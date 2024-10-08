'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChartBar, FaCar, FaCalendarAlt, FaFileImport, FaFileExport, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Sidebar(): JSX.Element {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/50' : '';
  };

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: FaChartBar },
    { href: '/vehicles', label: 'Vehicles', icon: FaCar },
    { href: '/bookings', label: 'Bookings', icon: FaCalendarAlt },
    { href: '/import', label: 'Import', icon: FaFileImport },
    { href: '/export', label: 'Export', icon: FaFileExport },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100 h-screen overflow-hidden shadow-xl transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className={`${isCollapsed ? 'pt-16 px-2':'p-5'} relative h-full`}>
        <button
          onClick={toggleSidebar}
          className="absolute top-3 right-4 text-purple-400 hover:text-pink-500 transition-colors duration-300"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
        <div className={` ${isCollapsed ? 'hidden ' : 'block'}`}>
          <h2 className="flex justify-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">Admin </h2>
        </div>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ease-in-out 
                            ${isActive(item.href)}
                            hover:bg-gray-800 hover:shadow-md hover:shadow-purple-500/30 group
                            ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon className={`w-5 h-5 text-purple-400 group-hover:text-pink-500 transition-colors duration-300`} />
                <span className={`font-medium transition-all duration-300 ${isCollapsed ? 'hidden' : 'w-auto opacity-100'}`}>
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}