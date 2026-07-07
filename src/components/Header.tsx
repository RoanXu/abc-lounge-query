import { Plane, Globe, MapPin, Building2 } from "lucide-react";
import { stats } from "../data";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-green-700 to-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <Plane className="w-8 h-8" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            农行机场贵宾厅查询
          </h1>
        </div>
        <p className="text-green-100 text-sm sm:text-base mb-6">
          覆盖全球机场贵宾厅信息，助您出行无忧
        </p>
        <div className="flex flex-wrap gap-3">
          <StatBadge icon={<Building2 className="w-4 h-4" />} label="境内机场" value={`${stats.domestic}个`} />
          <StatBadge icon={<Globe className="w-4 h-4" />} label="境外记录" value={`${stats.overseas}+`} />
          <StatBadge icon={<MapPin className="w-4 h-4" />} label="覆盖国家" value={`${stats.countries}个`} />
          <StatBadge icon={<Plane className="w-4 h-4" />} label="覆盖城市" value={`${stats.cities}个`} />
        </div>
      </div>
    </header>
  );
}

function StatBadge({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm">
      {icon}
      <span className="text-green-100">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
