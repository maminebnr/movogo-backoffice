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

      if (data?.login?.accessToken) {
        // Create a minimal user object since the API doesn't return user info in login response
        // We'll use the email from the login form and set a default role
        const user = {
          id: "", // Will be fetched later if needed
          email: email,
          role: "ADMIN", // Default role, can be updated after fetching user profile
        };
        authLogin(data.login.accessToken, user);
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Check if it's a fetch error (likely Chrome extension interference)
      const isFetchError = error?.message?.includes("Failed to fetch") || 
                          error?.networkError?.message?.includes("Failed to fetch");
      
      let errorMessage = error?.networkError?.message || 
                        error?.graphQLErrors?.[0]?.message || 
                        error?.message || 
                        "Login failed. Please check your credentials and network connection.";
      
      if (isFetchError) {
        errorMessage = "Network request failed. This may be caused by a browser extension. Please try disabling extensions or using incognito mode.";
      }
      
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-dvh grid place-items-center bg-zinc-50">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Movogo" width={36} height={36} />
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@movogo.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" variant="default" disabled={loading}>
              {loading ? "Signing in..." : "Continue"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
