import React from "react";
import { Drawer, Button, Select, UploadButton, Input } from "@/components/common";
import { FileText, Receipt, X } from "lucide-react";
import { type InvoiceForm } from "./FurnitureFixtureTypes";
import { invoiceModeOptions } from "./FurnitureFixtureConstants";
import { useTranslations } from "next-intl";

interface InvoiceDrawerProps {
  open: boolean;
  onClose: () => void;
  invoiceForm: InvoiceForm;
  updateInvoiceForm: (key: keyof InvoiceForm, value: string) => void;
  existingInvoiceOptions: { label: string; value: string }[];
  invoiceInputRef: React.RefObject<HTMLInputElement | null>;
  handleInvoiceUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  saveInvoiceDetails: () => void;
  invoiceError: string;
}

export function InvoiceDrawer({
  open,
  onClose,
  invoiceForm,
  updateInvoiceForm,
  existingInvoiceOptions,
  invoiceInputRef,
  handleInvoiceUpload,
  saveInvoiceDetails,
  invoiceError,
}: InvoiceDrawerProps) {
  const t = useTranslations("addAssetForm");
  return (
    <Drawer
      open={open}
      onClose={onClose}
      width="md"
      title={
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 id="drawer-title" className="text-lg font-semibold text-slate-900">
              {t("inventory.invoiceDrawer.title")}
            </h3>
            <p className="text-sm text-slate-500">
              {t("inventory.invoiceDrawer.subtitle")}
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Button variant="secondary" icon={X} onClick={onClose}>
            {t("buttons.close")}
          </Button>
          <Button variant="primary" icon={Receipt} onClick={saveInvoiceDetails}>
            {t("inventory.invoiceDrawer.saveBtn")}
          </Button>
        </div>
      }
    >
      <div className="px-2 py-5 sm:px-6 sm:py-6">
        <div className="rounded-2xl bg-white p-1">
          <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-2 sm:p-2">
            <Select
              label={t("inventory.invoiceDrawer.modeLabel")}
              value={invoiceForm.invoiceMode}
              onChange={(_, value) => {
                updateInvoiceForm("invoiceMode", value);
                updateInvoiceForm("existingInvoiceKey", "");
                if (value === "upload") {
                  updateInvoiceForm("invoiceNumber", "");
                  updateInvoiceForm("invoiceDate", "");
                  updateInvoiceForm("invoiceFileName", "");
                }
              }}
              options={invoiceModeOptions}
            />

            {invoiceForm.invoiceMode === "reuse" ? (
              <Select
                label={t("inventory.invoiceDrawer.selectExistingLabel")}
                value={invoiceForm.existingInvoiceKey}
                onChange={(_, key) => {
                  updateInvoiceForm("existingInvoiceKey", key);
                  const selected = existingInvoiceOptions.find((opt) => opt.value === key);
                  if (!selected?.value) return;

                  const [invoiceNumber, invoiceDate] = selected.value.split("__");
                  updateInvoiceForm("invoiceNumber", invoiceNumber || "");
                  updateInvoiceForm("invoiceDate", invoiceDate || "");
                  updateInvoiceForm("invoiceFileName", "");
                }}
                options={existingInvoiceOptions}
                placeholder={t("inventory.invoiceDrawer.selectExistingPlaceholder")}
                disabled={existingInvoiceOptions.length === 1 && existingInvoiceOptions[0]?.value === ""}
              />
            ) : (
              <>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-700">{t("inventory.invoiceDrawer.uploadLabel")}</span>
                  <input
                    ref={invoiceInputRef}
                    type="file"
                    accept=".bmp,.doc,.docx,.gif,.jpeg,.jpg,.pdf,.png,.ppt,.pptx,.tif,.tiff,.txt,.webp,.xls,.xlsx"
                    className="hidden"
                    onChange={handleInvoiceUpload}
                  />
                  <UploadButton
                    label={invoiceForm.invoiceFileName || t("inventory.invoiceDrawer.chooseFilePlaceholder")}
                    className="w-full justify-start"
                    onClick={() => invoiceInputRef.current?.click()}
                  />
                </div>

                <Input
                  label={t("inventory.columns.invoice")}
                  placeholder="e.g. INV-2024-001"
                  value={invoiceForm.invoiceNumber}
                  onChange={(event) => updateInvoiceForm("invoiceNumber", event.target.value)}
                />

                <Input
                  label={t("inventory.invoiceDrawer.invoiceDateLabel")}
                  type="date"
                  value={invoiceForm.invoiceDate}
                  onChange={(event) => updateInvoiceForm("invoiceDate", event.target.value)}
                />
              </>
            )}

            {invoiceForm.invoiceMode === "reuse" ? (
              <div className="rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700">
                {invoiceForm.existingInvoiceKey
                  ? `${t("inventory.invoiceDrawer.selected")}: ${invoiceForm.invoiceNumber}${invoiceForm.invoiceDate ? ` (${invoiceForm.invoiceDate})` : ""}`
                  : existingInvoiceOptions.length === 1 && existingInvoiceOptions[0]?.value === ""
                    ? t("inventory.invoiceDrawer.noInvoiceAvailable")
                    : t("inventory.invoiceDrawer.selectToReuse")}
              </div>
            ) : null}

            <div className="rounded-xl border border-amber-200 bg-amber-50 px-2 py-1.5 text-sm text-amber-800">
              {t("inventory.invoiceDrawer.reusedMessage")}
            </div>

            {invoiceError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-2 py-1.5 text-sm text-red-700">
                {invoiceError}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Drawer>
  );
}


