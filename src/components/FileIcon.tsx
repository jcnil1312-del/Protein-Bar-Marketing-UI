import React from 'react';
import {
  Folder,
  FileText,
  Table,
  Presentation,
  FileCheck,
  Image as ImageIcon,
  Film,
  Music,
  Code2,
  Archive,
  File,
} from 'lucide-react';
import { FileType } from '../types/drive';

interface FileIconProps {
  type: FileType;
  color?: string;
  className?: string;
  size?: number;
}

export const FileIcon: React.FC<FileIconProps> = ({
  type,
  color,
  className = '',
  size = 20,
}) => {
  switch (type) {
    case 'folder':
      return (
        <Folder
          size={size}
          className={`${className}`}
          style={{ color: color || '#5f6368', fill: color ? `${color}25` : '#5f636820' }}
        />
      );
    case 'document':
      return (
        <div className="relative inline-flex items-center justify-center">
          <FileText size={size} className={`text-blue-600 ${className}`} />
        </div>
      );
    case 'spreadsheet':
      return (
        <div className="relative inline-flex items-center justify-center">
          <Table size={size} className={`text-emerald-600 ${className}`} />
        </div>
      );
    case 'presentation':
      return (
        <div className="relative inline-flex items-center justify-center">
          <Presentation size={size} className={`text-amber-500 ${className}`} />
        </div>
      );
    case 'pdf':
      return (
        <div className="relative inline-flex items-center justify-center">
          <FileCheck size={size} className={`text-red-500 ${className}`} />
        </div>
      );
    case 'image':
      return (
        <div className="relative inline-flex items-center justify-center">
          <ImageIcon size={size} className={`text-rose-500 ${className}`} />
        </div>
      );
    case 'video':
      return (
        <div className="relative inline-flex items-center justify-center">
          <Film size={size} className={`text-red-600 ${className}`} />
        </div>
      );
    case 'audio':
      return (
        <div className="relative inline-flex items-center justify-center">
          <Music size={size} className={`text-purple-600 ${className}`} />
        </div>
      );
    case 'code':
      return (
        <div className="relative inline-flex items-center justify-center">
          <Code2 size={size} className={`text-teal-600 ${className}`} />
        </div>
      );
    case 'archive':
      return (
        <div className="relative inline-flex items-center justify-center">
          <Archive size={size} className={`text-stone-600 ${className}`} />
        </div>
      );
    default:
      return <File size={size} className={`text-gray-500 ${className}`} />;
  }
};
