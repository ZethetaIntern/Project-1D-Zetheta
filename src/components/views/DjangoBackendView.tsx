import React, { useState } from 'react';
import { DJANGO_BACKEND_FILES } from '../../data/djangoBackendFiles';
import {
  Code2,
  Copy,
  Check,
  Download,
  FileCode,
  FolderTree,
  Terminal,
  Server,
  Database,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const DjangoBackendView: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(1); // settings.py by default
  const [copied, setCopied] = useState(false);

  const currentFile = DJANGO_BACKEND_FILES[selectedFileIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(currentFile.content);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", currentFile.path.split('/').pop() || 'file.py');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadAllDjango = () => {
    const bundle: Record<string, string> = {};
    DJANGO_BACKEND_FILES.forEach(f => {
      bundle[f.path] = f.content;
    });
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "django-open-banking-gateway-bundle.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-medium">
              <Code2 className="w-3.5 h-3.5" />
              Core Architecture: Django 5.x REST Framework Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Django Open Banking FAPI Gateway Backend
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Production-ready Python/Django codebase architected specifically for financial-grade Open Banking APIs.
              Featuring custom middleware for mTLS certificate validation, DPoP token binding, token-bucket rate limiting,
              OpenAPI schema generation, and full isolation of all 7 TPP services.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadAllDjango}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition"
            >
              <Download className="w-4 h-4" />
              Download Full Django Project Bundle
            </button>
          </div>
        </div>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
            <span className="text-[10px] text-slate-400 font-mono block">FRAMEWORK</span>
            <span className="text-xs font-bold text-slate-200">Django 5.0 + DRF</span>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
            <span className="text-[10px] text-slate-400 font-mono block">SCHEMA SPEC</span>
            <span className="text-xs font-bold text-emerald-300">OpenAPI 3.0 via drf-spectacular</span>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
            <span className="text-[10px] text-slate-400 font-mono block">SECURITY MIDDLEWARE</span>
            <span className="text-xs font-bold text-cyan-300">mTLS + RFC 8705 cnf Binding</span>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
            <span className="text-[10px] text-slate-400 font-mono block">RUNNER</span>
            <span className="text-xs font-bold text-amber-300">Gunicorn + Celery + Redis</span>
          </div>
        </div>
      </div>

      {/* Code Inspector & File Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* File List / Navigation */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider font-mono flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-indigo-400" />
              Django Project Tree ({DJANGO_BACKEND_FILES.length})
            </span>
          </div>

          <div className="space-y-1.5">
            {DJANGO_BACKEND_FILES.map((file, idx) => {
              const isSelected = selectedFileIndex === idx;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-950/70 border border-indigo-500/40 text-indigo-200 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="truncate">{file.path}</span>
                  </div>
                  <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    {file.language}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick CLI Run Instructions */}
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
            <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Local Django Execution
            </div>
            <pre className="p-2.5 rounded bg-slate-950 text-[10px] font-mono text-slate-300 overflow-x-auto border border-slate-800/80">
{`# 1. Install dependencies
pip install -r requirements.txt

# 2. Run migrations
python manage.py migrate

# 3. Start Gateway Server
python manage.py runserver 0.0.0.0:8000`}
            </pre>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-mono text-white">{currentFile.path}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {currentFile.language}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentFile.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownloadFile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-medium transition"
              >
                <Download className="w-3.5 h-3.5" />
                Save File
              </button>
            </div>
          </div>

          {/* Syntax Highlighted Container */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs text-slate-200">
            <div className="max-h-[560px] overflow-y-auto p-4 leading-relaxed whitespace-pre font-mono text-emerald-300/90 scrollbar-thin">
              {currentFile.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
