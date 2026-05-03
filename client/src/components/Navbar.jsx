import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Bell, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="text-xl font-bold text-indigo-600 tracking-tight">
          IntelliTask<span className="text-gray-900"></span>
        </Link>
        
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-gray-500 hover:text-indigo-600 transition-colors relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-none">{user?.displayName}</p>
            <p className="text-[11px] text-gray-500 font-medium uppercase mt-1">{user?.role}</p>
          </div>
          <img 
            src={user?.photoURL || 'https://via.placeholder.com/40'} 
            className="w-9 h-9 rounded-full border border-gray-200"
            alt="profile"
          />
          <button 
            onClick={logout}
            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;