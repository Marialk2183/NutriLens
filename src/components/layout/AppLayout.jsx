import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Camera, PieChart, CheckSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AIChatbot } from '../common/AIChatbot';

export const AppLayout = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex bg-gray-900 min-h-screen relative w-full overflow-hidden">
      {/* Animated Background Environment */}
      <div className="bg-blobs bg-white">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="flex w-full min-h-screen bg-transparent relative z-10 flex-col md:flex-row">
        
        {/* Mobile Top Header */}
        <div className="md:hidden w-full h-14 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 z-50 shrink-0">
           <h1 className="font-bold text-forest h-full flex items-center">NutriLens</h1>
           {user?.photoURL && <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-gray-200" />}
        </div>

        {/* Desktop Sidebar Navigation */}
        <div className="hidden md:flex w-64 border-r border-white/40 bg-white/50 backdrop-blur-xl flex-col p-6 z-50 h-[100vh] shrink-0">
          <div className="mb-10 flex items-center gap-3">
             <div className="w-10 h-10 bg-forest rounded-xl flex items-center justify-center shadow-lg rotate-3">
                <span className="text-xl text-white font-bold">N</span>
             </div>
             <h2 className="font-bold text-2xl text-forest">NutriLens</h2>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <NavItem to="/home" icon={<Home size={22} />} label="Dashboard" desktop />
            <NavItem to="/scan" icon={<Camera size={22} />} label="Scan Meal" desktop />
            <NavItem to="/insights" icon={<PieChart size={22} />} label="Insights" desktop />
            <NavItem to="/habits" icon={<CheckSquare size={22} />} label="Habits" desktop />
          </div>

          <div className="mt-auto pt-6 border-t border-gray-200/50 flex items-center gap-3">
             {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover shadow-sm bg-gray-100" />
            ) : (
                <div className="w-10 h-10 flex items-center justify-center bg-forest text-white rounded-full">
                  {user?.displayName?.[0] || 'U'}
                </div>
            )}
             <div className="overflow-hidden">
                <p className="font-semibold text-sm text-forest truncate w-full">{user?.displayName || 'Welcome'}</p>
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto w-full h-[calc(100vh-56px-64px)] md:h-[100vh] pb-24 md:pb-10 no-scrollbar relative z-10 w-full max-w-7xl mx-auto container order-1">
          <Outlet />
        </div>
        
        {/* Mobile Bottom Navigation */}
        <div className="md:hidden w-full h-16 bg-white/80 backdrop-blur-md border-t border-gray-100 flex items-center justify-around z-50 shrink-0 order-2">
          <NavItem to="/home" icon={<Home size={24} />} label="Home" />
          <NavItem to="/scan" icon={<Camera size={24} />} label="Scan" />
          <NavItem to="/insights" icon={<PieChart size={24} />} label="Insights" />
          <NavItem to="/habits" icon={<CheckSquare size={24} />} label="Habits" />
        </div>
      </div>
      
      <AIChatbot />
    </div>
  );
};

const NavItem = ({ to, icon, label, desktop }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        transition-all font-medium 
        ${desktop ? 'flex items-center gap-3 p-3 rounded-xl hover:bg-white/80' : 'flex flex-col items-center justify-center p-2 flex-1 w-full'}
        ${isActive ? (desktop ? 'bg-white shadow-[0_4px_12px_rgba(27,67,50,0.06)] text-forest border border-white/50' : 'text-forest') : 'text-gray-400'}
      `}
    >
      {icon}
      <span className={desktop ? 'text-sm' : 'text-[10px] mt-1'}>{label}</span>
    </NavLink>
  );
};
