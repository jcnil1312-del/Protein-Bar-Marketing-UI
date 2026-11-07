import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, CheckCircle, Loader2 } from 'lucide-react';
import { UploadTask } from '../types/drive';
import { FileIcon } from './FileIcon';

interface UploadManagerProps {
  tasks: UploadTask[];
  onClearTasks: () => void;
}

export const UploadManager: React.FC<UploadManagerProps> = ({
  tasks,
  onClearTasks,
}) => {
  const [minimized, setMinimized] = useState(false);

  if (tasks.length === 0) return null;

  const inProgressCount = tasks.filter((t) => t.status === 'uploading').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="fixed bottom-4 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden text-gray-800 animate-in slide-in-from-bottom-5 duration-200 select-none">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          {inProgressCount > 0 ? (
            <Loader2 size={15} className="animate-spin text-blue-400" />
          ) : (
            <CheckCircle size={15} className="text-emerald-400" />
          )}
          <span className="text-xs font-semibold">
            {inProgressCount > 0
              ? `Uploading ${inProgressCount} item${inProgressCount > 1 ? 's' : ''}`
              : `${completedCount} upload${completedCount > 1 ? 's' : ''} complete`}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            {minimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            onClick={onClearTasks}
            className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Upload Tasks List */}
      {!minimized && (
        <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 p-2 text-xs">
          {tasks.map((task) => (
            <div key={task.id} className="py-2.5 px-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <FileIcon type={task.fileType} size={16} />
                <div className="min-w-0">
                  <div className="font-medium text-gray-800 truncate" title={task.fileName}>
                    {task.fileName}
                  </div>
                  {task.status === 'uploading' && (
                    <div className="w-32 bg-gray-100 h-1 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-150"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                {task.status === 'completed' ? (
                  <CheckCircle size={15} className="text-emerald-600" />
                ) : (
                  <span className="text-[10px] text-gray-400 font-mono">
                    {task.progress}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
