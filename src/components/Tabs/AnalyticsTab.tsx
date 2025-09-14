"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  LineChart,
  PieChart,
  Calendar
} from "lucide-react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useState } from "react";

interface AnalyticsTabProps {
  sites: { [key: string]: any };
  selectedSite: string;
  onSiteSelect: (siteKey: string) => void;
}

export function AnalyticsTab({ sites, selectedSite, onSiteSelect }: AnalyticsTabProps) {
  const [chartType, setChartType] = useState<'scatter'>('scatter');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('24h');

  const getSiteStatus = (site: any) => {
    if (!site?.checks || site.checks.length === 0) return 'unknown';
    const latestCheck = site.checks[site.checks.length - 1];
    return latestCheck.status < 400 ? 'up' : 'down';
  };

  const getUptimePercentage = (site: any) => {
    if (!site?.checks || site.checks.length === 0) return 0;
    const totalChecks = site.checks.length;
    const successfulChecks = site.checks.filter((check: any) => check.status < 400).length;
    return Math.round((successfulChecks / totalChecks) * 100);
  };

  const getAverageResponseTime = (site: any) => {
    if (!site?.checks || site.checks.length === 0) return 0;
    const totalTime = site.checks.reduce((sum: number, check: any) => sum + (check.latencyms || check.latencyMs || 0), 0);
    return Math.round(totalTime / site.checks.length);
  };

  const getFilteredData = (site: any) => {
    if (!site?.checks) return [];
    
    const now = new Date();
    const timeRanges = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      'all': Infinity
    };
    
    const cutoff = timeRanges[timeRange];
    return site.checks.filter((check: any) => {
      const checkTime = new Date(check.checkcreatedat).getTime();
      return (now.getTime() - checkTime) <= cutoff;
    });
  };

  const getStatusChartOptions = (site: any) => {
    const filteredData = getFilteredData(site);
    if (filteredData.length === 0) return {};

    // Create scatter plot data - each check is a dot
    const data = filteredData.map((check: any) => ({
      x: new Date(check.checkcreatedat).getTime(),
      y: check.status < 400 ? 1 : 0, // 1 for up, 0 for down
      status: check.status < 400 ? 'up' : 'down',
      statusCode: check.status,
      latency: check.latencyms || check.latencyMs || 0,
      timestamp: check.checkcreatedat
    }));

    return {
      chart: {
        type: 'scatter',
        backgroundColor: 'transparent',
        height: 400
      },
      title: {
        text: 'Website Status Over Time',
        style: {
          color: '#374151',
          fontSize: '18px',
          fontWeight: '600'
        }
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date & Time'
        },
        labels: {
          style: {
            color: '#6B7280'
          }
        }
      },
      yAxis: {
        title: {
          text: 'Status'
        },
        min: -0.1,
        max: 1.1,
        tickPositions: [0, 1],
        labels: {
          formatter: function(this: any) {
            return this.value === 1 ? 'UP' : 'DOWN';
          },
          style: {
            color: '#6B7280'
          }
        }
      },
      series: [{
        name: 'Status',
        data: data.map((point: any) => ({
          ...point,
          color: point.status === 'up' ? '#10B981' : '#EF4444' // green for up, red for down
        })),
        color: '#10B981',
        marker: {
          radius: 4,
          symbol: 'circle'
        }
      }],
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E7EB',
        borderRadius: 8,
        shadow: true,
        formatter: function(this: any) {
          const point = this.point as any;
          const date = new Date(point.x).toLocaleString();
          const status = point.status === 'up' ? '✅ UP' : '❌ DOWN';
          return `${status}<br/><b>${date}</b><br/>Status Code: <b>${point.statusCode}</b><br/>Response Time: <b>${point.latency}ms</b>`;
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      }
    };
  };

  const getUptimeChartOptions = (site: any) => {
    const uptime = getUptimePercentage(site);
    const downtime = 100 - uptime;

    return {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: 300
      },
      title: {
        text: 'Uptime Distribution',
        style: {
          color: '#374151',
          fontSize: '18px',
          fontWeight: '600'
        }
      },
      series: [{
        name: 'Uptime',
        data: [
          {
            name: 'Uptime',
            y: uptime,
            color: uptime >= 99 ? '#10B981' : uptime >= 95 ? '#F59E0B' : '#EF4444'
          },
          {
            name: 'Downtime',
            y: downtime,
            color: '#E5E7EB'
          }
        ],
        size: '80%',
        innerSize: '60%',
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.percentage:.1f}%',
          style: {
            fontSize: '12px',
            fontWeight: '600'
          }
        }
      }],
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E7EB',
        borderRadius: 8,
        shadow: true,
        formatter: function(this: any) {
          return `<b>${this.point.name}</b><br/>${this.point.percentage.toFixed(1)}%`;
        }
      },
      credits: {
        enabled: false
      }
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'down':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600">Detailed status insights for your websites</p>
        </div>
      </div>

      {/* Site Selection */}
      {Object.keys(sites).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Website</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(sites).map((siteKey) => {
                const site = sites[siteKey];
                const status = getSiteStatus(site);
                const uptime = getUptimePercentage(site);
                const avgResponseTime = getAverageResponseTime(site);
                console.log(site?.metadata?.isActive, siteKey, site, "Wohooo");
                return (
                  <Card
                    key={siteKey}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                      selectedSite === siteKey ? 'ring-2 ring-blue-500' : ''
                    } ${
                      site?.metadata?.isActive ? '' : 'opacity-70 pointer-events-none select-none'
                    } ${getStatusColor(status)}`}
                    onClick={() => onSiteSelect(siteKey)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        {getStatusIcon(status)}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {site?.metadata?.name || siteKey}
                          </h3>
                          <p className="text-sm text-gray-500 truncate text-ellipsis-truncate">{siteKey}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Uptime:</span>
                          <span className="ml-1 font-semibold">{uptime}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Avg:</span>
                          <span className="ml-1 font-semibold">{avgResponseTime}ms</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics for Selected Site */}
      {selectedSite && sites[selectedSite] && (
        <div className="space-y-6">
          {/* Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Time Range:</span>
                    <div className="flex space-x-1">
                      {(['24h', '7d', '30d', 'all'] as const).map((range) => (
                        <Button
                          key={range}
                          variant={timeRange === range ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTimeRange(range)}
                        >
                          {range}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Chart Type:</span>
                  <div className="flex space-x-1">
                    <Button
                      variant="default"
                      size="sm"
                      disabled
                    >
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Scatter Plot
                    </Button>
                  </div>
                </div> */}
              </div>
            </CardContent>
          </Card>

          {/* Site Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(getSiteStatus(sites[selectedSite]))}
                  <div>
                    <CardTitle className="text-lg">{selectedSite}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {sites[selectedSite]?.metadata?.name || 'Unnamed Site'}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(getSiteStatus(sites[selectedSite]))}`}>
                  {getSiteStatus(sites[selectedSite]) === 'up' ? 'Online' : getSiteStatus(sites[selectedSite]) === 'down' ? 'Offline' : 'Unknown'}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {getUptimePercentage(sites[selectedSite])}%
                  </div>
                  <div className="text-sm text-gray-500">Uptime</div>
                  <div className="flex items-center justify-center mt-1">
                    {getUptimePercentage(sites[selectedSite]) >= 99 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {getAverageResponseTime(sites[selectedSite])}ms
                  </div>
                  <div className="text-sm text-gray-500">Avg Response</div>
                  <div className="flex items-center justify-center mt-1">
                    {getAverageResponseTime(sites[selectedSite]) < 500 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : getAverageResponseTime(sites[selectedSite]) < 1000 ? (
                      <Activity className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {getFilteredData(sites[selectedSite]).length}
                  </div>
                  <div className="text-sm text-gray-500">Checks ({timeRange})</div>
                  <div className="flex items-center justify-center mt-1">
                    <Activity className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <HighchartsReact 
                  highcharts={Highcharts} 
                  options={getStatusChartOptions(sites[selectedSite])} 
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <HighchartsReact 
                  highcharts={Highcharts} 
                  options={getUptimeChartOptions(sites[selectedSite])} 
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Empty State */}
      {Object.keys(sites).length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No data available</h3>
            <p className="text-gray-500">
              Add websites to start seeing analytics and performance insights.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
