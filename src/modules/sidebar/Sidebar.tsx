'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { IoIosArrowDown } from 'react-icons/io';
import { FaChartBar, FaCar, FaCalendarAlt, FaFileExport, FaChevronLeft ,FaCogs , FaChevronRight} from 'react-icons/fa';

export default function Sidebar(): JSX.Element {
  const pathname = usePathname();
  const [vehicleSettingsOpen, setVehicleSettingsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/50' : '';
  };

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: FaChartBar },
    { href: '/vehicles', label: 'Vehicles', icon: FaCar },
    { href: '/bookings', label: 'Bookings', icon: FaCalendarAlt },
    { href: '/export', label: 'Export', icon: FaFileExport },
    { 
      label: 'Vehicle Catalog', 
      icon: FaCogs,
      subItems: [
        
        { href: '/vehicle-catalog/manufacturers', label: 'Manufacturers' },
        { href: '/vehicle-catalog/models', label: 'Models' },
      ]
    },
  ];
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100 h-screen overflow-hidden shadow-xl transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`${isCollapsed ? 'pt-5 px-2':'p-5'} relative h-full`}>
        <button
          onClick={toggleSidebar}
          className={`absolute ${isCollapsed ? 'top-3 right-7' : 'top-3 right-4'}  text-purple-400 hover:text-pink-500 transition-colors duration-300`}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
        <div className={` ${isCollapsed ? '' : 'block'}  h-20  flex justify-start items-center`}>
          <Image src='/icons/cochin-car-rentals.png' width={180} height={50} alt='company logo' className='hover:scale-105  transition-transform ease-out cursor-pointer'/>
        </div>
        <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.label}>
            {item.href ? (
              <Link 
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ease-in-out 
                            ${isActive(item.href) ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/50' : ''}
                            hover:bg-gray-800 hover:shadow-md hover:shadow-purple-500/30 group
                            ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon className={`w-5 h-5 text-purple-400 group-hover:text-pink-500 transition-colors duration-300`} />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            ): (
              <div>
                <button
                  onClick={() => setVehicleSettingsOpen(!vehicleSettingsOpen)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ease-in-out 
                              hover:bg-gray-800 hover:shadow-md hover:shadow-purple-500/30 group
                              ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <item.icon className={`w-5 h-5 text-purple-400 group-hover:text-pink-500 transition-colors duration-300`} />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium flex-grow">{item.label}</span>
                      <IoIosArrowDown 
                        className={`text-purple-400 group-hover:text-pink-500 transition-transform duration-300 ease-in-out ${vehicleSettingsOpen ? 'transform rotate-180' : ''}`} 
                      />
                    </>
                  )}
                </button>
                {vehicleSettingsOpen && !isCollapsed && (
                  <ul className="ml-6 mt-2 space-y-2">
                    {item.subItems?.map((subItem) => (
                      <li key={subItem.href}>
                        <Link 
                          href={subItem.href}
                          className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out 
                                      ${isActive(subItem.href) ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/50' : ''}
                                      hover:bg-gray-800 hover:shadow-md hover:shadow-purple-500/30 group`}
                        >
                          <span className="font-medium">{subItem.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
      </div>
    </aside>
  );
}