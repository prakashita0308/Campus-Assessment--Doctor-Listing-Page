import { useCallback } from "react";
import { useLocation } from "wouter";
import { DoctorFilterState, ConsultationType } from "@/types/doctor";

export function useQueryParams(): [
  DoctorFilterState,
  (updates: Partial<DoctorFilterState>) => void
] {
  const [location, setLocation] = useLocation();
  const search = location.includes('?') ? location.substring(location.indexOf('?')) : '';
  const params = new URLSearchParams(search);

  // Parse current query parameters
  const filterState: DoctorFilterState = {
    search: params.get("search") || "",
    specialties: params.get("specialties") ? params.get("specialties")!.split(",") : [],
    consultationType: params.get("consultationType") === ConsultationType.VIDEO
      ? ConsultationType.VIDEO
      : params.get("consultationType") === ConsultationType.IN_CLINIC
        ? ConsultationType.IN_CLINIC
        : "",
    sortBy: (params.get("sortBy") as "fees" | "experience" | "") || "",
  };

  // Update query parameters
  const updateQueryParams = useCallback(
    (updates: Partial<DoctorFilterState>) => {
      const currentParams = new URLSearchParams(search);

      // Update parameters
      Object.entries(updates).forEach(([key, value]) => {
        if (key === "specialties" && Array.isArray(value)) {
          if (value.length > 0) {
            currentParams.set(key, value.join(","));
          } else {
            currentParams.delete(key);
          }
        } else if (value) {
          currentParams.set(key, String(value));
        } else {
          currentParams.delete(key);
        }
      });

      // Update URL
      const newSearch = currentParams.toString();
      const newPath = location.split("?")[0] + (newSearch ? `?${newSearch}` : "");
      setLocation(newPath);
    },
    [location, search, setLocation]
  );

  return [filterState, updateQueryParams];
}
