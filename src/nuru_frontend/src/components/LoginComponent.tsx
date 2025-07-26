//LoginComponent.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthProvider';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Wallet, User, CheckCircle, AlertCircle } from 'lucide-react';

export const LoginComponent: React.FC = () => {
  const { isAuthenticated, principal, login, logout, isLoading: authLoading } = useAuth();
  const { user, registerUser, isLoading: appLoading } = useApp();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleRegister = async () => {
    try {
      const success = await registerUser();
      if (success) {
        alert('Registration successful! You can now use all features.');
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <Card className="bg-gray-900/50 border-gray-800 w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400"></div>
              <span className="text-white">Initializing...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <Card className="bg-gray-900/50 border-gray-800 w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8 text-orange-400" />
              </div>
            </div>
            <CardTitle className="text-white text-2xl">Connect Wallet</CardTitle>
            <p className="text-gray-400">
              Connect with Internet Identity to access Nuru Finance
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleLogin}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3"
              disabled={authLoading}
            >
              {authLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Connecting...</span>
                </div>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect with Internet Identity
                </>
              )}
            </Button>
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Don't have an Internet Identity?{' '}
                <a 
                  href="https://identity.ic0.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Create one here
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated but not registered state
  if (isAuthenticated && !user.isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <Card className="bg-gray-900/50 border-gray-800 w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-white text-2xl">Complete Setup</CardTitle>
            <p className="text-gray-400">
              One more step to access all features
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-green-400 mb-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Connected</span>
              </div>
              <p className="text-gray-300 text-sm font-mono break-all">
                {principal?.toString()}
              </p>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Registration Required</span>
              </div>
              <p className="text-gray-300 text-sm">
                Register to create savings pools, join pools, and access all features.
              </p>
            </div>

            <Button 
              onClick={handleRegister}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              disabled={appLoading}
            >
              {appLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Registering...</span>
                </div>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Register Account
                </>
              )}
            </Button>

            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Disconnect
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fully authenticated and registered - this component won't be shown
  // as the main app will render instead
  return (
    <div className="flex items-center space-x-4 text-white">
      <div className="flex items-center space-x-2">
        <CheckCircle className="w-4 h-4 text-green-400" />
        <span className="text-sm">Connected & Registered</span>
      </div>
      <Button 
        onClick={handleLogout}
        variant="outline"
        size="sm"
        className="border-gray-600 text-gray-300 hover:bg-gray-800"
      >
        Disconnect
      </Button>
    </div>
  );
};