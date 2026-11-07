import React from 'react';
import { X, Palette } from 'lucide-react';
import { DriveItem } from '../types/drive';

interface FolderColorModalProps {
  folder: DriveItem | null;
  onClose: () => void;
  onSelectColor: (folder: DriveItem, color: string) => void;
}

const COLORS = [
  { name: 'Classic Slate', hex: '#5f6368' },
  { name: 'Google Blue', hex: '#1a73e8' },
  { name: 'Sky Blue', hex: '#0284c7' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Mint Green', hex: '#10b981' },
  { name: 'Lime', hex: '#84cc16' },
  { name: 'Amber Yellow', hex: '#f59e0b' },
  { name: 'Orange', hex: '#ea580c' },
  { name: 'Rose Red', hex: '#e11d48' },
  { name: 'Fuchsia', hex: '#c026d3' },
  { name: 'Purple', hex: '#7c3aed' },
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Dark Slate', hex: '#1e293b' },
];

export const FolderColorModal: React.FC<FolderColorModalProps> = ({
  folder,
  onClose,
  onSelectColor,
}) => {
  if (!folder) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100">
      <div
        className="w-full max-w-xs bg-white rounded-3xl shadow-2xl border border-gray-200 p-5 text-gray-800 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">Change folder color</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2.5 py-2">
          {COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => {
                onSelectColor(folder, c.hex);
                onClose();
              }}
              style={{ backgroundColor: c.hex }}
              className={`w-9 h-9 rounded-xl transition-all shadow-2xs hover:scale-110 flex items-center justify-center ${
                folder.color === c.hex ? 'ring-2 ring-offset-2 ring-blue-600 scale-105' : ''
              }`}
              title={c.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
