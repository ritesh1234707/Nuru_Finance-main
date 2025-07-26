// import React from "react";
import { useAuth } from "../contexts/AuthProvider"; 
import { Button } from "./ui/button";

// Helper to shorten long principal IDs
const shortenPrincipal = (principal: string) =>
  principal.length > 12 ? `${principal.slice(0, 8)}...${principal.slice(-4)}` : principal;

export function AuthComponent() {
  let auth;
  try {
    auth = useAuth();
  } catch (err) {
    console.error("AuthProvider missing or broken:", err);
    return <span className="text-red-500">Auth unavailable</span>;
  }

  const { isAuthenticated, principal, login, logout, isLoading } = auth;

  if (isLoading) {
    return <span className="text-gray-300 text-sm">Checking session...</span>;
  }

  if (!isAuthenticated) {
    return (
      <Button
        onClick={login}
        className="bg-orange-600 hover:bg-orange-700 text-white"
      >
        Login
      </Button>
    );
  }

  // Authenticated
  const principalText = principal ? shortenPrincipal(principal.toText()) : "Unknown";

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-300">{principalText}</span>
      <Button
        className="bg-red-600 hover:bg-red-700 text-white"
        onClick={logout}
      >
        Logout
      </Button>
    </div>
  );
}
