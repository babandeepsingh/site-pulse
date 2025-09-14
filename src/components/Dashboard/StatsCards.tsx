"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

interface StatsCardsProps {
  sites: { [key: string]: any };
}

export function StatsCards({ sites }: StatsCardsProps) {
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

  // Calculate overall stats
  const totalSites = Object.keys(sites).length;
  const activeSites = Object.values(sites).filter(site => site?.metadata?.isActive).length;
  const upSites = Object.values(sites).filter(site => getSiteStatus(site) === 'up').length;
  const downSites = Object.values(sites).filter(site => getSiteStatus(site) === 'down').length;
  
  const overallUptime = totalSites > 0 ? Math.round((upSites / totalSites) * 100) : 0;
  const averageResponseTime = totalSites > 0 
    ? Math.round(Object.values(sites).reduce((sum, site) => sum + getAverageResponseTime(site), 0) / totalSites)
    : 0;

  const stats = [
    {
      title: "Total Sites",
      value: totalSites,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: null
    },
    {
      title: "Active Sites",
      value: activeSites,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: null
    },
    {
      title: "Uptime",
      value: `${overallUptime}%`,
      icon: TrendingUp,
      color: overallUptime >= 99 ? "text-green-600" : overallUptime >= 95 ? "text-yellow-600" : "text-red-600",
      bgColor: overallUptime >= 99 ? "bg-green-50" : overallUptime >= 95 ? "bg-yellow-50" : "bg-red-50",
      change: overallUptime >= 99 ? "up" : overallUptime >= 95 ? "stable" : "down"
    },
    {
      title: "Avg Response Time",
      value: `${averageResponseTime}ms`,
      icon: Clock,
      color: averageResponseTime < 500 ? "text-green-600" : averageResponseTime < 1000 ? "text-yellow-600" : "text-red-600",
      bgColor: averageResponseTime < 500 ? "bg-green-50" : averageResponseTime < 1000 ? "bg-yellow-50" : "bg-red-50",
      change: averageResponseTime < 500 ? "up" : averageResponseTime < 1000 ? "stable" : "down"
    }
  ];

  const getChangeIcon = (change: string | null) => {
    if (!change) return null;
    switch (change) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      case 'stable':
        return <Minus className="h-3 w-3 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              {getChangeIcon(stat.change)}
            </div>
            {stat.change && (
              <p className="text-xs text-gray-500 mt-1">
                {stat.change === 'up' && 'Improving'}
                {stat.change === 'down' && 'Needs attention'}
                {stat.change === 'stable' && 'Stable'}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
