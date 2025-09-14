"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  MoreVertical,
  Settings,
  Trash2,
  Pause,
  Play
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface SiteCardProps {
  siteKey: string;
  site: any;
  isSelected: boolean;
  onClick: () => void;
  onSettings?: () => void;
  onDelete?: () => void;
  onToggleActive?: () => void;
}

export function SiteCard({ 
  siteKey, 
  site, 
  isSelected, 
  onClick, 
  onSettings, 
  onDelete, 
  onToggleActive 
}: SiteCardProps) {
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

  const getLastCheckTime = () => {
    if (!site?.checks || site.checks.length === 0) return 'Never';
    const latestCheck = site.checks[site.checks.length - 1];
    return new Date(latestCheck.checkcreatedat).toLocaleString();
  };

  const status = getSiteStatus();
  const uptime = getUptimePercentage();
  const avgResponseTime = getAverageResponseTime();
  const lastCheck = getLastCheckTime();

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
        return 'border-green-200 bg-green-50';
      case 'down':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getUptimeColor = () => {
    if (uptime >= 99) return 'text-green-600';
    if (uptime >= 95) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getResponseTimeColor = () => {
    if (avgResponseTime < 500) return 'text-green-600';
    if (avgResponseTime < 1000) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      } ${getStatusColor()}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-gray-900 truncate" style={{width: '90%'}}>
                {site?.metadata?.name || siteKey}
              </CardTitle>
              <p className="text-sm text-gray-500 truncate text-ellipsis-truncate">
                {siteKey}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSettings?.(); }}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleActive?.(); }}>
                {site?.metadata?.isActive ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause Monitoring
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Resume Monitoring
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Uptime</p>
            <p className={`text-lg font-semibold ${getUptimeColor()}`}>
              {uptime}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Avg Response</p>
            <p className={`text-lg font-semibold ${getResponseTimeColor()}`}>
              {avgResponseTime}ms
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last check: {lastCheck}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              window.open(siteKey, '_blank');
            }}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Visit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
