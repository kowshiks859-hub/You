import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/common/MobileFrame';
import { LevelUpModal } from './components/common/LevelUpModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { LoginScreen } from './components/auth/LoginScreen';

import { DashboardPage } from './pages/DashboardPage';
import { FoodTrackerPage } from './pages/FoodTrackerPage';
import { WeeklyPlannerPage } from './pages/WeeklyPlannerPage';
import { MonthlyPlannerPage } from './pages/MonthlyPlannerPage';
import { VaultPage } from './pages/VaultPage';

const AppContent: React.FC = () => {
  const { activeTab, isAuthenticated } = useApp();

  // If not authenticated, show Spider Tracker login screen
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <MobileFrame>
      {/* Active Tab View */}
      {activeTab === 'dashboard' && <DashboardPage />}
      {activeTab === 'food' && <FoodTrackerPage />}
      {activeTab === 'planner' && <WeeklyPlannerPage />}
            {activeTab === 'monthly_planner' && <MonthlyPlannerPage />}
            {activeTab === 'vault' && <VaultPage />}

      {/* Floating AI Assistant (Movable & Expandable) */}
      
      {/* Dynamic Popups & Overlays */}
      <LevelUpModal />
            <SettingsModal />
    </MobileFrame>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
