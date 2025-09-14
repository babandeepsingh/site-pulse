"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { SignIn } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { 
  CheckCircle, 
  Zap, 
  Shield, 
  BarChart3, 
  Globe, 
  Mail, 
  Clock, 
  Users,
  Star,
  ArrowRight,
  Play,
  Monitor,
  Smartphone,
  Server,
  TrendingUp,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

const LandingPage = () => {
  const [open, setOpen] = useState(false);

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: "Real-Time Monitoring",
      description: "Get instant alerts when your website goes down. Monitor uptime 24/7 with 99.9% accuracy."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      title: "Advanced Analytics",
      description: "Deep insights into performance metrics, response times, and historical data trends."
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Security Monitoring",
      description: "Track SSL certificates, security headers, and detect potential vulnerabilities."
    },
    {
      icon: <Mail className="h-8 w-8 text-orange-600" />,
      title: "Smart Notifications",
      description: "Get notified via email, SMS, or Slack when issues are detected or resolved."
    },
    {
      icon: <Globe className="h-8 w-8 text-cyan-600" />,
      title: "Global Monitoring",
      description: "Monitor from multiple locations worldwide to ensure global accessibility."
    },
    {
      icon: <Clock className="h-8 w-8 text-red-600" />,
      title: "Response Time Tracking",
      description: "Track and optimize your website's response times for better user experience."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CTO, TechCorp",
      content: "SitePulse has been a game-changer for our infrastructure monitoring. The real-time alerts saved us from multiple outages.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "DevOps Engineer, StartupXYZ",
      content: "The analytics dashboard is incredibly detailed. We've improved our site performance by 40% since using SitePulse.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Founder, E-commerce Plus",
      content: "Easy to set up, reliable monitoring, and excellent customer support. Highly recommended for any business.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for personal projects",
      features: [
        "Up to 5 websites",
        "Basic monitoring",
        "Email alerts",
        "7-day history",
        "Community support"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Professional",
      price: "$19",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Up to 50 websites",
        "Advanced monitoring",
        "SMS & Slack alerts",
        "90-day history",
        "Priority support",
        "Custom dashboards"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large organizations",
      features: [
        "Unlimited websites",
        "Enterprise monitoring",
        "All alert channels",
        "Unlimited history",
        "24/7 phone support",
        "Custom integrations",
        "SLA guarantee"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

    return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Monitor className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SitePulse</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-gray-300">
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md sm:p-0">
                  <DialogHeader>
                    <DialogTitle>Welcome to SitePulse</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center items-center p-4">
                    <SignIn routing="hash" />
                  </div>
                </DialogContent>
              </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            Get Started
                        </Button>
                    </DialogTrigger>
                <DialogContent className="max-w-md sm:p-0">
                        <DialogHeader>
                    <DialogTitle>Welcome to SitePulse</DialogTitle>
                        </DialogHeader>
                  <div className="flex justify-center items-center p-4">
                    <SignIn routing="hash" />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
              <Zap className="h-4 w-4 mr-2" />
              Trusted by 10,000+ websites worldwide
            </div> */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Monitor Your Website
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Like a Pro
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get instant alerts when your website goes down. Monitor uptime, performance, and security 
              with our powerful monitoring platform trusted by businesses worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md sm:p-0">
                  <DialogHeader>
                    <DialogTitle>Welcome to SitePulse</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center items-center p-4">
                            <SignIn routing="hash" />
                        </div>
                    </DialogContent>
                </Dialog>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                Setup in 2 minutes
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
            </section>

            {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to monitor your websites
                    </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to keep your websites running smoothly and your team informed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader className="pb-4">
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Websites Monitored</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">&lt;30s</div>
              <div className="text-blue-100">Average Alert Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by developers and businesses
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say about SitePulse
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 shadow-lg">
                <CardContent>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that's right for your business
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`p-8 relative ${plan.popular ? 'ring-2 ring-blue-600 shadow-xl' : 'shadow-lg'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {plan.price}
                    {plan.period && <span className="text-lg text-gray-500">{plan.period}</span>}
                  </div>
                  <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className={`w-full ${plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                          : 'bg-gray-900 hover:bg-gray-800'
                        }`}
                      >
                        {plan.cta}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md sm:p-0">
                      <DialogHeader>
                        <DialogTitle>Welcome to SitePulse</DialogTitle>
                      </DialogHeader>
                      <div className="flex justify-center items-center p-4">
                        <SignIn routing="hash" />
                      </div>
                    </DialogContent>
                  </Dialog>
                            </CardContent>
                        </Card>
            ))}
                    </div>
                </div>
            </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to start monitoring your websites?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of businesses who trust SitePulse to keep their websites running smoothly.
                </p>
                <Dialog>
                    <DialogTrigger asChild>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </DialogTrigger>
            <DialogContent className="max-w-md sm:p-0">
                        <DialogHeader>
                <DialogTitle>Welcome to SitePulse</DialogTitle>
                        </DialogHeader>
              <div className="flex justify-center items-center p-4">
                            <SignIn routing="hash" />
                        </div>
                    </DialogContent>
                </Dialog>
        </div>
            </section>

            {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Monitor className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">SitePulse</span>
              </div>
              <p className="text-gray-400">
                Professional website monitoring for businesses of all sizes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SitePulse. All rights reserved.</p>
          </div>
                        </div>
      </footer>
        </div>
    );
};

export default LandingPage;
