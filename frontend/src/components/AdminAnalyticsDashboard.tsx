import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Calendar,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";

export const AdminAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  const metrics = {
    totalOrders: 1247,
    totalRevenue: 894500,
    activeUsers: 3421,
    avgDeliveryTime: 42,
    orderCompletionRate: 94.5,
    riderUtilization: 78,
    prescriptionVerificationRate: 98.2,
  };

  const trends = {
    orders: { value: 12.5, positive: true },
    revenue: { value: 18.2, positive: true },
    users: { value: 8.7, positive: true },
    deliveryTime: { value: 5.3, positive: false },
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-[#131b2e] text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#006a61] text-white">
              <BarChart3 className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold text-[#86f2e4] uppercase tracking-wider">
              ANALYTICS & REPORTING
            </span>
          </div>
          <h2 className="text-lg font-bold mt-1 text-white">Admin Dashboard</h2>
          <p className="text-xs text-white/70">
            Real-time metrics, performance tracking, and operational insights
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 rounded-lg bg-white/10 text-white text-xs border border-white/20 focus:outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <RefreshCw className="w-4 h-4 text-white" />
          </button>
          <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <Download className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Orders"
          value={metrics.totalOrders.toLocaleString()}
          trend={trends.orders}
          icon={Package}
          color="blue"
        />
        <MetricCard
          title="Total Revenue"
          value={`₹${(metrics.totalRevenue / 1000).toFixed(0)}K`}
          trend={trends.revenue}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Active Users"
          value={metrics.activeUsers.toLocaleString()}
          trend={trends.users}
          icon={Users}
          color="purple"
        />
        <MetricCard
          title="Avg Delivery Time"
          value={`${metrics.avgDeliveryTime} min`}
          trend={trends.deliveryTime}
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs">
          <h3 className="font-bold text-sm text-[#0b1c30] mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#006a61]" /> Performance Metrics
          </h3>
          <div className="space-y-4">
            <ProgressBar label="Order Completion Rate" value={metrics.orderCompletionRate} color="emerald" />
            <ProgressBar label="Rider Utilization" value={metrics.riderUtilization} color="blue" />
            <ProgressBar label="Rx Verification Rate" value={metrics.prescriptionVerificationRate} color="purple" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs">
          <h3 className="font-bold text-sm text-[#0b1c30] mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#006a61]" /> Alerts & Exceptions
          </h3>
          <div className="space-y-3">
            <AlertItem type="critical" count={3} message="Cold chain temperature breaches" />
            <AlertItem type="warning" count={12} message="Delayed deliveries (>45 min)" />
            <AlertItem type="info" count={5} message="Pending pharmacist verifications" />
            <AlertItem type="success" count={894} message="Successful deliveries today" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs">
        <h3 className="font-bold text-sm text-[#0b1c30] mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <ActivityItem
            time="2 min ago"
            action="Order #GM-12345 delivered"
            status="success"
            details="45-min delivery completed successfully"
          />
          <ActivityItem
            time="5 min ago"
            action="New prescription uploaded"
            status="info"
            details="Dr. Sharma - Patient ID: PT-4521"
          />
          <ActivityItem
            time="12 min ago"
            action="Payment received"
            status="success"
            details="₹1,245 - Order #GM-12344"
          />
          <ActivityItem
            time="18 min ago"
            action="Rider assigned"
            status="info"
            details="Ramesh Kumar assigned to Order #GM-12346"
          />
          <ActivityItem
            time="25 min ago"
            action="Cold chain alert"
            status="warning"
            details="Temperature deviation detected - Rider #2"
          />
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string;
  trend: { value: number; positive: boolean };
  icon: any;
  color: string;
}> = ({ title, value, trend, icon: Icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    purple: "bg-purple-100 text-purple-700",
    amber: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="bg-white rounded-2xl border border-[#dce9ff] p-4 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-semibold ${trend.positive ? "text-emerald-600" : "text-red-600"}`}>
          {trend.positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {trend.value}%
        </div>
      </div>
      <div className="text-2xl font-bold text-[#0b1c30]">{value}</div>
      <div className="text-[10px] text-[#76777d]">{title}</div>
    </div>
  );
};

const ProgressBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
  const colorClasses = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
  };

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[#45464d]">{label}</span>
        <span className="font-semibold text-[#0b1c30]">{value}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color as keyof typeof colorClasses]} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

const AlertItem: React.FC<{ type: string; count: number; message: string }> = ({ type, count, message }) => {
  const typeStyles = {
    critical: "bg-red-50 border-red-200 text-red-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
    info: "bg-blue-50 border-blue-200 text-blue-900",
    success: "bg-emerald-50 border-emerald-200 text-emerald-900",
  };

  const icons = {
    critical: AlertCircle,
    warning: AlertCircle,
    info: Clock,
    success: CheckCircle2,
  };

  const Icon = icons[type as keyof typeof icons];

  return (
    <div className={`p-3 rounded-lg border ${typeStyles[type as keyof typeof typeStyles]} flex items-center gap-3`}>
      <Icon className="w-4 h-4 shrink-0" />
      <div className="flex-1">
        <div className="text-xs font-semibold">{message}</div>
        <div className="text-[10px] opacity-75">{count} items</div>
      </div>
    </div>
  );
};

const ActivityItem: React.FC<{ time: string; action: string; status: string; details: string }> = ({
  time,
  action,
  status,
  details,
}) => {
  const statusStyles = {
    success: "bg-emerald-100 text-emerald-700",
    info: "bg-blue-100 text-blue-700",
    warning: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f8f9ff]">
      <div className="text-[10px] text-[#76777d] whitespace-nowrap">{time}</div>
      <div className="flex-1">
        <div className="text-xs font-semibold text-[#0b1c30]">{action}</div>
        <div className="text-[10px] text-[#45464d]">{details}</div>
      </div>
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status}
      </span>
    </div>
  );
};
