"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ShieldCheck, FileUp, Upload, CheckCircle2, XCircle,
  Loader2, Info, FileBox, AlertCircle, Trash2, Eye
} from "lucide-react";
import { useAssetForm } from "../AssetFormContext";
import {
  AssetDocumentDefinitionDto,
  AssetDocumentDto
} from "@/lib/api/asset/asset-document.service";
import {
  fetchDocumentDefinitionsAction,
  fetchUploadedDocumentsAction,
  deleteUploadedDocAction
} from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/actions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

// Document status type
type DocumentStatus = "pending" | "uploading" | "uploaded" | "error";

interface DocumentUploadState {
  definitionId: number;
  status: DocumentStatus;
  file?: File;
  uploadedDoc?: AssetDocumentDto;
  error?: string;
}

export default function LegalCompliancePage() {
  const t = useTranslations("addAssetForm");
  const { formData, registerSubmitHook, stagedFiles, setStagedFiles, setIsDataLoading } = useAssetForm();
  const [definitions, setDefinitions] = useState<AssetDocumentDefinitionDto[]>([]);
  const [uploadStates, setUploadStates] = useState<Record<number, DocumentUploadState>>({});
  const [deletedDocIds, setDeletedDocIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [viewingDocId, setViewingDocId] = useState<number | null>(null);

  const handleView = useCallback(async (definitionId: number, state?: DocumentUploadState) => {
    if (!state) return;

    // Case 1: File is locally staged (offline/memory state before save)
    if (state.file) {
      try {
        const fileUrl = URL.createObjectURL(state.file);
        window.open(fileUrl, "_blank");
      } catch (err) {
        toast.error(t("compliance.toasts.previewFailed") || "Failed to open local file preview.");
      }
      return;
    }

    // Case 2: File is already on server
    if (state.uploadedDoc?.id) {
      setViewingDocId(definitionId);
      try {
        const { fetchAssetDocumentFile } = await import("@/app/[locale]/assets/municipal-Asset/asset-detail/actions");
        const result = await fetchAssetDocumentFile(state.uploadedDoc.id);

        if (result.error || !result.base64) {
          throw new Error(result.error || "Unable to load document file.");
        }

        const binaryStr = atob(result.base64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: result.contentType });
        const fileUrl = URL.createObjectURL(blob);
        window.open(fileUrl, "_blank");
      } catch (err: any) {
        toast.error(err.message || t("compliance.toasts.downloadFailed") || "Failed to download document for viewing.");
      } finally {
        setViewingDocId(null);
      }
    }
  }, [t]);

  // Fetch document definitions based on category and type
  useEffect(() => {
    async function fetchDefinitions() {
      setLoading(true);
      if (setIsDataLoading) setIsDataLoading(true);
      setError(null);
      try {
        const response = await fetchDocumentDefinitionsAction(
          formData.categoryId,
          formData.typeId
        );

        if (response.success && response.data) {
          const defs = Array.isArray(response.data) ? response.data : [];
          setDefinitions(defs);
          // Initialize upload states with default pending state or staged files
          const states: Record<number, DocumentUploadState> = {};
          defs.forEach(def => {
            if (stagedFiles && stagedFiles[def.id]) {
              states[def.id] = {
                definitionId: def.id,
                status: "uploaded",
                file: stagedFiles[def.id].file
              };
            } else {
              states[def.id] = { definitionId: def.id, status: "pending" };
            }
          });
          setUploadStates(states);
        } else {
          setError(response.error || response.message || "Failed to load document definitions");
        }
      } catch (err) {
        setError("Failed to load document definitions. Please try again.");
      } finally {
        setLoading(false);
        if (setIsDataLoading) setIsDataLoading(false);
      }
    }

    if (formData.categoryId) {
      fetchDefinitions();
    } else {
      setLoading(false);
      if (setIsDataLoading) setIsDataLoading(false);
    }
  }, [formData.categoryId, formData.typeId]);

  // Fetch already uploaded documents if asset exists
  useEffect(() => {
    async function fetchUploadedDocs() {
      const assetId = formData.assetId || formData.id;
      if (!assetId || assetId === 0) return;

      try {
        const response = await fetchUploadedDocumentsAction(assetId, true, true);
        if (response.success && response.data) {
          const docs = Array.isArray(response.data) ? response.data : [];

          // Update upload states for already uploaded docs
          setUploadStates(prev => {
            const updated = { ...prev };
            docs.forEach(doc => {
              if (updated[doc.documentDefinitionId]) {
                updated[doc.documentDefinitionId] = {
                  ...updated[doc.documentDefinitionId],
                  status: "uploaded",
                  uploadedDoc: doc
                };
              }
            });
            return updated;
          });
        }
      } catch (err) {
      }
    }

    fetchUploadedDocs();
  }, [formData.assetId, formData.id, definitions]);

  // Handle file selection
  const handleFileSelect = useCallback(async (definitionId: number, file: File) => {
    const definition = definitions.find(d => d.id === definitionId);
    if (!definition) return;

    // Validate file size
    const maxSizeBytes = definition.maxFileSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setUploadStates(prev => ({
        ...prev,
        [definitionId]: {
          ...prev[definitionId],
          status: "error",
          error: t("compliance.card.sizeExceeds", { size: definition.maxFileSizeMB }) || `File size exceeds ${definition.maxFileSizeMB}MB limit`
        }
      }));
      return;
    }

    // Validate file extension
    const allowedExts = (definition.allowedExtensions || "").toLowerCase().split(",").map(e => e.trim());
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
    if (allowedExts.length > 0 && allowedExts[0] !== "" && !allowedExts.includes(`.${fileExt}`) && !allowedExts.includes(fileExt)) {
      setUploadStates(prev => ({
        ...prev,
        [definitionId]: {
          ...prev[definitionId],
          status: "error",
          error: t("compliance.card.allowedExtensions", { extensions: definition.allowedExtensions }) || `File type not allowed. Allowed: ${definition.allowedExtensions}`
        }
      }));
      return;
    }

    // Offline First: Stage file locally in memory
    setUploadStates(prev => {
      const existing = prev[definitionId];
      // If there was an uploaded document previously in this slot, queue it for replacement deletion
      if (existing?.uploadedDoc?.id) {
        setDeletedDocIds(dels => [...new Set([...dels, existing.uploadedDoc!.id])]);
      }
      return {
        ...prev,
        [definitionId]: {
          definitionId,
          status: "uploaded", // Mark as staged/uploaded locally
          file,
          uploadedDoc: undefined, // Clear server reference since we are replacing it
          error: undefined
        }
      };
    });

    // Save to context stagedFiles
    if (setStagedFiles) {
      setStagedFiles(prev => ({
        ...prev,
        [definitionId]: { file, definition }
      }));
    }
  }, [definitions, setStagedFiles, t]);

  // Handle document deletion
  const handleDelete = useCallback((definitionId: number) => {
    setUploadStates(prev => {
      const existing = prev[definitionId];

      // If it was already uploaded on the server, queue its ID for deletion
      if (existing?.uploadedDoc?.id) {
        setDeletedDocIds(dels => [...new Set([...dels, existing.uploadedDoc!.id])]);
      }

      return {
        ...prev,
        [definitionId]: {
          definitionId,
          status: "pending",
          file: undefined,
          uploadedDoc: undefined,
          error: undefined
        }
      };
    });

    // Remove from context stagedFiles
    if (setStagedFiles) {
      setStagedFiles(prev => {
        const next = { ...prev };
        delete next[definitionId];
        return next;
      });
    }
  }, [setStagedFiles]);

  // Submit Hook: Trigger uploads and deletions sequentially on Save & Next
  const handleStepSubmit = useCallback(async (): Promise<boolean> => {
    const assetId = formData.assetId || formData.id || 0;
    if (!assetId || assetId === 0) {
      toast.error(t("compliance.toasts.assetNotSaved") || "Asset must be saved first before uploading documents.");
      return false;
    }

    try {
      // 1. Process deletes
      if (deletedDocIds.length > 0) {
        for (const docId of deletedDocIds) {
          const res = await deleteUploadedDocAction(docId);
          if (!res.success) {
          }
        }
        setDeletedDocIds([]);
      }

      // 2. Validate required documents are present (either on server or staged in context)
      const missingRequired = definitions.filter(def => {
        if (!def.isRequired) return false;

        // Either it's already uploaded on server or staged in uploadStates/context
        const localState = uploadStates[def.id];
        const isPresent = localState && (localState.status === "uploaded" || localState.status === "uploading" || localState.uploadedDoc !== undefined);
        return !isPresent;
      });

      if (missingRequired.length > 0) {
        toast.error(t("compliance.toasts.missingRequired", { missing: missingRequired.map(d => d.documentName).join(", ") }) || `Please upload all required compliance documents: ${missingRequired.map(d => d.documentName).join(", ")}`);
        return false;
      }

      return true; // Validated, proceed to next step
    } catch (err) {
      toast.error(t("compliance.toasts.validationFailed") || "An unexpected error occurred during document validation.");
      return false;
    }
  }, [formData, uploadStates, deletedDocIds, definitions, t]);

  // Register submit hook in form context
  useEffect(() => {
    if (registerSubmitHook) {
      registerSubmitHook(handleStepSubmit);
    }
    return () => {
      if (registerSubmitHook) {
        registerSubmitHook(null);
      }
    };
  }, [registerSubmitHook, handleStepSubmit]);

  // Group definitions by required/optional
  const groupedDefinitions = React.useMemo(() => {
    const groups: Record<string, AssetDocumentDefinitionDto[]> = {
      required: [],
      optional: []
    };

    definitions.forEach(def => {
      if (def.isRequired) {
        groups.required.push(def);
      } else {
        groups.optional.push(def);
      }
    });

    // Sort by display order
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => a.displayOrder - b.displayOrder);
    });

    return groups;
  }, [definitions]);

  // Sorted definitions by displayOrder, prioritizing required documents first
  const sortedDefinitions = React.useMemo(() => {
    return [...definitions].sort((a, b) => {
      if (a.isRequired && !b.isRequired) return -1;
      if (!a.isRequired && b.isRequired) return 1;
      return a.displayOrder - b.displayOrder;
    });
  }, [definitions]);

  const requiredCount = groupedDefinitions.required.length;
  const uploadedRequiredCount = groupedDefinitions.required.filter(
    d => uploadStates[d.id]?.status === "uploaded"
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 text-blue-600 animate-spin" />
          <p className="text-sm text-slate-500">{t("compliance.loadingRequirements")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    const is404 = error.includes('404') || error.toLowerCase().includes('not found');
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-start gap-3">
          <XCircle className="size-5 text-red-500 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">{error}</p>
            {is404 && (
              <p className="text-red-600 text-sm mt-1">
                {t("compliance.apiError")}
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-600 underline hover:no-underline"
            >
              {t("compliance.retry")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-800">{t("compliance.title")}</h2>
              <p className="text-xs text-slate-500">
                {t("compliance.subtitle", { category: formData.category, type: formData.assetType })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Documents Section */}
      {definitions.length > 0 && (
        <div className="border border-emerald-200 bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 border-b border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-600 size-4" />
              <h3 className="font-bold text-emerald-800 text-sm">{t("compliance.documents")}</h3>
            </div>
            {requiredCount > 0 && (
              <span className="text-xs text-emerald-600 font-medium">
                {t("compliance.uploadedRequired", { uploaded: uploadedRequiredCount, required: requiredCount })}
              </span>
            )}
          </div>
          <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sortedDefinitions.map(def => (
              <DocumentUploadCard
                key={def.id}
                definition={def}
                state={uploadStates[def.id]}
                onFileSelect={(file) => handleFileSelect(def.id, file)}
                onDelete={() => handleDelete(def.id)}
                onView={() => handleView(def.id, uploadStates[def.id])}
                isViewing={viewingDocId === def.id}
                fileInputRef={(el) => { fileInputRefs.current[def.id] = el; }}
                t={t}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Documents Message */}
      {definitions.length === 0 && (
        <div className="p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="bg-white p-3 rounded-full shadow-sm mb-3">
            <Info className="size-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">{t("compliance.noDocsTitle")}</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-2">
            {t("compliance.noDocsDesc")}
          </p>
        </div>
      )}
    </div>
  );
}

// Document Upload Card Component
interface DocumentUploadCardProps {
  definition: AssetDocumentDefinitionDto;
  state?: DocumentUploadState;
  onFileSelect: (file: File) => void;
  onDelete: () => void;
  onView?: () => void;
  isViewing?: boolean;
  fileInputRef: (el: HTMLInputElement | null) => void;
  t: any;
}

function DocumentUploadCard({ definition, state, onFileSelect, onDelete, onView, isViewing, fileInputRef, t }: DocumentUploadCardProps) {
  const status = state?.status || "pending";
  const inputId = `compliance-doc-${definition.id}`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const statusConfig = {
    pending: { bg: "bg-gradient-to-r from-[#C8E1FC] via-[#DBEAFF] to-[#EDF5FF]", border: "border-[#A3CBFA]", icon: FileUp, iconColor: "text-[#1d4ed8]" },
    uploading: { bg: "bg-blue-50", border: "border-blue-200", icon: Loader2, iconColor: "text-blue-600" },
    uploaded: { bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle2, iconColor: "text-emerald-600" },
    error: { bg: "bg-red-50", border: "border-red-200", icon: AlertCircle, iconColor: "text-red-500" }
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className={`${config.bg} ${config.border} border rounded-xl p-3 transition-all hover:shadow-sm w-full h-full flex flex-col justify-between`}>
      <div className="flex items-start gap-3 h-full">
        <div className={`p-2 rounded-lg shrink-0 ${status === "uploaded" ? "bg-emerald-100" : status === "error" ? "bg-red-100" : "bg-white"}`}>
          <StatusIcon className={`size-5 ${config.iconColor} ${status === "uploading" ? "animate-spin" : ""}`} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-semibold text-slate-800 leading-tight">
                  {definition.documentName}
                  {definition.isRequired && <span className="text-red-500 font-bold ml-1">*</span>}
                </h4>
                {definition.description && (
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{definition.description}</p>
                )}
              </div>
            </div>

            {/* Status / File Name or File Info */}
            {status === "uploaded" && (state?.file || state?.uploadedDoc) ? (
              <div className="mt-2 flex items-center gap-1.5 text-emerald-700">
                <FileBox className="size-3 shrink-0" />
                <span className="text-[10px] font-medium truncate">
                  {state.file ? state.file.name : state.uploadedDoc?.fileName}
                </span>
              </div>
            ) : (
              <div className="mt-2 text-[10px] text-slate-400 space-y-0.5">
                <p>{t("compliance.card.maxSize", { size: definition.maxFileSizeMB })} • {definition.allowedExtensions || t("compliance.card.allTypes")}</p>
              </div>
            )}
            {status === "error" && state?.error && (
              <p className="mt-2 text-[10px] text-red-600 font-medium">{state.error}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                id={inputId}
                onChange={handleFileChange}
                accept={definition.allowedExtensions || "*"}
                className="hidden"
              />
              <label
                htmlFor={inputId}
                className={`
                  w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all
                  ${status === "uploaded"
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200"
                    : status === "uploading"
                      ? "bg-blue-100 text-blue-600 border border-blue-200 cursor-wait"
                      : status === "error"
                        ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }
                `}
              >
                {status === "uploading" ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    {t("compliance.card.uploading")}
                  </>
                ) : status === "uploaded" ? (
                  <>
                    <Upload className="size-3" />
                    {t("compliance.card.replace")}
                  </>
                ) : (
                  <>
                    <Upload className="size-3" />
                    {t("compliance.card.upload")}
                  </>
                )}
              </label>
            </div>

            {status === "uploaded" && (
              <>
                {onView && (
                  <button
                    type="button"
                    onClick={onView}
                    disabled={isViewing}
                    className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg transition-all active:scale-95 flex items-center justify-center cursor-pointer disabled:opacity-50"
                    title={t("compliance.card.view")}
                  >
                    {isViewing ? (
                      <Loader2 className="size-3.5 animate-spin text-blue-600" />
                    ) : (
                      <Eye className="size-3.5" />
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={onDelete}
                  className="p-1.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                  title={t("compliance.card.delete")}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
