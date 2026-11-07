import React, { useState } from 'react';
import {
  X,
  Star,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Save,
  FileText,
  Table as TableIcon,
  Maximize2,
} from 'lucide-react';
import { DriveItem } from '../types/drive';
import { FileIcon } from './FileIcon';
import { formatBytes, formatDate, downloadDriveFile } from '../utils/formatters';

interface FilePreviewModalProps {
  file: DriveItem | null;
  onClose: () => void;
  onUpdateFile: (updated: DriveItem) => void;
  onShare: (file: DriveItem) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  onClose,
  onUpdateFile,
  onShare,
}) => {
  if (!file) return null;

  // Document state
  const [docContent, setDocContent] = useState(file.content || '');
  const [docSaved, setDocSaved] = useState(true);

  // Spreadsheet state
  const [sheetGrid, setSheetGrid] = useState<string[][]>(
    file.sheetData || [
      ['Item', 'Q1', 'Q2', 'Total'],
      ['Revenue', '120k', '145k', '265k'],
      ['Expenses', '80k', '85k', '165k'],
      ['Net Profit', '40k', '60k', '100k'],
    ]
  );
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number }>({ r: 0, c: 0 });

  // Slide state
  const slides = file.slideTitles || [
    '1. Executive Summary & Vision',
    '2. Key Market Drivers & Expansion',
    '3. Product Architecture & Cloud Mesh',
    '4. Financial Projections & Milestones',
  ];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Image zoom state
  const [imageZoom, setImageZoom] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);

  // Copy code state
  const [copiedCode, setCopiedCode] = useState(false);

  const handleDocChange = (val: string) => {
    setDocContent(val);
    setDocSaved(false);
  };

  const handleSaveDoc = () => {
    onUpdateFile({
      ...file,
      content: docContent,
      modifiedAt: new Date().toISOString(),
    });
    setDocSaved(true);
  };

  const handleCellChange = (r: number, c: number, val: string) => {
    const updated = sheetGrid.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val : cell))
    );
    setSheetGrid(updated);
    onUpdateFile({
      ...file,
      sheetData: updated,
      modifiedAt: new Date().toISOString(),
    });
  };

  const addSheetRow = () => {
    const cols = sheetGrid[0]?.length || 4;
    const newRow = new Array(cols).fill('');
    const updated = [...sheetGrid, newRow];
    setSheetGrid(updated);
    onUpdateFile({
      ...file,
      sheetData: updated,
      modifiedAt: new Date().toISOString(),
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(file.content || '');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col animate-in fade-in duration-150">
      {/* Top Navbar in Preview */}
      <div className="h-14 px-4 bg-gray-900 text-white flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-3 min-w-0">
          <FileIcon type={file.type} size={20} />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate text-gray-100 max-w-sm sm:max-w-md">
              {file.name}
            </span>
            <span className="text-[10px] text-gray-400">
              {formatBytes(file.size)} • Modified {formatDate(file.modifiedAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Star toggle */}
          <button
            onClick={() =>
              onUpdateFile({
                ...file,
                starred: !file.starred,
              })
            }
            className={`p-2 rounded-lg hover:bg-gray-800 transition-colors ${
              file.starred ? 'text-amber-400' : 'text-gray-400 hover:text-white'
            }`}
            title={file.starred ? 'Starred' : 'Add star'}
          >
            <Star size={17} fill={file.starred ? 'currentColor' : 'none'} />
          </button>

          {/* Share */}
          <button
            onClick={() => onShare(file)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title="Share"
          >
            <Share2 size={17} />
          </button>

          {/* Download */}
          <button
            onClick={() => downloadDriveFile(file.name, file.content || file.thumbnail, file.type)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title="Download file"
          >
            <Download size={17} />
          </button>

          <div className="h-4 w-px bg-gray-700 mx-1" />

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title="Close (Esc)"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Preview / Editor Workspace */}
      <div className="flex-1 bg-gray-950/90 overflow-hidden flex flex-col items-center justify-center p-4">
        {/* Document Editor */}
        {file.type === 'document' && (
          <div className="w-full max-w-4xl h-full bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden text-gray-900 border border-gray-200">
            {/* Toolbar */}
            <div className="h-11 px-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-2 font-medium">
                <FileText size={16} className="text-blue-600" />
                <span className="font-semibold text-gray-700">Document Editor</span>
                <span className="text-gray-300">|</span>
                <span className="text-[11px] text-gray-400">
                  {docSaved ? 'All changes saved' : 'Unsaved changes'}
                </span>
              </div>
              <button
                onClick={handleSaveDoc}
                disabled={docSaved}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  docSaved
                    ? 'bg-gray-100 text-gray-400 cursor-default'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                }`}
              >
                <Save size={14} />
                <span>Save</span>
              </button>
            </div>

            {/* Editable Content Area */}
            <div className="flex-1 p-8 overflow-y-auto font-sans leading-relaxed">
              <textarea
                value={docContent}
                onChange={(e) => handleDocChange(e.target.value)}
                className="w-full h-full resize-none outline-none text-gray-800 text-sm leading-relaxed font-sans placeholder-gray-400"
                placeholder="Start typing your document..."
              />
            </div>
          </div>
        )}

        {/* Spreadsheet Editor */}
        {file.type === 'spreadsheet' && (
          <div className="w-full max-w-5xl h-full bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden text-gray-900 border border-gray-200">
            {/* Spreadsheet Toolbar */}
            <div className="h-11 px-4 bg-emerald-50/70 border-b border-emerald-200/80 flex items-center justify-between text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <TableIcon size={16} className="text-emerald-600" />
                <span className="font-semibold text-emerald-900">Google Sheets Grid</span>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-gray-500 font-mono">
                  Cell [{String.fromCharCode(65 + selectedCell.c)}
                  {selectedCell.r + 1}]:{' '}
                  <span className="font-semibold text-gray-800">
                    {sheetGrid[selectedCell.r]?.[selectedCell.c] || ''}
                  </span>
                </span>
              </div>
              <button
                onClick={addSheetRow}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs font-medium transition-colors shadow-xs"
              >
                <Plus size={13} /> Add Row
              </button>
            </div>

            {/* Table Grid */}
            <div className="flex-1 overflow-auto bg-gray-50 p-4">
              <div className="inline-block min-w-full bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
                <table className="min-w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 font-bold border-b border-gray-300">
                      <th className="w-10 py-1.5 px-2 text-center border-r border-gray-300 bg-gray-200/60 font-mono text-[10px]">
                        #
                      </th>
                      {sheetGrid[0]?.map((_, colIdx) => (
                        <th
                          key={colIdx}
                          className="py-1.5 px-3 border-r border-gray-200 font-mono text-center uppercase"
                        >
                          {String.fromCharCode(65 + colIdx)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sheetGrid.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-gray-200 hover:bg-blue-50/20">
                        <td className="py-1.5 px-2 text-center border-r border-gray-200 bg-gray-100 font-mono text-gray-500 text-[10px]">
                          {rIdx + 1}
                        </td>
                        {row.map((cellValue, cIdx) => {
                          const isFocused =
                            selectedCell.r === rIdx && selectedCell.c === cIdx;
                          return (
                            <td
                              key={cIdx}
                              onClick={() => setSelectedCell({ r: rIdx, c: cIdx })}
                              className={`p-0 border-r border-gray-200 relative ${
                                isFocused ? 'ring-2 ring-emerald-500 z-10' : ''
                              }`}
                            >
                              <input
                                type="text"
                                value={cellValue}
                                onChange={(e) =>
                                  handleCellChange(rIdx, cIdx, e.target.value)
                                }
                                className={`w-full py-1.5 px-3 text-xs outline-none bg-transparent ${
                                  rIdx === 0 ? 'font-semibold text-gray-800' : 'text-gray-700'
                                }`}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Presentation Slide Viewer */}
        {file.type === 'presentation' && (
          <div className="w-full max-w-4xl h-full flex flex-col items-center justify-between">
            {/* Active Slide Canvas */}
            <div className="w-full flex-1 max-h-[500px] bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl shadow-2xl border border-gray-800 p-10 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-amber-400 font-semibold tracking-wider uppercase">
                <span>Google Slides Presentation</span>
                <span>
                  Slide {currentSlideIndex + 1} of {slides.length}
                </span>
              </div>

              <div className="space-y-4 my-auto">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {slides[currentSlideIndex]}
                </h1>
                <p className="text-sm text-gray-300 max-w-xl">
                  Strategic deliverable prepared for leadership review. Key topics include automated scale, high-reliability storage clusters, and frictionless user experiences.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-800 pt-4">
                <span>Confidential • Internal Workspace Review</span>
                <span>Drive Hub Presentation Mode</span>
              </div>
            </div>

            {/* Slide Navigation Controls & Thumbnails */}
            <div className="w-full flex items-center justify-between mt-4 px-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentSlideIndex === 0}
                  className="p-2 rounded-xl bg-gray-800 text-white disabled:opacity-40 hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    setCurrentSlideIndex((prev) =>
                      Math.min(slides.length - 1, prev + 1)
                    )
                  }
                  disabled={currentSlideIndex === slides.length - 1}
                  className="p-2 rounded-xl bg-gray-800 text-white disabled:opacity-40 hover:bg-gray-700 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Thumbnails strip */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-md py-1">
                {slides.map((title, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      currentSlideIndex === idx
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Image Viewer */}
        {file.type === 'image' && (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <div className="flex-1 flex items-center justify-center overflow-hidden max-w-4xl max-h-[75vh]">
              <img
                src={file.thumbnail || ''}
                alt={file.name}
                style={{
                  transform: `scale(${imageZoom}) rotate(${imageRotation}deg)`,
                  transition: 'transform 0.2s ease-out',
                }}
                className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Floating zoom toolbar */}
            <div className="mt-4 flex items-center gap-3 bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-gray-800 text-white shadow-xl text-xs">
              <button
                onClick={() => setImageZoom((z) => Math.max(0.5, z - 0.25))}
                className="p-1 hover:text-blue-400 transition-colors"
                title="Zoom out"
              >
                <ZoomOut size={16} />
              </button>
              <span className="font-mono">{Math.round(imageZoom * 100)}%</span>
              <button
                onClick={() => setImageZoom((z) => Math.min(3, z + 0.25))}
                className="p-1 hover:text-blue-400 transition-colors"
                title="Zoom in"
              >
                <ZoomIn size={16} />
              </button>
              <div className="h-4 w-px bg-gray-700" />
              <button
                onClick={() => setImageRotation((r) => (r + 90) % 360)}
                className="p-1 hover:text-blue-400 transition-colors"
                title="Rotate 90°"
              >
                <RotateCw size={16} />
              </button>
              <button
                onClick={() => {
                  setImageZoom(1);
                  setImageRotation(0);
                }}
                className="text-[11px] text-gray-400 hover:text-white pl-1"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Code / JSON / PDF Viewer */}
        {(file.type === 'code' || file.type === 'pdf') && (
          <div className="w-full max-w-4xl h-full bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-gray-100 border border-gray-800 font-mono text-xs">
            <div className="h-10 px-4 bg-slate-800/80 border-b border-gray-700 flex items-center justify-between">
              <span className="text-gray-300 font-semibold">{file.name}</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-gray-200 text-xs transition-colors"
              >
                {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="flex-1 p-6 overflow-auto text-emerald-400 leading-relaxed font-mono">
              <code>{file.content || `/* File: ${file.name} */\n// Size: ${formatBytes(file.size)}\n// Last modified: ${file.modifiedAt}\n// Simulated content preview for ${file.type}`}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
