import React, { useState, useRef } from 'react';
import {
  Plus,
  HardDrive,
  Users,
  Clock,
  Star,
  Trash2,
  FolderPlus,
  Upload,
  FolderUp,
  FileText,
  Table,
  Presentation,
  Code,
  ChevronRight,
  ChevronDown,
  Cloud,
} from 'lucide-react';
import { ActiveSection, DriveItem, StorageStats } from '../types/drive';
import { FileIcon } from './FileIcon';

interface SidebarProps {
  activeSection: ActiveSection;
  onSelectSection: (section: ActiveSection) => void;
  currentFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  folders: DriveItem[];
  storage: StorageStats;
  onNewFolder: () => void;
  onCreateDoc: (type: 'document' | 'spreadsheet' | 'presentation' | 'code') => void;
  onFileUpload: (files: FileList) => void;
  onOpenStorageModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  currentFolderId,
  onSelectFolder,
  folders,
  storage,
  onNewFolder,
  onCreateDoc,
  onFileUpload,
  onOpenStorageModal,
}) => {
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [myDriveExpanded, setMyDriveExpanded] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const rootFolders = folders.filter((f) => f.parentId === null && !f.trashed);

  const usedPercentage = Math.min(
    100,
    Math.round((storage.usedBytes / storage.totalBytes) * 100)
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files);
      e.target.value = '';
    }
    setShowNewMenu(false);
  };

  return (
    <aside className="w-64 min-w-[240px] h-[calc(100vh-4rem)] bg-[#f8fafd] flex flex-col justify-between p-3 select-none border-r border-gray-200/70">
      {/* Hidden file pickers */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        className="hidden"
      />
      <input
        type="file"
        // @ts-expect-error webkitdirectory is standard in browsers
        webkitdirectory="true"
        directory="true"
        ref={folderInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Part: "+ New" button and Main Nav Links */}
      <div className="space-y-4">
        {/* "+ New" Pill Button */}
        <div className="relative">
          <button
            onClick={() => setShowNewMenu(!showNewMenu)}
            className="flex items-center gap-3 px-5 py-3.5 bg-white hover:bg-gray-50 text-gray-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-200/80 transition-all font-medium text-sm w-44 group cursor-pointer"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 36 36">
                <path fill="#4285F4" d="M16 16v14h4V20z" />
                <path fill="#34A853" d="M30 16H20l-2 4h12z" />
                <path fill="#FBBC05" d="M6 16h10l2 4H6z" />
                <path fill="#EA4335" d="M20 16V2h-4v14z" />
                <path fill="#none" d="M0 0h36v36H0z" />
              </svg>
            </div>
            <span className="text-gray-700 font-semibold tracking-wide">New</span>
          </button>

          {/* "+ New" Context Dropdown */}
          {showNewMenu && (
            <div
              className="absolute left-0 top-14 w-60 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in duration-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setShowNewMenu(false);
                  onNewFolder();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
              >
                <FolderPlus size={18} className="text-gray-600" />
                <span>New folder</span>
              </button>

              <div className="my-1 border-t border-gray-100" />

              <button
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
              >
                <Upload size={18} className="text-gray-600" />
                <span>File upload</span>
              </button>

              <button
                onClick={() => {
                  folderInputRef.current?.click();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
              >
                <FolderUp size={18} className="text-gray-600" />
                <span>Folder upload</span>
              </button>

              <div className="my-1 border-t border-gray-100" />

              <button
                onClick={() => {
                  setShowNewMenu(false);
                  onCreateDoc('document');
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
              >
                <FileText size={18} className="text-blue-600" />
                <span>Google Docs</span>
              </button>

              <button
                onClick={() => {
                  setShowNewMenu(false);
                  onCreateDoc('spreadsheet');
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
              >
                <Table size={18} className="text-emerald-600" />
                <span>Google Sheets</span>
              </button>

              <button
                onClick={() => {
                  setShowNewMenu(false);
                  onCreateDoc('presentation');
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
              >
                <Presentation size={18} className="text-amber-500" />
                <span>Google Slides</span>
              </button>

              <button
                onClick={() => {
                  setShowNewMenu(false);
                  onCreateDoc('code');
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
              >
                <Code size={18} className="text-teal-600" />
                <span>Code / Config file</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Item Tree */}
        <nav className="space-y-0.5 text-sm font-medium">
          {/* My Drive with expandable subfolders */}
          <div>
            <div
              className={`flex items-center justify-between px-3 py-2 rounded-full cursor-pointer transition-colors ${
                activeSection === 'my-drive' && currentFolderId === null
                  ? 'bg-blue-100/70 text-blue-900 font-semibold'
                  : 'text-gray-700 hover:bg-gray-200/60'
              }`}
              onClick={() => {
                onSelectSection('my-drive');
                onSelectFolder(null);
              }}
            >
              <div className="flex items-center gap-3">
                <HardDrive size={18} className={activeSection === 'my-drive' && currentFolderId === null ? 'text-blue-600' : 'text-gray-600'} />
                <span>My Drive</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMyDriveExpanded(!myDriveExpanded);
                }}
                className="p-1 hover:bg-black/5 rounded-full text-gray-500"
              >
                {myDriveExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </button>
            </div>

            {/* Subfolders list */}
            {myDriveExpanded && (
              <div className="ml-5 pl-2 border-l border-gray-200/80 my-1 space-y-0.5">
                {rootFolders.map((folder) => {
                  const isSelected = currentFolderId === folder.id;
                  return (
                    <div
                      key={folder.id}
                      onClick={() => {
                        onSelectSection('my-drive');
                        onSelectFolder(folder.id);
                      }}
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs cursor-pointer truncate transition-colors ${
                        isSelected
                          ? 'bg-blue-100/70 text-blue-900 font-semibold'
                          : 'text-gray-600 hover:bg-gray-200/60'
                      }`}
                    >
                      <FileIcon type="folder" color={folder.color} size={15} />
                      <span className="truncate">{folder.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Shared with me */}
          <button
            onClick={() => {
              onSelectSection('shared-with-me');
              onSelectFolder(null);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-full cursor-pointer transition-colors text-left ${
              activeSection === 'shared-with-me'
                ? 'bg-blue-100/70 text-blue-900 font-semibold'
                : 'text-gray-700 hover:bg-gray-200/60'
            }`}
          >
            <Users size={18} className={activeSection === 'shared-with-me' ? 'text-blue-600' : 'text-gray-600'} />
            <span>Shared with me</span>
          </button>

          {/* Recent */}
          <button
            onClick={() => {
              onSelectSection('recent');
              onSelectFolder(null);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-full cursor-pointer transition-colors text-left ${
              activeSection === 'recent'
                ? 'bg-blue-100/70 text-blue-900 font-semibold'
                : 'text-gray-700 hover:bg-gray-200/60'
            }`}
          >
            <Clock size={18} className={activeSection === 'recent' ? 'text-blue-600' : 'text-gray-600'} />
            <span>Recent</span>
          </button>

          {/* Starred */}
          <button
            onClick={() => {
              onSelectSection('starred');
              onSelectFolder(null);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-full cursor-pointer transition-colors text-left ${
              activeSection === 'starred'
                ? 'bg-blue-100/70 text-blue-900 font-semibold'
                : 'text-gray-700 hover:bg-gray-200/60'
            }`}
          >
            <Star size={18} className={activeSection === 'starred' ? 'text-amber-500 fill-amber-500' : 'text-gray-600'} />
            <span>Starred</span>
          </button>

          {/* Trash */}
          <button
            onClick={() => {
              onSelectSection('trash');
              onSelectFolder(null);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-full cursor-pointer transition-colors text-left ${
              activeSection === 'trash'
                ? 'bg-blue-100/70 text-blue-900 font-semibold'
                : 'text-gray-700 hover:bg-gray-200/60'
            }`}
          >
            <Trash2 size={18} className={activeSection === 'trash' ? 'text-blue-600' : 'text-gray-600'} />
            <span>Trash</span>
          </button>
        </nav>
      </div>

      {/* Bottom: Storage Status Widget */}
      <div className="pt-4 border-t border-gray-200/70">
        <div
          onClick={onOpenStorageModal}
          className="group cursor-pointer p-2.5 rounded-xl hover:bg-gray-200/60 transition-colors"
        >
          <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-700 mb-2">
            <Cloud size={16} className="text-blue-600" />
            <span>Storage</span>
            <span className="text-[11px] text-gray-500 font-normal ml-auto">
              {usedPercentage}%
            </span>
          </div>

          {/* Storage bar */}
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                usedPercentage > 90
                  ? 'bg-red-500'
                  : usedPercentage > 75
                  ? 'bg-blue-600'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${usedPercentage}%` }}
            />
          </div>

          <div className="text-[11px] text-gray-500 mb-2.5">
            {(storage.usedBytes / 1_000_000_000).toFixed(1)} GB of{' '}
            {(storage.totalBytes / 1_000_000_000).toFixed(0)} GB used
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenStorageModal();
            }}
            className="w-full text-center py-1.5 px-3 rounded-full text-xs font-medium text-blue-600 border border-blue-300 hover:bg-blue-50 transition-colors"
          >
            Get more storage
          </button>
        </div>
      </div>
    </aside>
  );
};
