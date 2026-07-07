import { useMemo } from "react";
import { Search, RotateCcw, ChevronDown } from "lucide-react";
import type { FilterState } from "../types";
import {
  regions,
  getCountriesByRegion,
  getCitiesByCountry,
  departureTypes,
  securityTypes,
} from "../data";

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export default function FilterPanel({ filters, onChange }: Props) {
  const countries = useMemo(
    () => (filters.region ? getCountriesByRegion(filters.region) : []),
    [filters.region]
  );

  const cities = useMemo(
    () =>
      filters.region && filters.country
        ? getCitiesByCountry(filters.region, filters.country)
        : [],
    [filters.region, filters.country]
  );

  function update<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    const next = { ...filters, [key]: value };
    if (key === "region") {
      next.country = "";
      next.city = "";
      next.citySearch = "";
    } else if (key === "country") {
      next.city = "";
      next.citySearch = "";
    }
    onChange(next);
  }

  function reset() {
    onChange({
      region: "", country: "", city: "", citySearch: "",
      airportCode: "", departureType: "", securityType: "",
    });
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Search className="w-5 h-5 text-green-600" />
          筛选条件
        </h2>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 transition-colors px-3 py-1.5 rounded-md hover:bg-green-50"
        >
          <RotateCcw className="w-4 h-4" />
          重置
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 mb-1">区域</label>
          <div className="relative">
            <select value={filters.region} onChange={(e) => update("region", e.target.value)}
              className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none">
              <option value="">全部区域</option>
              {regions.map((r) => (<option key={r} value={r}>{r}</option>))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 mb-1">国家</label>
          <div className="relative">
            <select value={filters.country} onChange={(e) => update("country", e.target.value)}
              disabled={!filters.region}
              className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400">
              <option value="">{filters.region ? "全部国家" : "请先选区域"}</option>
              {countries.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 mb-1">城市选择</label>
          <div className="relative">
            <select
              value={filters.city}
              onChange={(e) => {
                const val = e.target.value;
                const next = { ...filters, city: val };
                if (val) next.citySearch = "";
                onChange(next);
              }}
              disabled={!filters.country}
              className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">{filters.country ? "全部城市" : "请先选国家"}</option>
              {cities.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">城市搜索</label>
          <input
            type="text"
            value={filters.citySearch}
            onChange={(e) => {
              const val = e.target.value;
              const next = { ...filters, citySearch: val };
              if (val) next.city = "";
              onChange(next);
            }}
            placeholder="输入城市名搜索"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">机场代码</label>
          <input type="text" value={filters.airportCode}
            onChange={(e) => update("airportCode", e.target.value.toUpperCase())}
            placeholder="如: PEK, JFK"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none uppercase placeholder:normal-case" />
        </div>

        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 mb-1">出发类型</label>
          <div className="relative">
            <select value={filters.departureType} onChange={(e) => update("departureType", e.target.value)}
              className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none">
              {departureTypes.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 mb-1">安检类型</label>
          <div className="relative">
            <select value={filters.securityType} onChange={(e) => update("securityType", e.target.value)}
              className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none">
              {securityTypes.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
