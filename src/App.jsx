import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIMentorWidget } from './components/AIMentorWidget';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { LabsPage } from './pages/LabsPage';
import { AIMentorPage } from './pages/AIMentorPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { CertificatePage } from './pages/CertificatePage';
import { AdminPage } from './pages/AdminPage';

function AppContent() {
  const [activeTab, setActiveTab] = useState('landing');
  const [selectedLab, setSelectedLab] = useState(null);
  const { currentUser } = useAuth();

  const handleSelectLab = (lab) => {
    setSelectedLab(lab);
    setActiveTab('labs');
  };

  const handleAuthSuccess = () => {
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-slate-950 text-slate-100">
      <div className="scanlines-overlay" />

      <div className="relative z-10">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
          {activeTab === 'landing' && (
            <LandingPage
              onGetStarted={() => setActiveTab(currentUser ? 'dashboard' : 'auth')}
              onExploreLabs={() => setActiveTab('labs')}
            />
          )}

          {activeTab === 'auth' && (
            <AuthPage onAuthSuccess={handleAuthSuccess} />
          )}

          {activeTab === 'dashboard' && (
            <DashboardPage
              onSelectLab={handleSelectLab}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'labs' && (
            <LabsPage
              initialLab={selectedLab}
              onNavigateToMentor={() => setActiveTab('mentor')}
              onNavigateToDashboard={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'mentor' && (
            <AIMentorPage />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardPage />
          )}

          {activeTab === 'profile' && (
            <ProfilePage
              onNavigateToCertificate={() => setActiveTab('certificate')}
            />
          )}

          {activeTab === 'certificate' && (
            <CertificatePage onBack={() => setActiveTab('profile')} />
          )}

          {activeTab === 'admin' && (
            <AdminPage />
          )}
        </main>
      </div>

      <div className="relative z-50">
        <AIMentorWidget activeLab={selectedLab} />
      </div>

      <div className="relative z-10">
        <Footer setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
