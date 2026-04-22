'use client';
import { useState } from 'react';
import { Menu, Bell, Search, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationCenter from '../components/NotificationCenter';

export default function AdminHeader({ onMenuClick, breadcrumbs = ['Dashboards', 'Home'] }) {
  return (
    <header className="bg-gray-100 border-b border-black10">
      <div className="flex items-center justify-between h-16 md:px-6">
        {/* Left side */}
        <div className="flex items-center md:space-x-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
   
          {/* Breadcrumbs */}
          <div className="hidden md:flex items-center text-sm text-gray-500">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                <span className={index === breadcrumbs.length - 1 ? 'text-tertiary' : 'text-black66'}>
                  {crumb}
                </span>
                {index < breadcrumbs.length - 1 && (
                  <span className="mx-2">/</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2  transform -translate-y-1/2 w-4 h-4 text-black33" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-80 bg-black10 rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-transparent transition-all duration-300 text-tertiary placeholder:text-black33"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-3">
            <NotificationCenter />
            <Button variant="ghost" size="sm" className="text-tertiary hover:text-gray-800">
              <HelpCircle className="w-6 h-6 " />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-tertiary text-sm font-medium">A</span>
            </div>
              <ChevronDown className="w-4 h-4 text-tertiary" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

