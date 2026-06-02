'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Sparkles } from 'lucide-react';

/**
 * Asset Management Intro Video Component
 * 
 * Displays full-screen video when user first navigates to Asset Management dashboard
 * 
 * Session Storage Key: 'ntis_asset_management_intro_played'
 * 
 * To reset/test again in browser console:
 * sessionStorage.removeItem('ntis_asset_management_intro_played')
 */

interface AssetIntroVideoProps {
  displayUlbName?: string;
}

export function AssetIntroVideo({ displayUlbName }: AssetIntroVideoProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
    setPortalTarget(document.body);

    // Check if window is available (client-side only)
    if (typeof window === 'undefined') {
      console.log('Window not available, skipping video (SSR)');
      return;
    }

    // Use a very specific key for asset management intro only
    const hasPlayedAssetIntro = sessionStorage.getItem('ntis_asset_management_intro_played');

    console.log('AssetIntroVideo mounted, ntis_asset_management_intro_played:', hasPlayedAssetIntro);
    console.log('Current URL:', window.location.pathname);

    // Only show if NOT played and we're on asset dashboard route
    const isAssetDashboardRoute = window.location.pathname.includes('/asset/dashboard');

    console.log('Is asset dashboard route:', isAssetDashboardRoute);

    if (!hasPlayedAssetIntro && isAssetDashboardRoute) {
      console.log('Showing video...');
      setIsVisible(true);

      // Allow skipping after 3 seconds
      const skipTimer = setTimeout(() => {
        setCanSkip(true);
      }, 3000);

      return () => {
        clearTimeout(skipTimer);
      };
    } else {
      console.log('Video skipped. Already played:', !!hasPlayedAssetIntro, 'Is asset route:', isAssetDashboardRoute);
      // Safely clear/disable the server-side style tag without deleting it
      const serverStyle = document.getElementById('server-intro-style') as HTMLStyleElement;
      if (serverStyle) {
        try {
          if (serverStyle.sheet) {
            serverStyle.sheet.disabled = true;
          }
        } catch (e) { }
        serverStyle.innerHTML = '';
      }

      // Dispatch immediately to let the map know it can render
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('ntis_intro_dismissed'));
      }
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      document.body.classList.add('intro-video-active');
      document.documentElement.classList.add('intro-video-active');
    } else {
      document.body.classList.remove('intro-video-active');
      document.documentElement.classList.remove('intro-video-active');
    }
    return () => {
      document.body.classList.remove('intro-video-active');
      document.documentElement.classList.remove('intro-video-active');
    };
  }, [isVisible]);

  const handleDismiss = () => {
    console.log('Video dismissed');
    sessionStorage.setItem('ntis_asset_management_intro_played', 'true');
    // Set cookie for 1 year so server knows they have played it
    document.cookie = "ntis_asset_management_intro_played=true; path=/; max-age=31536000";
    setIsVisible(false);

    // Safely clear/disable the server-side style tag without deleting it
    const serverStyle = document.getElementById('server-intro-style') as HTMLStyleElement;
    if (serverStyle) {
      try {
        if (serverStyle.sheet) {
          serverStyle.sheet.disabled = true;
        }
      } catch (e) { }
      serverStyle.innerHTML = '';
    }

    // Dispatch event to notify other components (like MapView) that intro has finished
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ntis_intro_dismissed'));
    }
  };

  if (!mounted) return null;

  const introContent = (
    <>
      {isVisible && (
        <style dangerouslySetInnerHTML={{
          __html: `
          body.intro-video-active header,
          body.intro-video-active footer,
          body.intro-video-active main,
          html.intro-video-active header,
          html.intro-video-active footer,
          html.intro-video-active main {
            display: none !important;
          }
          body.intro-video-active,
          html.intro-video-active {
            background-color: black !important;
            overflow: hidden !important;
          }
        ` }} />
      )}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[9999] overflow-hidden bg-black"
          >
            {/* Full-screen Video */}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              onEnded={handleDismiss}
              onError={(e) => {
                console.error('Video error:', e);
                console.error('Video element:', videoRef.current);
              }}
              onLoadedData={() => console.log('Video loaded successfully')}
              onPlay={() => console.log('Video started playing')}
            >
              <source src="/videos/mp__Feel_free_to_ask_me_for_the_videos_of_the_other_scenes_.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Subtle dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/25" />

            {/* Content Overlay */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6">

              {/* Welcome Message */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-center space-y-6"
              >
                {/* Icon with glow effect */}
                <div className="relative inline-flex items-center justify-center">
                  <div className="absolute -inset-2 rounded-full border border-cyan-400/20 animate-pulse" />
                  <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-2xl">
                    <Landmark className="w-12 h-12 text-white" />
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-3">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex items-center justify-center gap-2"
                  >

                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                      Welcome
                    </h1>

                  </motion.div>

                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-2xl md:text-3xl font-semibold text-cyan-300"
                  >{displayUlbName}

                  </motion.h2>

                  {/* {displayUlbName && (
                    <h1>
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1 }}
                        className="text-lg text-white/80 font-bold"
                      >
                        Asset Management System
                      </motion.p>
                    </h1>
                  )} */}
                </div>

                {/* Loading indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="flex flex-col items-center gap-3 mt-8"
                >
                  <div className="flex gap-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <p className="text-sm text-white/70">Loading your dashboard...</p>
                </motion.div>
              </motion.div>

              {/* Skip button */}
              {canSkip && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  onClick={handleDismiss}
                  className="absolute bottom-8 right-8 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-lg text-white text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  Skip Intro
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return portalTarget ? createPortal(introContent, portalTarget) : introContent;
}
