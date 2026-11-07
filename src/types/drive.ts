export type FileType =
  | 'folder'
  | 'document'
  | 'spreadsheet'
  | 'presentation'
  | 'pdf'
  | 'image'
  | 'video'
  | 'audio'
  | 'code'
  | 'archive';

export interface FileCollaborator {
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer' | 'commenter';
}

export interface DriveItem {
  id: string;
  name: string;
  type: FileType;
  mimeType: string;
  size: number; // bytes, 0 for folder
  parentId: string | null; // null = root ("My Drive")
  createdAt: string; // ISO date string
  modifiedAt: string; // ISO date string
  starred: boolean;
  trashed: boolean;
  trashedAt?: string;
  owner: FileCollaborator;
  sharedWith: FileCollaborator[];
  thumbnail?: string;
  content?: string; // For documents or code
  sheetData?: string[][]; // For spreadsheets: 2D array of cell values
  slideTitles?: string[]; // For presentations: slide topics
  color?: string; // Folder color (e.g. '#2563eb', '#10b981', etc.)
  description?: string;
  tags?: string[];
}

export type ViewMode = 'grid' | 'list';

export type SortField = 'name' | 'modifiedAt' | 'size';
export type SortDirection = 'asc' | 'desc';

export type ActiveSection =
  | 'my-drive'
  | 'shared-with-me'
  | 'recent'
  | 'starred'
  | 'trash'
  | 'storage';

export interface StorageStats {
  usedBytes: number;
  totalBytes: number;
  driveBytes: number;
  gmailBytes: number;
  photosBytes: number;
}

export interface UploadTask {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: FileType;
  progress: number; // 0 - 100
  status: 'uploading' | 'completed' | 'error';
}

export interface DriveFilterOptions {
  type: string; // 'all' or FileType
  owner: string; // 'anyone' | 'me' | 'not-me'
  modified: string; // 'anytime' | 'today' | '7days' | '30days'
}
