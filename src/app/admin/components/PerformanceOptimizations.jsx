'use client';
import { memo, lazy, Suspense, useState, useEffect } from 'react';

// Lazy load heavy components
export const LazyChartCard = lazy(() => import('./ChartCard'));
export const LazyAnalytics = lazy(() => import('../pages/analytics'));
export const LazyReports = lazy(() => import('../pages/reports'));

// Memoized components for performance
export const MemoizedStatsCard = memo(function StatsCard(props) {
  const StatsCard = require('./StatsCard').default;
  return <StatsCard {...props} />;
});

export const MemoizedRecentActivity = memo(function RecentActivity(props) {
  const RecentActivity = require('./RecentActivity').default;
  return <RecentActivity {...props} />;
});

// Loading component
export const ChartLoading = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Error boundary component
export const AdminErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      console.error('Admin Dashboard Error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return fallback || (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">Please refresh the page or contact support.</p>
          <button 
            type="button"
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return children;
};
