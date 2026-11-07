import React, { useEffect, useRef } from 'react';
import {
  Eye,
  Share2,
  Star,
  Edit2,
  FolderInput,
  Palette,
  Download,
  Trash2,
  RotateCcw,
  Info,
} from 'lucide-react';
import { DriveItem } from '../types/drive';

interface ContextMenuProps {
  x: number;
  y: number;
  item: DriveItem;
  isTrash: boolean;
  onClose: () => void;
  onOpen: (item: DriveItem) => void;
  onShare: (item: DriveItem) => void;
  onStar: (item: DriveItem) => void;
  onRename: (item: DriveItem) => void;
  onMove: (item: DriveItem) => void;
  onChangeColor: (item: DriveItem) => void;
  onDownload: (item: DriveItem) => void;
  onDelete: (item: DriveItem) => void;
  onRestore: (item: DriveItem) => void;
  onViewDetails: (item: DriveItem) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  item,
  isTrash,
  onClose,
  onOpen,
  onShare,
  onStar,
  onRename,
  onMove,
  onChangeColor,
  onDownload,
  onDelete,
  onRestore,
  onViewDetails,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Adjust positioning so menu stays inside viewport
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - 340);

  return (
    <div
      ref={menuRef}
      style={{ left: `${adjustedX}px`, top: `${adjustedY}px` }}
      className="fixed z-50 w-52 bg-white rounded-2xl shadow-2xl border border-gray-200/90 py-1.5 text-xs text-gray-700 animate-in fade-in zoom-in-95 duration-100 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {isTrash ? (
        <>
          <button
            onClick={() => {
              onClose();
              onRestore(item);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-gray-100 text-left transition-colors font-medium text-blue-600"
          >
            <RotateCcw size={15} />
            <span>Restore from trash</span>
          </button>
          <button
            onClick={() => {
              onClose();
              onDelete(item);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-red-50 text-left transition-colors font-medium text-red-600"
          >
            <Trash2 size={15} />
            <span>Delete permanently</span>
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              onClose();
              onOpen(item);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-gray-100 text-left transition-colors font-medium"
          >
            <Eye size={15} />
            <span>{item.type === 'folder' ? 'Open folder' : 'Preview & Edit'}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onShare(item);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-gray-100 text-left transition-colors"
          >
            <Share2 size={15} />
            <span>Share</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onStar(item);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-gray-100 text-left transition-colors"
          >
            <Star size={15} className={item.starred ? 'text-amber-500 fill-amber-500' : ''} />
            <span>{item.starred ? 'Remove from starred' : 'Add to starred'}</span>
          </button>

          <div className="my-1 border-t border-gray-100" />

          <button
            onClick={() => {
              onClose();
              onRename(item);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-gray-100 text-left transition-colors"
          >
            <Edit2 size={15} />
            <span>Rename</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onMove(item);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-gray-100 text-left transition-colors"
          >
            <FolderInput size={15} />
            <span>Move to folder...</span>
          </button>

          {item.type === 'folder' && (
            <button
              onClick={() => {
                onClose();
                onChangeColor(item);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-gray-100 text-left transition-colors"
            >
              <Palette size={15} />
              <span>Change color</span>
            </button>
          )}

          {item.type !== 'folder' && (
            <button
              onClick={() => {
                onClose();
                onDownload(item);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-gray-100 text-left transition-colors"
            >
              <Download size={15} />
              <span>Download</span>
            </button>
          )}

          <button
            onClick={() => {
              onClose();
              onViewDetails(item);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-gray-100 text-left transition-colors"
          >
            <Info size={15} />
            <span>File details</span>
          </button>

          <div className="my-1 border-t border-gray-100" />

          <button
            onClick={() => {
              onClose();
              onDelete(item);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-red-50 text-left text-red-600 transition-colors"
          >
            <Trash2 size={15} />
            <span>Move to trash</span>
          </button>
        </>
      )}
    </div>
  );
};
