import { useMemo } from "react";

export const useExpiredTime = (expiryDate?: string) => {
  const isExpired = useMemo(() => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  }, [expiryDate]);

  const isExpiringSoon = useMemo(() => {
    if (!expiryDate) return false;

    const daysUntilExpiry = Math.floor(
      (new Date(expiryDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  }, [expiryDate]);

  return { isExpired, isExpiringSoon };
};
