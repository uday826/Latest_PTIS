/* eslint-disable i18next/no-literal-string */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Eye, FileImage, FileText } from 'lucide-react';
import { Button, Card } from '@/components/common';
import type { AssetDetailRecord, AssetDocumentListItem } from '@/types/municipal-asset/detail-tabs.types';
import { fetchAssetDocumentFile } from '@/app/[locale]/asset/municipal-Asset/asset-detail/actions';
import {
  LoadedDocumentFile,
  parseFileNameFromDisposition,
  isImage,
  DocumentPreviewDrawer,
} from './documentHelpers';

export function DocumentsTab({
  asset,
}: {
  asset: AssetDetailRecord;
  initialDocumentId?: string | null;
}) {
  const documents = useMemo(() => asset.documents ?? [], [asset.documents]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedDocument, setSelectedDocument] = useState<AssetDocumentListItem | null>(null);
  const [loadedFile, setLoadedFile] = useState<LoadedDocumentFile | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const pendingOpenIdRef = useRef<string | null>(null);
  const drawerStateRef = useRef<'closed' | 'opening' | 'open' | 'closing'>('closed');
  const currentDocumentId = searchParams.get('doc');

  const revokeLoadedFile = useCallback(() => {
    setLoadedFile((current) => {
      if (current?.objectUrl) URL.revokeObjectURL(current.objectUrl);
      return null;
    });
  }, []);

  const setDocumentQuery = useCallback(
    (documentId: string | number | null) => {
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
    },
    [pathname, router, searchParams]
  );

  useEffect(() => revokeLoadedFile, [revokeLoadedFile]);

  const loadDocumentFile = useCallback(
    async (documentItem: AssetDocumentListItem) => {
      revokeLoadedFile();
      setIsLoadingFile(true);
      setFileError(null);

      try {
        const result = await fetchAssetDocumentFile(documentItem.id);

        if (result.error || !result.base64) {
          throw new Error(result.error || 'Unable to load this document.');
        }

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
    },
    [revokeLoadedFile]
  );

  useEffect(() => {
    if (!currentDocumentId) {
      pendingOpenIdRef.current = null;
      if (drawerStateRef.current !== 'closed') {
        drawerStateRef.current = 'closed';
      }
      return;
    }

    if (drawerStateRef.current === 'closing' || (selectedDocument && String(selectedDocument.id) === String(currentDocumentId))) {
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
  }, [currentDocumentId, documents, loadDocumentFile, selectedDocument]);

  useEffect(() => {
    if (!selectedDocument) {
      drawerStateRef.current = 'closed';
      return;
    }
    drawerStateRef.current = isLoadingFile ? 'opening' : 'open';
    if (!isLoadingFile && pendingOpenIdRef.current === String(selectedDocument.id)) {
      pendingOpenIdRef.current = null;
    }
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
    const file = loadedFile;

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

  return (
    <div className="w-full min-h-full animate-in fade-in duration-300 font-sans">
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
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => openDocument(documentItem)}
                      className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left h-auto p-0 border-0 rounded-none"
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
                    </Button>
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

      <DocumentPreviewDrawer
        selectedDocument={selectedDocument}
        loadedFile={loadedFile}
        isLoadingFile={isLoadingFile}
        fileError={fileError}
        onClose={closeDrawer}
        onDownload={downloadDocument}
      />
    </div>
  );
}
