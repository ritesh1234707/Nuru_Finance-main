// backend.ts - Fixed version with better error handling
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { Identity } from "@dfinity/agent";

// Import the generated actor factories
import { createActor as createNuruBackendActor } from "../../../declarations/nuru_backend";
import { createActor as createBitcoinActor } from "../../../declarations/canister_two";
import { createActor as createGovernanceActor } from "../../../declarations/canister_three";
import { createActor as createYieldActor } from "../../../declarations/canister_four";

// Canister IDs
import { canisterId as nuruBackendCanisterId } from "../../../declarations/nuru_backend";
import { canisterId as bitcoinCanisterId } from "../../../declarations/canister_two";
import { canisterId as governanceCanisterId } from "../../../declarations/canister_three";
import { canisterId as yieldCanisterId } from "../../../declarations/canister_four";

// Types from Motoko did
import type { User, SavingsPool, Investment } from "../../../declarations/nuru_backend/nuru_backend.did";
import type { Proposal } from "../../../declarations/canister_three/canister_three.did";
import type { YieldStrategy, UserPosition } from "../../../declarations/canister_four/canister_four.did";
import type { Wallet } from "../../../declarations/canister_two/canister_two.did";

// ENV setup
const isDevelopment = import.meta.env.DEV || import.meta.env.DFX_NETWORK === "local";
const HOST = isDevelopment ? "http://localhost:4943" : "https://ic0.app";

console.log("Backend Config:", { isDevelopment, HOST });

let nuruBackendActor: any = null;
let bitcoinActor: any = null;
let governanceActor: any = null;
let yieldActor: any = null;

// Create actors after login
export const initializeActors = (identity: Identity) => {
  console.log("Initializing actors with principal:", identity.getPrincipal().toString());
  const agent = new HttpAgent({ host: HOST, identity });

  if (isDevelopment) {
    agent.fetchRootKey().catch(err => {
      console.warn("Failed to fetch root key", err);
    });
  }

  nuruBackendActor = createNuruBackendActor(nuruBackendCanisterId, { agent });
  bitcoinActor = createBitcoinActor(bitcoinCanisterId, { agent });
  governanceActor = createGovernanceActor(governanceCanisterId, { agent });
  yieldActor = createYieldActor(yieldCanisterId, { agent });
};

const ensureActorsInitialized = () => {
  if (!nuruBackendActor) {
    throw new Error("Actors not initialized! Please login first.");
  }
};

export const backendService = {
  async registerUser(): Promise<{ success: boolean; message: string }> {
    try {
      console.log("🔄 Starting registerUser...");
      ensureActorsInitialized();
      
      console.log("🔄 Calling Motoko registerUser function...");
      const result = await nuruBackendActor.registerUser();
      console.log("📋 Raw Motoko registerUser result:", result);
      console.log("📋 Result type:", typeof result);
      console.log("📋 Result keys:", Object.keys(result));

      // Handle Motoko Result<Text, Text> type
      if (result && typeof result === 'object') {
        if ('ok' in result) {
          console.log("Registration successful:", result.ok);
          return { success: true, message: result.ok };
        } else if ('err' in result) {
          console.log("Registration failed:", result.err);
          return { success: false, message: result.err };
        }
      }
      
      // Fallback for unexpected result format
      console.error("Unexpected result format:", result);
      return { success: false, message: "Unexpected response format from backend" };
      
    } catch (error) {
      console.error("registerUser caught exception:");
      console.error("Error object:", error);
      console.error("Error message:", error instanceof Error ? error.message : 'Unknown error');
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack');
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('not initialized')) {
          return { success: false, message: "Please connect your wallet first" };
        }
        if (error.message.includes('network')) {
          return { success: false, message: "Network error. Please check your connection." };
        }
        return { success: false, message: `Registration error: ${error.message}` };
      }
      
      return { success: false, message: "Unexpected error during registration" };
    }
  },

  async getUserProfile(): Promise<User | null> {
    try {
      console.log("Fetching user profile...");
      ensureActorsInitialized();
      const result = await nuruBackendActor.getUserProfile();
      console.log("getUserProfile result:", result);
      
      if ("ok" in result) {
        console.log("User profile found");
        return result.ok;
      } else if ("err" in result) {
        console.log("User profile error:", result.err);
        return null;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  },

  async getAllActivePools(): Promise<SavingsPool[]> {
    try {
      console.log("Fetching all active pools...");
      ensureActorsInitialized();
      const result = await nuruBackendActor.getAllActivePools();
      console.log("getAllActivePools result:", result);
      return result || [];
    } catch (error) {
      console.error("Error fetching pools:", error);
      return [];
    }
  },

  async createSavingsPool(
    name: string,
    targetAmount: number,
    deadline: bigint,
    poolType: "individual" | "group"
  ): Promise<bigint | null> {
    try {
      console.log("Creating savings pool:", { name, targetAmount, deadline, poolType });
      ensureActorsInitialized();
      
      const poolTypeValue = poolType === "individual" ? { individual: null } : { group: null };
      console.log("Pool type value:", poolTypeValue);
      
      const result = await nuruBackendActor.createSavingsPool(name, targetAmount, deadline, poolTypeValue);
      console.log("createSavingsPool result:", result);
      
      if ("ok" in result) {
        console.log("Pool created successfully with ID:", result.ok);
        return result.ok;
      } else if ("err" in result) {
        console.error("Pool creation failed:", result.err);
        throw new Error(result.err);
      }
      return null;
    } catch (error) {
      console.error("Error creating savings pool:", error);
      throw error; // Re-throw to be handled by calling function
    }
  },

  async joinPool(poolId: bigint): Promise<boolean> {
    try {
      console.log("Joining pool:", poolId);
      ensureActorsInitialized();
      const result = await nuruBackendActor.joinPool(poolId);
      console.log("joinPool result:", result);
      
      if ("ok" in result) {
        console.log("Successfully joined pool");
        return true;
      } else if ("err" in result) {
        console.error("Failed to join pool:", result.err);
        throw new Error(result.err);
      }
      return false;
    } catch (error) {
      console.error("Error joining pool:", error);
      throw error;
    }
  },

  async depositToPool(poolId: bigint, amount: number): Promise<boolean> {
    try {
      console.log("Depositing to pool:", { poolId, amount });
      ensureActorsInitialized();
      const result = await nuruBackendActor.depositToPool(poolId, amount);
      console.log("depositToPool result:", result);
      
      if ("ok" in result) {
        console.log("Deposit successful");
        return true;
      } else if ("err" in result) {
        console.error("Deposit failed:", result.err);
        throw new Error(result.err);
      }
      return false;
    } catch (error) {
      console.error("Error depositing:", error);
      throw error;
    }
  },

  async startInvestment(amount: number, duration: bigint): Promise<boolean> {
    try {
      console.log("Starting investment:", { amount, duration });
      ensureActorsInitialized();
      const result = await nuruBackendActor.startInvestment(amount, duration);
      console.log("startInvestment result:", result);
      
      if ("ok" in result) {
        console.log("Investment started successfully");
        return true;
      } else if ("err" in result) {
        console.error("Investment failed:", result.err);
        throw new Error(result.err);
      }
      return false;
    } catch (error) {
      console.error("Error starting investment:", error);
      throw error;
    }
  },

  async getUserInvestments(userId: Principal): Promise<Investment[]> {
    try {
      console.log("Fetching user investments for:", userId.toString());
      ensureActorsInitialized();
      const result = await nuruBackendActor.getUserInvestments(userId);
      console.log("getUserInvestments result:", result);
      return result || [];
    } catch (error) {
      console.error("Error fetching investments:", error);
      return [];
    }
  },

  
  // Bitcoin operations 
  async getWalletInfo(): Promise<Wallet | null> {
    try {
      const result = await bitcoinActor.getWalletInfo();
      if ('ok' in result) {
        return result.ok;
      }
      return null;
    } catch (error) {
      console.error("Error fetching wallet info:", error);
      return null;
    }
  },

  async getBalance(): Promise<number> {
    try {
      const result = await bitcoinActor.getBalance();
      if ('ok' in result) {
        return Number(result.ok) / 100000000; // Convert from satoshis to BTC
      }
      return 0;
    } catch (error) {
      console.error("Error fetching balance:", error);
      return 0;
    }
  },

  async createWallet(): Promise<string | null> {
    try {
      const result = await bitcoinActor.createWallet();
      if ('ok' in result) {
        return result.ok;
      }
      return null;
    } catch (error) {
      console.error("Error creating wallet:", error);
      return null;
    }
  },

  async transferToSavings(amount: bigint, poolId: bigint): Promise<boolean> {
    try {
      const result = await bitcoinActor.transferToSavings(amount, poolId);
      return 'ok' in result;
    } catch (error) {
      console.error("Error transferring to savings:", error);
      return false;
    }
  },

  async simulateDeposit(amount: bigint): Promise<boolean> {
    try {
      const result = await bitcoinActor.simulateDeposit(amount);
      return 'ok' in result;
    } catch (error) {
      console.error("Error simulating deposit:", error);
      return false;
    }
  },

  // Governance operations 
  async getActiveProposals(): Promise<Proposal[]> {
    try {
      const result = await governanceActor.getActiveProposals();
      return result;
    } catch (error) {
      console.error("Error fetching active proposals:", error);
      return [];
    }
  },

  async getProposal(proposalId: bigint): Promise<Proposal | null> {
    try {
      const result = await governanceActor.getProposal(proposalId);
      if ('ok' in result) {
        return result.ok;
      }
      return null;
    } catch (error) {
      console.error("Error fetching proposal:", error);
      return null;
    }
  },

  async vote(proposalId: bigint, support: boolean): Promise<boolean> {
    try {
      const voteType = support ? { for: null } : { against: null };
      const result = await governanceActor.vote(proposalId, voteType);
      return 'ok' in result;
    } catch (error) {
      console.error("Error voting:", error);
      return false;
    }
  },

  async createProposal(title: string, description: string, proposalType: 'newFeature' | 'parameterChange' | 'treasurySpend'): Promise<boolean> {
    try {
      const typeValue = proposalType === 'newFeature' ? { newFeature: null } : 
                       proposalType === 'parameterChange' ? { parameterChange: null } : 
                       { treasurySpend: null };
      const result = await governanceActor.createProposal(title, description, typeValue);
      return 'ok' in result;
    } catch (error) {
      console.error("Error creating proposal:", error);
      return false;
    }
  },

  // Yield operations 
  async getAvailableStrategies(): Promise<YieldStrategy[]> {
    try {
      const result = await yieldActor.getAvailableStrategies();
      return result;
    } catch (error) {
      console.error("Error fetching yield strategies:", error);
      return [];
    }
  },

  async enterPosition(strategyId: string, amount: number): Promise<boolean> {
    try {
      const result = await yieldActor.enterPosition(strategyId, amount);
      return 'ok' in result;
    } catch (error) {
      console.error("Error entering position:", error);
      return false;
    }
  },

  async getUserPositions(): Promise<UserPosition[]> {
    try {
      const result = await yieldActor.getUserPositions();
      return result;
    } catch (error) {
      console.error("Error fetching user positions:", error);
      return [];
    }
  },

  async calculateCurrentYield(): Promise<number> {
    try {
      const result = await yieldActor.calculateCurrentYield();
      if ('ok' in result) {
        return result.ok;
      }
      return 0;
    } catch (error) {
      console.error("Error calculating current yield:", error);
      return 0;
    }
  },

  async claimYields(): Promise<number> {
    try {
      const result = await yieldActor.claimYields();
      if ('ok' in result) {
        return result.ok;
      }
      return 0;
    } catch (error) {
      console.error("Error claiming yields:", error);
      return 0;
    }
  },

  async projectReturns(amount: number, strategyId: string, duration: bigint): Promise<number> {
    try {
      const result = await yieldActor.projectReturns(amount, strategyId, duration);
      if ('ok' in result) {
        return result.ok;
      }
      return 0;
    } catch (error) {
      console.error("Error projecting returns:", error);
      return 0;
    }
  },

  async getStrategyPerformance(strategyId: string): Promise<number> {
    try {
      const result = await yieldActor.getStrategyPerformance(strategyId);
      if ('ok' in result) {
        return result.ok;
      }
      return 0;
    } catch (error) {
      console.error("Error getting strategy performance:", error);
      return 0;
    }
  }
};