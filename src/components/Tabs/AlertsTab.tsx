"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Mail, 
  Bell, 
  Settings,
  Filter,
  Download,
  RefreshCw
} from "lucide-react";

interface AlertsTabProps {
  sites: { [key: string]: any };
}

export function AlertsTab({ sites }: AlertsTabProps) {
  const getSiteStatus = (site: any) => {
    if (!site?.checks || site.checks.length === 0) return 'unknown';
    const latestCheck = site.checks[site.checks.length - 1];
    return latestCheck.status < 400 ? 'up' : 'down';
  };

  const getDowntimeEvents = (site: any, siteKey: string) => {
    if (!site?.checks) return [];
    
    const events = [];
    let isDown = false;
    let downStart = null;
    
    // Sort checks by date (oldest first)
    const sortedChecks = [...site.checks].sort((a: any, b: any) => 
      new Date(a.checkcreatedat).getTime() - new Date(b.checkcreatedat).getTime()
    );
    
    for (const check of sortedChecks) {
      const isCurrentlyDown = check.status >= 400;
      const checkTime = new Date(check.checkcreatedat);
      
      if (isCurrentlyDown && !isDown) {
        // Downtime started
        isDown = true;
        downStart = checkTime;
      } else if (!isCurrentlyDown && isDown) {
        // Downtime ended
        if (downStart) {
          events.push({
            type: 'downtime',
            site: siteKey,
            siteName: site?.metadata?.name || siteKey,
            start: downStart,
            end: checkTime,
            duration: checkTime.getTime() - downStart.getTime(),
            status: check.status
          });
        }
        isDown = false;
        downStart = null;
      }
    }
    
    // If still down, add current downtime
    if (isDown && downStart) {
      events.push({
        type: 'downtime',
        site: siteKey,
        siteName: site?.metadata?.name || siteKey,
        start: downStart,
        end: null,
        duration: Date.now() - downStart.getTime(),
        status: 'ongoing'
      });
    }
    
    return events;
  };

  const getAllAlerts = () => {
    const allAlerts:any = [];
    
    Object.keys(sites).forEach(siteKey => {
      const site = sites[siteKey];
      const downtimeEvents = getDowntimeEvents(site, siteKey);
      allAlerts.push(...downtimeEvents);
    });
    
    // Sort by start time (newest first)
    return allAlerts.sort((a:any, b:any) => b.start.getTime() - a.start.getTime());
  };

  const formatDuration = (duration: number) => {
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const getStatusBadge = (alert: any) => {
    if (alert.end === null) {
      return <Badge variant="destructive" className="bg-red-100 text-red-800">Ongoing</Badge>;
    }
    return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Resolved</Badge>;
  };

  const alerts = getAllAlerts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Alerts & Incidents</h2>
          <p className="text-gray-600">Monitor downtime events and system alerts</p>
        </div>
        {/* <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div> */}
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Incidents</p>
                <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ongoing Issues</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alerts.filter((alert:any) => alert.end === null).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alerts.filter((alert:any) => alert.end !== null).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Settings */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Alert Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Notification Channels</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Email Notifications</span>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">SMS Alerts</span>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Alert Thresholds</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Response Time Alert</span>
                  <Badge variant="outline">500ms</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Uptime Threshold</span>
                  <Badge variant="outline">99%</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Alert History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert:any, index:any) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{alert.siteName}</h4>
                          {getStatusBadge(alert)}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{alert.site}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>Started: {alert.start.toLocaleString()}</span>
                          </div>
                          {alert.end && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-3 w-3" />
                              <span>Ended: {alert.end.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <span>Duration: {formatDuration(alert.duration)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button> */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No incidents reported</h3>
              <p className="text-gray-500">
                Great! All your websites are running smoothly with no downtime events.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
