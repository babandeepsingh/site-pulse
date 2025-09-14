"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { 
  LayoutDashboard, 
  Globe, 
  BarChart3, 
  Settings, 
  Bell, 
  HelpCircle, 
  LogOut,
  Plus,
  Menu,
  X,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface SidebarProps {
  sites: { [key: string]: any };
  selectedSite: string;
  onSiteSelect: (siteKey: string) => void;
  onAddSite: () => void;
  activeTab: 'sites' | 'analytics' | 'alerts' | 'settings' | 'help';
  onTabChange: (tab: 'sites' | 'analytics' | 'alerts' | 'settings' | 'help') => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
  className?: string;
}

export function Sidebar({ sites, selectedSite, onSiteSelect, onAddSite, activeTab, onTabChange, isMobileOpen, setIsMobileOpen, className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const getSiteStatus = (site: any) => {
    if (!site?.checks || site.checks.length === 0) return 'unknown';
    const latestCheck = site.checks[site.checks.length - 1];
    return latestCheck.status < 400 ? 'up' : 'down';
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
        return 'border-l-green-500 bg-green-50';
      case 'down':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-300 bg-gray-50';
    }
  };

  const navigationItems = [
    { id: 'sites', icon: Activity, label: "Sites" },
    { id: 'analytics', icon: BarChart3, label: "Analytics" },
    { id: 'alerts', icon: Bell, label: "Alerts" },
    { id: 'settings', icon: Settings, label: "Settings" },
    { id: 'help', icon: HelpCircle, label: "Help" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen?.(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        "lg:relative lg:translate-x-0",
        isMobileOpen ? "fixed inset-y-0 left-0 z-50 translate-x-0" : "fixed inset-y-0 left-0 z-50 -translate-x-full",
        className
      )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">SitesPulse</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => onTabChange(item.id as any)}
            className={cn(
              "w-full justify-start transition-colors",
              isCollapsed && "justify-center px-2",
              activeTab === item.id 
                ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            <item.icon className={cn(
              "h-4 w-4", 
              !isCollapsed && "mr-3",
              activeTab === item.id ? "text-blue-600" : "text-gray-500"
            )} />
            {!isCollapsed && (
              <span className={cn(
                "font-medium",
                activeTab === item.id ? "text-blue-600" : "text-gray-700"
              )}>
                {item.label}
              </span>
            )}
          </Button>
        ))}
      </nav>



      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "h-8 w-8"
              }
            }}
          />
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Account</p>
              <p className="text-xs text-gray-500">Manage your account</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
