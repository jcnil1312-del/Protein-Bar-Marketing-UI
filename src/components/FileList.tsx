import React from 'react';
import { MoreVertical, Star, Share2, Download, Trash2 } from 'lucide-react';
import { DriveItem } from '../types/drive';
import { FileIcon } from './FileIcon';
import { formatBytes, formatDate } from '../utils/formatters';

interface FileListProps {
  items: DriveItem[];
  selectedItemIds: string[];
  onOpenItem: (item: DriveItem) => void;
  onToggleSelectItem: (itemId: string, isMulti: boolean) => void;
  onSelectAll: () => void;
  onStarItem: (item: DriveItem) => void;
  onShareItem: (item: DriveItem) => void;
  onDownloadItem: (item: DriveItem) => void;
  onOpenItemMenu: (item: DriveItem, e: React.MouseEvent) => void;
}

export const FileList: React.FC<FileListProps> = ({
  items,
  selectedItemIds,
  onOpenItem,
  onToggleSelectItem,
  onSelectAll,
  onStarItem,
  onShareItem,
  onDownloadItem,
  onOpenItemMenu,
}) => {
  const allSelected = items.length > 0 && selectedItemIds.length === items.length;

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200/90 overflow-hidden select-none shadow-2xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gray-50 border-b border-gray-200/80 text-gray-500 font-semibold uppercase tracking-wider">
          <tr>
            <th className="py-3 pl-4 pr-2 w-8">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </th>
            <th className="py-3 px-3">Name</th>
            <th className="py-3 px-3 hidden md:table-cell">Owner</th>
            <th className="py-3 px-3 hidden sm:table-cell">Last modified</th>
            <th className="py-3 px-3 hidden lg:table-cell">File size</th>
            <th className="py-3 pr-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => {
            const isSelected = selectedItemIds.includes(item.id);

            return (
              <tr
                key={item.id}
                draggable={item.type !== 'folder'}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', item.id);
                }}
                onClick={(e) => {
                  if (e.detail === 2) {
                    onOpenItem(item);
                  } else {
                    onToggleSelectItem(item.id, e.shiftKey || e.metaKey || e.ctrlKey);
                  }
                }}
                onDoubleClick={() => onOpenItem(item)}
                className={`group cursor-pointer transition-colors ${
                  isSelected ? 'bg-blue-50/80' : 'hover:bg-gray-50/80'
                }`}
              >
                {/* Checkbox */}
                <td className="py-3 pl-4 pr-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelectItem(item.id, true)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </td>

                {/* Name & Icon */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileIcon type={item.type} color={item.color} size={18} />
                    <span className="font-medium text-gray-800 truncate max-w-xs md:max-w-md group-hover:text-blue-600">
                      {item.name}
                    </span>
                    {item.starred && (
                      <Star
                        size={12}
                        className="text-amber-500 fill-amber-500 shrink-0"
                      />
                    )}
                  </div>
                </td>

                {/* Owner */}
                <td className="py-3 px-3 hidden md:table-cell">
                  <div className="flex items-center gap-2 text-gray-600">
                    {item.owner.avatar ? (
                      <img
                        src={item.owner.avatar}
                        alt={item.owner.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                        {item.owner.name.charAt(0)}
                      </div>
                    )}
                    <span className="truncate">{item.owner.name}</span>
                  </div>
                </td>

                {/* Last Modified */}
                <td className="py-3 px-3 text-gray-500 hidden sm:table-cell">
                  {formatDate(item.modifiedAt)}
                </td>

                {/* Size */}
                <td className="py-3 px-3 text-gray-500 hidden lg:table-cell">
                  {item.type === 'folder' ? '—' : formatBytes(item.size)}
                </td>

                {/* Actions */}
                <td
                  className="py-3 pr-4 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onStarItem(item)}
                      className={`p-1.5 rounded-full hover:bg-gray-200/70 ${
                        item.starred ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'
                      }`}
                      title={item.starred ? 'Starred' : 'Add star'}
                    >
                      <Star size={14} fill={item.starred ? 'currentColor' : 'none'} />
                    </button>

                    {item.type !== 'folder' && (
                      <>
                        <button
                          onClick={() => onShareItem(item)}
                          className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/70"
                          title="Share"
                        >
                          <Share2 size={14} />
                        </button>
                        <button
                          onClick={() => onDownloadItem(item)}
                          className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/70"
                          title="Download"
                        >
                          <Download size={14} />
                        </button>
                      </>
                    )}

                    <button
                      onClick={(e) => onOpenItemMenu(item, e)}
                      className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/70"
                      title="More options"
                    >
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
