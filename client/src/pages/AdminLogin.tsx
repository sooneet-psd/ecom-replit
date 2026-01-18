import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Lock, User, Eye, EyeOff, ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface SessionResponse {
  authenticated: boolean;
  user?: { id: string; username: string };
}

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSetup, setIsSetup] = useState(false);

  const sessionQuery = useQuery<SessionResponse>({
    queryKey: ["/api/admin/session"],
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const res = await apiRequest("POST", "/api/admin/login", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/session"] });
      toast({ title: "Login successful", description: "Welcome back!" });
      setLocation("/admin");
    },
    onError: () => {
      toast({ title: "Login failed", description: "Invalid username or password", variant: "destructive" });
    },
  });

  const setupMutation = useMutation({
    mutationFn: async (data: { password: string }) => {
      const res = await apiRequest("POST", "/api/admin/setup", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Admin created", description: "You can now login with your password" });
      setIsSetup(false);
    },
    onError: (error: Error) => {
      if (error.message.includes("already exists")) {
        toast({ title: "Admin exists", description: "Admin account already set up. Please login." });
        setIsSetup(false);
      } else {
        toast({ title: "Setup failed", description: error.message, variant: "destructive" });
      }
    },
  });

  // Redirect if already logged in
  if (sessionQuery.data?.authenticated) {
    setLocation("/admin");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSetup) {
      setupMutation.mutate({ password });
    } else {
      loginMutation.mutate({ username, password });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/">
          <Button variant="ghost" className="mb-4" data-testid="button-back-home">
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Store
          </Button>
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>{isSetup ? "Setup Admin Account" : "Admin Login"}</CardTitle>
            <CardDescription>
              {isSetup
                ? "Create your admin password to get started"
                : "Enter your credentials to access the dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isSetup && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      placeholder="admin"
                      data-testid="input-admin-username"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder={isSetup ? "Choose a secure password" : "Enter your password"}
                    data-testid="input-admin-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending || setupMutation.isPending}
                data-testid="button-admin-login"
              >
                {loginMutation.isPending || setupMutation.isPending
                  ? "Please wait..."
                  : isSetup
                  ? "Create Admin Account"
                  : "Login"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => setIsSetup(!isSetup)}
                className="text-primary"
                data-testid="button-toggle-setup"
              >
                {isSetup ? "Already have an account? Login" : "First time? Setup admin account"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
