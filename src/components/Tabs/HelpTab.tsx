"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { 
  HelpCircle, 
  Mail, 
  MessageCircle, 
  Book, 
  Video, 
  FileText,
  ExternalLink,
  Search,
  ChevronRight,
  Phone,
  Clock
} from "lucide-react";

export function HelpTab() {
  const faqItems = [
    {
      question: "How do I add a new website to monitor?",
      answer: "Click the 'Add Website' button in the Sites tab, enter your website URL, and give it a display name. We'll start monitoring it immediately."
    },
    {
      question: "How often are websites checked?",
      answer: "We check your websites every 5 minutes to ensure accurate uptime monitoring and quick detection of any issues."
    },
    {
      question: "What happens when my website goes down?",
      answer: "You'll receive an instant email notification when your website goes offline, and another when it comes back online."
    },
    {
      question: "Can I monitor multiple websites?",
      answer: "Yes! The free plan allows up to 5 websites. Paid plans support many more websites with additional features."
    },
    {
      question: "How accurate is the uptime monitoring?",
      answer: "Our monitoring is 99.9% accurate. We use multiple monitoring locations to ensure reliable detection of website status."
    },
    {
      question: "Can I customize alert settings?",
      answer: "Yes! You can configure email notifications, set response time thresholds, and customize alert preferences in the Settings tab."
    }
  ];

  const helpResources = [
    {
      title: "Getting Started Guide",
      description: "Learn how to set up your first website monitoring",
      icon: Book,
      type: "guide"
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      icon: Video,
      type: "video"
    },
    {
      title: "API Documentation",
      description: "Integrate SitesPulse with your applications",
      icon: FileText,
      type: "documentation"
    },
    {
      title: "Status Page",
      description: "Check the current status of our monitoring services",
      icon: ExternalLink,
      type: "external"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Help & Support</h2>
          <p className="text-gray-600">Get help and find answers to your questions</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search help articles, guides, and FAQs..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Contact Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Email Support</h4>
                  <p className="text-sm text-gray-500">Get help via email</p>
                </div>
              </div>
              <div className="ml-11">
                <a 
                  href="mailto:me@babandeep.in" 
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  me@babandeep.in
                </a>
                <p className="text-sm text-gray-500 mt-1">
                  <Clock className="h-3 w-3 inline mr-1" />
                  Response time: Within 24 hours
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Live Chat</h4>
                  <p className="text-sm text-gray-500">Chat with our support team</p>
                </div>
              </div>
              <div className="ml-11">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Start Chat
                </Button>
                <p className="text-sm text-gray-500 mt-1">
                  <Clock className="h-3 w-3 inline mr-1" />
                  Available 24/7
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Book className="h-5 w-5 mr-2" />
            Help Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {helpResources.map((resource, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <resource.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{resource.title}</h4>
                  <p className="text-sm text-gray-500">{resource.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h4 className="font-medium text-gray-900 mb-2">{item.question}</h4>
                <p className="text-sm text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Send us a Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="What can we help you with?" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your question or issue..."
              />
            </div>
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Send Message
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Support Team</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">me@babandeep.in</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">24/7 Support Available</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Response Times</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Email Support:</span>
                  <span className="font-medium">Within 24 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Live Chat:</span>
                  <span className="font-medium">Immediate</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Critical Issues:</span>
                  <span className="font-medium">Within 2 hours</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
