import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  HelpCircle,
  Settings,
  Grid,
  List,
  Info,
  CheckCircle2,
  HardDrive,
  User as UserIcon,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { ViewMode, DriveFilterOptions } from '../types/drive';
import { CURRENT_USER } from '../data/initialData';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
  detailsOpen: boolean;
  onToggleDetails: () => void;
  filterOptions: DriveFilterOptions;
  onFilterChange: (filters: DriveFilterOptions) => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  detailsOpen,
  onToggleDetails,
  filterOptions,
  onFilterChange,
  onOpenSettings,
  onOpenHelp,
}) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const hasActiveFilters =
    filterOptions.type !== 'all' ||
    filterOptions.owner !== 'anyone' ||
    filterOptions.modified !== 'anytime';

  const resetFilters = () => {
    onFilterChange({
      type: 'all',
      owner: 'anyone',
      modified: 'anytime',
    });
  };

  return (
    <header className="h-16 px-4 flex items-center justify-between border-b border-gray-200/80 bg-white/95 backdrop-blur-sm sticky top-0 z-30 select-none">
      {/* Left: Brand Logo & Title */}
      <div className="flex items-center gap-3 w-64 min-w-[240px]">
        <div className="flex items-center gap-2.5 cursor-pointer">
          {/* Custom Google Drive Logo SVG */}
          <div className="w-9 h-9 relative flex items-center justify-center">
            <svg viewBox="0 0 87.3 78" className="w-8 h-8">
              <path
                d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
                fill="#0066da"
              />
              <path
                d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z"
                fill="#00ac47"
              />
              <path
                d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
                fill="#ea4335"
              />
              <path
                d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.25z"
                fill="#00832d"
              />
              <path
                d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
                fill="#2684fc"
              />
              <path
                d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
                fill="#ffba00"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[20px] font-medium tracking-tight text-gray-800 leading-tight flex items-center gap-1.5">
              Drive Hub
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-200/60">
                PRO
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Google-style Omnibox Search Bar */}
      <div className="flex-1 max-w-2xl relative px-2">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-gray-500 pointer-events-none">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search in Drive (e.g. documents, roadmap, finance...)"
            className="w-full pl-10 pr-24 py-2.5 text-sm bg-gray-100/90 hover:bg-gray-100 focus:bg-white text-gray-900 placeholder-gray-500 rounded-full border border-transparent focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60 shadow-sm transition-all outline-none"
          />
          <div className="absolute right-2.5 flex items-center gap-1">
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200/60"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`p-1.5 rounded-full transition-colors ${
                hasActiveFilters || showFilterDropdown
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/70'
              }`}
              title="Search options & filters"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Search Options Dropdown Modal */}
        {showFilterDropdown && (
          <div className="absolute top-12 left-2 right-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Search Filters
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                  Reset all
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              {/* Type Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                <select
                  value={filterOptions.type}
                  onChange={(e) =>
                    onFilterChange({ ...filterOptions, type: e.target.value })
                  }
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-200 outline-none"
                >
                  <option value="all">Any type</option>
                  <option value="document">Documents</option>
                  <option value="spreadsheet">Spreadsheets</option>
                  <option value="presentation">Presentations</option>
                  <option value="pdf">PDFs</option>
                  <option value="image">Photos & Images</option>
                  <option value="folder">Folders</option>
                  <option value="code">Code & JSON</option>
                </select>
              </div>

              {/* Owner Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">People / Owner</label>
                <select
                  value={filterOptions.owner}
                  onChange={(e) =>
                    onFilterChange({ ...filterOptions, owner: e.target.value })
                  }
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-200 outline-none"
                >
                  <option value="anyone">Anyone</option>
                  <option value="me">Owned by me</option>
                  <option value="not-me">Not owned by me</option>
                </select>
              </div>

              {/* Modified Date */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Date Modified</label>
                <select
                  value={filterOptions.modified}
                  onChange={(e) =>
                    onFilterChange({ ...filterOptions, modified: e.target.value })
                  }
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-200 outline-none"
                >
                  <option value="anytime">Any time</option>
                  <option value="today">Today</option>
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowFilterDropdown(false)}
                className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Controls: View Switch, Help, Settings, Profile */}
      <div className="flex items-center gap-1.5">
        {/* Offline sync indicator */}
        <div
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200/70"
          title="Changes automatically save and sync"
        >
          <CheckCircle2 size={13} className="text-emerald-600" />
          <span className="font-medium">Synced</span>
        </div>

        {/* View Switcher: List vs Grid */}
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 ml-2">
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'list'
                ? 'bg-white text-blue-600 shadow-xs font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="List view"
          >
            <List size={17} />
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-blue-600 shadow-xs font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Grid view"
          >
            <Grid size={17} />
          </button>
        </div>

        {/* Details Toggle */}
        <button
          onClick={onToggleDetails}
          className={`p-2 rounded-full transition-colors ${
            detailsOpen
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          title="View details & activity"
        >
          <Info size={19} />
        </button>

        {/* Help button */}
        <button
          onClick={onOpenHelp}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          title="Support & Shortcuts"
        >
          <HelpCircle size={19} />
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          title="Drive settings"
        >
          <Settings size={19} />
        </button>

        {/* Profile Avatar & Dropdown */}
        <div className="relative ml-2">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-9 h-9 rounded-full ring-2 ring-transparent hover:ring-blue-300 transition-all overflow-hidden flex items-center justify-center bg-gray-200 shadow-sm"
          >
            <img
              src={CURRENT_USER.avatar}
              alt={CURRENT_USER.name}
              className="w-full h-full object-cover"
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-11 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-3 px-4 z-50 animate-in fade-in duration-100">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <img
                  src={CURRENT_USER.avatar}
                  alt={CURRENT_USER.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-gray-800 truncate">
                    {CURRENT_USER.name}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {CURRENT_USER.email}
                  </span>
                </div>
              </div>

              <div className="py-2.5 border-b border-gray-100 text-xs text-gray-600 space-y-1">
                <div className="flex items-center justify-between text-gray-700 font-medium">
                  <span className="flex items-center gap-1.5">
                    <HardDrive size={13} className="text-blue-500" /> Storage
                  </span>
                  <span>11.4 GB / 15 GB</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[76%] rounded-full" />
                </div>
              </div>

              <div className="pt-2 text-xs">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-2 py-1.5 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Settings size={14} /> Preferences & Theme
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    alert('Signed in as local Workspace owner. Storage runs in local persisted high-speed mode.');
                  }}
                  className="w-full flex items-center gap-2 py-1.5 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Sparkles size={14} className="text-amber-500" /> Account Status: Active
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
