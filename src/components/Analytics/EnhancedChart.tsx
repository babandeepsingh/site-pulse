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
  PieChart
} from "lucide-react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useState } from "react";

interface EnhancedChartProps {
  siteKey: string;
  site: any;
  selectedChartOption: any;
}

export function EnhancedChart({ siteKey, site, selectedChartOption }: EnhancedChartProps) {
  const [chartType, setChartType] = useState<'line' | 'column' | 'area'>('line');

  const getSiteStatus = () => {
    if (!site?.checks || site.checks.length === 0) return 'unknown';
    const latestCheck = site.checks[site.checks.length - 1];
    return latestCheck.status < 400 ? 'up' : 'down';
  };

  const getUptimePercentage = () => {
    if (!site?.checks || site.checks.length === 0) return 0;
    const totalChecks = site.checks.length;
    const successfulChecks = site.checks.filter((check: any) => check.status < 400).length;
    return Math.round((successfulChecks / totalChecks) * 100);
  };

  const getAverageResponseTime = () => {
    if (!site?.checks || site.checks.length === 0) return 0;
    const totalTime = site.checks.reduce((sum: number, check: any) => sum + (check.latencyms || check.latencyMs || 0), 0);
    return Math.round(totalTime / site.checks.length);
  };

  const getStatusChartOptions = () => {
    if (!site?.checks || site.checks.length === 0) return {};

    // Create scatter plot data - each check is a dot
    const data = site.checks.map((check: any) => ({
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
        height: 300
      },
      title: {
        text: 'Website Status Over Time',
        style: {
          color: '#374151',
          fontSize: '16px',
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
        data: data,
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

  const getUptimeChartOptions = () => {
    const uptime = getUptimePercentage();
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
          fontSize: '16px',
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

  const status = getSiteStatus();
  const uptime = getUptimePercentage();
  const avgResponseTime = getAverageResponseTime();

  const getStatusIcon = () => {
    switch (status) {
      case 'up':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'down':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
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
      {/* Site Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <CardTitle className="text-lg">{siteKey}</CardTitle>
                <p className="text-sm text-gray-500">
                  {site?.metadata?.name || 'Unnamed Site'}
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
              {status === 'up' ? 'Online' : status === 'down' ? 'Offline' : 'Unknown'}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {uptime}%
              </div>
              <div className="text-sm text-gray-500">Uptime</div>
              <div className="flex items-center justify-center mt-1">
                {uptime >= 99 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {avgResponseTime}ms
              </div>
              <div className="text-sm text-gray-500">Avg Response</div>
              <div className="flex items-center justify-center mt-1">
                {avgResponseTime < 500 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : avgResponseTime < 1000 ? (
                  <Activity className="h-4 w-4 text-yellow-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {site?.checks?.length || 0}
              </div>
              <div className="text-sm text-gray-500">Total Checks</div>
              <div className="flex items-center justify-center mt-1">
                <Activity className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Status Monitoring
        </CardTitle>
            {/* <div className="flex space-x-2">
              <Button
                variant={chartType === 'line' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('line')}
              >
                <LineChart className="h-4 w-4 mr-1" />
                Line
              </Button>
              <Button
                variant={chartType === 'column' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('column')}
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Column
              </Button>
              <Button
                variant={chartType === 'area' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('area')}
              >
                <PieChart className="h-4 w-4 mr-1" />
                Area
              </Button>
            </div> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
        <HighchartsReact 
          highcharts={Highcharts} 
          options={getStatusChartOptions()} 
        />
            </div>
            <div>
              <HighchartsReact 
                highcharts={Highcharts} 
                options={getUptimeChartOptions()} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Original Chart */}
      {/* todo need to test */}
      {/* {selectedChartOption && Object.keys(selectedChartOption).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historical Status Data</CardTitle>
          </CardHeader>
          <CardContent>
            <HighchartsReact highcharts={Highcharts} options={selectedChartOption} />
          </CardContent>
        </Card>
      )} */}
    </div>
  );
}
