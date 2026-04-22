'use client'
import { useState } from 'react'
import { Download, Calendar, FileText, BarChart3, Users, Home, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

// Mock reports data
const mockReports = [
  {
    id: 1,
    title: 'Monthly User Report',
    type: 'users',
    period: 'January 2024',
    status: 'completed',
    generatedDate: '2024-01-31',
    size: '2.3 MB',
    icon: Users,
  },
  {
    id: 2,
    title: 'Property Analytics Report',
    type: 'properties',
    period: 'Q1 2024',
    status: 'completed',
    generatedDate: '2024-03-31',
    size: '4.1 MB',
    icon: Home,
  },
  {
    id: 3,
    title: 'Service Provider Performance',
    type: 'services',
    period: 'February 2024',
    status: 'generating',
    generatedDate: '2024-02-29',
    size: '1.8 MB',
    icon: Wrench,
  },
  {
    id: 4,
    title: 'Revenue Summary',
    type: 'revenue',
    period: 'January 2024',
    status: 'completed',
    generatedDate: '2024-01-31',
    size: '3.2 MB',
    icon: BarChart3,
  },
];

const reportTypes = [
  { value: 'users', label: 'User Reports', icon: Users },
  { value: 'properties', label: 'Property Reports', icon: Home },
  { value: 'services', label: 'Service Reports', icon: Wrench },
  { value: 'revenue', label: 'Revenue Reports', icon: BarChart3 },
];

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [reports] = useState(mockReports)
  const [isLoading] = useState(false)

  const filteredReports = reports?.filter(report => {
    const matchesType = selectedType === 'all' || report.type === selectedType;
    return matchesType;
  });

  const handleGenerateReport = () => {
    toast.success('Report generation started. You will be notified when ready.');
    // Implement actual API call here
  };

  const handleDownloadReport = (reportId) => {
    toast.success('Report download started');
    // Implement actual download here
  };

  const getStatusBadge = (status) => {
    const baseClass = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    const variants = {
      completed: 'bg-green-500 text-white',
      generating: 'bg-yellow-500 text-white',
      failed: 'bg-red-500 text-white',
    };
    return (
      <span className={`${baseClass} ${variants[status] || 'bg-gray-500 text-white'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header Section with Title and Generate Button */}
        <div className="md:flex items-center justify-between sticky top-0 bg-white z-10 pb-6 pt-4 border-b border-black10 px-6">
          <div className='block'>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-sm text-gray-600 mt-1">Generate and download comprehensive reports</p>
          </div>
          <Button 
            onClick={handleGenerateReport} 
            className="bg-primary hover:bg-primary/90 flex items-center gap-2 mt-3 md:mt-0"
          >
            <FileText className="w-4 h-4" />
          Generate New Report
        </Button>
      </div>

        {/* Content Section */}
        <div className="p-6 pb-28 space-y-6">
      {/* Report Types */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Types</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((type) => (
          <div
            key={type.value}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-colors ${
              selectedType === type.value
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedType(type.value)}
          >
            <div className="flex items-center">
              <type.icon className="w-8 h-8 text-primary mr-3" />
              <div>
                      <h4 className="font-semibold text-gray-900">{type.label}</h4>
                <p className="text-sm text-gray-500">Generate reports</p>
              </div>
            </div>
          </div>
        ))}
            </div>
      </div>

      {/* Filters */}
          <div className="border-t border-black10 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="users">User Reports</SelectItem>
              <SelectItem value="properties">Property Reports</SelectItem>
              <SelectItem value="services">Service Reports</SelectItem>
              <SelectItem value="revenue">Revenue Reports</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Periods</SelectItem>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last3months">Last 3 months</SelectItem>
              <SelectItem value="last6months">Last 6 months</SelectItem>
              <SelectItem value="lastyear">Last year</SelectItem>
            </SelectContent>
          </Select>

              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
            Custom Range
          </Button>
        </div>
      </div>

          {/* Generated Reports List */}
          <div className="border-t border-black10 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Reports</h3>
            <div className="divide-y divide-black10">
          {filteredReports?.map((report) => (
                <div key={report.id} className="py-4 hover:bg-gray-50 transition-colors">
                  <div className="md:flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        <report.icon className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{report.title}</h4>
                        <p className="text-sm text-gray-500">{report.period}</p>
                        <p className="text-xs text-gray-400">
                          Generated: {report.generatedDate} • Size: {report.size}
                        </p>
                      </div>
                    </div>
                
                    <div className="flex items-center gap-3 mt-5 md:mt-0 place-self-end">
                      {getStatusBadge(report.status)}
                      {report.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadReport(report.id)}
                            className="flex items-center gap-2"
                      >
                            <Download className="w-4 h-4" />
                        Download
                      </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
          <div className="border-t border-black10 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FileText className="w-8 h-8 text-primary mr-3" />
                  <h4 className="text-lg font-semibold text-gray-900">Quick Reports</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Generate common reports with one click
          </p>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              Daily Summary
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Weekly Overview
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Monthly Report
            </Button>
          </div>
        </div>

              <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-8 h-8 text-primary mr-3" />
                  <h4 className="text-lg font-semibold text-gray-900">Custom Reports</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Create custom reports with specific criteria
          </p>
                <Button className="w-full bg-primary hover:bg-primary/90">
            Create Custom Report
          </Button>
        </div>

              <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Calendar className="w-8 h-8 text-primary mr-3" />
                  <h4 className="text-lg font-semibold text-gray-900">Scheduled Reports</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Set up automated report generation
          </p>
          <Button variant="outline" className="w-full">
            Schedule Report
          </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

