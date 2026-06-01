'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Download, Eye, File, FileImage, FileText, Loader2 } from 'lucide-react';
import { Button, Card, Drawer } from '@/components/common';
import type { AssetDetailRecord, AssetDocumentListItem } from './types';
import { fetchAssetDocumentFile } from '@/app/[locale]/asset/actions';

type LoadedDocumentFile = {
  objectUrl: string;
  contentType: string;
  fileName: string;
};

function formatDate(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatFileSize(value?: number | string | null) {
  const bytes = Number(value);
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function parseFileNameFromDisposition(disposition: string | null) {
  if (!disposition) return null;
  const utfMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) return decodeURIComponent(utfMatch[1].replace(/"/g, ''));
  const match = disposition.match(/filename="?([^";]+)"?/i);
  return match?.[1] ? match[1].trim() : null;
}

function isPdf(contentType: string, fileName: string) {
  return contentType.includes('application/pdf') || fileName.toLowerCase().endsWith('.pdf');
}

function isImage(contentType: string, fileName: string) {
  return contentType.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp)$/i.test(fileName);
}

export function DocumentsTab({
  asset,
  initialDocumentId = null,
}: {
  asset: AssetDetailRecord;
  initialDocumentId?: string | null;
}) {
  const documents = asset.documents ?? [];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedDocument, setSelectedDocument] = React.useState<AssetDocumentListItem | null>(null);
  const [loadedFile, setLoadedFile] = React.useState<LoadedDocumentFile | null>(null);
  const [isLoadingFile, setIsLoadingFile] = React.useState(false);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const pendingOpenIdRef = React.useRef<string | null>(null);
  const drawerStateRef = React.useRef<'closed' | 'opening' | 'open' | 'closing'>('closed');
  const currentDocumentId = searchParams.get('doc');

  const revokeLoadedFile = React.useCallback(() => {
    setLoadedFile((current) => {
      if (current?.objectUrl) URL.revokeObjectURL(current.objectUrl);
      return null;
    });
  }, []);

  const setDocumentQuery = React.useCallback((documentId: string | number | null) => {
    const currentDoc = searchParams.get('doc');
    if (documentId === null && !currentDoc) return;
    if (documentId !== null && currentDoc === String(documentId)) return;

    const params = new URLSearchParams(searchParams.toString());
    if (documentId === null) {
      params.delete('doc');
    } else {
      params.set('doc', String(documentId));
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  React.useEffect(() => revokeLoadedFile, [revokeLoadedFile]);

  const loadDocumentFile = React.useCallback(async (documentItem: AssetDocumentListItem) => {
    revokeLoadedFile();
    setIsLoadingFile(true);
    setFileError(null);

    try {
      const result = await fetchAssetDocumentFile(documentItem.id);

      if (result.error || !result.base64) {
        throw new Error(result.error || 'Unable to load this document.');
      }

      // Convert base64 → binary → Blob
      const binaryStr = atob(result.base64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: result.contentType });

      const contentType = result.contentType || documentItem.contentType || 'application/octet-stream';
      const fileName =
        parseFileNameFromDisposition(result.contentDisposition) ||
        documentItem.fileName ||
        documentItem.name;

      setLoadedFile({
        objectUrl: URL.createObjectURL(blob),
        contentType,
        fileName,
      });
    } catch (error) {
      setFileError(error instanceof Error ? error.message : 'Unable to load this document.');
    } finally {
      setIsLoadingFile(false);
    }
  }, [revokeLoadedFile]);

  React.useEffect(() => {
    if (!currentDocumentId) {
      pendingOpenIdRef.current = null;
      if (drawerStateRef.current !== 'closed') {
        drawerStateRef.current = 'closed';
      }
      return;
    }

    if (drawerStateRef.current === 'closing') {
      return;
    }

    if (selectedDocument && String(selectedDocument.id) === String(currentDocumentId)) {
      drawerStateRef.current = isLoadingFile ? 'opening' : 'open';
      return;
    }

    if (documents.length === 0 || drawerStateRef.current !== 'closed') return;

    const match = documents.find((doc) => String(doc.id) === String(currentDocumentId));
    if (match) {
      pendingOpenIdRef.current = String(match.id);
      drawerStateRef.current = 'opening';
      setSelectedDocument(match);
      void loadDocumentFile(match);
    }
  }, [currentDocumentId, documents, isLoadingFile, loadDocumentFile, selectedDocument]);

  React.useEffect(() => {
    if (!selectedDocument) {
      drawerStateRef.current = 'closed';
      return;
    }

    if (pendingOpenIdRef.current === String(selectedDocument.id)) {
      drawerStateRef.current = isLoadingFile ? 'opening' : 'open';
      if (!isLoadingFile) pendingOpenIdRef.current = null;
      return;
    }

    drawerStateRef.current = isLoadingFile ? 'opening' : 'open';
  }, [isLoadingFile, selectedDocument]);

  const openDocument = (documentItem: AssetDocumentListItem) => {
    if (drawerStateRef.current === 'opening' || drawerStateRef.current === 'closing') return;
    setSelectedDocument(documentItem);
    pendingOpenIdRef.current = String(documentItem.id);
    drawerStateRef.current = 'opening';
    setDocumentQuery(documentItem.id);
    void loadDocumentFile(documentItem);
  };

  const closeDrawer = () => {
    if (drawerStateRef.current === 'closed' || drawerStateRef.current === 'closing') return;
    drawerStateRef.current = 'closing';
    pendingOpenIdRef.current = null;
    setSelectedDocument(null);
    setFileError(null);
    setIsLoadingFile(false);
    revokeLoadedFile();
    setDocumentQuery(null);
  };

  const downloadDocument = async () => {
    if (!selectedDocument) return;
    let file = loadedFile;

    if (!file) {
      await loadDocumentFile(selectedDocument);
      return;
    }

    const link = document.createElement('a');
    link.href = file.objectUrl;
    link.download = file.fileName || selectedDocument.fileName || selectedDocument.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <div className="w-full min-h-full animate-in fade-in duration-300">
      <div className="w-full rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4 lg:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <h3 className="flex min-w-0 items-center gap-2 text-sm font-bold text-blue-900">
            <FileText className="h-4 w-4 text-blue-600" />
            Documents
          </h3>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
            {documents.length} {documents.length === 1 ? 'file' : 'files'}
          </span>
        </div>

        {asset.documentsError && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{asset.documentsError}</span>
          </div>
        )}

        {documents.length === 0 ? (
          <div className="mt-3 flex min-h-[180px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <div>
              <FileText className="mx-auto mb-2 h-10 w-10 text-slate-300" />
              <p className="text-sm font-bold text-slate-700">No documents available</p>
              <p className="mt-1 text-xs text-slate-500">Uploaded asset documents will appear here.</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex w-full justify-end">
            <div className="grid w-full gap-3 lg:w-[calc(100%-1px)] lg:grid-cols-2">
              {documents.map((documentItem) => {
                const Icon = isImage(documentItem.contentType || '', documentItem.fileName) ? FileImage : FileText;

                return (
                  <Card
                    key={String(documentItem.id)}
                    variant="bordered"
                    padding="none"
                    className="flex min-h-[68px] w-full max-w-full items-center justify-between gap-3 rounded-md border-slate-200 bg-white px-3 py-3 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/30 sm:min-h-[72px] sm:px-4 sm:py-3.5 lg:px-5"
                  >
                    <button
                      type="button"
                      onClick={() => openDocument(documentItem)}
                      className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-blue-600 sm:h-9 sm:w-9">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block max-w-full truncate text-sm font-bold leading-5 text-slate-800 sm:text-[15px]" title={documentItem.name}>
                          {documentItem.name}
                        </span>
                        <span className="mt-0.5 block max-w-full truncate text-xs font-medium leading-5 text-slate-500 sm:mt-0.5 sm:text-xs lg:text-sm" title={documentItem.fileName}>
                          {documentItem.fileName}
                        </span>
                      </span>
                    </button>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Eye}
                      aria-label={`View ${documentItem.name}`}
                      className="h-9 w-9 shrink-0 rounded-md border-slate-300 bg-white px-0 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:h-10 sm:w-10"
                      onClick={() => openDocument(documentItem)}
                    />
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Drawer
        open={!!selectedDocument}
        onClose={closeDrawer}
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
            <Button variant="secondary" onClick={closeDrawer}>
              Close
            </Button>
            <Button
              variant="success"
              icon={Download}
              onClick={downloadDocument}
              disabled={!selectedDocument || isLoadingFile || !!fileError || !loadedFile}
            >
              Download
            </Button>
          </>
        }
      >
        <div className="max-w-full overflow-hidden bg-slate-50">{renderPreview()}</div>
      </Drawer>
    </div>
  );
}
