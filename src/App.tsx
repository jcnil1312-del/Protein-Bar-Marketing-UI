import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ActiveSection,
  DriveItem,
  FileType,
  SortDirection,
  SortField,
  StorageStats,
  UploadTask,
  ViewMode,
  DriveFilterOptions,
} from './types/drive';
import { INITIAL_ITEMS, INITIAL_STORAGE, CURRENT_USER } from './data/initialData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BreadcrumbBar } from './components/BreadcrumbBar';
import { SuggestedFiles } from './components/SuggestedFiles';
import { FolderGrid } from './components/FolderGrid';
import { FileGrid } from './components/FileGrid';
import { FileList } from './components/FileList';
import { DetailsPanel } from './components/DetailsPanel';
import { FilePreviewModal } from './components/FilePreviewModal';
import { ShareModal } from './components/ShareModal';
import { NewFolderModal } from './components/NewFolderModal';
import { RenameModal } from './components/RenameModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { StorageModal } from './components/StorageModal';
import { UploadManager } from './components/UploadManager';
import { ContextMenu } from './components/ContextMenu';
import { MoveModal } from './components/MoveModal';
import { FolderColorModal } from './components/FolderColorModal';
import { HelpModal, SettingsModal } from './components/HelpSettingsModals';
import { downloadDriveFile } from './utils/formatters';
import { UploadCloud, FolderOpen, Star, Clock, Users, Trash2 } from 'lucide-react';

export default function App() {
  // --- Persistent Storage State ---
  const [items, setItems] = useState<DriveItem[]>(() => {
    try {
      const saved = localStorage.getItem('drive_hub_items_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ITEMS;
  });

  const [storage, setStorage] = useState<StorageStats>(() => {
    try {
      const saved = localStorage.getItem('drive_hub_storage_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STORAGE;
  });

  useEffect(() => {
    try {
      localStorage.setItem('drive_hub_items_v3', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('drive_hub_storage_v3', JSON.stringify(storage));
    } catch (e) {
      console.error(e);
    }
  }, [storage]);

  // --- Navigation & View State ---
  const [activeSection, setActiveSection] = useState<ActiveSection>('my-drive');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  // --- Search & Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState<DriveFilterOptions>({
    type: 'all',
    owner: 'anyone',
    modified: 'anytime',
  });

  // --- Sort & Selection State ---
  const [sortField, setSortField] = useState<SortField>('modifiedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // --- Panels & Modals State ---
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [inspectItemId, setInspectItemId] = useState<string | null>(null);

  const [previewFile, setPreviewFile] = useState<DriveItem | null>(null);
  const [shareItem, setShareItem] = useState<DriveItem | null>(null);
  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false);
  const [renameItem, setRenameItem] = useState<DriveItem | null>(null);
  const [moveItem, setMoveItem] = useState<DriveItem | null>(null);
  const [colorFolder, setColorFolder] = useState<DriveItem | null>(null);
  const [storageModalOpen, setStorageModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Destructive Confirmation Dialog
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isPermanent?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Context Menu
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: DriveItem;
  } | null>(null);

  // Upload tasks queue
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);
  const [isDragOverWindow, setIsDragOverWindow] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === 'Escape') {
        setSelectedIds([]);
        setContextMenu(null);
        setPreviewFile(null);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds.length > 0) {
          triggerDeleteSelected();
        }
      } else if (e.key === 's' || e.key === 'S') {
        if (selectedIds.length > 0) {
          triggerStarSelected();
        }
      } else if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds]);

  // Current folder and ancestor path
  const currentFolder = useMemo(() => {
    if (!currentFolderId) return null;
    return items.find((i) => i.id === currentFolderId) || null;
  }, [items, currentFolderId]);

  const parentChain = useMemo(() => {
    const chain: DriveItem[] = [];
    let cur = currentFolder;
    while (cur && cur.parentId) {
      const parent = items.find((i) => i.id === cur?.parentId);
      if (parent) {
        chain.unshift(parent);
        cur = parent;
      } else {
        break;
      }
    }
    return chain;
  }, [items, currentFolder]);

  // All folders for sidebar & move picker
  const allFolders = useMemo(() => {
    return items.filter((i) => i.type === 'folder' && !i.trashed);
  }, [items]);

  // Active filtered and sorted items
  const displayedItems = useMemo(() => {
    let result = items.slice();

    // Section filtering
    if (activeSection === 'trash') {
      result = result.filter((i) => i.trashed);
    } else {
      result = result.filter((i) => !i.trashed);

      if (activeSection === 'my-drive') {
        // If searching or filtering, search across whole drive
        if (!searchQuery && filterOptions.type === 'all' && filterOptions.owner === 'anyone' && filterOptions.modified === 'anytime') {
          result = result.filter((i) => i.parentId === currentFolderId);
        }
      } else if (activeSection === 'shared-with-me') {
        result = result.filter((i) => i.owner.email !== CURRENT_USER.email);
      } else if (activeSection === 'recent') {
        // Sorted by modified date
      } else if (activeSection === 'starred') {
        result = result.filter((i) => i.starred);
      }
    }

    // Text search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.tags?.some((t) => t.toLowerCase().includes(q)) ||
          i.description?.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (filterOptions.type !== 'all') {
      result = result.filter((i) => i.type === filterOptions.type);
    }

    // Owner filter
    if (filterOptions.owner === 'me') {
      result = result.filter((i) => i.owner.email === CURRENT_USER.email);
    } else if (filterOptions.owner === 'not-me') {
      result = result.filter((i) => i.owner.email !== CURRENT_USER.email);
    }

    // Date modified filter
    if (filterOptions.modified !== 'anytime') {
      const now = new Date().getTime();
      result = result.filter((i) => {
        const itemTime = new Date(i.modifiedAt).getTime();
        const diffDays = (now - itemTime) / (1000 * 3600 * 24);
        if (filterOptions.modified === 'today') return diffDays <= 1;
        if (filterOptions.modified === '7days') return diffDays <= 7;
        if (filterOptions.modified === '30days') return diffDays <= 30;
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      // Always keep folders on top when in grid view
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;

      let valA: string | number = a.name;
      let valB: string | number = b.name;

      if (sortField === 'modifiedAt') {
        valA = new Date(a.modifiedAt).getTime();
        valB = new Date(b.modifiedAt).getTime();
      } else if (sortField === 'size') {
        valA = a.size;
        valB = b.size;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [
    items,
    activeSection,
    currentFolderId,
    searchQuery,
    filterOptions,
    sortField,
    sortDirection,
  ]);

  const displayFolders = useMemo(() => {
    return displayedItems.filter((i) => i.type === 'folder');
  }, [displayedItems]);

  const displayFiles = useMemo(() => {
    return displayedItems.filter((i) => i.type !== 'folder');
  }, [displayedItems]);

  const suggestedFiles = useMemo(() => {
    if (activeSection !== 'my-drive' || currentFolderId !== null || searchQuery) {
      return [];
    }
    return items
      .filter((i) => !i.trashed && i.type !== 'folder')
      .slice(0, 4);
  }, [items, activeSection, currentFolderId, searchQuery]);

  // Selected items objects
  const selectedItems = useMemo(() => {
    return items.filter((i) => selectedIds.includes(i.id));
  }, [items, selectedIds]);

  const inspectedItem = useMemo(() => {
    if (inspectItemId) {
      return items.find((i) => i.id === inspectItemId) || null;
    }
    if (selectedItems.length === 1) {
      return selectedItems[0];
    }
    return null;
  }, [items, inspectItemId, selectedItems]);

  // --- Actions ---

  const handleToggleSelect = (id: string, isMulti: boolean) => {
    if (isMulti) {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    } else {
      setSelectedIds((prev) => (prev.length === 1 && prev[0] === id ? [] : [id]));
    }
    setInspectItemId(id);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === displayedItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedItems.map((i) => i.id));
    }
  };

  const handleStarItem = (item: DriveItem) => {
    const updated = items.map((i) =>
      i.id === item.id ? { ...i, starred: !i.starred } : i
    );
    setItems(updated);
    showToast(item.starred ? 'Removed from Starred' : 'Added to Starred');
  };

  const triggerStarSelected = () => {
    if (selectedIds.length === 0) return;
    const allStarred = selectedItems.every((i) => i.starred);
    const updated = items.map((i) =>
      selectedIds.includes(i.id) ? { ...i, starred: !allStarred } : i
    );
    setItems(updated);
    showToast(
      allStarred
        ? `Removed ${selectedIds.length} item(s) from Starred`
        : `Added ${selectedIds.length} item(s) to Starred`
    );
  };

  const handleUpdateItem = (updated: DriveItem) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleCreateFolder = (name: string, color: string) => {
    const newFolder: DriveItem = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      mimeType: 'application/vnd.google-apps.folder',
      size: 0,
      parentId: currentFolderId,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      starred: false,
      trashed: false,
      owner: CURRENT_USER,
      sharedWith: [],
      color,
      description: 'Folder created by user.',
    };

    setItems((prev) => [newFolder, ...prev]);
    showToast(`Created folder "${name}"`);
  };

  const handleCreateDoc = (type: 'document' | 'spreadsheet' | 'presentation' | 'code') => {
    const id = `file-${Date.now()}`;
    let name = 'Untitled Document.gdoc';
    let mime = 'application/vnd.google-apps.document';
    let content = '# Untitled Document\n\nStart typing your content here...';
    let thumbnail: string | undefined = undefined;

    if (type === 'spreadsheet') {
      name = 'Untitled Spreadsheet.gsheet';
      mime = 'application/vnd.google-apps.spreadsheet';
      thumbnail = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&h=300&q=80';
    } else if (type === 'presentation') {
      name = 'Untitled Presentation.gslides';
      mime = 'application/vnd.google-apps.presentation';
      thumbnail = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=500&h=300&q=80';
    } else if (type === 'code') {
      name = 'config.json';
      mime = 'application/json';
      content = '{\n  "version": "1.0.0",\n  "status": "ready"\n}';
    } else {
      thumbnail = 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=500&h=300&q=80';
    }

    const newDoc: DriveItem = {
      id,
      name,
      type,
      mimeType: mime,
      size: 15_000,
      parentId: currentFolderId,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      starred: false,
      trashed: false,
      owner: CURRENT_USER,
      sharedWith: [],
      thumbnail,
      content,
      description: 'Created recently.',
    };

    setItems((prev) => [newDoc, ...prev]);
    setPreviewFile(newDoc);
    showToast(`Created new ${type}`);
  };

  const handleFileUpload = (files: FileList) => {
    const newTasks: UploadTask[] = [];

    Array.from(files).forEach((f, idx) => {
      const taskId = `task-${Date.now()}-${idx}`;
      let inferredType: FileType = 'document';
      if (f.type.startsWith('image/')) inferredType = 'image';
      else if (f.type.includes('pdf')) inferredType = 'pdf';
      else if (f.type.includes('sheet') || f.name.endsWith('.csv') || f.name.endsWith('.xlsx')) inferredType = 'spreadsheet';
      else if (f.type.includes('presentation') || f.name.endsWith('.pptx')) inferredType = 'presentation';
      else if (f.type.startsWith('video/')) inferredType = 'video';
      else if (f.type.startsWith('audio/')) inferredType = 'audio';
      else if (f.type.includes('json') || f.type.includes('javascript') || f.type.includes('text/')) inferredType = 'code';

      newTasks.push({
        id: taskId,
        fileName: f.name,
        fileSize: f.size,
        fileType: inferredType,
        progress: 10,
        status: 'uploading',
      });
    });

    setUploadTasks((prev) => [...prev, ...newTasks]);

    // Simulate progress and create real file items
    newTasks.forEach((task, i) => {
      let cur = 20;
      const interval = setInterval(() => {
        cur += 30;
        if (cur >= 100) {
          clearInterval(interval);
          setUploadTasks((prev) =>
            prev.map((t) =>
              t.id === task.id ? { ...t, progress: 100, status: 'completed' } : t
            )
          );

          // Add newly uploaded file to items
          const fileReader = new FileReader();
          const targetFile = files[i];

          fileReader.onload = () => {
            const isImg = task.fileType === 'image';
            const newItem: DriveItem = {
              id: `upload-${Date.now()}-${i}`,
              name: task.fileName,
              type: task.fileType,
              mimeType: targetFile?.type || 'application/octet-stream',
              size: task.fileSize || 45_000,
              parentId: currentFolderId,
              createdAt: new Date().toISOString(),
              modifiedAt: new Date().toISOString(),
              starred: false,
              trashed: false,
              owner: CURRENT_USER,
              sharedWith: [],
              thumbnail: isImg ? (fileReader.result as string) : undefined,
              content: !isImg && typeof fileReader.result === 'string' ? fileReader.result : undefined,
              description: 'Uploaded from computer.',
            };

            setItems((prev) => [newItem, ...prev]);
            setStorage((s) => ({
              ...s,
              usedBytes: s.usedBytes + (task.fileSize || 45_000),
              driveBytes: s.driveBytes + (task.fileSize || 45_000),
            }));
            showToast(`Uploaded "${task.fileName}"`);
          };

          if (task.fileType === 'image') {
            fileReader.readAsDataURL(targetFile);
          } else {
            fileReader.readAsText(targetFile);
          }
        } else {
          setUploadTasks((prev) =>
            prev.map((t) => (t.id === task.id ? { ...t, progress: cur } : t))
          );
        }
      }, 400 + i * 200);
    });
  };

  const handleDropItemToFolder = (draggedItemId: string, targetFolderId: string) => {
    const item = items.find((i) => i.id === draggedItemId);
    if (!item) return;

    const targetFolder = items.find((i) => i.id === targetFolderId);
    setItems((prev) =>
      prev.map((i) => (i.id === draggedItemId ? { ...i, parentId: targetFolderId } : i))
    );
    showToast(`Moved "${item.name}" to "${targetFolder?.name || 'folder'}"`);
  };

  // Move items to trash (with confirmation)
  const handleDeleteItem = (item: DriveItem) => {
    setDeleteConfirm({
      isOpen: true,
      title: item.trashed ? `Delete "${item.name}" permanently?` : `Move "${item.name}" to trash?`,
      message: item.trashed
        ? 'This item will be deleted forever and cannot be restored.'
        : 'Items in trash can be restored anytime or deleted forever.',
      confirmLabel: item.trashed ? 'Delete forever' : 'Move to trash',
      isPermanent: item.trashed,
      onConfirm: () => {
        if (item.trashed) {
          // Permanent delete
          setItems((prev) => prev.filter((i) => i.id !== item.id));
          showToast(`Deleted "${item.name}" forever`);
        } else {
          // Move to trash
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, trashed: true, trashedAt: new Date().toISOString() }
                : i
            )
          );
          showToast(`Moved "${item.name}" to trash`);
        }
        setSelectedIds((prev) => prev.filter((id) => id !== item.id));
      },
    });
  };

  const triggerDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    const isTrash = activeSection === 'trash';

    setDeleteConfirm({
      isOpen: true,
      title: isTrash
        ? `Permanently delete ${selectedIds.length} item(s)?`
        : `Move ${selectedIds.length} item(s) to trash?`,
      message: isTrash
        ? `These ${selectedIds.length} items will be permanently erased. This cannot be undone.`
        : `These ${selectedIds.length} items will be moved to Trash.`,
      confirmLabel: isTrash ? 'Delete forever' : 'Move to trash',
      isPermanent: isTrash,
      onConfirm: () => {
        if (isTrash) {
          setItems((prev) => prev.filter((i) => !selectedIds.includes(i.id)));
          showToast(`Permanently deleted ${selectedIds.length} item(s)`);
        } else {
          setItems((prev) =>
            prev.map((i) =>
              selectedIds.includes(i.id)
                ? { ...i, trashed: true, trashedAt: new Date().toISOString() }
                : i
            )
          );
          showToast(`Moved ${selectedIds.length} item(s) to trash`);
        }
        setSelectedIds([]);
      },
    });
  };

  const handleEmptyTrash = () => {
    const trashCount = items.filter((i) => i.trashed).length;
    if (trashCount === 0) {
      showToast('Trash is already empty');
      return;
    }

    setDeleteConfirm({
      isOpen: true,
      title: 'Empty trash?',
      message: `All ${trashCount} items in the trash will be permanently deleted. You can't undo this action.`,
      confirmLabel: 'Empty trash',
      isPermanent: true,
      onConfirm: () => {
        setItems((prev) => prev.filter((i) => !i.trashed));
        setSelectedIds([]);
        showToast('Trash emptied');
      },
    });
  };

  const handleRestoreTrashSelected = () => {
    setItems((prev) =>
      prev.map((i) =>
        selectedIds.includes(i.id) ? { ...i, trashed: false, trashedAt: undefined } : i
      )
    );
    showToast(`Restored ${selectedIds.length} item(s)`);
    setSelectedIds([]);
  };

  const handleOpenItem = (item: DriveItem) => {
    if (item.type === 'folder') {
      setCurrentFolderId(item.id);
      setSelectedIds([]);
    } else {
      setPreviewFile(item);
    }
  };

  const handleOpenContextMenu = (item: DriveItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
    });
    setInspectItemId(item.id);
  };

  return (
    <div
      className="min-h-screen bg-[#f8fafd] flex flex-col antialiased text-gray-900 select-none relative"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOverWindow(true);
      }}
      onDragLeave={(e) => {
        if (e.relatedTarget === null) {
          setIsDragOverWindow(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOverWindow(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFileUpload(e.dataTransfer.files);
        }
      }}
    >
      {/* Window Drag & Drop Overlay */}
      {isDragOverWindow && (
        <div className="fixed inset-0 z-50 bg-blue-600/20 backdrop-blur-xs border-4 border-dashed border-blue-500 rounded-3xl m-4 flex flex-col items-center justify-center text-blue-700 pointer-events-none animate-in fade-in">
          <UploadCloud size={64} className="animate-bounce mb-3" />
          <h2 className="text-2xl font-bold">Drop files to upload to Drive</h2>
          <p className="text-sm text-blue-600 mt-1">
            Files will be stored in{' '}
            {currentFolder ? currentFolder.name : 'My Drive'}
          </p>
        </div>
      )}

      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        detailsOpen={detailsOpen}
        onToggleDetails={() => setDetailsOpen(!detailsOpen)}
        filterOptions={filterOptions}
        onFilterChange={setFilterOptions}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenHelp={() => setHelpModalOpen(true)}
      />

      {/* Main Workspace: Sidebar + Content + Details */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSelectSection={(sec) => {
            setActiveSection(sec);
            setSelectedIds([]);
          }}
          currentFolderId={currentFolderId}
          onSelectFolder={(fId) => {
            setCurrentFolderId(fId);
            setSelectedIds([]);
          }}
          folders={allFolders}
          storage={storage}
          onNewFolder={() => setNewFolderModalOpen(true)}
          onCreateDoc={handleCreateDoc}
          onFileUpload={handleFileUpload}
          onOpenStorageModal={() => setStorageModalOpen(true)}
        />

        {/* Center Main Stage */}
        <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto bg-white rounded-tl-2xl shadow-xs border-t border-l border-gray-200/60">
          {/* Breadcrumbs & Action Bar */}
          <BreadcrumbBar
            activeSection={activeSection}
            currentFolder={currentFolder}
            parentChain={parentChain}
            onNavigateToFolder={(fId) => {
              setCurrentFolderId(fId);
              setSelectedIds([]);
            }}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={(f, dir) => {
              setSortField(f);
              setSortDirection(dir);
            }}
            selectedItems={selectedItems}
            onClearSelection={() => setSelectedIds([])}
            onShare={(item) => setShareItem(item)}
            onDownload={(item) => downloadDriveFile(item.name, item.content || item.thumbnail, item.type)}
            onDeleteSelected={triggerDeleteSelected}
            onStarSelected={triggerStarSelected}
            onEmptyTrash={handleEmptyTrash}
            onRenameFolder={(f) => setRenameItem(f)}
            onChangeFolderColor={(f) => setColorFolder(f)}
            onNewFolderInside={() => setNewFolderModalOpen(true)}
            onRestoreTrashSelected={handleRestoreTrashSelected}
          />

          {/* Items Canvas */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Suggested / Quick Access Cards */}
            <SuggestedFiles
              files={suggestedFiles}
              onOpenFile={handleOpenItem}
              onStarFile={handleStarItem}
              onOpenItemMenu={handleOpenContextMenu}
            />

            {/* Empty State */}
            {displayedItems.length === 0 ? (
              <div className="h-72 flex flex-col items-center justify-center text-center text-gray-400">
                {activeSection === 'trash' ? (
                  <>
                    <Trash2 size={48} className="text-gray-300 mb-3" />
                    <h3 className="text-base font-semibold text-gray-700">Trash is empty</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Items moved to the trash will appear here.
                    </p>
                  </>
                ) : activeSection === 'starred' ? (
                  <>
                    <Star size={48} className="text-gray-300 mb-3" />
                    <h3 className="text-base font-semibold text-gray-700">No starred files</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Add stars to things that you want to easily find later.
                    </p>
                  </>
                ) : searchQuery ? (
                  <>
                    <h3 className="text-base font-semibold text-gray-700">
                      No results found for "{searchQuery}"
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Try checking for typos or resetting your filters.
                    </p>
                  </>
                ) : (
                  <>
                    <FolderOpen size={48} className="text-gray-300 mb-3" />
                    <h3 className="text-base font-semibold text-gray-700">This folder is empty</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Drop files here or click "+ New" to create files and folders.
                    </p>
                  </>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="space-y-6">
                {/* Folders Section */}
                <FolderGrid
                  folders={displayFolders}
                  selectedFolderIds={selectedIds}
                  onOpenFolder={(fId) => {
                    setCurrentFolderId(fId);
                    setSelectedIds([]);
                  }}
                  onToggleSelectFolder={handleToggleSelect}
                  onStarFolder={handleStarItem}
                  onOpenFolderMenu={handleOpenContextMenu}
                  onDropItemToFolder={handleDropItemToFolder}
                />

                {/* Files Section */}
                <FileGrid
                  files={displayFiles}
                  selectedFileIds={selectedIds}
                  onOpenFile={handleOpenItem}
                  onToggleSelectFile={handleToggleSelect}
                  onStarFile={handleStarItem}
                  onOpenItemMenu={handleOpenContextMenu}
                />
              </div>
            ) : (
              /* List Table View */
              <FileList
                items={displayedItems}
                selectedItemIds={selectedIds}
                onOpenItem={handleOpenItem}
                onToggleSelectItem={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onStarItem={handleStarItem}
                onShareItem={(item) => setShareItem(item)}
                onDownloadItem={(item) => downloadDriveFile(item.name, item.content || item.thumbnail, item.type)}
                onOpenItemMenu={handleOpenContextMenu}
              />
            )}
          </div>
        </main>

        {/* Right Details Panel Drawer */}
        {detailsOpen && (
          <DetailsPanel
            item={inspectedItem}
            onClose={() => setDetailsOpen(false)}
            onStarItem={handleStarItem}
            onShareItem={(item) => setShareItem(item)}
            onDeleteItem={handleDeleteItem}
            onUpdateDescription={(item, desc) => {
              handleUpdateItem({ ...item, description: desc });
              showToast('Description updated');
            }}
          />
        )}
      </div>

      {/* Floating Upload Progress Toast */}
      <UploadManager
        tasks={uploadTasks}
        onClearTasks={() => setUploadTasks([])}
      />

      {/* Right-click Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          item={contextMenu.item}
          isTrash={contextMenu.item.trashed}
          onClose={() => setContextMenu(null)}
          onOpen={handleOpenItem}
          onShare={(item) => setShareItem(item)}
          onStar={handleStarItem}
          onRename={(item) => setRenameItem(item)}
          onMove={(item) => setMoveItem(item)}
          onChangeColor={(item) => setColorFolder(item)}
          onDownload={(item) => downloadDriveFile(item.name, item.content || item.thumbnail, item.type)}
          onDelete={handleDeleteItem}
          onRestore={(item) => {
            handleUpdateItem({ ...item, trashed: false, trashedAt: undefined });
            showToast(`Restored "${item.name}"`);
          }}
          onViewDetails={(item) => {
            setInspectItemId(item.id);
            setDetailsOpen(true);
          }}
        />
      )}

      {/* Modals & Dialogs */}
      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onUpdateFile={handleUpdateItem}
        onShare={(file) => setShareItem(file)}
      />

      <ShareModal
        item={shareItem}
        onClose={() => setShareItem(null)}
        onUpdateItem={handleUpdateItem}
        onShowToast={showToast}
      />

      <NewFolderModal
        isOpen={newFolderModalOpen}
        onClose={() => setNewFolderModalOpen(false)}
        onCreate={handleCreateFolder}
      />

      <RenameModal
        item={renameItem}
        onClose={() => setRenameItem(null)}
        onRename={(item, newName) => {
          handleUpdateItem({ ...item, name: newName });
          showToast(`Renamed to "${newName}"`);
        }}
      />

      <MoveModal
        item={moveItem}
        folders={allFolders}
        onClose={() => setMoveItem(null)}
        onMove={(item, targetFolderId) => {
          handleUpdateItem({ ...item, parentId: targetFolderId });
          showToast(`Moved "${item.name}"`);
        }}
      />

      <FolderColorModal
        folder={colorFolder}
        onClose={() => setColorFolder(null)}
        onSelectColor={(folder, color) => {
          handleUpdateItem({ ...folder, color });
          showToast(`Updated folder color`);
        }}
      />

      <ConfirmDeleteModal
        isOpen={deleteConfirm.isOpen}
        title={deleteConfirm.title}
        message={deleteConfirm.message}
        confirmLabel={deleteConfirm.confirmLabel}
        isPermanent={deleteConfirm.isPermanent}
        onConfirm={deleteConfirm.onConfirm}
        onClose={() => setDeleteConfirm((prev) => ({ ...prev, isOpen: false }))}
      />

      <StorageModal
        isOpen={storageModalOpen}
        onClose={() => setStorageModalOpen(false)}
        storage={storage}
        onUpgradeStorage={(newTotalBytes) => {
          setStorage((s) => ({ ...s, totalBytes: newTotalBytes }));
          showToast('Upgraded Google Workspace storage!');
        }}
      />

      <HelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        density={density}
        onDensityChange={setDensity}
        onResetData={() => {
          localStorage.removeItem('drive_hub_items_v3');
          localStorage.removeItem('drive_hub_storage_v3');
          setItems(INITIAL_ITEMS);
          setStorage(INITIAL_STORAGE);
          showToast('Reset demo files and storage to defaults');
        }}
      />

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-medium z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 flex items-center gap-2 border border-gray-800">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
