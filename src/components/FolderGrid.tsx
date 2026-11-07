import React, { useState } from 'react';
import { MoreVertical, Star, Folder } from 'lucide-react';
import { DriveItem } from '../types/drive';

interface FolderGridProps {
  folders: DriveItem[];
  selectedFolderIds: string[];
  onOpenFolder: (folderId: string) => void;
  onToggleSelectFolder: (folderId: string, isMulti: boolean) => void;
  onStarFolder: (folder: DriveItem) => void;
  onOpenFolderMenu: (folder: DriveItem, e: React.MouseEvent) => void;
  onDropItemToFolder: (draggedItemId: string, targetFolderId: string) => void;
}

export const FolderGrid: React.FC<FolderGridProps> = ({
  folders,
  selectedFolderIds,
  onOpenFolder,
  onToggleSelectFolder,
  onStarFolder,
  onOpenFolderMenu,
  onDropItemToFolder,
}) => {
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);

  if (folders.length === 0) return null;

  return (
    <div className="mb-8 select-none">
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 px-1">
        Folders ({folders.length})
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {folders.map((folder) => {
          const isSelected = selectedFolderIds.includes(folder.id);
          const isDragTarget = dragOverFolderId === folder.id;

          return (
            <div
              key={folder.id}
              onClick={(e) => {
                if (e.detail === 2) {
                  onOpenFolder(folder.id);
                } else {
                  onToggleSelectFolder(folder.id, e.shiftKey || e.metaKey || e.ctrlKey);
                }
              }}
              onDoubleClick={() => onOpenFolder(folder.id)}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverFolderId(folder.id);
              }}
              onDragLeave={() => {
                setDragOverFolderId(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverFolderId(null);
                const draggedId = e.dataTransfer.getData('text/plain');
                if (draggedId && draggedId !== folder.id) {
                  onDropItemToFolder(draggedId, folder.id);
                }
              }}
              className={`group relative flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                isDragTarget
                  ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-300'
                  : isSelected
                  ? 'bg-blue-50/90 border-blue-400 shadow-xs'
                  : 'bg-white border-gray-200/90 hover:border-gray-300 hover:bg-gray-50/80 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <Folder
                  size={20}
                  style={{
                    color: folder.color || '#3b82f6',
                    fill: folder.color ? `${folder.color}30` : '#3b82f625',
                  }}
                  className="shrink-0"
                />
                <span className="text-xs font-medium text-gray-800 truncate group-hover:text-blue-600">
                  {folder.name}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {folder.starred && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStarFolder(folder);
                    }}
                    className="text-amber-500 hover:text-amber-600 p-1"
                    title="Starred"
                  >
                    <Star size={13} fill="currentColor" />
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenFolderMenu(folder, e);
                  }}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
