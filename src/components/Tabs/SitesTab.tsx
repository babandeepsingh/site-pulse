"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  MoreVertical,
  Settings,
  Trash2,
  Pause,
  Play,
  Plus,
  Activity
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface SitesTabProps {
  sites: { [key: string]: any };
  onSiteSelect: (siteKey: string) => void;
  onAddSite: () => void;
  onToggleActive: (siteKey: string) => void;
  onDelete: (siteKey: string) => void;
}

export function SitesTab({ sites, onSiteSelect, onAddSite, onToggleActive, onDelete }: SitesTabProps) {
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

  const getLastCheckTime = (site: any) => {
    if (!site?.checks || site.checks.length === 0) return 'Never';
    const latestCheck = site.checks[site.checks.length - 1];
    return new Date(latestCheck.checkcreatedat).toLocaleString();
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
        return 'border-green-200 bg-green-50';
      case 'down':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Websites</h2>
          <p className="text-gray-600">Monitor and manage your website status</p>
        </div>
        <Button onClick={onAddSite} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Website
        </Button>
      </div>

      {/* Sites Grid */}
      {Object.keys(sites).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(sites).map((siteKey) => {
            const site = sites[siteKey];
            const status = getSiteStatus(site);
            const uptime = getUptimePercentage(site);
            const avgResponseTime = getAverageResponseTime(site);
            const lastCheck = getLastCheckTime(site);

            return (
              <Card key={siteKey} className={`hover:shadow-lg transition-all duration-300 ${getStatusColor(status)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(status)}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                          {site?.metadata?.name || siteKey}
                        </CardTitle>
                        <p className="text-sm text-gray-500 truncate text-ellipsis-truncate">
                          {siteKey}
                        </p>
                      </div>
                    </div>
                    {/* <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSiteSelect(siteKey)}>
                          <Settings className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleActive(siteKey)}>
                          {site?.metadata?.isActive ? (
                            <>
                              <Pause className="mr-2 h-4 w-4" />
                              Disable Monitoring
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Enable Monitoring
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(siteKey)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Uptime</p>
                      <p className={`text-lg font-semibold ${
                        uptime >= 99 ? 'text-green-600' : uptime >= 95 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {uptime}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Avg Response</p>
                      <p className={`text-lg font-semibold ${
                        avgResponseTime < 500 ? 'text-green-600' : avgResponseTime < 1000 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {avgResponseTime}ms
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={site?.metadata?.isActive || false}
                        onCheckedChange={() => onToggleActive(siteKey)}
                      />
                      <span className="text-sm text-gray-600">
                        {site?.metadata?.isActive ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={() => window.open(siteKey, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Last check: {lastCheck}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No websites yet</h3>
            <p className="text-gray-500 mb-6">
              Add your first website to start monitoring its uptime and performance.
            </p>
            <Button onClick={onAddSite} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Website
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
