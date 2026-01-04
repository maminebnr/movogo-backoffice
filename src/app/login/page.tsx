"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client/react";
import { LOGIN_MUTATION } from "@/lib/graphql/mutations";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { AlertCircle, Lock, Mail, Truck, Package, TrendingUp } from "lucide-react";

export default function LoginPage() {
  const { isAuthenticated, login: authLogin } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("medaminebnr@gmail.com");
  const [password, setPassword] = useState("Password123");
  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data } = await login({
        variables: { 
          input: {
            email,
            password,
          }
        },
      });

      if (data && typeof data === 'object' && 'login' in data && (data as any).login && typeof (data as any).login === 'object' && 'accessToken' in (data as any).login) {
        // Create a minimal user object since the API doesn't return user info in login response
        // We'll use the email from the login form and set a default role
        const user = {
          id: "", // Will be fetched later if needed
          email: email,
          role: "ADMIN", // Default role, can be updated after fetching user profile
        };
        authLogin((data as any).login.accessToken, user);
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Check if it's a fetch error (likely Chrome extension interference)
      const errorMsg = error?.message || "";
      const networkErrorMsg = error?.networkError?.message || "";
      const errorString = JSON.stringify(error);
      
      const isFetchError = errorMsg.includes("Failed to fetch") || 
                          networkErrorMsg.includes("Failed to fetch") ||
                          errorString.includes("Failed to fetch") ||
                          error?.networkError?.error?.message?.includes("Failed to fetch");
      
      let errorMessage = networkErrorMsg ||
                        error?.graphQLErrors?.[0]?.message || 
                        errorMsg || 
                        "Login failed. Please check your credentials and network connection.";
      
      if (isFetchError || error?.networkError) {
        errorMessage = "Network request blocked by browser extension. Please use incognito mode or disable extensions.";
      }
      
      toast.error(errorMessage, {
        duration: 6000, // Show longer for important messages
      });
    }
  };

  return (
    <div className="min-h-dvh grid lg:grid-cols-2 bg-gradient-to-br from-orange-50 via-white to-zinc-50">
      {/* Left Side - Visual/Info */}
      <div className="hidden lg:flex flex-col justify-center items-center px-12 bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMjYgNjZjMTAuNDE4IDAgMTktOC41ODIgMTktMTlzLTguNTgyLTE5LTE5LTE5LTE5IDguNTgyLTE5IDE5IDguNTgyIDE5IDE5IDE5eiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="max-w-2xl w-full space-y-8 relative z-10">
          <div className="flex items-center justify-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-xl">
              <Image src="/logo.svg" alt="Movogo" width={56} height={56} />
            </div>
            <h1 className="text-3xl font-bold drop-shadow-lg">Movogo Backoffice</h1>
          </div>
          <div className="space-y-6">
            <p className="text-xl text-orange-50 font-medium drop-shadow text-center">
              Welcome back! Sign in to manage your delivery operations.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex flex-col items-center p-8 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                <div className="p-4 bg-white/20 rounded-xl mb-4">
                  <Truck className="w-10 h-10" />
                </div>
                <p className="text-base font-semibold text-center">Carrier Management</p>
              </div>
              <div className="flex flex-col items-center p-8 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                <div className="p-4 bg-white/20 rounded-xl mb-4">
                  <Package className="w-10 h-10" />
                </div>
                <p className="text-base font-semibold text-center">Delivery Tracking</p>
              </div>
              <div className="flex flex-col items-center p-8 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                <div className="p-4 bg-white/20 rounded-xl mb-4">
                  <TrendingUp className="w-10 h-10" />
                </div>
                <p className="text-base font-semibold text-center">Analytics & Reports</p>
              </div>
              <div className="flex flex-col items-center p-8 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                <div className="p-4 bg-white/20 rounded-xl mb-4">
                  <Lock className="w-10 h-10" />
                </div>
                <p className="text-base font-semibold text-center">Secure Access</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-4 lg:p-8">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-white border-4 border-orange-100 mb-4 mx-auto shadow-xl">
              <Image src="/logo.svg" alt="Movogo" width={64} height={64} className="drop-shadow-sm" />
            </div>
            <CardTitle className="text-3xl font-bold">Sign in</CardTitle>
            <p className="text-sm text-zinc-600 font-normal mt-2">Enter your credentials to access the dashboard</p>
          </CardHeader>
          <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Having login issues?</p>
                <p className="text-xs">If requests fail, try using incognito mode or disable browser extensions.</p>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="w-4 h-4 text-orange-600" />
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@movogo.app"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10 h-11 border-2 focus:border-orange-500"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                <Lock className="w-4 h-4 text-orange-600" />
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10 h-11 border-2 focus:border-orange-500"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button 
              className="w-full h-11 text-base font-semibold bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all" 
              type="submit" 
              variant="default" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Continue"}
            </Button>
          </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
