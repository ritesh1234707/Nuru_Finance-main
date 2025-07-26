import { useState, useEffect, useContext, createContext, ReactNode } from "react";
import { Principal } from "@dfinity/principal";
import { backendService } from "../lib/backend";

// Import types from the generated declarations
import type { User, SavingsPool } from "../../../declarations/nuru_backend/nuru_backend.did";
import type { Proposal } from "../../../declarations/canister_three/canister_three.did";
import type { YieldStrategy, UserPosition } from "../../../declarations/canister_four/canister_four.did";

interface AppUser {
  profile: User | null;
  bitcoinBalance: number;
  isAuthenticated: boolean;
  isRegistered: boolean;
  principal: Principal | null;
}

interface AppContextType {
  user: AppUser;
  proposals: Proposal[];
  yieldStrategies: YieldStrategy[];
  userPositions: UserPosition[];
  savingsPools: SavingsPool[];
  isLoading: boolean;
  error: string | null;
  
  // User actions
  login: (principal: Principal) => Promise<boolean>;
  logout: () => void;
  registerUser: () => Promise<boolean>;
  
  // Savings actions
  getAllActivePools: () => Promise<void>;
  createSavingsPool: (name: string, targetAmount: number, deadline: bigint, poolType: 'individual' | 'group') => Promise<boolean>;
  joinPool: (poolId: bigint) => Promise<boolean>;
  depositToPool: (poolId: bigint, amount: number) => Promise<boolean>;
  
  // Bitcoin actions
  createWallet: () => Promise<boolean>;
  getBalance: () => Promise<void>;
  transferToSavings: (amount: number, poolId: bigint) => Promise<boolean>;
  
  // Governance actions
  vote: (proposalId: bigint, support: boolean) => Promise<boolean>;
  createProposal: (title: string, description: string, proposalType: 'newFeature' | 'parameterChange' | 'treasurySpend') => Promise<boolean>;
  refreshProposals: () => Promise<void>;
  
  // Yield actions
  enterPosition: (strategyId: string, amount: number) => Promise<boolean>;
  refreshYieldStrategies: () => Promise<void>;
  getUserPositions: () => Promise<void>;
  claimYields: () => Promise<boolean>;
  calculateCurrentYield: () => Promise<number>;
  projectReturns: (amount: number, strategyId: string, duration: bigint) => Promise<number>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser>({
    profile: null,
    bitcoinBalance: 0,
    isAuthenticated: false,
    isRegistered: false,
    principal: null
  });
  
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [yieldStrategies, setYieldStrategies] = useState<YieldStrategy[]>([]);
  const [userPositions, setUserPositions] = useState<UserPosition[]>([]);
  const [savingsPools, setSavingsPools] = useState<SavingsPool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize data on app load
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      try {
        // Load public data (proposals, yield strategies, savings pools) regardless of authentication
        await Promise.all([
          refreshProposals(),
          refreshYieldStrategies(),
          getAllActivePools()
        ]);
      } catch (err) {
        setError("Failed to initialize app data");
        console.error("Initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const login = async (principal: Principal): Promise<boolean> => {
    console.log("AppContext: Starting login with principal:", principal.toString());
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch user profile
      console.log("AppContext: Fetching user profile...");
      const profile = await backendService.getUserProfile();
      console.log("AppContext: Profile result:", profile);
      
      if (!profile) {
        // User doesn't exist, might need to register
        console.log("AppContext: User doesn't exist, setting as unauthenticated/unregistered");
        setUser((prev: AppUser) => ({
          ...prev,
          principal,
          isAuthenticated: true,
          isRegistered: false,
          profile: null
        }));
        return false; // User needs registration
      } else {
        // User exists, load their data
        console.log("AppContext: User exists, loading data...");
        const bitcoinBalance = await backendService.getBalance();

        setUser({
          profile,
          bitcoinBalance,
          isAuthenticated: true,
          isRegistered: true,
          principal
        });
        return true; // User is already registered
      }
    } catch (err) {
      console.error("AppContext: Login error:", err);
      setError("Failed to login");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser({
      profile: null,
      bitcoinBalance: 0,
      isAuthenticated: false,
      isRegistered: false,
      principal: null
    });
    setError(null);
  };

  // Updated registerUser to handle the new return type
  const registerUser = async (): Promise<boolean> => {
    console.log("AppContext: Starting registerUser...");
    
    if (!user.principal) {
      console.error("AppContext: No principal available for user registration");
      setError("No principal available for user registration");
      return false;
    }

    if (!user.isAuthenticated) {
      console.error("AppContext: User not authenticated");
      setError("User not authenticated. Please connect your wallet first.");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("AppContext: Calling backendService.registerUser...");
      const result = await backendService.registerUser(); // Now returns { success: boolean; message: string }
      console.log("AppContext: Registration backend result:", result);
      
      if (result.success) {
        console.log("AppContext: Registration successful, message:", result.message);
        
        // Refresh user profile after registration and ensure state is updated
        console.log("AppContext: Fetching updated user profile...");
        const profile = await backendService.getUserProfile();
        console.log("AppContext: Updated profile:", profile);
        
        setUser((prev: AppUser) => {
          const updatedUser = { 
            ...prev, 
            profile,
            isRegistered: true 
          };
          console.log("AppContext: Updated user state:", updatedUser);
          return updatedUser;
        });
        
        console.log("AppContext: User registration completed successfully");
        return true;
      } else {
        console.error("AppContext: Backend registration failed:", result.message);
        setError(`Registration failed: ${result.message}`);
        return false;
      }
    } catch (err) {
      console.error("AppContext: User registration error:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Failed to register user: ${errorMessage}`);
      return false;
    } finally {
      setIsLoading(false);
      console.log("AppContext: registerUser completed");
    }
  };

  const getBalance = async (): Promise<void> => {
    if (!user.principal) return;

    try {
      const bitcoinBalance = await backendService.getBalance();
      setUser((prev: AppUser) => ({
        ...prev,
        bitcoinBalance
      }));
    } catch (err) {
      console.error("Error refreshing balance:", err);
    }
  };

  const getAllActivePools = async (): Promise<void> => {
    try {
      const pools = await backendService.getAllActivePools();
      setSavingsPools(pools);
    } catch (err) {
      console.error("Error fetching active pools:", err);
    }
  };

  const createSavingsPool = async (name: string, targetAmount: number, deadline: bigint, poolType: 'individual' | 'group'): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const poolId = await backendService.createSavingsPool(name, targetAmount, deadline, poolType);
      if (poolId !== null) {
        await getAllActivePools();
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to create savings pool");
      console.error("Create savings pool error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const joinPool = async (poolId: bigint): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await backendService.joinPool(poolId);
      if (success) {
        await getAllActivePools();
      }
      return success;
    } catch (err) {
      setError("Failed to join pool");
      console.error("Join pool error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const depositToPool = async (poolId: bigint, amount: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await backendService.depositToPool(poolId, amount);
      if (success) {
        await Promise.all([getBalance(), getAllActivePools()]);
      }
      return success;
    } catch (err) {
      setError("Failed to deposit to pool");
      console.error("Deposit to pool error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createWallet = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const address = await backendService.createWallet();
      if (address) {
        await getBalance();
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to create wallet");
      console.error("Create wallet error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const transferToSavings = async (amount: number, poolId: bigint): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const amountInSatoshis = BigInt(Math.floor(amount * 100000000));
      const success = await backendService.transferToSavings(amountInSatoshis, poolId);
      if (success) {
        await Promise.all([getBalance(), getAllActivePools()]);
      }
      return success;
    } catch (err) {
      setError("Failed to transfer to savings");
      console.error("Transfer to savings error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProposals = async (): Promise<void> => {
    try {
      const newProposals = await backendService.getActiveProposals();
      setProposals(newProposals);
    } catch (err) {
      console.error("Error refreshing proposals:", err);
    }
  };

  const vote = async (proposalId: bigint, support: boolean): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await backendService.vote(proposalId, support);
      if (success) {
        await refreshProposals();
      }
      return success;
    } catch (err) {
      setError("Failed to vote");
      console.error("Vote error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createProposal = async (title: string, description: string, proposalType: 'newFeature' | 'parameterChange' | 'treasurySpend'): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await backendService.createProposal(title, description, proposalType);
      if (success) {
        await refreshProposals();
      }
      return success;
    } catch (err) {
      setError("Failed to create proposal");
      console.error("Create proposal error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshYieldStrategies = async (): Promise<void> => {
    try {
      const strategies = await backendService.getAvailableStrategies();
      setYieldStrategies(strategies);
    } catch (err) {
      console.error("Error refreshing yield strategies:", err);
    }
  };

  const enterPosition = async (strategyId: string, amount: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await backendService.enterPosition(strategyId, amount);
      if (success) {
        await Promise.all([getBalance(), refreshYieldStrategies(), getUserPositions()]);
      }
      return success;
    } catch (err) {
      setError("Failed to enter position");
      console.error("Enter position error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserPositions = async (): Promise<void> => {
    try {
      const positions = await backendService.getUserPositions();
      setUserPositions(positions);
    } catch (err) {
      console.error("Error getting user positions:", err);
    }
  };

  const claimYields = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const claimed = await backendService.claimYields();
      if (claimed > 0) {
        await Promise.all([getBalance(), getUserPositions()]);
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to claim yields");
      console.error("Claim yields error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCurrentYield = async (): Promise<number> => {
    try {
      return await backendService.calculateCurrentYield();
    } catch (err) {
      console.error("Error calculating current yield:", err);
      return 0;
    }
  };

  const projectReturns = async (amount: number, strategyId: string, duration: bigint): Promise<number> => {
    try {
      return await backendService.projectReturns(amount, strategyId, duration);
    } catch (err) {
      console.error("Error projecting returns:", err);
      return 0;
    }
  };

  const contextValue: AppContextType = {
    user,
    proposals,
    yieldStrategies,
    userPositions,
    savingsPools,
    isLoading,
    error,
    login,
    logout,
    registerUser,
    getAllActivePools,
    createSavingsPool,
    joinPool,
    depositToPool,
    createWallet,
    getBalance,
    transferToSavings,
    vote,
    createProposal,
    refreshProposals,
    enterPosition,
    refreshYieldStrategies,
    getUserPositions,
    claimYields,
    calculateCurrentYield,
    projectReturns
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};