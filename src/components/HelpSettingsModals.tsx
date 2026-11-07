import React from 'react';
import { X, Keyboard, Settings, RotateCcw, ShieldCheck, HardDrive, Smartphone } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Enter', desc: 'Open / Preview selected item' },
    { key: 'Esc', desc: 'Close dialog or clear selection' },
    { key: '/', desc: 'Focus search omnibox' },
    { key: 'Delete / Backspace', desc: 'Move selected item to trash' },
    { key: 'S', desc: 'Toggle star on selected item' },
    { key: 'Double Click', desc: 'Open folder or file preview' },
    { key: 'Drag & Drop', desc: 'Move files into folders or upload from desktop' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 text-gray-800 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Keyboard size={18} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">
              Keyboard Shortcuts & Help
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="py-4 space-y-2.5 max-h-72 overflow-y-auto">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-gray-50"
            >
              <span className="text-gray-600">{sc.desc}</span>
              <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded-md font-mono text-[11px] font-semibold text-gray-700 shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 leading-relaxed">
          Tip: You can drag and drop multiple files directly from your computer anywhere into the window to upload them instantly!
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  density: 'comfortable' | 'compact';
  onDensityChange: (d: 'comfortable' | 'compact') => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  density,
  onDensityChange,
  onResetData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 text-gray-800 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gray-100 text-gray-700">
              <Settings size={18} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Drive Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs">
          {/* Density */}
          <div>
            <label className="block font-semibold text-gray-800 mb-1.5">
              Display Density
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onDensityChange('comfortable')}
                className={`p-2.5 rounded-xl border text-left transition-colors ${
                  density === 'comfortable'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                Comfortable
              </button>
              <button
                onClick={() => onDensityChange('compact')}
                className={`p-2.5 rounded-xl border text-left transition-colors ${
                  density === 'compact'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                Compact
              </button>
            </div>
          </div>

          {/* Sync status */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
            <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-emerald-950">
                High-Speed Persistent Storage Active
              </div>
              <div className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                Your files, uploads, and edits are securely cached in client local storage and persist between browser sessions.
              </div>
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={() => {
                if (window.confirm('Reset all Drive files to original sample state?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition-colors w-full font-medium"
            >
              <RotateCcw size={15} />
              <span>Reset demo files & storage</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
