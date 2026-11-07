import React from 'react';
import { X, Cloud, HardDrive, Mail, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { StorageStats } from '../types/drive';
import { formatBytes } from '../utils/formatters';

interface StorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  storage: StorageStats;
  onUpgradeStorage: (newTotalBytes: number) => void;
}

export const StorageModal: React.FC<StorageModalProps> = ({
  isOpen,
  onClose,
  storage,
  onUpgradeStorage,
}) => {
  if (!isOpen) return null;

  const drivePct = (storage.driveBytes / storage.totalBytes) * 100;
  const gmailPct = (storage.gmailBytes / storage.totalBytes) * 100;
  const photosPct = (storage.photosBytes / storage.totalBytes) * 100;
  const freeBytes = Math.max(0, storage.totalBytes - storage.usedBytes);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 text-gray-800 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <Cloud size={22} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Google Workspace Storage
              </h3>
              <p className="text-xs text-gray-500">
                Shared across Google Drive, Gmail, and Google Photos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Storage Bar Breakdown */}
        <div className="my-6 p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700">Storage Used</span>
            <span className="text-xs font-bold text-gray-900">
              {formatBytes(storage.usedBytes)} of {formatBytes(storage.totalBytes)} (
              {Math.round((storage.usedBytes / storage.totalBytes) * 100)}%)
            </span>
          </div>

          {/* Multi-color segment bar */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${drivePct}%` }}
              className="bg-blue-600 h-full"
              title={`Drive: ${formatBytes(storage.driveBytes)}`}
            />
            <div
              style={{ width: `${gmailPct}%` }}
              className="bg-red-500 h-full"
              title={`Gmail: ${formatBytes(storage.gmailBytes)}`}
            />
            <div
              style={{ width: `${photosPct}%` }}
              className="bg-amber-400 h-full"
              title={`Photos: ${formatBytes(storage.photosBytes)}`}
            />
          </div>

          {/* Breakdown labels */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
              <div>
                <div className="text-gray-500 text-[10px]">Google Drive</div>
                <div className="font-semibold text-gray-800">
                  {formatBytes(storage.driveBytes)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
              <div>
                <div className="text-gray-500 text-[10px]">Gmail</div>
                <div className="font-semibold text-gray-800">
                  {formatBytes(storage.gmailBytes)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
              <div>
                <div className="text-gray-500 text-[10px]">Google Photos</div>
                <div className="font-semibold text-gray-800">
                  {formatBytes(storage.photosBytes)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300 shrink-0" />
              <div>
                <div className="text-gray-500 text-[10px]">Free Space</div>
                <div className="font-semibold text-gray-800">
                  {formatBytes(freeBytes)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Plans */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-500" />
            Upgrade Storage with Google One
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 100 GB Tier */}
            <div className="border border-gray-200 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-400 transition-colors bg-white">
              <div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  Basic
                </span>
                <div className="text-lg font-bold text-gray-900 mt-2">100 GB</div>
                <div className="text-xs text-gray-500">$1.99 / month</div>
              </div>
              <button
                onClick={() => onUpgradeStorage(100_000_000_000)}
                className="mt-4 w-full py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              >
                Upgrade to 100G
              </button>
            </div>

            {/* 200 GB Tier */}
            <div className="border border-blue-300 bg-blue-50/30 rounded-2xl p-4 flex flex-col justify-between shadow-2xs relative">
              <div className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                POPULAR
              </div>
              <div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full">
                  Standard
                </span>
                <div className="text-lg font-bold text-gray-900 mt-2">200 GB</div>
                <div className="text-xs text-gray-500">$2.99 / month</div>
              </div>
              <button
                onClick={() => onUpgradeStorage(200_000_000_000)}
                className="mt-4 w-full py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
              >
                Upgrade to 200G
              </button>
            </div>

            {/* 2 TB Tier */}
            <div className="border border-gray-200 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-400 transition-colors bg-white">
              <div>
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  Premium
                </span>
                <div className="text-lg font-bold text-gray-900 mt-2">2 TB</div>
                <div className="text-xs text-gray-500">$9.99 / month</div>
              </div>
              <button
                onClick={() => onUpgradeStorage(2_000_000_000_000)}
                className="mt-4 w-full py-1.5 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
              >
                Upgrade to 2 TB
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
