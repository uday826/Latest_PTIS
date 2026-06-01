"use client";

import { useState, useMemo } from 'react';
import type { CommercialComplexShopRow, CommercialComplexShopTableResult } from '@/types/asset-types/asset-detail-view-types/asset-detail-view-types';

export function useCommercialComplexShopTable(
  shopDetails: CommercialComplexShopRow[] | undefined
): CommercialComplexShopTableResult {
  const [shopSortColumn, setShopSortColumn] = useState<'shopNumber' | 'floor' | null>('shopNumber');
  const [shopSortDirection, setShopSortDirection] = useState<'asc' | 'desc'>('asc');
  const [shopSearchQuery, setShopSearchQuery] = useState('');
  const [selectedFloorFilter, setSelectedFloorFilter] = useState('All');
  const [currentShopPage, setCurrentShopPage] = useState(1);
  const shopsPerPage = 6;

  // Sorted shops for the shop details table
  const sortedShops = useMemo(() => {
    if (!shopDetails || shopDetails.length === 0) return [];

    const shops = [...shopDetails];

    if (!shopSortColumn) return shops;

    return shops.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      if (shopSortColumn === 'shopNumber') {
        const extractNumber = (shopNum: string) => {
          const match = shopNum.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        };

        const extractFloor = (shopNum: string) => {
          const match = shopNum.match(/^([A-Za-z]+)/);
          return match ? match[1] : '';
        };

        const aFloor = extractFloor(a.shopNumber);
        const bFloor = extractFloor(b.shopNumber);
        const aNum = extractNumber(a.shopNumber);
        const bNum = extractNumber(b.shopNumber);

        if (aFloor !== bFloor) {
          aValue = aFloor;
          bValue = bFloor;
        } else {
          aValue = aNum;
          bValue = bNum;
        }
      } else if (shopSortColumn === 'floor') {
        aValue = a.floorName || '';
        bValue = b.floorName || '';
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return shopSortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        const comparison = String(aValue).localeCompare(String(bValue));
        return shopSortDirection === 'asc' ? comparison : -comparison;
      }
    });
  }, [shopDetails, shopSortColumn, shopSortDirection]);

  const handleShopSort = (column: 'shopNumber' | 'floor') => {
    if (shopSortColumn === column) {
      setShopSortDirection(shopSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setShopSortColumn(column);
      setShopSortDirection('asc');
    }
  };

  const shopsByFloor = useMemo(() => {
    const grouped: { [key: string]: CommercialComplexShopRow[] } = {};
    sortedShops.forEach((shop: CommercialComplexShopRow) => {
      const floor = shop.floorName || 'Ground';
      if (!grouped[floor]) {
        grouped[floor] = [];
      }
      grouped[floor].push(shop);
    });
    return grouped;
  }, [sortedShops]);

  const flattenedShops = useMemo(() => {
    const flattened: CommercialComplexShopRow[] = [];
    Object.entries(shopsByFloor).forEach(([floor, shops]: [string, CommercialComplexShopRow[]]) => {
      shops.forEach((shop: CommercialComplexShopRow) => {
        flattened.push({ ...shop, floorName: floor });
      });
    });
    return flattened;
  }, [shopsByFloor]);

  const availableFloors = useMemo(() => {
    const floors = flattenedShops.map((shop: CommercialComplexShopRow) => shop.floorName);
    const uniqueFloors = Array.from(new Set(floors));

    const sortedFloors = uniqueFloors.sort((a, b) => {
      const floorOrder: { [key: string]: number } = {
        'Ground Floor': 0,
        'First Floor': 1,
        'Second Floor': 2,
        'Third Floor': 3,
        'Fourth Floor': 4,
        'Fifth Floor': 5,
        'Sixth Floor': 6,
        'Seventh Floor': 7,
        'Eighth Floor': 8,
        'Ninth Floor': 9,
        'Tenth Floor': 10,
      };

      const orderA = floorOrder[a] !== undefined ? floorOrder[a] : 999;
      const orderB = floorOrder[b] !== undefined ? floorOrder[b] : 999;

      return orderA - orderB;
    });

    return ['All', ...sortedFloors];
  }, [flattenedShops]);

  const filteredShops = useMemo(() => {
    let filtered = flattenedShops;

    if (selectedFloorFilter !== 'All') {
      filtered = filtered.filter((shop: CommercialComplexShopRow) => shop.floorName === selectedFloorFilter);
    }

    if (shopSearchQuery.trim()) {
      const query = shopSearchQuery.toLowerCase();
      filtered = filtered.filter((shop: CommercialComplexShopRow) => {
        return (
          shop.id?.toLowerCase().includes(query) ||
          shop.shopNumber?.toLowerCase().includes(query) ||
          shop.shopName?.toLowerCase().includes(query) ||
          shop.floorName?.toLowerCase().includes(query) ||
          shop.renterEnglishName?.toLowerCase().includes(query) ||
          shop.renterMobile?.includes(query) ||
          shop.occupancyStatus?.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [flattenedShops, selectedFloorFilter, shopSearchQuery]);

  const paginatedShops = useMemo(() => {
    const startIndex = (currentShopPage - 1) * shopsPerPage;
    const endIndex = startIndex + shopsPerPage;
    return filteredShops.slice(startIndex, endIndex);
  }, [filteredShops, currentShopPage, shopsPerPage]);

  const totalShopPages = Math.ceil(filteredShops.length / shopsPerPage);

  return {
    shopSortColumn,
    shopSortDirection,
    shopSearchQuery,
    setShopSearchQuery,
    selectedFloorFilter,
    setSelectedFloorFilter,
    currentShopPage,
    setCurrentShopPage,
    shopsPerPage,
    sortedShops,
    availableFloors,
    filteredShops,
    paginatedShops,
    totalShopPages,
    handleShopSort
  };
}
