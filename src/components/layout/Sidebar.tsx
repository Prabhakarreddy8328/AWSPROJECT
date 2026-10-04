import React from 'react';
import {
  LayoutDashboard, Network, Boxes, Activity, ShieldAlert, TrendingUp, Cpu, FileText,
  Wrench, Cloud, Gauge, Layers, FileSpreadsheet, Settings, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  critical?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
  const { alerts } = useSimulation();
  const activeAlertsCount = alerts.filter((a) => a.status === 'Active').length;
  const criticalAlertsCount = alerts.filter((a) => a.status === 'Active' && a.severity === 'Critical').length;

  const groups: { title: string; items: NavItem[] }[] = [
    {
      title: 'Monitor',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'plant-overview', label: 'Plant Overview', icon: Network },
        { id: 'assets', label: 'Assets', icon: Boxes },
        { id: 'live-monitoring', label: 'Live Monitoring', icon: Activity },
        { id: 'alerts', label: 'Alerts', icon: ShieldAlert, badge: activeAlertsCount, critical: criticalAlertsCount > 0 },
      ],
    },
    {
      title: 'Analyze',
      items: [
        { id: 'trends', label: 'Trends & Analytics', icon: TrendingUp },
        { id: 'performance', label: 'Performance', icon: Gauge },
        { id: 'event-logs', label: 'Event Logs', icon: FileText },
        { id: 'maintenance', label: 'Maintenance', icon: Wrench },
        { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
      ],
    },
    {
      title: 'Infrastructure',
      items: [
        { id: 'outposts-edge', label: 'Outposts / Edge', icon: Cpu },
        { id: 'cloud-connectivity', label: 'Cloud Connectivity', icon: Cloud },
        { id: 'aws-architecture', label: 'Architecture', icon: Layers },
      ],
    },
  ];

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id || (item.id === 'assets' && activeTab === 'asset-detail');
    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        title={collapsed ? item.label : undefined}
        className={`relative w-full flex items-center gap-3 h-9 px-3 rounded-md text-sm transition-colors ${
          isActive ? 'bg-blue-50 text-cyan-300 font-medium' : 'text-slate-300 hover:bg-slate-950 hover:text-slate-100'
        }`}
      >
        {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded bg-cyan-500" />}
        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
        {!collapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
        {!collapsed && item.badge !== undefined && item.badge > 0 && (
          <span
            className={`px-1.5 min-w-5 h-5 inline-flex items-center justify-center rounded-full text-[11px] font-semibold ${
              item.critical ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 transition-[width] duration-200 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-5">
        {groups.map((g) => (
          <div key={g.title} className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">{g.title}</div>
            )}
            {g.items.map(renderItem)}
          </div>
        ))}
        <div className="pt-1 border-t border-slate-800">
          <div className="pt-3">{renderItem({ id: 'settings', label: 'Settings', icon: Settings })}</div>
        </div>
      </nav>

      <div className="border-t border-slate-800 p-3 space-y-3">
        {!collapsed && (
          <div className="text-xs space-y-0.5">
            <div className="flex items-center gap-1.5 font-medium text-slate-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Outposts rack active
            </div>
            <div className="font-mono text-[11px] text-slate-500">op-0a82f941c9b2</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center h-8 rounded-md text-slate-500 hover:bg-slate-950 hover:text-slate-100 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
