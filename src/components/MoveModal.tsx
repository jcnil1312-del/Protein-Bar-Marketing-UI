import React, { useState } from 'react';
import { X, Folder, HardDrive, Check } from 'lucide-react';
import { DriveItem } from '../types/drive';

interface MoveModalProps {
  item: DriveItem | null;
  folders: DriveItem[];
  onClose: () => void;
  onMove: (item: DriveItem, targetFolderId: string | null) => void;
}

export const MoveModal: React.FC<MoveModalProps> = ({
  item,
  folders,
  onClose,
  onMove,
}) => {
  const [targetId, setTargetId] = useState<string | null>(item?.parentId ?? null);

  if (!item) return null;

  // Filter out self and children if moving a folder
  const availableFolders = folders.filter(
    (f) => f.id !== item.id && !f.trashed && f.parentId !== item.id
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 text-gray-800 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">
            Move "{item.name}"
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="py-4 space-y-1 max-h-60 overflow-y-auto">
          {/* Root option */}
          <div
            onClick={() => setTargetId(null)}
            className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs font-medium transition-colors ${
              targetId === null
                ? 'bg-blue-50 text-blue-800 font-semibold border border-blue-200'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <HardDrive size={16} className="text-blue-600" />
              <span>My Drive (Root)</span>
            </div>
            {targetId === null && <Check size={14} className="text-blue-600" />}
          </div>

          {/* Folder options */}
          {availableFolders.map((f) => (
            <div
              key={f.id}
              onClick={() => setTargetId(f.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs font-medium transition-colors ${
                targetId === f.id
                  ? 'bg-blue-50 text-blue-800 font-semibold border border-blue-200'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Folder
                  size={16}
                  style={{ color: f.color || '#3b82f6', fill: f.color ? `${f.color}30` : '#3b82f620' }}
                />
                <span className="truncate">{f.name}</span>
              </div>
              {targetId === f.id && <Check size={14} className="text-blue-600" />}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onMove(item, targetId);
              onClose();
            }}
            disabled={targetId === item.parentId}
            className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            Move here
          </button>
        </div>
      </div>
    </div>
  );
};
