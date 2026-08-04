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
import { Lock, Mail, Truck, Package, TrendingUp } from "lucide-react";

export default function LoginPage() {
  const { isAuthenticated, isLoading: authLoading, login: authLogin } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await login({
        variables: {
          input: {
            email,
            password,
          },
        },
      });

      const payload = result.data as
        | { login?: { accessToken?: string; message?: string } }
        | null
        | undefined;

      const graphQLError =
        result.error?.message ||
        (result as { errors?: { message?: string }[] }).errors?.[0]?.message;

      if (graphQLError && !payload?.login?.accessToken) {
        toast.error(graphQLError, { duration: 6000 });
        return;
      }

      if (payload?.login?.accessToken) {
        const token = payload.login.accessToken;
        let role = "ADMIN";
        let id = "";
        try {
          const part = token.split(".")[1];
          const json = JSON.parse(
            atob(part.replace(/-/g, "+").replace(/_/g, "/")),
          ) as { id?: string; role?: string };
          if (json.role) role = json.role;
          if (json.id) id = json.id;
        } catch {
          // keep defaults
        }
        authLogin(token, { id, email, role });
        toast.success(payload.login.message || "Login successful!");
        router.push("/dashboard");
        return;
      }

      toast.error("Login failed. Please check your credentials.");
    } catch (error: unknown) {
      console.error("Login error:", error);
      const err = error as {
        message?: string;
        graphQLErrors?: { message?: string }[];
        networkError?: { message?: string };
      };
      const errorMessage =
        err?.graphQLErrors?.[0]?.message ||
        err?.networkError?.message ||
        err?.message ||
        "Login failed. Please check your credentials and network connection.";
      toast.error(errorMessage, { duration: 6000 });
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
