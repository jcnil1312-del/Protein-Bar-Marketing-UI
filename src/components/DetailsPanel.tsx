import React, { useState } from 'react';
import {
  X,
  FileText,
  Clock,
  HardDrive,
  Users,
  Calendar,
  Tag,
  Star,
  Download,
  Trash2,
  Share2,
} from 'lucide-react';
import { DriveItem } from '../types/drive';
import { FileIcon } from './FileIcon';
import { formatBytes, formatFullDateTime, getFileTypeLabel, downloadDriveFile } from '../utils/formatters';

interface DetailsPanelProps {
  item: DriveItem | null;
  onClose: () => void;
  onStarItem: (item: DriveItem) => void;
  onShareItem: (item: DriveItem) => void;
  onDeleteItem: (item: DriveItem) => void;
  onUpdateDescription: (item: DriveItem, description: string) => void;
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({
  item,
  onClose,
  onStarItem,
  onShareItem,
  onDeleteItem,
  onUpdateDescription,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details');
  const [editingDesc, setEditingDesc] = useState(false);
  const [descText, setDescText] = useState(item?.description || '');

  if (!item) {
    return (
      <aside className="w-80 border-l border-gray-200/80 bg-white h-[calc(100vh-4rem)] p-6 flex flex-col items-center justify-center text-center text-gray-400 select-none">
        <FileText size={40} className="text-gray-300 mb-3" />
        <h4 className="text-sm font-semibold text-gray-600">Select an item</h4>
        <p className="text-xs text-gray-400 mt-1">
          Click any file or folder to inspect its details, sharing status, and activity.
        </p>
      </aside>
    );
  }

  const handleSaveDesc = () => {
    onUpdateDescription(item, descText);
    setEditingDesc(false);
  };

  return (
    <aside className="w-80 border-l border-gray-200/80 bg-white h-[calc(100vh-4rem)] flex flex-col z-10 select-none overflow-hidden">
      {/* Top Header */}
      <div className="p-4 pb-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <FileIcon type={item.type} color={item.color} size={18} />
          <h3 className="text-xs font-semibold text-gray-900 truncate" title={item.name}>
            {item.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title="Close details"
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-4 text-xs font-medium">
        <button
          onClick={() => setActiveTab('details')}
          className={`py-2.5 mr-6 border-b-2 transition-colors ${
            activeTab === 'details'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`py-2.5 border-b-2 transition-colors ${
            activeTab === 'activity'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Activity
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-gray-600">
        {activeTab === 'details' ? (
          <>
            {/* Visual Thumbnail Preview */}
            <div className="w-full h-36 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center relative">
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <FileIcon type={item.type} color={item.color} size={48} />
                </div>
              )}
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => onStarItem(item)}
                className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  item.starred
                    ? 'border-amber-300 bg-amber-50 text-amber-700'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Star size={13} fill={item.starred ? 'currentColor' : 'none'} />
                <span>{item.starred ? 'Starred' : 'Star'}</span>
              </button>

              <button
                onClick={() => onShareItem(item)}
                className="flex-1 py-1.5 px-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 size={13} />
                <span>Share</span>
              </button>

              {item.type !== 'folder' && (
                <button
                  onClick={() => downloadDriveFile(item.name, item.content || item.thumbnail, item.type)}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
                  title="Download"
                >
                  <Download size={13} />
                </button>
              )}
            </div>

            {/* Who has access */}
            <div>
              <div className="font-semibold text-gray-800 mb-2 flex items-center justify-between">
                <span>Who has access</span>
                <button
                  onClick={() => onShareItem(item)}
                  className="text-blue-600 hover:underline text-[11px]"
                >
                  Manage
                </button>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={item.owner.avatar}
                  alt={item.owner.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-200"
                />
                {item.sharedWith?.map((c) => (
                  <img
                    key={c.email}
                    src={c.avatar}
                    alt={c.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-200"
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* System File Properties */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="font-semibold text-gray-800">File Properties</div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="text-gray-400">Type</div>
                <div className="text-gray-800 font-medium">
                  {getFileTypeLabel(item.type)}
                </div>

                <div className="text-gray-400">Size</div>
                <div className="text-gray-800 font-medium">
                  {item.type === 'folder' ? '—' : formatBytes(item.size)}
                </div>

                <div className="text-gray-400">Storage used</div>
                <div className="text-gray-800 font-medium">
                  {item.type === 'folder' ? '0 B' : formatBytes(item.size)}
                </div>

                <div className="text-gray-400">Owner</div>
                <div className="text-gray-800 font-medium">{item.owner.name}</div>

                <div className="text-gray-400">Modified</div>
                <div className="text-gray-800 font-medium">
                  {formatFullDateTime(item.modifiedAt)}
                </div>

                <div className="text-gray-400">Created</div>
                <div className="text-gray-800 font-medium">
                  {formatFullDateTime(item.createdAt)}
                </div>
              </div>
            </div>

            {/* Editable Description */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="font-semibold text-gray-800 flex items-center justify-between">
                <span>Description</span>
                {!editingDesc && (
                  <button
                    onClick={() => {
                      setDescText(item.description || '');
                      setEditingDesc(true);
                    }}
                    className="text-blue-600 hover:underline text-[11px]"
                  >
                    Edit
                  </button>
                )}
              </div>

              {editingDesc ? (
                <div className="space-y-2">
                  <textarea
                    value={descText}
                    onChange={(e) => setDescText(e.target.value)}
                    placeholder="Add description or notes..."
                    rows={3}
                    className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => setEditingDesc(false)}
                      className="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveDesc}
                      className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-xs italic bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  {item.description || 'No description added yet.'}
                </p>
              )}
            </div>

            {/* Danger Zone: Move to trash */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => onDeleteItem(item)}
                className="w-full flex items-center justify-center gap-2 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
              >
                <Trash2 size={14} />
                <span>Move to trash</span>
              </button>
            </div>
          </>
        ) : (
          /* Activity Timeline */
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-gray-800">
                  You opened this file
                </div>
                <div className="text-[10px] text-gray-400">Just now</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-gray-800">
                  Modified by {item.owner.name}
                </div>
                <div className="text-[10px] text-gray-400">
                  {formatFullDateTime(item.modifiedAt)}
                </div>
              </div>
            </div>

            {item.sharedWith && item.sharedWith.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-gray-800">
                    Shared with {item.sharedWith.map((c) => c.name).join(', ')}
                  </div>
                  <div className="text-[10px] text-gray-400">2 days ago</div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-gray-800">
                  Created and uploaded
                </div>
                <div className="text-[10px] text-gray-400">
                  {formatFullDateTime(item.createdAt)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
