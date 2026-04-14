import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { LoginScreen } from './features/auth/LoginScreen';
import { AppLayout } from './components/layout/AppLayout';
import { HomeScreen } from './features/home/HomeScreen';
import { ScanScreen } from './features/scan/ScanScreen';
import { InsightsScreen } from './features/insights/InsightsScreen';
import { HabitsScreen } from './features/habits/HabitsScreen';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900"><div className="w-full max-w-[375px] bg-cream relative min-h-screen"><p className="p-10 text-center font-bold text-forest">Loading...</p></div></div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AppContent = () => {
    return (
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<HomeScreen />} />
            <Route path="scan" element={<ScanScreen />} />
            <Route path="insights" element={<InsightsScreen />} />
            <Route path="habits" element={<HabitsScreen />} />
          </Route>
        </Routes>
    )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
            <AppContent />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
