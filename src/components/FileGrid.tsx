import React from 'react';
import { MoreVertical, Star, Users } from 'lucide-react';
import { DriveItem } from '../types/drive';
import { FileIcon } from './FileIcon';
import { formatBytes, formatDate } from '../utils/formatters';

interface FileGridProps {
  files: DriveItem[];
  selectedFileIds: string[];
  onOpenFile: (file: DriveItem) => void;
  onToggleSelectFile: (fileId: string, isMulti: boolean) => void;
  onStarFile: (file: DriveItem) => void;
  onOpenItemMenu: (file: DriveItem, e: React.MouseEvent) => void;
}

export const FileGrid: React.FC<FileGridProps> = ({
  files,
  selectedFileIds,
  onOpenFile,
  onToggleSelectFile,
  onStarFile,
  onOpenItemMenu,
}) => {
  if (files.length === 0) return null;

  return (
    <div className="select-none">
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 px-1">
        Files ({files.length})
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((file) => {
          const isSelected = selectedFileIds.includes(file.id);

          return (
            <div
              key={file.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', file.id);
              }}
              onClick={(e) => {
                if (e.detail === 2) {
                  onOpenFile(file);
                } else {
                  onToggleSelectFile(file.id, e.shiftKey || e.metaKey || e.ctrlKey);
                }
              }}
              onDoubleClick={() => onOpenFile(file)}
              className={`group relative bg-white rounded-2xl border transition-all cursor-pointer flex flex-col overflow-hidden h-60 ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50/20 shadow-sm'
                  : 'border-gray-200/80 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              {/* Card Header: Icon, Name, Star & Menu */}
              <div className="p-3 pb-2 flex items-center justify-between border-b border-gray-100/80">
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <FileIcon type={file.type} size={18} />
                  <span
                    className="text-xs font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors"
                    title={file.name}
                  >
                    {file.name}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStarFile(file);
                    }}
                    className={`p-1 rounded-full transition-opacity ${
                      file.starred
                        ? 'text-amber-500 opacity-100'
                        : 'text-gray-400 hover:text-amber-500 opacity-0 group-hover:opacity-100'
                    }`}
                    title={file.starred ? 'Starred' : 'Add star'}
                  >
                    <Star size={13} fill={file.starred ? 'currentColor' : 'none'} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenItemMenu(file, e);
                    }}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="More actions"
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>

              {/* Card Center: Visual Preview Thumbnail */}
              <div className="flex-1 bg-gray-50/70 relative overflow-hidden flex items-center justify-center p-2">
                {file.thumbnail ? (
                  <img
                    src={file.thumbnail}
                    alt={file.name}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-102 transition-transform duration-200"
                  />
                ) : file.sheetData ? (
                  /* Mini Sheet Preview */
                  <div className="w-full h-full bg-white rounded border border-gray-200/80 p-1 overflow-hidden text-[9px] text-gray-500 font-mono">
                    <div className="grid grid-cols-3 gap-0.5 border-b pb-0.5 font-bold text-gray-700">
                      <span>Col A</span>
                      <span>Col B</span>
                      <span>Col C</span>
                    </div>
                    {file.sheetData.slice(0, 3).map((row, idx) => (
                      <div key={idx} className="grid grid-cols-3 gap-0.5 py-0.5 truncate">
                        <span className="truncate">{row[0]}</span>
                        <span className="truncate">{row[1]}</span>
                        <span className="truncate">{row[2]}</span>
                      </div>
                    ))}
                  </div>
                ) : file.content ? (
                  /* Mini Doc text preview */
                  <div className="w-full h-full bg-white rounded border border-gray-200/80 p-2 overflow-hidden text-[10px] text-gray-600 line-clamp-5 whitespace-pre-wrap font-sans">
                    {file.content}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-300">
                    <FileIcon type={file.type} size={42} />
                  </div>
                )}
              </div>

              {/* Card Footer: Metadata (Size, Modified Date, Collaborators) */}
              <div className="px-3 py-2 bg-white flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100">
                <span>{formatBytes(file.size)}</span>
                <div className="flex items-center gap-1.5">
                  {file.sharedWith && file.sharedWith.length > 0 && (
                    <div
                      className="flex items-center text-gray-400 hover:text-blue-600"
                      title={`Shared with ${file.sharedWith.length} people`}
                    >
                      <Users size={12} />
                    </div>
                  )}
                  <span>{formatDate(file.modifiedAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
