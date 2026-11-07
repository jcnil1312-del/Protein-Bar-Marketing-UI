import React from 'react';
import { MoreVertical, Star } from 'lucide-react';
import { DriveItem } from '../types/drive';
import { FileIcon } from './FileIcon';
import { formatDate } from '../utils/formatters';

interface SuggestedFilesProps {
  files: DriveItem[];
  onOpenFile: (file: DriveItem) => void;
  onStarFile: (file: DriveItem) => void;
  onOpenItemMenu: (file: DriveItem, e: React.MouseEvent) => void;
}

export const SuggestedFiles: React.FC<SuggestedFilesProps> = ({
  files,
  onOpenFile,
  onStarFile,
  onOpenItemMenu,
}) => {
  if (files.length === 0) return null;

  return (
    <div className="mb-6 select-none">
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 px-1">
        Suggested / Quick Access
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.slice(0, 4).map((file) => (
          <div
            key={file.id}
            onClick={() => onOpenFile(file)}
            className="group relative bg-white rounded-2xl border border-gray-200/80 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col h-48"
          >
            {/* Header Thumbnail Preview / Banner */}
            <div className="h-28 bg-gray-100 relative overflow-hidden flex items-center justify-center">
              {file.thumbnail ? (
                <img
                  src={file.thumbnail}
                  alt={file.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="p-4 flex flex-col items-center justify-center text-gray-400">
                  <FileIcon type={file.type} size={36} />
                </div>
              )}

              {/* Star badge on top-left of preview */}
              {file.starred && (
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs p-1 rounded-full shadow-xs text-amber-500">
                  <Star size={13} fill="currentColor" />
                </div>
              )}

              {/* Quick menu trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenItemMenu(file, e);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical size={14} />
              </button>
            </div>

            {/* Bottom Meta & Name */}
            <div className="p-3 flex-1 flex flex-col justify-between bg-white">
              <div className="flex items-center gap-2">
                <FileIcon type={file.type} size={16} />
                <span className="text-xs font-semibold text-gray-800 truncate leading-snug group-hover:text-blue-600 transition-colors">
                  {file.name}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1">
                <span>Opened {formatDate(file.modifiedAt)}</span>
                <span className="capitalize">{file.owner.name.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
