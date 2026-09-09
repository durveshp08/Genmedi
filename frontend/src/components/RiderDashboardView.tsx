import React, { useState, useEffect } from "react";
import {
  Truck,
  MapPin,
  Clock,
  Battery,
  Thermometer,
  CheckCircle2,
  XCircle,
  User,
  Phone,
  Star,
  Package,
  Zap,
  Activity,
  RefreshCw,
  MoreVertical,
  Filter,
  Coffee,
} from "lucide-react";
import { api } from "../services/api";

interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  vehicleNumber: string;
  status: "active" | "idle" | "offline" | "break";
  currentOrderId: string | null;
  rating: number;
  completedOrders: number;
  hubId: string;
  lastLocation: { lat: number; lng: number };
  batteryLevel?: number;
  temperature?: number;
}

export const RiderDashboardView: React.FC = () => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "idle">("all");

  useEffect(() => {
    loadRiders();
  }, []);

  const loadRiders = async () => {
    try {
      const response = await api.riders.list();
      setRiders(response.data);
    } catch (err) {
      console.error("Failed to load riders:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRiders = riders.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700";
      case "idle":
        return "bg-blue-100 text-blue-700";
      case "offline":
        return "bg-gray-100 text-gray-700";
      case "break":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return Activity;
      case "idle":
        return Clock;
      case "offline":
        return XCircle;
      case "break":
        return Coffee;
      default:
        return Activity;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-[#131b2e] text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#006a61] text-white">
              <Truck className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold text-[#86f2e4] uppercase tracking-wider">
              FLEET MANAGEMENT
            </span>
          </div>
          <h2 className="text-lg font-bold mt-1 text-white">Rider Dashboard</h2>
          <p className="text-xs text-white/70">
            Monitor fleet status, assign orders, and track delivery performance
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 px-4 py-2 rounded-xl text-xs font-mono">
          <div>
            <span className="text-white/60">Total Riders: </span>
            <strong className="text-[#86f2e4]">{riders.length}</strong>
          </div>
          <span className="text-white/30">|</span>
          <div>
            <span className="text-white/60">Active: </span>
            <strong className="text-emerald-400">{riders.filter((r) => r.status === "active").length}</strong>
          </div>
          <span className="text-white/30">|</span>
          <div>
            <span className="text-white/60">Idle: </span>
            <strong className="text-blue-400">{riders.filter((r) => r.status === "idle").length}</strong>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === "all" ? "bg-[#006a61] text-white" : "bg-white text-[#45464d] border border-[#e5eeff]"
          }`}
        >
          All Riders
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === "active" ? "bg-[#006a61] text-white" : "bg-white text-[#45464d] border border-[#e5eeff]"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("idle")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === "idle" ? "bg-[#006a61] text-white" : "bg-white text-[#45464d] border border-[#e5eeff]"
          }`}
        >
          Idle
        </button>
        <button
          onClick={loadRiders}
          className="ml-auto p-2 rounded-lg bg-white border border-[#e5eeff] hover:bg-[#f8f9ff] transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-[#45464d]" />
        </button>
      </div>

      {/* Riders Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-[#76777d]">Loading riders...</div>
      ) : filteredRiders.length === 0 ? (
        <div className="text-center py-12 text-xs text-[#76777d]">No riders found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRiders.map((rider) => {
            const StatusIcon = getStatusIcon(rider.status);
            return (
              <div
                key={rider.id}
                className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#006a61] to-[#86f2e4] flex items-center justify-center text-white font-bold text-sm">
                      {rider.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#0b1c30]">{rider.name}</div>
                      <div className="text-[10px] text-[#76777d]">{rider.vehicle}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(rider.status)} flex items-center gap-1`}>
                    <StatusIcon className="w-3 h-3" /> {rider.status}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[#f8f9ff] rounded-lg p-2">
                    <div className="text-[10px] text-[#76777d]">Rating</div>
                    <div className="font-bold text-sm text-[#0b1c30] flex items-center justify-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-current" /> {rider.rating}
                    </div>
                  </div>
                  <div className="bg-[#f8f9ff] rounded-lg p-2">
                    <div className="text-[10px] text-[#76777d]">Completed</div>
                    <div className="font-bold text-sm text-[#0b1c30]">{rider.completedOrders}</div>
                  </div>
                  <div className="bg-[#f8f9ff] rounded-lg p-2">
                    <div className="text-[10px] text-[#76777d]">Vehicle</div>
                    <div className="font-bold text-[10px] text-[#0b1c30]">{rider.vehicleNumber}</div>
                  </div>
                </div>

                {/* Current Order */}
                {rider.currentOrderId ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1">
                      <Package className="w-3.5 h-3.5" /> Current Order
                    </div>
                    <div className="text-[10px] text-emerald-800 font-mono">{rider.currentOrderId}</div>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                      <Clock className="w-3.5 h-3.5" /> Available for Assignment
                    </div>
                  </div>
                )}

                {/* Telemetry */}
                {rider.batteryLevel !== undefined && rider.temperature !== undefined && (
                  <div className="flex items-center gap-4 text-[10px] text-[#76777d]">
                    <div className="flex items-center gap-1">
                      <Battery className="w-3.5 h-3.5" /> {rider.batteryLevel}%
                    </div>
                    <div className="flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5" /> {rider.temperature}°C
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-lg bg-[#006a61] text-white text-xs font-semibold hover:bg-[#005049] transition-colors flex items-center justify-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Track
                  </button>
                  <button className="flex-1 py-2 rounded-lg border border-[#e5eeff] text-[#45464d] text-xs font-semibold hover:bg-[#f8f9ff] transition-colors flex items-center justify-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Call
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
