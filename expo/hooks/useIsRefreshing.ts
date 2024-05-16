import { useCallback, useState } from "react";

export function useIsRefreshing(refetch: () => Promise<any>): [() => void, boolean] {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  return [refresh, isRefreshing];
}
