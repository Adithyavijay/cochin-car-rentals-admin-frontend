    'use client'
    import React from 'react';
    import { FaBars, FaSignOutAlt  } from 'react-icons/fa';
    import { Poppins } from 'next/font/google';

    // Load the Poppins font
    const poppins = Poppins({
    weight: ['400', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    });

    export default function Header(){
    return (
        <header className={`${poppins.className} bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white p-4 shadow-lg`}>
        <div className="container mx-auto flex justify-between items-center">
            {/* Menu toggle for mobile */}
            <button 
        
            className="text-white md:hidden focus:outline-none"
            aria-label="Toggle menu"
            >
            <FaBars className="text-2xl" />
            </button>

            {/* Centered title */}
            <h1 className="text-2xl font-bold text-center flex-grow text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                The Weekend Ride
            </h1>

            {/* Login button */}
            <button
            
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300"
            >
                    <FaSignOutAlt className="mr-2" /> Sign out
            </button>
        </div>
        </header>
    );
    }