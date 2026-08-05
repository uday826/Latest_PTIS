"use client";

import React from 'react';
import EditPropertyView from './EditPropertyView';
import PrintCardView from './PrintCardView';
import ViewDemandView from './ViewDemandView';
import ViewCollectionView from './ViewCollectionView';
import GenerateNoticeView from './GenerateNoticeView';
import PropertyHistoryView from './PropertyHistoryView';
import DocumentsView from './DocumentsView';
import ApplyOcView from './ApplyOcView';
import MoreActionsView from './MoreActionsView';

interface ActionViewsProps {
  activeAction: string | null;
  setActiveAction: (action: string | null) => void;
}

export default function ActionViews({ activeAction, setActiveAction }: ActionViewsProps) {
  const onClose = () => setActiveAction(null);

  switch (activeAction) {
    case 'edit-property':
      return <EditPropertyView onClose={onClose} />;
    case 'print-card':
      return <PrintCardView onClose={onClose} />;
    case 'view-demand':
      return <ViewDemandView onClose={onClose} />;
    case 'view-collection':
      return <ViewCollectionView onClose={onClose} />;
    case 'generate-notice':
      return <GenerateNoticeView onClose={onClose} />;
    case 'property-history':
      return <PropertyHistoryView onClose={onClose} />;
    case 'documents':
      return <DocumentsView onClose={onClose} />;
    case 'apply-oc':
      return <ApplyOcView onClose={onClose} />;
    case 'more-actions':
      return <MoreActionsView onClose={onClose} />;
    default:
      return null;
  }
}
