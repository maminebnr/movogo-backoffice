import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Truck, Package, Users, TrendingUp, Shield, Zap, BarChart3, MapPin, Clock, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-br from-zinc-50 to-zinc-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/logo.svg" alt="Movogo" width={40} height={40} />
              <span className="text-xl font-bold text-orange-600">Movogo</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/login">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 flex-1">
        <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-zinc-900">
            Delivery Management
            <span className="text-orange-600"> Backoffice</span>
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl">
            Manage carriers, senders, deliveries, and track your business performance
            with our comprehensive admin dashboard
          </p>
          <div className="flex gap-4">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">Powerful Features</h2>
          <p className="text-zinc-600 text-lg">Everything you need to manage your delivery business</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <Truck className="w-10 h-10 text-orange-600 mb-2" />
              <CardTitle>Carrier Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600">
                Manage all carrier accounts, track their status, and monitor wallet balances
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Package className="w-10 h-10 text-orange-600 mb-2" />
              <CardTitle>Delivery Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600">
                Track today&apos;s and active deliveries in real-time with detailed status updates
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className="w-10 h-10 text-orange-600 mb-2" />
              <CardTitle>Sender Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600">
                View and manage all sender accounts with complete contact information
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <TrendingUp className="w-10 h-10 text-orange-600 mb-2" />
              <CardTitle>Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600">
                Monitor app gain, total funds, and business performance metrics
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="w-10 h-10 text-orange-600 mb-2" />
              <CardTitle>Account Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600">
                Manage user accounts, roles, and permissions with ease
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Zap className="w-10 h-10 text-orange-600 mb-2" />
              <CardTitle>Vehicle Types</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600">
                Add and manage vehicle types with custom icons and descriptions
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* More Details Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">Why Choose Movogo Backoffice?</h2>
            <p className="text-zinc-600 text-lg">Comprehensive management tools for your delivery operations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="overflow-hidden border-2 hover:border-orange-300 transition-colors group">
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGM0LjQxOCAwIDgtMy41ODIgOC04cy0zLjU4Mi04LTgtOC04IDMuNTgyLTggOCAzLjU4MiA4IDggOHoiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <Clock className="w-20 h-20 text-white opacity-90 group-hover:scale-110 transition-transform" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Real-Time Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600">
                  Monitor deliveries in real-time with live status updates. Track today&apos;s deliveries and active shipments with instant notifications and status changes.
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-2 hover:border-orange-300 transition-colors group">
              <div className="relative h-48 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGM0LjQxOCAwIDgtMy41ODIgOC04cy0zLjU4Mi04LTgtOC04IDMuNTgyLTggOCAzLjU4MiA4IDggOHoiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <BarChart3 className="w-20 h-20 text-white opacity-90 group-hover:scale-110 transition-transform" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Comprehensive Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600">
                  Get detailed insights into your business performance with revenue trends, delivery statistics, and financial analytics to make data-driven decisions.
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-2 hover:border-orange-300 transition-colors group">
              <div className="relative h-48 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGM0LjQxOCAwIDgtMy41ODIgOC04cy0zLjU4Mi04LTgtOC04IDMuNTgyLTggOCAzLjU4MiA4IDggOHoiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <Users className="w-20 h-20 text-white opacity-90 group-hover:scale-110 transition-transform" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600">
                  Efficiently manage carriers, senders, and accounts. Control access levels, monitor wallet balances, and track user activity from one central dashboard.
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-2 hover:border-orange-300 transition-colors group">
              <div className="relative h-48 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGM0LjQxOCAwIDgtMy41ODIgOC04cy0zLjU4Mi04LTgtOC04IDMuNTgyLTggOCAzLjU4MiA4IDggOHoiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <Zap className="w-20 h-20 text-white opacity-90 group-hover:scale-110 transition-transform" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  Flexible Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600">
                  Customize vehicle types, manage delivery settings, and configure system parameters to match your business requirements and operational needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.svg" alt="Movogo" width={32} height={32} />
              <span className="font-semibold text-orange-600">Movogo Backoffice</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-600">
              <span>© {new Date().getFullYear()} Movogo. All rights reserved.</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="text-center text-sm text-zinc-500 space-y-2">
            <p>Administration dashboard for delivery management</p>
            <p>Made by <span className="font-semibold text-zinc-700">Persista Technology</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
