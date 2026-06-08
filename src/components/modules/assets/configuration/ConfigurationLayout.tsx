'use client';

import { usePathname, useRouter, useParams } from "next/navigation";
import { useTranslations } from 'next-intl';
import { ReactNode } from "react";
import { PageContainer, Tabs, Card } from "@/components/common";
import type { TabValue } from "@/components/common";
import { Database, LayoutGrid, Settings } from "lucide-react";

/* ================= CONST ================= */
const TAB_KEYS = {
  MASTER_DATA: "master-data",
  SCREEN_FIELDS: "screen-fields-master",
} as const;

interface ConfigurationLayoutProps {
  children: ReactNode;
}

export function ConfigurationLayout({ children }: ConfigurationLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "en";
  const t = useTranslations('screenFieldMaster');

  /* ================= ACTIVE TAB ================= */
  const getActiveTab = (): TabValue => {
    if (pathname.includes("screen-fields-master")) {
      return TAB_KEYS.SCREEN_FIELDS;
    }
    if (pathname.includes("master-data")) {
      return TAB_KEYS.MASTER_DATA;
    }
    return TAB_KEYS.SCREEN_FIELDS;
  };

  /* ================= TAB NAVIGATION ================= */
  const handleTabChange = (value: TabValue) => {
    const targetPath = value === TAB_KEYS.MASTER_DATA
      ? `/${locale}/assets/configuration/master-data/asset-type`
      : `/${locale}/assets/configuration/${value}`;
    router.push(targetPath);
  };

  return (
    <PageContainer>
      {/* ================= HEADER ================= */}
      <Card className="flex justify-between items-center px-6 py-4 shadow-sm bg-white border border-gray-100 rounded-xl">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Settings className="w-5 h-5 text-blue-600" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-black">
              {t('screenFieldsMaster.configurationMaster')}
            </h1>
            <p className="text-sm text-gray-500">
              {t('screenFieldsMaster.centralizedSystem')}
            </p>
          </div>
        </div>

        {/* RIGHT (STATS) */}
        <div className="flex gap-3">
        </div>
      </Card>

      {/* ================= TABS NAVIGATION ================= */}
      <div className="mt-4">
        <Card className="bg-white border border-gray-200 rounded-xl shadow-md p-1.5 w-fit">
          <Tabs
            value={getActiveTab()}
            onChange={handleTabChange}
            variant="pills"
          >
            <Tabs.TabList className="!bg-transparent !p-0 !flex !items-center !gap-1.5">
              {/* MASTER DATA */}
              <Tabs.Tab
                icon={Database}
                value={TAB_KEYS.MASTER_DATA}
                className="!flex !items-center !gap-2 !px-6 !py-2.5 !rounded-lg !text-sm !font-semibold !transition-all !text-gray-700 hover:!bg-gray-100 hover:!text-gray-800 [&[aria-selected='true']]:!bg-blue-600 [&[aria-selected='true']]:!text-white [&[aria-selected='true']]:!shadow-sm"
              >
                <span className="!leading-none !mt-[1px]">{t('screenFieldsMaster.masterData')}</span>
              </Tabs.Tab>

              {/* SCREEN FIELDS MASTER */}
              <Tabs.Tab
                icon={LayoutGrid}
                value={TAB_KEYS.SCREEN_FIELDS}
                className="!flex !items-center !gap-2 !px-6 !py-2.5 !rounded-lg !text-sm !font-semibold !transition-all !text-gray-700 hover:!bg-gray-100 hover:!text-gray-800 [&[aria-selected='true']]:!bg-blue-600 [&[aria-selected='true']]:!text-white [&[aria-selected='true']]:!shadow-sm"
              >
                <span className="!leading-none !mt-[1px]">
                  {t('screenFieldsMaster.title')}
                </span>
              </Tabs.Tab>
            </Tabs.TabList>
          </Tabs>
        </Card>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="mt-4 w-full">{children}</div>
    </PageContainer>
  );
}
