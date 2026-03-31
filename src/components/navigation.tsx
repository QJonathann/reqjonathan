
"use client";

import React from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-md shadow-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-xl">
              <GraduationCap className="w-7 h-7 text-primary" />
            </div>
            <div className="flex flex-col">
              <div className="text-xl font-bold text-gray-900 leading-none">
                Korepetycje <span className="text-primary">Online</span>
              </div>
              <span className="text-[10px] text-gray-500 uppercase font-bold mt-1">
                FIZYKA • MATEMATYKA
              </span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
