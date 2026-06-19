import { useCallback, useEffect, useState } from 'react';
import { getLeaseRentDemandsAction } from '@/app/[locale]/assets/revenue/payment/details/[recordId]/make-payment/actions';
import type { LeaseRentDemandItem } from '@/types/asset/leaseRentPayment.types';

interface UseLeaseRentDemandsState {
  demands: LeaseRentDemandItem[];
  isLoading: boolean;
  error: string | null;
}

interface UseLeaseRentDemandsResult extends UseLeaseRentDemandsState {
  refetch: () => Promise<void>;
}

/**
 * Fetches the Lease Rent Demand master table for a given lease id via a server action.
 *
 * The shape of the response is a flat list of period rows with the columns
 * `month`, `rent`, `penalty`, `gst` and `total`. This hook is consumed by the
 * Make Payment period drawer to render a master-table view and allow the
 * user to select one or more periods for the upcoming payment.
 */
export function useLeaseRentDemands(
  leaseId: number | string | null | undefined,
  financeYear?: number | string | null
): UseLeaseRentDemandsResult {
  const [state, setState] = useState<UseLeaseRentDemandsState>({
    demands: [],
    isLoading: false,
    error: null,
  });

  const loadDemands = useCallback(async () => {
    if (leaseId == null || leaseId === '') {
      setState({ demands: [], isLoading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await getLeaseRentDemandsAction(
      leaseId,
      financeYear ?? undefined
    );

    if (!result.success) {
      setState({
        demands: [],
        isLoading: false,
        error: result.error || 'Failed to fetch lease rent demands.',
      });
      return;
    }

    setState({ demands: result.data, isLoading: false, error: null });
  }, [leaseId, financeYear]);

  useEffect(() => {
    void loadDemands();
  }, [loadDemands]);

  return { ...state, refetch: loadDemands };
}
