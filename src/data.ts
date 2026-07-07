import type { LoungeRecord } from "./types";

// @ts-ignore
import loungeJson from "../public/data/lounges.json";

export const allRecords: LoungeRecord[] = loungeJson as LoungeRecord[];

// Build cascade data: region -> country -> city[]
export function buildCascadeData(records: LoungeRecord[]) {
  const map: Record<string, Record<string, string[]>> = {};

  for (const r of records) {
    const region = r.region || "未知区域";
    const country = r.country || "未知国家";
    const city = r.city || "未知城市";

    if (!map[region]) map[region] = {};
    if (!map[region][country]) map[region][country] = [];
    if (!map[region][country].includes(city)) {
      map[region][country].push(city);
    }
  }

  // Sort
  for (const region of Object.keys(map)) {
    for (const country of Object.keys(map[region])) {
      map[region][country].sort((a, b) => a.localeCompare(b, "zh"));
    }
  }

  return map;
}

export const cascadeData = buildCascadeData(allRecords);

export const regions = Object.keys(cascadeData).sort((a, b) => {
  // 中国排第一
  if (a === "中国") return -1;
  if (b === "中国") return 1;
  return a.localeCompare(b, "zh");
});

export function getCountriesByRegion(region: string): string[] {
  if (!region || !cascadeData[region]) return [];
  return Object.keys(cascadeData[region]).sort((a, b) => a.localeCompare(b, "zh"));
}

export function getCitiesByCountry(region: string, country: string): string[] {
  if (!region || !country || !cascadeData[region] || !cascadeData[region][country]) return [];
  return cascadeData[region][country];
}

// Stats
export const stats = {
  total: allRecords.length,
  domestic: allRecords.filter((r) => r.type === "domestic").length,
  overseas: allRecords.filter((r) => r.type === "overseas").length,
  regions: regions.length,
  countries: new Set(allRecords.map((r) => r.country)).size,
  cities: new Set(allRecords.map((r) => r.city)).size,
};

// Departure type options
export const departureTypes = [
  { value: "", label: "全部" },
  { value: "国际出发", label: "国际出发" },
  { value: "国内出发", label: "国内出发" },
  { value: "国内到达", label: "国内到达" },
  { value: "国际到达", label: "国际到达" },
  { value: "国内中转", label: "国内中转" },
  { value: "国际中转", label: "国际中转" },
];

// Security type options
export const securityTypes = [
  { value: "", label: "全部" },
  { value: "安检前", label: "安检前" },
  { value: "安检后", label: "安检后" },
];
