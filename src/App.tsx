import { useState, useMemo } from "react";
import type { FilterState } from "./types";
import { allRecords } from "./data";
import Header from "./components/Header";
import FilterPanel from "./components/FilterPanel";
import Results from "./components/Results";
import Footer from "./components/Footer";

export default function App() {
  const [filters, setFilters] = useState<FilterState>({
    region: "",
    country: "",
    city: "",
    citySearch: "",
    airportCode: "",
    departureType: "",
    securityType: "",
  });

  const filteredRecords = useMemo(() => {
    return allRecords.filter((r) => {
      if (filters.region && r.region !== filters.region) return false;
      if (filters.country && r.country !== filters.country) return false;

      // City: dropdown exact match OR text fuzzy match
      if (filters.city) {
        if (r.city !== filters.city) return false;
      } else if (filters.citySearch) {
        const search = filters.citySearch.toLowerCase();
        if (!r.city.toLowerCase().includes(search) &&
            !r.airportName.toLowerCase().includes(search)) return false;
      }

      if (filters.airportCode) {
        const code = filters.airportCode.toUpperCase();
        if (!r.airportCode.toUpperCase().includes(code) &&
            !r.airportName.toUpperCase().includes(code)) return false;
      }

      if (filters.departureType) {
        if (!r.departureType.includes(filters.departureType)) return false;
      }

      if (filters.securityType) {
        if (r.securityType !== filters.securityType) return false;
      }

      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <FilterPanel filters={filters} onChange={setFilters} />
        <Results records={filteredRecords} />
      </main>
      <Footer />
    </div>
  );
}
