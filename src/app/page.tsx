import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Truck, Package, Users, TrendingUp, Shield, Zap } from "lucide-react";

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

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
            <CardDescription className="text-base">
              Sign in to access the admin dashboard and start managing your delivery business
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8">
                Sign In to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
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
              <span>© 2025 Movogo. All rights reserved.</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="text-center text-sm text-zinc-500">
            <p>Administration dashboard for delivery management</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
