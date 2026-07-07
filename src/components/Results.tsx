import { useMemo } from "react";
import {
  MapPin, Plane, Building, Navigation,
  Shield, ShieldCheck, Users, UserX, Baby,
  AlertCircle, Clock, Inbox,
} from "lucide-react";
import type { LoungeRecord } from "../types";

interface Props {
  records: LoungeRecord[];
}

export default function Results({ records }: Props) {
  const domestic = useMemo(() => records.filter((r) => r.type === "domestic"), [records]);
  const overseas = useMemo(() => records.filter((r) => r.type === "overseas"), [records]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          共找到 <span className="font-semibold text-green-700">{records.length}</span> 条记录
          {domestic.length > 0 && <span className="ml-2">（境内 <span className="font-medium">{domestic.length}</span> 条</span>}
          {overseas.length > 0 && <span className={domestic.length > 0 ? "" : " ml-2"}>{domestic.length > 0 ? "，" : "（"}境外 <span className="font-medium">{overseas.length}</span> 条）</span>}
        </p>
      </div>

      {records.length === 0 && (
        <div className="text-center py-16">
          <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">未找到匹配的贵宾厅记录</p>
          <p className="text-gray-400 text-sm mt-1">请尝试调整筛选条件</p>
        </div>
      )}

      {domestic.length > 0 && (
        <section>
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-green-600 rounded-full" />
            境内贵宾厅
            <span className="text-sm font-normal text-gray-500">({domestic.length})</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {domestic.map((r) => (<DomesticCard key={r.id} record={r} />))}
          </div>
        </section>
      )}

      {overseas.length > 0 && (
        <section>
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-blue-500 rounded-full" />
            境外贵宾厅
            <span className="text-sm font-normal text-gray-500">({overseas.length})</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {overseas.map((r) => (<OverseasCard key={r.id} record={r} />))}
          </div>
        </section>
      )}
    </div>
  );
}

function DomesticCard({ record }: { record: LoungeRecord }) {
  const bookingTag = getBookingTag(record.needsBooking || "");
  const guestTag = getGuestTag(record.guestPolicy || "");
  return (
    <div className="lounge-card-domestic p-4">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 text-base leading-tight">{record.airportName}</h4>
      </div>
      {record.city && (
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <MapPin className="w-3.5 h-3.5" />{record.city}
        </div>
      )}
      <div className="flex flex-wrap gap-2 mt-3">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${bookingTag.className}`}>
          {bookingTag.icon}{record.needsBooking}{record.advanceBooking ? `（${record.advanceBooking}）` : ""}
        </span>
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${guestTag.className}`}>
          {guestTag.icon}{record.guestPolicy}
        </span>
      </div>
    </div>
  );
}

function OverseasCard({ record }: { record: LoungeRecord }) {
  const depTypes = record.departureType ? record.departureType.split(",").map((s) => s.trim()) : [];
  return (
    <div className="lounge-card-overseas p-4">
      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1.5 flex-wrap">
        <span>{record.region}</span><span>/</span><span>{record.country}</span>
        {record.city && <><span>/</span><span>{record.city}</span></>}
      </div>
      <div className="flex items-center gap-2 mb-1">
        <Plane className="w-4 h-4 text-blue-500 flex-shrink-0" />
        <h4 className="font-semibold text-gray-900 text-base">
          {record.airportName}
          {record.airportCode && <span className="ml-1.5 text-sm font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{record.airportCode}</span>}
        </h4>
      </div>
      {record.terminal && <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2 ml-6"><Building className="w-3.5 h-3.5 text-gray-400" />{record.terminal}</div>}
      {record.loungeName && <div className="text-sm font-medium text-gray-800 mb-2 ml-6">{record.loungeName}</div>}
      <div className="flex flex-wrap gap-1.5 mb-2 ml-6">
        {depTypes.map((dt) => (
          <span key={dt} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded"><Navigation className="w-3 h-3" />{dt}</span>
        ))}
        {record.securityType && (
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ${record.securityType === "安检前" ? "bg-orange-50 text-orange-700" : "bg-green-50 text-green-700"}`}>
            {record.securityType === "安检前" ? <Shield className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}{record.securityType}
          </span>
        )}
      </div>
      {record.locationGuide && (
        <div className="flex items-start gap-1.5 text-xs text-gray-500 ml-6 mt-1">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-3">{record.locationGuide}</span>
        </div>
      )}
    </div>
  );
}

function getBookingTag(needsBooking: string) {
  if (needsBooking === "无需预约") return { className: "bg-green-50 text-green-700", icon: <ShieldCheck className="w-3 h-3" /> };
  if (needsBooking === "需要预约") return { className: "bg-orange-50 text-orange-700", icon: <Clock className="w-3 h-3" /> };
  return { className: "bg-gray-100 text-gray-600", icon: <AlertCircle className="w-3 h-3" /> };
}

function getGuestTag(guestPolicy: string) {
  if (guestPolicy === "不可携伴" || guestPolicy.includes("不可携带")) return { className: "bg-red-50 text-red-700", icon: <UserX className="w-3 h-3" /> };
  if (guestPolicy.includes("扣减")) return { className: "bg-orange-50 text-orange-700", icon: <AlertCircle className="w-3 h-3" /> };
  if (guestPolicy.includes("儿童")) return { className: "bg-blue-50 text-blue-700", icon: <Baby className="w-3 h-3" /> };
  if (guestPolicy.includes("可携伴")) return { className: "bg-green-50 text-green-700", icon: <Users className="w-3 h-3" /> };
  return { className: "bg-gray-100 text-gray-600", icon: <AlertCircle className="w-3 h-3" /> };
}
