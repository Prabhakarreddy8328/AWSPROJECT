import { useState } from 'react';
import { SimulationProvider } from './context/SimulationContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { PlantOverviewPage } from './pages/PlantOverviewPage';
import { AssetsPage } from './pages/AssetsPage';
import { AssetDetailPage } from './pages/AssetDetailPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { AlertsPage } from './pages/AlertsPage';
import { TrendsPage } from './pages/TrendsPage';
import { OutpostsEdgePage } from './pages/OutpostsEdgePage';
import { EventLogsPage } from './pages/EventLogsPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { CloudConnectivityPage } from './pages/CloudConnectivityPage';
import { PerformancePage } from './pages/PerformancePage';
import { AwsArchitecturePage } from './pages/AwsArchitecturePage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export function MainContent() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage setActiveTab={setActiveTab} />;
      case 'plant-overview':
        return <PlantOverviewPage setActiveTab={setActiveTab} />;
      case 'assets':
        return <AssetsPage setActiveTab={setActiveTab} />;
      case 'asset-detail':
        return <AssetDetailPage setActiveTab={setActiveTab} />;
      case 'live-monitoring':
        return <LiveMonitoringPage />;
      case 'alerts':
        return <AlertsPage setActiveTab={setActiveTab} />;
      case 'trends':
        return <TrendsPage />;
      case 'outposts-edge':
        return <OutpostsEdgePage />;
      case 'event-logs':
        return <EventLogsPage />;
      case 'maintenance':
        return <MaintenancePage />;
      case 'cloud-connectivity':
        return <CloudConnectivityPage />;
      case 'performance':
        return <PerformancePage />;
      case 'aws-architecture':
        return <AwsArchitecturePage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderTab()}
    </AppLayout>
  );
}

export default function App() {
  return (
    <SimulationProvider>
      <MainContent />
    </SimulationProvider>
  );
}
