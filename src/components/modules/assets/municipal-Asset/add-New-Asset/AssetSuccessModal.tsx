"use client";

import { useEffect } from "react";
import { CheckCircle2, X, Building2, Landmark, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useAssetForm } from "./AssetFormContext";

interface SuccessModalProps {
  assetName: string;
  assetCode: string;
  onGoToDashboard: () => void;
}

export default function AssetSuccessModal({ assetName, assetCode, onGoToDashboard }: SuccessModalProps) {
  const t = useTranslations("addAssetForm");
  const { formData } = useAssetForm();

  // Auto close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onGoToDashboard();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onGoToDashboard]);

  const normalizedCategory = (formData.category || "").toLowerCase();
  
  const getCategoryIcon = () => {
    if (normalizedCategory.includes("building")) {
      return <Building2 className="w-16 h-16" />;
    } else if (normalizedCategory.includes("land")) {
      return <Landmark className="w-16 h-16" />;
    } else if (normalizedCategory.includes("infrastructure")) {
      return <Activity className="w-16 h-16" />;
    } else {
      return <CheckCircle2 className="w-16 h-16" />;
    }
  };

  const getCategoryColor = () => {
    if (normalizedCategory.includes("building")) {
      return { primary: "#1E5AA8", secondary: "#9CC7F0", bg: "#EAF4FD" };
    } else if (normalizedCategory.includes("land")) {
      return { primary: "#059669", secondary: "#88C9A0", bg: "#D9F2E1" };
    } else if (normalizedCategory.includes("infrastructure")) {
      return { primary: "#DC2626", secondary: "#FCA5A5", bg: "#FEF2F2" };
    } else {
      return { primary: "#10B981", secondary: "#6EE7B7", bg: "#D1FAE5" };
    }
  };

  const colors = getCategoryColor();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onGoToDashboard}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
          style={{ backdropFilter: "blur(8px)" }}
        />

        {/* Modal Container */}
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative pointer-events-auto"
            style={{
              boxShadow: `0 0 60px ${colors.secondary}80, 0 20px 40px rgba(0, 0, 0, 0.3)`
            }}
          >
            {/* Close Button */}
            <button
              onClick={onGoToDashboard}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Success Icon with Animation */}
            <div
              className="pt-8 pb-6 px-6 text-center"
              style={{
                background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.secondary}40 100%)`
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
                className="inline-flex items-center justify-center rounded-full p-4 mb-4"
                style={{
                  backgroundColor: colors.primary,
                  boxShadow: `0 0 30px ${colors.primary}60, 0 10px 20px ${colors.primary}40`
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", damping: 10 }}
                  style={{ color: "white" }}
                >
                  {getCategoryIcon()}
                </motion.div>
              </motion.div>

              {/* Checkmark Animation */}
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", damping: 12 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500"
                  style={{
                    boxShadow: "0 0 30px rgba(34, 197, 94, 0.6), 0 10px 20px rgba(34, 197, 94, 0.4)"
                  }}
                >
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </motion.div>
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-2"
                style={{
                  color: colors.primary,
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                }}
              >
                🎉 {t("wizard.successModal.successTitle")}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-gray-600 font-medium"
              >
                {t("wizard.successModal.successSubtitle")}
              </motion.p>
            </div>

            {/* Asset Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="px-6 py-5 bg-white"
            >
              <div className="space-y-3">
                {assetCode && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-xs font-semibold text-gray-600">{t("wizard.assetNoLabel")}</span>
                    <span
                      className="text-sm font-bold font-mono"
                      style={{ color: colors.primary }}
                    >
                      {assetCode}
                    </span>
                  </div>
                )}

                {formData.category && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-xs font-semibold text-gray-600">{t("basicInfo.propertyDetails.assetCategory")}</span>
                    <span
                      className="text-sm font-bold capitalize px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.primary
                      }}
                    >
                      {formData.category}
                    </span>
                  </div>
                )}

                {formData.assetType && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-xs font-semibold text-gray-600">{t("basicInfo.propertyDetails.assetType")}</span>
                    <span className="text-sm font-bold text-gray-800">
                      {formData.assetType}
                    </span>
                  </div>
                )}

                {assetName && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-xs font-semibold text-gray-600">{t("wizard.assetNameLabel")}</span>
                    <span className="text-sm font-bold text-gray-800">
                      {assetName}
                    </span>
                  </div>
                )}
              </div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-5 p-4 rounded-xl border-2"
                style={{
                  background: `linear-gradient(135deg, ${colors.bg} 0%, white 100%)`,
                  borderColor: colors.secondary
                }}
              >
                <p className="text-xs text-gray-700 text-center leading-relaxed font-medium">
                  {t("wizard.successModal.successNote")}
                </p>
              </motion.div>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center"
            >
              <button
                onClick={onGoToDashboard}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:scale-105 shadow-lg cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  boxShadow: `0 4px 12px ${colors.primary}40`
                }}
              >
                {t("wizard.dashboardRedirect")}
              </button>
              <p className="text-xs text-gray-500 text-center mt-2 font-medium">
                {t("wizard.successModal.autoCloseText")}
              </p>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-full h-full"
                style={{ color: colors.primary }}
              >
                {getCategoryIcon()}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
