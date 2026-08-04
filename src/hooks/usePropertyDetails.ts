import { useState, useEffect } from 'react';
import { propertyService } from '@/services/propertyService';
import { PropertyDetails, TimelineStage, TaxComparison } from '@/types/property';

export function usePropertyDetails(propertyId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<PropertyDetails | null>(null);
  const [timeline, setTimeline] = useState<TimelineStage[]>([]);
  const [taxes, setTaxes] = useState<TaxComparison | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [detailsRes, timelineRes, taxesRes] = await Promise.all([
          propertyService.getPropertyDetails(propertyId),
          propertyService.getTimelineStages(propertyId),
          propertyService.getTaxComparison(propertyId),
        ]);
        setDetails(detailsRes);
        setTimeline(timelineRes);
        setTaxes(taxesRes);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch property details.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [propertyId]);

  const updateDetails = async (newData: Partial<PropertyDetails>) => {
    try {
      const updated = await propertyService.updatePropertyDetails(propertyId, newData);
      setDetails(updated);
      return updated;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update property details.');
    }
  };

  return { loading, error, details, timeline, taxes, updateDetails };
}
