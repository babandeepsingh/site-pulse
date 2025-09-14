"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { 
  Settings, 
  Globe, 
  Bell, 
  Mail, 
  Shield, 
  User, 
  Database,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock
} from "lucide-react";

interface SettingsTabProps {
  sites: { [key: string]: any };
  userData: any;
}

export function SettingsTab({ sites, userData }: SettingsTabProps) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'down':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
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

  const totalSites = Object.keys(sites).length;
  const activeSites = Object.values(sites).filter(site => site?.metadata?.isActive).length;
  const upSites = Object.values(sites).filter(site => getSiteStatus(site) === 'up').length;
  const downSites = Object.values(sites).filter(site => getSiteStatus(site) === 'down').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600">Manage your account and monitoring preferences</p>
        </div>
      </div>

      {/* Account Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Account Information</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-500">Full Name</Label>
                  <p className="text-sm font-medium">{userData?.fullname || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Email</Label>
                  <p className="text-sm font-medium">{userData?.emailAddresses?.[0]?.emailAddress || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Account ID</Label>
                  <p className="text-sm font-medium font-mono">{userData?.id || 'Not available'}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Usage Statistics</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total Websites</span>
                  <Badge variant="outline">{totalSites}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Active Monitoring</span>
                  <Badge variant="outline">{activeSites}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Online Sites</span>
                  <Badge variant="outline" className="text-green-600">{upSites}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Offline Sites</span>
                  <Badge variant="outline" className="text-red-600">{downSites}</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Website Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Website Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Website Limit</h4>
                <p className="text-sm text-gray-500">Maximum number of websites you can monitor</p>
              </div>
              <Badge variant="outline">5 websites (Free Plan)</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Monitoring Frequency</h4>
                <p className="text-sm text-gray-500">How often we check your websites</p>
              </div>
              <Badge variant="outline">Every 5 minutes</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Email Notifications</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Website Down Alerts</Label>
                    <p className="text-sm text-gray-500">Get notified when a website goes offline</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Website Recovery Alerts</Label>
                    <p className="text-sm text-gray-500">Get notified when a website comes back online</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Weekly Reports</Label>
                    <p className="text-sm text-gray-500">Receive weekly uptime and performance reports</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Alert Thresholds</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="response-time">Response Time Alert (ms)</Label>
                  <Input id="response-time" type="number" defaultValue="500" />
                </div>
                <div>
                  <Label htmlFor="uptime-threshold">Uptime Threshold (%)</Label>
                  <Input id="uptime-threshold" type="number" defaultValue="99" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Website Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Website Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(sites).length > 0 ? (
            <div className="space-y-3">
              {Object.keys(sites).map((siteKey) => {
                const site = sites[siteKey];
                const status = getSiteStatus(site);
                const uptime = getUptimePercentage(site);

                return (
                  <div key={siteKey} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(status)}
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {site?.metadata?.name || siteKey}
                        </h4>
                        <p className="text-sm text-gray-500">{siteKey}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{uptime}% uptime</p>
                        <p className="text-xs text-gray-500">
                          {site?.metadata?.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(status)}
                      >
                        {status === 'up' ? 'Online' : status === 'down' ? 'Offline' : 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No websites configured</h3>
              <p className="text-gray-500">
                Add websites to start monitoring and see their status here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Data Retention</h4>
                <p className="text-sm text-gray-500">How long we keep your monitoring data</p>
              </div>
              <Badge variant="outline">30 days (Free Plan)</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Delete All Data</h4>
                <p className="text-sm text-gray-500">Permanently delete all your monitoring data and websites</p>
              </div>
              <Button variant="destructive" size="sm">Delete All Data</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Export Data</h4>
                <p className="text-sm text-gray-500">Download all your monitoring data before deletion</p>
              </div>
              <Button variant="outline" size="sm">Export Data</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
