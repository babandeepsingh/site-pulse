"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LandingPage from "@/components/LandingPage/LandingPage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDashboard } from "./useDashboard";
import { Sidebar } from "@/components/Dashboard/Sidebar";
import { StatsCards } from "@/components/Dashboard/StatsCards";
import { SiteCard } from "@/components/Dashboard/SiteCard";
import { EnhancedChart } from "@/components/Analytics/EnhancedChart";
import { SitesTab } from "@/components/Tabs/SitesTab";
import { AnalyticsTab } from "@/components/Tabs/AnalyticsTab";
import { AlertsTab } from "@/components/Tabs/AlertsTab";
import { SettingsTab } from "@/components/Tabs/SettingsTab";
import { HelpTab } from "@/components/Tabs/HelpTab";
import ChatWidget from "@/components/Chat/ChatWidget";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Plus, Activity, Bell, Settings, Menu, LogOut } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

export default function Home() {
  const {
    isSignedIn,
    userData,
    sites,
    loading,
    selectedChartOption,
    selectedLink,
    showError,
    formData,
    urlError,
    handleSiteClick,
    handleNewUrl,
    handleFormValues,
    closeRef,
    setUrlError
  } = useDashboard();

  const [selectedSite, setSelectedSite] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'sites' | 'analytics' | 'alerts' | 'settings' | 'help'>('sites');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSiteSelect = (siteKey: string) => {
    setSelectedSite(siteKey);
    const site = sites[siteKey];
    if (site?.metadata?.isActive && site?.checks) {
      handleSiteClick(site.checks, siteKey);
    }
  };

  const handleAddSite = () => {
    // This will be handled by the existing dialog
  };

  if (!isSignedIn) {
    return <LandingPage />;
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        sites={sites}
        selectedSite={selectedSite}
        onSiteSelect={handleSiteSelect}
        onAddSite={handleAddSite}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        className="flex-shrink-0"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">SitesPulse</h1>
                <p className="text-sm text-gray-500">
                  Welcome back, {userData?.fullname || 'User'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <SignOutButton>
                <Button variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {showError && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Sorry</AlertTitle>
              <AlertDescription>We are not able to process the request currently</AlertDescription>
            </Alert>
          )}

          {/* Tab Content */}
          {activeTab === 'sites' && (
            <SitesTab
              sites={sites}
              onSiteSelect={handleSiteSelect}
              onAddSite={handleAddSite}
              onToggleActive={(siteKey) => {
                console.log('Toggle active for', siteKey);
              }}
              onDelete={(siteKey) => {
                console.log('Delete', siteKey);
              }}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab
              sites={sites}
              selectedSite={selectedSite}
              onSiteSelect={handleSiteSelect}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsTab sites={sites} />
          )}

          {activeTab === 'settings' && (
            <SettingsTab sites={sites} userData={userData} />
          )}

          {activeTab === 'help' && (
            <HelpTab />
          )}

          {/* Add Site Dialog - Available in Sites Tab */}
          <Dialog>
            <DialogTrigger asChild>
              <div style={{ display: 'none' }} />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add a new website</DialogTitle>
                <DialogDescription>
                  We'll monitor your website and send you alerts when it goes down or comes back up.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleNewUrl} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="url">Website URL</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Enter the full URL including https://</p>
                        <p>Example: https://example.com</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    className="focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    type="text"
                    name="url"
                    placeholder="https://example.com"
                    onChange={handleFormValues}
                  />
                  {urlError && <p className="text-sm text-red-600">{urlError}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Display Name (Optional)</Label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="My Website"
                    onChange={handleFormValues}
                  />
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Add Website
                  </Button>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setUrlError('')}
                      ref={closeRef}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </main>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
