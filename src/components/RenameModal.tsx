import React, { useState, useEffect } from 'react';
import { X, Edit2 } from 'lucide-react';
import { DriveItem } from '../types/drive';

interface RenameModalProps {
  item: DriveItem | null;
  onClose: () => void;
  onRename: (item: DriveItem, newName: string) => void;
}

export const RenameModal: React.FC<RenameModalProps> = ({
  item,
  onClose,
  onRename,
}) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name);
    }
  }, [item]);

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && name.trim() !== item.name) {
      onRename(item, name.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100">
      <div
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 text-gray-800 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Edit2 size={18} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Rename</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Item name
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || name.trim() === item.name}
              className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
