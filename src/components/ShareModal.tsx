import React, { useState } from 'react';
import {
  X,
  Link2,
  Check,
  Globe,
  Lock,
  UserPlus,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { DriveItem, FileCollaborator } from '../types/drive';

interface ShareModalProps {
  item: DriveItem | null;
  onClose: () => void;
  onUpdateItem: (updated: DriveItem) => void;
  onShowToast: (msg: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  item,
  onClose,
  onUpdateItem,
  onShowToast,
}) => {
  if (!item) return null;

  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'editor' | 'viewer' | 'commenter'>('editor');
  const [isPublic, setIsPublic] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      onShowToast('Please enter a valid email address');
      return;
    }

    const newCollaborator: FileCollaborator = {
      name: newEmail.split('@')[0],
      email: newEmail,
      role: newRole,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80`,
    };

    const updated = {
      ...item,
      sharedWith: [...(item.sharedWith || []), newCollaborator],
    };

    onUpdateItem(updated);
    setNewEmail('');
    onShowToast(`Invitation sent to ${newEmail}`);
  };

  const handleRemoveCollaborator = (email: string) => {
    const updated = {
      ...item,
      sharedWith: item.sharedWith.filter((c) => c.email !== email),
    };
    onUpdateItem(updated);
    onShowToast(`Removed access for ${email}`);
  };

  const handleCopyLink = () => {
    const fakeLink = `https://drivehub.app/file/${item.id}`;
    navigator.clipboard.writeText(fakeLink);
    setCopiedLink(true);
    onShowToast('Link copied to clipboard');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden text-gray-800 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 leading-snug">
              Share "{item.name}"
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage who has access to view, edit, or comment on this file.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Add People Input Form */}
          <form onSubmit={handleAddCollaborator} className="flex gap-2">
            <div className="flex-1 relative flex items-center">
              <UserPlus size={16} className="absolute left-3.5 text-gray-400" />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Add people or emails..."
                className="w-full pl-10 pr-24 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="absolute right-2 text-xs bg-transparent text-gray-600 font-medium outline-none cursor-pointer"
              >
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
                <option value="commenter">Commenter</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-sm transition-colors shrink-0"
            >
              Add
            </button>
          </form>

          {/* People with access list */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              People with access
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {/* Owner */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.owner.avatar}
                    alt={item.owner.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-semibold text-gray-800">
                      {item.owner.name} (You)
                    </div>
                    <div className="text-[10px] text-gray-500">{item.owner.email}</div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-gray-400 bg-gray-200/60 px-2 py-0.5 rounded-full">
                  Owner
                </span>
              </div>

              {/* Collaborators */}
              {item.sharedWith?.map((c) => (
                <div
                  key={c.email}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {c.avatar ? (
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {c.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-semibold text-gray-800">{c.name}</div>
                      <div className="text-[10px] text-gray-500">{c.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 capitalize">{c.role}</span>
                    <button
                      onClick={() => handleRemoveCollaborator(c.email)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-md"
                      title="Remove access"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* General Access link settings */}
          <div className="pt-2 border-t border-gray-100">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              General Access
            </h4>
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isPublic
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isPublic ? <Globe size={16} /> : <Lock size={16} />}
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-800">
                    {isPublic ? 'Anyone with the link' : 'Restricted'}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {isPublic
                      ? 'Anyone on the internet with this link can view'
                      : 'Only people with access can open with the link'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsPublic(!isPublic)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2 py-1"
              >
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 px-6 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-white text-xs font-semibold transition-all shadow-2xs"
          >
            {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Link2 size={14} />}
            <span>{copiedLink ? 'Link copied' : 'Copy link'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white rounded-full text-xs font-semibold hover:bg-blue-700 shadow-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
