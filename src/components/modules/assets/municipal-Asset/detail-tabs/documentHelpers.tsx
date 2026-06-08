/* eslint-disable i18next/no-literal-string */
/* eslint-disable @next/next/no-img-element */
'use client';

import { Button, Drawer } from '@/components/common';
import type { AssetDocumentListItem } from '@/types/municipal-asset/detail-tabs.types';
import { AlertCircle, Download, File, Loader2 } from 'lucide-react';

export type LoadedDocumentFile = {
  objectUrl: string;
  contentType: string;
  fileName: string;
};

export function formatDate(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatFileSize(value?: number | string | null) {
  const bytes = Number(value);
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function parseFileNameFromDisposition(disposition: string | null) {
  if (!disposition) return null;
  const utfMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) return decodeURIComponent(utfMatch[1].replace(/"/g, ''));
  const match = disposition.match(/filename="?([^";]+)"?/i);
  return match?.[1] ? match[1].trim() : null;
}

export function isPdf(contentType: string, fileName: string) {
  return contentType.includes('application/pdf') || fileName.toLowerCase().endsWith('.pdf');
}

export function isImage(contentType: string, fileName: string) {
  return contentType.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp)$/i.test(fileName);
}

interface DocumentPreviewDrawerProps {
  selectedDocument: AssetDocumentListItem | null;
  loadedFile: LoadedDocumentFile | null;
  isLoadingFile: boolean;
  fileError: string | null;
  onClose: () => void;
  onDownload: () => void;
}

export function DocumentPreviewDrawer({
  selectedDocument,
  loadedFile,
  isLoadingFile,
  fileError,
  onClose,
  onDownload,
}: DocumentPreviewDrawerProps) {
  const renderPreview = () => {
    if (isLoadingFile) {
      return (
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-slate-500 sm:min-h-[420px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-semibold">Loading document preview...</p>
        </div>
      );
    }

    if (fileError) {
      return (
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-2 p-4 text-center sm:min-h-[420px] sm:p-6">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <p className="text-sm font-bold text-slate-800">{fileError}</p>
          <p className="max-w-sm text-xs text-slate-500">You can close the drawer and try opening the document again.</p>
        </div>
      );
    }

    if (!loadedFile || !selectedDocument) return null;

    if (isPdf(loadedFile.contentType, loadedFile.fileName)) {
      return (
        <iframe
          title={selectedDocument.name}
          src={loadedFile.objectUrl}
          className="h-[calc(100vh-170px)] min-h-[360px] w-full bg-white sm:h-[calc(100vh-155px)] sm:min-h-[520px]"
        />
      );
    }

    if (isImage(loadedFile.contentType, loadedFile.fileName)) {
      return (
        <div className="flex min-h-[360px] items-center justify-center bg-slate-100 p-3 sm:min-h-[520px] sm:p-4">
          <img
            src={loadedFile.objectUrl}
            alt={selectedDocument.name}
            className="max-h-[calc(100vh-210px)] max-w-full rounded-lg object-contain shadow-sm sm:max-h-[calc(100vh-190px)]"
          />
        </div>
      );
    }

    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 p-4 text-center sm:min-h-[420px] sm:p-6">
        <File className="h-12 w-12 text-slate-400" />
        <p className="text-sm font-bold text-slate-800">Preview is not available for this file type.</p>
        <p className="max-w-sm text-xs text-slate-500">Use the download button to open this document on your device.</p>
      </div>
    );
  };

  return (
    <Drawer
      open={!!selectedDocument}
      onClose={onClose}
      width="lg"
      title={
        <div className="min-w-0">
          <p id="drawer-title" className="truncate text-sm font-bold text-slate-900">
            {selectedDocument?.name || 'Document'}
          </p>
          <p className="truncate text-xs text-slate-500">{loadedFile?.fileName || selectedDocument?.fileName}</p>
        </div>
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="success"
            icon={Download}
            onClick={onDownload}
            disabled={!selectedDocument || isLoadingFile || !!fileError || !loadedFile}
          >
            Download
          </Button>
        </>
      }
    >
      <div className="max-w-full overflow-hidden bg-slate-50">{renderPreview()}</div>
    </Drawer>
  );
}
