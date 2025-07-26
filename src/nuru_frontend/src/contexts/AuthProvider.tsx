//AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

interface AuthContextType {
  isAuthenticated: boolean;
  identity: Identity | null;
  principal: Principal | null;
  authClient: AuthClient | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get the correct Internet Identity URL based on environment
  const getIdentityProviderUrl = () => {
  const isDevelopment =
    process.env.NODE_ENV === "development" ||
    process.env.DFX_NETWORK === "local" ||
    !process.env.DFX_NETWORK;

  if (isDevelopment) {
    // Local Internet Identity canister you deployed
    return `http://umunu-kh777-77774-qaaca-cai.localhost:4943/`;
  } else {
    // Mainnet fallback
    return "https://identity.ic0.app";
  }
};

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      console.log('Initializing AuthClient...');
      const client = await AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true
        }
      });
      
      setAuthClient(client);

      // Check if user is already authenticated
      const isAuth = await client.isAuthenticated();
      console.log('Is authenticated:', isAuth);

      if (isAuth) {
        const identity = client.getIdentity();
        const principal = identity.getPrincipal();
        
        console.log('Found existing session:', principal.toString());
        
        setIsAuthenticated(true);
        setIdentity(identity);
        setPrincipal(principal);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    if (!authClient) {
      console.error('AuthClient not initialized');
      return;
    }

    try {
      console.log('Starting login process...');
      setIsLoading(true);

      const identityProviderUrl = getIdentityProviderUrl();
      console.log('Using Identity Provider:', identityProviderUrl);

      await new Promise<void>((resolve, reject) => {
        authClient.login({
          identityProvider: identityProviderUrl,
          onSuccess: () => {
            console.log('Login successful');
            resolve();
          },
          onError: (error) => {
            console.error('Login error:', error);
            reject(error);
          },
          // For local development, you might want to add these options
          ...(process.env.NODE_ENV === 'development' && {
            derivationOrigin: 'http://localhost:3000'
          })
        });
      });

      // Get the identity after successful login
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal();

      console.log('Login completed. Principal:', principal.toString());

      setIsAuthenticated(true);
      setIdentity(identity);
      setPrincipal(principal);

    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!authClient) return;

    try {
      console.log('Logging out...');
      await authClient.logout();
      
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
      
      console.log('Logout completed');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    identity,
    principal,
    authClient,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};