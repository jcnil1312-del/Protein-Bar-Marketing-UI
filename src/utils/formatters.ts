import { FileType } from '../types/drive';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24 && date.getDate() === now.getDate()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear()) {
      return 'Yesterday';
    }

    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return isoString;
  }
}

export function formatFullDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function getFileTypeLabel(type: FileType): string {
  switch (type) {
    case 'folder': return 'Folder';
    case 'document': return 'Google Docs';
    case 'spreadsheet': return 'Google Sheets';
    case 'presentation': return 'Google Slides';
    case 'pdf': return 'PDF Document';
    case 'image': return 'Image';
    case 'video': return 'Video';
    case 'audio': return 'Audio';
    case 'code': return 'Code file';
    case 'archive': return 'Zip Archive';
    default: return 'File';
  }
}

export function downloadDriveFile(name: string, content?: string, type?: FileType) {
  let fileContent = content || `Content of ${name}\nGenerated on ${new Date().toLocaleString()}`;
  let mime = 'text/plain';

  if (type === 'spreadsheet') {
    mime = 'text/csv';
  } else if (type === 'code') {
    mime = 'application/json';
  } else if (type === 'image') {
    // For hotlinked images, open in new tab or trigger link download
    const a = document.createElement('a');
    a.href = content || '#';
    a.target = '_blank';
    a.download = name;
    a.click();
    return;
  }

  const blob = new Blob([fileContent], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
