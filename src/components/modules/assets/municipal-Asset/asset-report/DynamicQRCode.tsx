"use client";

import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export function DynamicQRCode({ assetId }: { assetId: string }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Generate the exact URL the user is currently on
    setUrl(window.location.href);
  }, []);

  if (!url) {
    return <div className="h-[60px] w-[60px] bg-gray-100 animate-pulse" />;
  }

  return <QRCodeSVG value={url} size={60} className="h-[60px] w-[60px]" />;
}
