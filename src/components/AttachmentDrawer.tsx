import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  File, 
  Trash2, 
  Download, 
  Eye,
  Plus,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface AttachmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: string;
  entityId: string;
  entityName?: string;
}

interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  date: string;
  url: string;
}

export function AttachmentDrawer({ isOpen, onClose, entityType, entityId, entityName }: AttachmentDrawerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: 'KYC_Aadhaar_Front.jpg', size: '1.2 MB', type: 'image/jpeg', date: '2024-03-10', url: '#' },
    { id: '2', name: 'KYC_Aadhaar_Back.jpg', size: '1.1 MB', type: 'image/jpeg', date: '2024-03-10', url: '#' },
    { id: '3', name: 'Installation_Form.pdf', size: '2.4 MB', type: 'application/pdf', date: '2024-03-11', url: '#' },
  ]);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newFile: FileItem = {
        id: Math.random().toString(),
        name: 'New_Upload_' + Date.now() + '.png',
        size: '800 KB',
        type: 'image/png',
        date: new Date().toISOString().split('T')[0],
        url: '#'
      };
      setFiles([newFile, ...files]);
      setIsUploading(false);
    }, 1500);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md transform transition-all ease-in-out duration-300">
          <div className="h-full flex flex-col bg-white shadow-2xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900 italic serif">Attachments</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {entityType}: {entityName || entityId}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Upload Area */}
            <div className="p-6">
              <div 
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer",
                  isUploading ? "bg-slate-50 border-slate-200" : "bg-slate-50/50 border-slate-200 hover:border-[#007AFF]/50 hover:bg-white"
                )}
                onClick={() => !isUploading && handleUpload()}
              >
                {isUploading ? (
                  <>
                    <Loader2 size={32} className="text-[#007AFF] animate-spin mb-4" />
                    <p className="text-sm font-bold text-slate-900">Uploading File...</p>
                    <p className="text-xs text-slate-500 mt-1">Please wait while we process your document</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#007AFF] mb-4">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-900">Click to upload or drag & drop</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, PNG, JPG or WEBP (max. 10MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* File List */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Uploaded Files ({files.length})</h4>
              </div>

              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file.id} className="group p-3 bg-white border border-slate-100 rounded-xl hover:border-[#007AFF]/30 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        file.type.includes('image') ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                      )}>
                        {file.type.includes('image') ? <ImageIcon size={20} /> : <FileText size={20} />}
                      </div>
                      <div className="max-w-[180px]">
                        <h5 className="text-sm font-bold text-slate-900 truncate" title={file.name}>{file.name}</h5>
                        <p className="text-[10px] text-slate-400 font-medium">{file.size} • {file.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-[#007AFF] hover:bg-slate-50 rounded-md transition-all" title="View">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-all" title="Download">
                        <Download size={16} />
                      </button>
                      <button 
                        onClick={() => removeFile(file.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all" 
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {files.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-3">
                      <File size={24} />
                    </div>
                    <p className="text-sm text-slate-400">No attachments found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <button 
                onClick={onClose}
                className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
