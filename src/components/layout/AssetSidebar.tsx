'use client';

import { motion } from 'motion/react';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import {
  User,
  ChevronDown,
  Settings,
  Building2,
  IndianRupee,
  Users,
  CreditCard,
  LayoutDashboard
} from 'lucide-react';

import { AssetUser, AssetSidebarProps, ScreenItem, SidebarSection } from '@/types/asset.types';
import {
  PROJECT_SCREEN_CATALOG,
  ACCESS_PROFILE_CHANGE_EVENT,
  SCREEN_MASTER_CHANGE_EVENT,
  getAllowedScreenPaths,
  loadAccessProfiles,
  loadScreenMaster
} from '@/lib/utils/asset-access';
import { getLocaleFromPathname } from '@/i18n/config';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/assets/dashboard/master-dashboard' },
  { id: 'assets', label: 'Municipal Assets', icon: Building2, route: '/assets/municipal-Asset' },
];

const secondarySidebarItems: any[] = [];

const ASSET_MENU_SECTIONS: SidebarSection[] = [
  {
    id: 'revenue-group',
    label: 'Revenue Management',
    icon: IndianRupee,
    colorClass: 'text-violet-400',
    items: [
      { id: 'renters', label: 'Manage Renters Details', icon: Users, route: '/assets/revenue/manage-renters' },
      { id: 'payment', label: 'Payment', icon: CreditCard, route: '/assets/revenue/payment' }
    ]
  }
];

const routeMap = {
  'dashboard': '/assets/dashboard/master-dashboard',
  'assets': '/assets/municipal-Asset',
  'renters': '/assets/revenue/manage-renters',
  'payment': '/assets/revenue/payment',
  'configuration': '/assets/configuration/master-data/asset-type',
};

/**
 * Parses user_name safely from cookies since we don't have a global auth provider
 * Match the behavior of Header.tsx exactly.
 */
function getUsernameFromCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(/(?:^|; )user_name=([^;]+)/);
  const rawUserName = match ? match[1] : undefined;
  if (!rawUserName) return undefined;

  try {
    return decodeURIComponent(rawUserName.replace(/\+/g, ' '));
  } catch {
    return rawUserName;
  }
}

export function AssetSidebar({
  isDarkMode: isDarkModeProp,
  onToggleDarkMode: _onToggleDarkMode,
  currentPage = 'dashboard',
  onNavigate,
  isSidebarExpanded: isSidebarExpandedProp,
  setSidebarExpanded: setSidebarExpandedProp
}: Partial<AssetSidebarProps> = {}) {
  // Internal state — used when no props are passed (self-contained mode)
  const [internalDarkMode, _setInternalDarkMode] = useState(false);
  const [internalExpanded, setInternalExpanded] = useState(true);

  const isDarkMode = isDarkModeProp ?? internalDarkMode;
  const isSidebarExpanded = isSidebarExpandedProp ?? internalExpanded;
  const setSidebarExpanded = setSidebarExpandedProp ?? setInternalExpanded;
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState<string | undefined>(undefined);

  // Set username after mount to avoid SSR mismatch
  useEffect(() => {
    const cookieUserName = getUsernameFromCookie();
    if (cookieUserName) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsername(cookieUserName);
    }
  }, []);

  // Mock User based on cookie matching the Header logic, filling in defaults for Asset Sidebar requirements.
  const user: AssetUser = useMemo(() => ({
    id: 'u1',
    name: username || 'Asset Admin',
    role: 'Asset Manager'
  }), [username]);

  // Logout is handled by the main Header — not duplicated here.

  // Dynamic section expansion state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const [screenCatalog, setScreenCatalog] = useState<ScreenItem[]>(() => loadScreenMaster(PROJECT_SCREEN_CATALOG));
  const [accessProfiles, setAccessProfiles] = useState(() => loadAccessProfiles([]));

  useEffect(() => {
    const handleAccessChange = () => {
      setScreenCatalog(loadScreenMaster(PROJECT_SCREEN_CATALOG));
      setAccessProfiles(loadAccessProfiles([]));
    };

    window.addEventListener(SCREEN_MASTER_CHANGE_EVENT, handleAccessChange as EventListener);
    window.addEventListener(ACCESS_PROFILE_CHANGE_EVENT, handleAccessChange as EventListener);
    return () => {
      window.removeEventListener(SCREEN_MASTER_CHANGE_EVENT, handleAccessChange as EventListener);
      window.removeEventListener(ACCESS_PROFILE_CHANGE_EVENT, handleAccessChange as EventListener);
    };
  }, []);

  const allowedPaths = useMemo(() => {
    if (!user) return new Set<string>();

    if (user.accessibleScreenCodes?.length) {
      const enabledCodes = new Set(
        user.accessibleScreenCodes.filter((code) => user.screenStates?.[code] !== false)
      );

      return new Set(
        screenCatalog
          .filter((screen: ScreenItem) => enabledCodes.has(screen.screenCode))
          .map((screen: ScreenItem) => screen.screenPath)
      );
    }

    return getAllowedScreenPaths({
      userId: user.id,
      userRole: user.role,
      screens: screenCatalog,
      profiles: accessProfiles,
    });
  }, [user, screenCatalog, accessProfiles]);

  const isPathAllowed = (route: string) => {
    if (!route) return true;
    if (!screenCatalog.length) return true;
    if (!allowedPaths.size) return true;
    return allowedPaths.has(route);
  };

  const handleNavigate = (page: string) => {
    const route = routeMap[page as keyof typeof routeMap];
    if (route) {
      const locale = getLocaleFromPathname(pathname);
      router.push(`/${locale}${route}`);
    }
    if (onNavigate) {
      onNavigate(page);
    }
  };

  useEffect(() => {
    const cleanPath = (pathname || '').replace(/^\/(en|hi|mr)(?=\/|$)/, '') || '/';

    // Auto-expand sections if a sub-item is active
    const newExpanded: Record<string, boolean> = {};
    ASSET_MENU_SECTIONS.forEach(section => {
      if (section.items.some(item => item.route === cleanPath)) {
        newExpanded[section.id] = true;
      }
    });

    if (Object.keys(newExpanded).length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedSections(prev => ({ ...prev, ...newExpanded }));
    }
  }, [pathname]);

  useEffect(() => {
    if (!isSidebarExpanded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedSections({});
    }
  }, [isSidebarExpanded]);

  const getActivePageFromRoute = () => {
    const currentPath = (pathname || '').replace(/^\/(en|hi|mr)(?=\/|$)/, '') || '/';

    // Check main items
    const activeItem = sidebarItems.find(item => item.route === currentPath);
    if (activeItem) return activeItem.id;

    // Check secondary items
    const activeSecondaryItem = secondarySidebarItems.find(item => item.route === currentPath);
    if (activeSecondaryItem) return activeSecondaryItem.id;

    // Check dynamic sections
    for (const section of ASSET_MENU_SECTIONS) {
      const activeSubItem = section.items.find(item => item.route === currentPath);
      if (activeSubItem) return activeSubItem.id;
    }

    return currentPage;
  };

  const activePage = getActivePageFromRoute();
  const filteredSidebarItems = sidebarItems.filter(item => isPathAllowed(item.route));
  const filteredSecondaryItems = secondarySidebarItems.filter(item => isPathAllowed(item.route));

  // Filter items within sections based on permissions
  const filteredSections = ASSET_MENU_SECTIONS.map(section => ({
    ...section,
    items: section.items.filter(item => isPathAllowed(item.route))
  })).filter(section => section.items.length > 0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderNavItem = (item: any, index: number, delayOffset: number = 0) => {
    const Icon = item.icon;
    const isActive = activePage === item.id;

    const iconColors: Record<string, string> = {
      'dashboard': 'text-cyan-400',
      'map': 'text-emerald-400',
      'assets': 'text-orange-400',
      'maintenance': 'text-yellow-400',
      'change-detection': 'text-purple-400',
      'inventory-dashboard': 'text-rose-400',
    };

    const borderColors: Record<string, string> = {
      'dashboard': 'border-cyan-400/40 hover:border-cyan-400/60',
      'map': 'border-emerald-400/40 hover:border-emerald-400/60',
      'assets': 'border-orange-400/40 hover:border-orange-400/60',
      'maintenance': 'border-yellow-400/40 hover:border-yellow-400/60',
      'change-detection': 'border-purple-400/40 hover:border-purple-400/60',
      'inventory-dashboard': 'border-rose-400/40 hover:border-rose-400/60',
    };

    const activeBorderColors: Record<string, string> = {
      'dashboard': 'border-cyan-400/60',
      'map': 'border-emerald-400/60',
      'assets': 'border-orange-400/60',
      'maintenance': 'border-yellow-400/60',
      'change-detection': 'border-purple-400/60',
      'inventory-dashboard': 'border-rose-400/60',
    };

    const iconColor = iconColors[item.id] || 'text-slate-400';
    const borderColor = borderColors[item.id] || 'border-slate-700/50 hover:border-slate-600/60';
    const activeBorderColor = activeBorderColors[item.id] || 'border-indigo-400/50';

    return (
      <motion.button
        key={item.id}
        onClick={() => handleNavigate(item.id)}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.3,
          delay: 0.1 * (index + delayOffset),
          type: 'spring',
          stiffness: 100
        }}
        whileHover={{
          x: 8,
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.98 }}
        className={`relative w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm transition-all group cursor-pointer overflow-hidden backdrop-blur-md ${isSidebarExpanded ? 'border' : 'border-0'
          } ${isActive
            ? isSidebarExpanded
              ? isDarkMode
                ? `bg-gradient-to-r from-indigo-600/80 to-blue-600/80 text-white shadow-lg ${activeBorderColor}`
                : `bg-white/30 text-white shadow-lg ${activeBorderColor}`
              : 'bg-transparent text-white'
            : isSidebarExpanded
              ? isDarkMode
                ? `text-slate-300 bg-slate-800/40 hover:bg-slate-700/60 hover:text-white ${borderColor}`
                : `text-indigo-100 bg-white/5 hover:bg-white/15 hover:text-white ${borderColor}`
              : 'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white'
          }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-sm pointer-events-none" />

        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />

        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full ${isDarkMode ? 'bg-cyan-400' : 'bg-white'
              }`}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}

        <motion.div
          whileHover={{ rotate: isActive ? 0 : 12, scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : iconColor} transition-colors`} />
        </motion.div>

        <motion.span
          initial={false}
          animate={{
            opacity: isSidebarExpanded ? 1 : 0,
            width: isSidebarExpanded ? 'auto' : 0,
          }}
          transition={{ duration: 0.2 }}
          className="text-xs font-medium whitespace-nowrap overflow-hidden relative z-10"
        >
          <span className="relative inline-block">
            {item.label}
          </span>
        </motion.span>

        <motion.div
          className={`absolute inset-0 rounded-lg ${isDarkMode ? 'bg-white/20' : 'bg-white/30'
            }`}
          initial={{ scale: 0, opacity: 0.5 }}
          whileTap={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </motion.button>
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarExpanded ? 260 : 72 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      onMouseEnter={() => setSidebarExpanded(true)}
      onMouseLeave={() => setSidebarExpanded(false)}
      className={`relative z-40 flex-shrink-0 transition-colors duration-300 ${isDarkMode
        ? 'bg-gradient-to-b from-[#000428] to-[#004e92] border-r border-indigo-400/20'
        : 'bg-gradient-to-b from-[#000428] to-[#004e92] border-r border-slate-700/40'
        } shadow-xl overflow-hidden h-full`}
    >
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
            'linear-gradient(180deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
            'linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="flex flex-col h-full relative z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`px-2 py-4 mt-4 border-b transition-colors relative ${isDarkMode ? 'border-indigo-400/20' : 'border-white/20'
            }`}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
              repeatDelay: 6,
            }}
          />

          <motion.div
            className="flex items-center gap-3 px-2 relative z-10"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden ${isDarkMode
                ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                : 'bg-gradient-to-br from-orange-500 to-yellow-500'
                }`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/30 rounded-full"
                animate={{
                  opacity: [0, 0.5, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <User className="w-5 h-5 text-white relative z-10" />
            </motion.div>
            <motion.div
              initial={false}
              animate={{
                opacity: isSidebarExpanded ? 1 : 0,
                width: isSidebarExpanded ? 'auto' : 0,
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden relative"
            >
              <div className="relative inline-block">
                <p className={`text-sm font-semibold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-white'
                  }`}>
                  {user.name}
                </p>
              </div>
              <div className="relative inline-block">
                <p className={`text-xs capitalize whitespace-nowrap ${isDarkMode ? 'text-slate-300' : 'text-indigo-100'
                  }`}>
                  {user.role.replace('_', ' ')}
                </p>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 10, delay: 1 }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {filteredSidebarItems.map((item, index) => renderNavItem(item, index))}

          {filteredSections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.1 * (filteredSidebarItems.length + sectionIndex),
                type: 'spring',
                stiffness: 100
              }}
              className="space-y-1"
            >
              <motion.button
                onClick={() => toggleSection(section.id)}
                whileHover={{ x: 8, scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className={`relative w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm transition-all group cursor-pointer overflow-hidden backdrop-blur-md ${isSidebarExpanded
                  ? `border ${isDarkMode
                    ? `text-slate-300 bg-slate-800/40 hover:bg-slate-700/60 hover:text-white border-white/20`
                    : `text-indigo-100 bg-white/5 hover:bg-white/15 hover:text-white border-white/20`
                  }`
                  : 'border-0 bg-transparent hover:bg-white/5 text-slate-300 hover:text-white'
                  }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-sm pointer-events-none" />
                <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.6, ease: 'easeInOut' }} />

                <motion.div whileHover={{ rotate: 12, scale: 1.1 }} transition={{ duration: 0.3 }}>
                  <section.icon className={`w-4 h-4 flex-shrink-0 ${section.colorClass} transition-colors`} />
                </motion.div>

                <motion.span
                  initial={false}
                  animate={{ opacity: isSidebarExpanded ? 1 : 0, width: isSidebarExpanded ? 'auto' : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs font-medium whitespace-nowrap overflow-hidden relative z-10"
                >
                  <span className="relative inline-block">{section.label}</span>
                </motion.span>

                <motion.div
                  initial={false}
                  animate={{ opacity: isSidebarExpanded ? 1 : 0, rotate: expandedSections[section.id] ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10"
                >
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </motion.div>

                <motion.div className={`absolute inset-0 rounded-lg ${isDarkMode ? 'bg-white/20' : 'bg-white/30'}`} initial={{ scale: 0, opacity: 0.5 }} whileTap={{ scale: 2, opacity: 0 }} transition={{ duration: 0.5 }} />
              </motion.button>

              <motion.div
                initial={false}
                animate={{ height: expandedSections[section.id] ? 'auto' : 0, opacity: expandedSections[section.id] ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden space-y-1"
              >
                {section.items.map((subItem, subIndex) => {
                  const SubIcon = subItem.icon;
                  const isActive = activePage === subItem.id;

                  return (
                    <motion.button
                      key={subItem.id}
                      onClick={() => handleNavigate(subItem.id)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * subIndex, type: 'spring', stiffness: 100 }}
                      whileHover={{ x: 8, scale: 1.02, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm transition-all group cursor-pointer overflow-hidden backdrop-blur-md border ${isActive
                        ? isDarkMode
                          ? `bg-gradient-to-r from-indigo-600/80 to-blue-600/80 text-white shadow-lg border-white/40`
                          : `bg-white/30 text-white shadow-lg border-white/40`
                        : isDarkMode
                          ? `text-slate-300 bg-slate-800/30 hover:bg-slate-700/50 hover:text-white border-white/10`
                          : `text-indigo-100 bg-white/5 hover:bg-white/10 hover:text-white border-white/10`
                        }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-sm pointer-events-none" />
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.6, ease: 'easeInOut' }} />

                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full ${isDarkMode ? 'bg-cyan-400' : 'bg-white'}`}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}

                      <motion.div whileHover={{ rotate: isActive ? 0 : 12, scale: 1.1 }} transition={{ duration: 0.3 }}>
                        <SubIcon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : section.colorClass} transition-colors`} />
                      </motion.div>

                      <motion.span
                        initial={false}
                        animate={{ opacity: isSidebarExpanded ? 1 : 0, width: isSidebarExpanded ? 'auto' : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs font-medium whitespace-nowrap overflow-hidden relative z-10"
                      >
                        <span className="relative inline-block">{subItem.label}</span>
                      </motion.span>

                      <motion.div className={`absolute inset-0 rounded-lg ${isDarkMode ? 'bg-white/20' : 'bg-white/30'}`} initial={{ scale: 0, opacity: 0.5 }} whileTap={{ scale: 2, opacity: 0 }} transition={{ duration: 0.5 }} />
                    </motion.button>
                  );
                })}
              </motion.div>
            </motion.div>
          ))}

          {filteredSecondaryItems.map((item, index) => renderNavItem(item, index, filteredSidebarItems.length + filteredSections.length))}

        </nav>

        {/* Configuration Master */}
        <div className="p-2 border-t border-slate-700/50 space-y-1">
          {isPathAllowed('/assets/configuration/master-data/asset-type') && (
          <motion.button
            onClick={() => handleNavigate('configuration')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group overflow-hidden relative ${
              activePage === 'configuration'
                ? isDarkMode
                  ? 'bg-gradient-to-r from-indigo-600/80 to-blue-600/80 text-white shadow-lg'
                  : 'bg-white/30 text-white shadow-lg'
                : isDarkMode 
                  ? 'hover:bg-blue-500/10 text-slate-400 hover:text-blue-400' 
                  : 'hover:bg-blue-500/10 text-indigo-200 hover:text-blue-400'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg pointer-events-none" />
            
            {activePage === 'configuration' && (
              <motion.div
                layoutId="activeIndicator"
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full ${
                  isDarkMode ? 'bg-cyan-400' : 'bg-white'
                }`}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            
            <motion.div whileHover={{ rotate: 12, scale: 1.1 }} transition={{ duration: 0.3 }}>
              <Settings className="w-5 h-5 flex-shrink-0" />
            </motion.div>
            <motion.span
              animate={{ opacity: isSidebarExpanded ? 1 : 0, width: isSidebarExpanded ? 'auto' : 0 }}
              className="text-sm font-medium whitespace-nowrap overflow-hidden relative z-10"
            >
              Configuration
            </motion.span>
          </motion.button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
