import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  Trash2,
  Share2,
  Download,
  Star,
  Edit2,
  Palette,
  FolderPlus,
  RotateCcw,
} from 'lucide-react';
import { DriveItem, ActiveSection, SortField, SortDirection } from '../types/drive';

interface BreadcrumbBarProps {
  activeSection: ActiveSection;
  currentFolder: DriveItem | null;
  parentChain: DriveItem[];
  onNavigateToFolder: (folderId: string | null) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, dir: SortDirection) => void;
  selectedItems: DriveItem[];
  onClearSelection: () => void;
  onShare: (item: DriveItem) => void;
  onDownload: (item: DriveItem) => void;
  onDeleteSelected: () => void;
  onStarSelected: () => void;
  onEmptyTrash: () => void;
  onRenameFolder: (folder: DriveItem) => void;
  onChangeFolderColor: (folder: DriveItem) => void;
  onNewFolderInside: () => void;
  onRestoreTrashSelected: () => void;
}

export const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({
  activeSection,
  currentFolder,
  parentChain,
  onNavigateToFolder,
  sortField,
  sortDirection,
  onSortChange,
  selectedItems,
  onClearSelection,
  onShare,
  onDownload,
  onDeleteSelected,
  onStarSelected,
  onEmptyTrash,
  onRenameFolder,
  onChangeFolderColor,
  onNewFolderInside,
  onRestoreTrashSelected,
}) => {
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'my-drive':
        return 'My Drive';
      case 'shared-with-me':
        return 'Shared with me';
      case 'recent':
        return 'Recent files';
      case 'starred':
        return 'Starred';
      case 'trash':
        return 'Trash';
      case 'storage':
        return 'Storage Management';
      default:
        return 'Drive';
    }
  };

  return (
    <div className="h-14 px-6 flex items-center justify-between border-b border-gray-100 bg-white sticky top-16 z-20 select-none">
      {/* Left: Breadcrumbs or Multi-selection bar */}
      <div className="flex items-center gap-1.5 overflow-hidden">
        {selectedItems.length > 0 ? (
          <div className="flex items-center gap-3 animate-in fade-in duration-100">
            <span className="text-sm font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              {selectedItems.length} selected
            </span>

            <button
              onClick={onClearSelection}
              className="text-xs text-gray-500 hover:text-gray-800 hover:underline"
            >
              Deselect all
            </button>

            <div className="h-4 w-px bg-gray-300 mx-1" />

            {/* Actions for selected */}
            {activeSection === 'trash' ? (
              <>
                <button
                  onClick={onRestoreTrashSelected}
                  className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-1.5 text-xs font-medium"
                  title="Restore selected items"
                >
                  <RotateCcw size={16} className="text-blue-600" />
                  <span>Restore</span>
                </button>
                <button
                  onClick={onDeleteSelected}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1.5 text-xs font-medium"
                  title="Delete forever"
                >
                  <Trash2 size={16} />
                  <span>Delete forever</span>
                </button>
              </>
            ) : (
              <>
                {selectedItems.length === 1 && (
                  <button
                    onClick={() => onShare(selectedItems[0])}
                    className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-1.5 text-xs font-medium"
                    title="Share item"
                  >
                    <Share2 size={16} className="text-gray-600" />
                    <span>Share</span>
                  </button>
                )}

                {selectedItems.length === 1 && (
                  <button
                    onClick={() => onDownload(selectedItems[0])}
                    className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-1.5 text-xs font-medium"
                    title="Download item"
                  >
                    <Download size={16} className="text-gray-600" />
                    <span>Download</span>
                  </button>
                )}

                <button
                  onClick={onStarSelected}
                  className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-1.5 text-xs font-medium"
                  title="Toggle star"
                >
                  <Star size={16} className="text-amber-500" />
                  <span>Star</span>
                </button>

                <button
                  onClick={onDeleteSelected}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1.5 text-xs font-medium"
                  title="Move to trash"
                >
                  <Trash2 size={16} />
                  <span>Remove</span>
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-lg font-medium text-gray-800">
            {/* Base Section name */}
            <button
              onClick={() => onNavigateToFolder(null)}
              className={`hover:text-blue-600 transition-colors ${
                currentFolder === null ? 'font-semibold text-gray-900' : 'text-gray-600'
              }`}
            >
              {getSectionTitle()}
            </button>

            {/* Parent folder path ancestors */}
            {parentChain.map((ancestor) => (
              <React.Fragment key={ancestor.id}>
                <ChevronRight size={16} className="text-gray-400 shrink-0" />
                <button
                  onClick={() => onNavigateToFolder(ancestor.id)}
                  className="text-gray-600 hover:text-blue-600 truncate max-w-[150px] transition-colors"
                >
                  {ancestor.name}
                </button>
              </React.Fragment>
            ))}

            {/* Current Folder with Dropdown */}
            {currentFolder && (
              <div className="relative flex items-center">
                <ChevronRight size={16} className="text-gray-400 shrink-0" />
                <button
                  onClick={() => setShowFolderMenu(!showFolderMenu)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100 text-gray-900 font-semibold max-w-[200px] truncate ml-1"
                >
                  <span className="truncate">{currentFolder.name}</span>
                  <ChevronDown size={14} className="text-gray-500 shrink-0" />
                </button>

                {showFolderMenu && (
                  <div
                    className="absolute left-0 top-9 w-52 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50 text-xs text-gray-700 animate-in fade-in duration-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        setShowFolderMenu(false);
                        onNewFolderInside();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-100 text-left"
                    >
                      <FolderPlus size={15} /> New folder here
                    </button>
                    <button
                      onClick={() => {
                        setShowFolderMenu(false);
                        onRenameFolder(currentFolder);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-100 text-left"
                    >
                      <Edit2 size={15} /> Rename folder
                    </button>
                    <button
                      onClick={() => {
                        setShowFolderMenu(false);
                        onChangeFolderColor(currentFolder);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-100 text-left"
                    >
                      <Palette size={15} /> Change color
                    </button>
                    <div className="my-1 border-t border-gray-100" />
                    <button
                      onClick={() => {
                        setShowFolderMenu(false);
                        onDeleteSelected();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-red-50 text-red-600 text-left"
                    >
                      <Trash2 size={15} /> Move folder to trash
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Trash actions or Sort selector */}
      <div className="flex items-center gap-3">
        {activeSection === 'trash' ? (
          <button
            onClick={onEmptyTrash}
            className="px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full border border-red-200/80 transition-colors flex items-center gap-1.5"
          >
            <Trash2 size={14} /> Empty trash
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <ArrowUpDown size={13} className="text-gray-500" />
              <span>
                Sort:{' '}
                {sortField === 'name'
                  ? 'Name'
                  : sortField === 'modifiedAt'
                  ? 'Last modified'
                  : 'File size'}
              </span>
              <ChevronDown size={12} className="text-gray-400" />
            </button>

            {showSortMenu && (
              <div
                className="absolute right-0 top-9 w-44 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-40 text-xs text-gray-700 animate-in fade-in duration-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-1 font-semibold text-[10px] text-gray-400 uppercase tracking-wider">
                  Sort by
                </div>
                <button
                  onClick={() => {
                    onSortChange('name', sortField === 'name' && sortDirection === 'asc' ? 'desc' : 'asc');
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-gray-100 flex items-center justify-between ${
                    sortField === 'name' ? 'font-semibold text-blue-600' : ''
                  }`}
                >
                  <span>Name</span>
                  {sortField === 'name' && (
                    <span>{sortDirection === 'asc' ? 'A→Z' : 'Z→A'}</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    onSortChange('modifiedAt', sortField === 'modifiedAt' && sortDirection === 'desc' ? 'asc' : 'desc');
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-gray-100 flex items-center justify-between ${
                    sortField === 'modifiedAt' ? 'font-semibold text-blue-600' : ''
                  }`}
                >
                  <span>Last modified</span>
                  {sortField === 'modifiedAt' && (
                    <span>{sortDirection === 'desc' ? 'Newest' : 'Oldest'}</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    onSortChange('size', sortField === 'size' && sortDirection === 'desc' ? 'asc' : 'desc');
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-gray-100 flex items-center justify-between ${
                    sortField === 'size' ? 'font-semibold text-blue-600' : ''
                  }`}
                >
                  <span>Size</span>
                  {sortField === 'size' && (
                    <span>{sortDirection === 'desc' ? 'Largest' : 'Smallest'}</span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
