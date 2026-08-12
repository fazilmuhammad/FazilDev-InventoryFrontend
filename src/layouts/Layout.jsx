import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { WidgetLinear, BoxLinear, BuildingsLinear, TagLinear, Logout3Linear, HamburgerMenuLinear, CloseCircleLinear, ArrowLeftLinear, ArrowRightLinear, UserCircleLinear, AltArrowDownLinear, SunLinear, MoonLinear, DangerCircleLinear, CheckCircleLinear, InfoCircleLinear } from 'solar-icon-set';
import { Toaster, resolveValue, toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <WidgetLinear size={20} /> },
    { name: 'Products', path: '/products', icon: <BoxLinear size={20} /> },
    { name: 'Categories', path: '/categories', icon: <TagLinear size={20} /> },
  ];

  return (
    <>
      
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      <aside
        className={`fixed md:fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'
        } bg-white dark:bg-[#1a1d24] border-r border-gray-200 dark:border-gray-800 flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center gap-3 text-primary dark:text-white">
            <BuildingsLinear size={24} className="flex-shrink-0" />
            <h1 className={`text-xl font-bold whitespace-nowrap transition-opacity duration-300 hidden md:block ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
              Eureka-Inventory
            </h1>
          </div>
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 md:hidden flex-shrink-0">
            <CloseCircleLinear size={20} />
          </button>
        </div>

        <nav className="flex-1 px-0 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 transition-all duration-200 ${isActive(item.path)
                  ? 'border-l-4 border-primary text-primary dark:text-white font-semibold bg-gray-50 dark:bg-gray-800'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white border-l-4 border-transparent'
                }`}
              title={!isOpen ? item.name : ''}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <span className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden md:block md:w-0'}`}>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={toggleSidebar}
            className="flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors w-full hover:bg-gray-100 dark:hover:bg-gray-800"
            title={!isOpen ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <div className="flex-shrink-0">
              {isOpen ? <ArrowLeftLinear size={20} /> : <ArrowRightLinear size={20} />}
            </div>
            <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden md:block md:w-0'}`}>
              Collapse Sidebar
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-[#0f1115] font-sans text-gray-900 dark:text-gray-100 flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className={`flex-1 flex flex-col min-w-0 h-screen transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <header className="h-16 flex-shrink-0 bg-white dark:bg-[#1a1d24] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 z-10 transition-colors">
        
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 transition-colors md:hidden"
          >
            <HamburgerMenuLinear size={24} />
          </button>
          <div className="flex-1 md:hidden"></div> 
          
          <div className="flex-1 hidden md:block"></div> 

          <div className="flex items-center gap-3 relative">
           
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <SunLinear size={20} /> : <MoonLinear size={20} />}
            </button>
            
            <button
              onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
              onBlur={() => setTimeout(() => setAvatarDropdownOpen(false), 150)}
              className="flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 p-1 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded-full"
            >
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm overflow-hidden">
                {user?.avatar ? (
                  <img src={`http://localhost:3000${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserCircleLinear size={18} />
                )}
              </div>
            </button>
            
            {avatarDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50 py-1">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.username || 'User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user?.position}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
                </div>
                <button
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                  onClick={handleLogout}
                >
                  <Logout3Linear size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 w-full min-w-0 overflow-y-auto overflow-x-hidden">
          <div className="w-full bg-white dark:bg-[#1a1d24] p-4 md:p-8 border border-gray-200 dark:border-gray-800 min-h-full transition-colors">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
