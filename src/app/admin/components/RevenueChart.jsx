'use client';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function RevenueChart() {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  
  // Mock data for the three categories
  const data = [
    { name: 'Mon', properties: 20, services: 15, items: 10 },
    { name: 'Tue', properties: 35, services: 25, items: 20 },
    { name: 'Wed', properties: 45, services: 40, items: 30 },
    { name: 'Thur', properties: 60, services: 35, items: 25 },
    { name: 'Fri', properties: 55, services: 50, items: 35 },
    { name: 'Sat', properties: 70, services: 45, items: 40 },
  ];

  return (
    <div className="bg-white rounded-2xl p-2 md:p-8 md:py-5 shadow-sm relative">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">Revenue Analytics</h3>
        </div>
        
        <div className="flex items-center gap-3 relative">
          {/* Legend */}
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-700">Properties</span>
            </div>
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <span className="text-xs font-medium text-gray-700">Services</span>
            </div>
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-700">Items</span>
            </div>
          </div>
          {/* Period selection dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-black10 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:ring-offset-2">
                <span>{selectedPeriod}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="var(--tertiary)">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 border-none bg-black10 z-100">
              <DropdownMenuItem 
                onClick={() => setSelectedPeriod('Week')}
                className="cursor-pointer"
              >
                Week
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedPeriod('Month')}
                className="cursor-pointer"
              >
                Month
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedPeriod('Year')}
                className="cursor-pointer"
              >
                Year
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* View options */}
          <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button className="p-2 text-blue-600 bg-white rounded-lg shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      
      
      {/* Chart Container - Using CSS-based chart to avoid Recharts selector issues */}
      <div className="bg-gray-50/50 rounded-2xl p-2 md:p-6">
        <div className="h-80 w-full relative">
          {/* Chart Area */}
          <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pb-8">
              <span>80K</span>
              <span>60K</span>
              <span>40K</span>
              <span>20K</span>
              <span>0</span>
            </div>
            
            {/* Grid lines */}
            <div className="absolute inset-0 ml-8 mr-4 pb-8">
              {[0, 20, 40, 60, 80].map((value, index) => (
                <div
                  key={index}
                  className="absolute w-full border-t border-t-black10"
                  style={{ bottom: `${value * 0.8}%` }}
                />
              ))}
            </div>
            
            {/* Data points and lines */}
            <div className="ml-8 mr-4 w-full h-full relative pb-8">
              {/* Properties line */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M 0,80 L 20,65 L 40,55 L 60,40 L 80,45 L 100,30"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth=".5"
                  className="drop-shadow-sm"
                />
                {data.map((item, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y = 100 - (item.properties / 80) * 100;
                  return (
                    <circle
                      key={`properties-${index}`}
                      cx={x}
                      cy={y}
                      r="1"
                      fill="#3b82f6"
                      className="drop-shadow-sm"
                    />
                  );
                })}
              </svg>
              
              {/* Services line */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M 0,85 L 20,75 L 40,60 L 60,65 L 80,50 L 100,55"
                  fill="none"
                  stroke="var(--tertiary)"
                  strokeWidth=".5"
                  className="drop-shadow-sm"
                />
                {data.map((item, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y = 100 - (item.services / 80) * 100;
                  return (
                    <circle
                      key={`services-${index}`}
                      cx={x}
                      cy={y}
                      r="1"
                      fill="var(--tertiary)"
                      className="drop-shadow-sm"
                    />
                  );
                })}
              </svg>
              
              {/* Items line */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M 0,90 L 20,80 L 40,70 L 60,75 L 80,65 L 100,60"
                  fill="none"
                  stroke="var(--secondary)"
                  strokeWidth=".5"
                  className="drop-shadow-sm"
                />
                {data.map((item, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y = 100 - (item.items / 80) * 100;
                  return (
                    <circle
                      key={`items-${index}`}
                      cx={x}
                      cy={y}
                      r="1"
                      fill="var(--secondary)"
                      className="drop-shadow-sm"
                    />
                  );
                })}
              </svg>
            </div>
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-8 right-4 flex justify-between text-xs text-gray-500">
              {data.map((item) => (
                <span key={item.name}>{item.name}</span>
              ))}
            </div>
          </div>
          
          
        </div>
      </div>
    </div>
  );
}