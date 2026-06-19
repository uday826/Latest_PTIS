"use client";

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export function DynamicQRCode({ assetId: _assetId }: { assetId: string }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  if (!url) {
    return <div className="h-[60px] w-[60px] bg-gray-100 animate-pulse" />;
  }

  return <QRCodeSVG value={url} size={60} className="h-[60px] w-[60px]" />;
}

