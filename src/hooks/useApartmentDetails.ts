import { useState, useEffect } from 'react';
import { apartmentService } from '@/services/apartmentService';
import { SocietyDetails, WingDetailsDTO, ComparisonRowDTO, AddWingPayload } from '@/types/apartment';

export function useApartmentDetails(apartmentId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [society, setSociety] = useState<SocietyDetails | null>(null);
  const [wings, setWings] = useState<WingDetailsDTO[]>([]);
  const [rows, setRows] = useState<ComparisonRowDTO[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [societyRes, wingsRes, rowsRes] = await Promise.all([
          apartmentService.getSocietyDetails(apartmentId),
          apartmentService.getWingsList(apartmentId),
          apartmentService.getComparisonRows('all-wings'),
        ]);
        setSociety(societyRes);
        setWings(wingsRes);
        setRows(rowsRes);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch apartment details.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [apartmentId]);

  const loadComparison = async (wingId: string) => {
    try {
      const rowsRes = await apartmentService.getComparisonRows(wingId);
      setRows(rowsRes);
    } catch (err: any) {
      setError(err.message || 'Failed to reload comparison tables.');
    }
  };

  const createWing = async (payload: AddWingPayload) => {
    try {
      const newWing = await apartmentService.addWing(apartmentId, payload);
      setWings(prev => [...prev, newWing]);
      return newWing;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create wing.');
    }
  };

  return { loading, error, society, wings, rows, loadComparison, createWing };
}
