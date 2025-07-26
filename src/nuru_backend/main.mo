import Principal "mo:base/Principal";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat32 "mo:base/Nat32";
import Float "mo:base/Float";

actor SavingsApp {
    
    type UserId = Principal;
    type PoolId = Nat;
    
    type User = {
        id: UserId;
        btcAddress: ?Text;
        totalSavings: Float;
        totalInvested: Float;
        joinedPools: [PoolId];
        createdAt: Time.Time;
    };
    
    type SavingsPool = {
        id: PoolId;
        name: Text;
        creator: UserId;
        members: [UserId];
        targetAmount: Float;
        currentAmount: Float;
        deadline: Time.Time;
        isActive: Bool;
        poolType: { #individual; #group };
    };
    
    type Investment = {
        userId: UserId;
        amount: Float;
        apy: Float;
        startTime: Time.Time;
        duration: Nat; // days
        isActive: Bool;
    };
    
    private stable var nextPoolId: Nat = 0;
    private var users = HashMap.HashMap<UserId, User>(10, Principal.equal, Principal.hash);
    private var pools = HashMap.HashMap<PoolId, SavingsPool>(10, func(a: Nat, b: Nat): Bool { a == b }, func(n: Nat): Nat32 { Nat32.fromNat(n) });
    private var investments = HashMap.HashMap<UserId, [Investment]>(10, Principal.equal, Principal.hash);
    
    // Current APY rates (simplified)
    private let BASE_APY: Float = 5.2;
    private let PREMIUM_APY: Float = 8.7;
    
    public shared(msg) func registerUser(): async Result.Result<Text, Text> {
        let userId = msg.caller;
        
        switch(users.get(userId)) {
            case (?_user) { #err("User already registered") };
            case null {
                let newUser: User = {
                    id = userId;
                    btcAddress = null;
                    totalSavings = 0.0;
                    totalInvested = 0.0;
                    joinedPools = [];
                    createdAt = Time.now();
                };
                users.put(userId, newUser);
                #ok("User registered successfully")
            };
        }
    };
    
    public shared(msg) func createSavingsPool(name: Text, targetAmount: Float, deadline: Time.Time, poolType: { #individual; #group }): async Result.Result<PoolId, Text> {
        let userId = msg.caller;
        
        switch(users.get(userId)) {
            case null { #err("User not registered") };
            case (?_user) {
                let poolId = nextPoolId;
                nextPoolId += 1;
                
                let newPool: SavingsPool = {
                    id = poolId;
                    name = name;
                    creator = userId;
                    members = [userId];
                    targetAmount = targetAmount;
                    currentAmount = 0.0;
                    deadline = deadline;
                    isActive = true;
                    poolType = poolType;
                };
                
                pools.put(poolId, newPool);
                #ok(poolId)
            };
        }
    };
    
    public shared(msg) func joinPool(poolId: PoolId): async Result.Result<Text, Text> {
        let userId = msg.caller;
        
        switch(pools.get(poolId)) {
            case null { #err("Pool not found") };
            case (?pool) {
                if (pool.poolType == #individual) {
                    return #err("Cannot join individual pool");
                };
                
                let updatedMembers = Array.append(pool.members, [userId]);
                let updatedPool = {
                    pool with members = updatedMembers
                };
                pools.put(poolId, updatedPool);
                #ok("Joined pool successfully")
            };
        }
    };
    
    public shared(msg) func depositToPool(poolId: PoolId, amount: Float): async Result.Result<Text, Text> {
        let userId = msg.caller;
        
        switch(pools.get(poolId)) {
            case null { #err("Pool not found") };
            case (?pool) {
                if (Array.find(pool.members, func(id: UserId): Bool { id == userId }) == null) {
                    return #err("Not a member of this pool");
                };                
                let updatedPool = {
                    pool with currentAmount = pool.currentAmount + amount
                };
                pools.put(poolId, updatedPool);
                
                // Update user savings
                switch(users.get(userId)) {
                    case (?user) {
                        let updatedUser = {
                            user with totalSavings = user.totalSavings + amount
                        };
                        users.put(userId, updatedUser);
                    };
                    case null { };
                };
                
                #ok("Deposit successful")
            };
        }
    };
    
    public shared(msg) func startInvestment(amount: Float, duration: Nat): async Result.Result<Text, Text> {
        let userId = msg.caller;
        
        switch(users.get(userId)) {
            case null { #err("User not registered") };
            case (?user) {
                if (user.totalSavings < amount) {
                    return #err("Insufficient savings");
                };
                
                let apy = if (amount >= 1000.0) { PREMIUM_APY } else { BASE_APY };
                
                let newInvestment: Investment = {
                    userId = userId;
                    amount = amount;
                    apy = apy;
                    startTime = Time.now();
                    duration = duration;
                    isActive = true;
                };
                
                let userInvestments = switch(investments.get(userId)) {
                    case null { [newInvestment] };
                    case (?existing) { Array.append(existing, [newInvestment]) };
                };
                
                investments.put(userId, userInvestments);
                
                // Update user totals
                let updatedUser = {
                    user with 
                    totalSavings = user.totalSavings - amount;
                    totalInvested = user.totalInvested + amount;
                };
                users.put(userId, updatedUser);
                
                #ok("Investment started with " # Float.toText(apy) # "% APY")
            };
        }
    };
    
    public query(msg) func getUserProfile(): async Result.Result<User, Text> {
        let userId = msg.caller;
        
        switch(users.get(userId)) {
            case null { #err("User not found") };
            case (?user) { #ok(user) };
        }
    };
    
    public query func getUserInvestments(userId: UserId): async [Investment] {
        switch(investments.get(userId)) {
            case null { [] };
            case (?userInvestments) { userInvestments };
        }
    };
    
    public query func getPool(poolId: PoolId): async Result.Result<SavingsPool, Text> {
        switch(pools.get(poolId)) {
            case null { #err("Pool not found") };
            case (?pool) { #ok(pool) };
        }
    };
    
    public query func getAllActivePools(): async [SavingsPool] {
        let poolsArray = Iter.toArray(pools.vals());
        Array.filter(poolsArray, func(pool: SavingsPool): Bool { pool.isActive })
    };
    
    // Calculate current investment returns
    public query(msg) func calculateReturns(): async Float {
        let userId = msg.caller;
        
        switch(investments.get(userId)) {
            case null { 0.0 };
            case (?userInvestments) {
                let currentTime = Time.now();
                var totalReturns: Float = 0.0;
                
                for (investment in userInvestments.vals()) {
                    if (investment.isActive) {
                        let timePassed = currentTime - investment.startTime;
                        let daysPassed = Float.fromInt(timePassed) / (24.0 * 60.0 * 60.0 * 1_000_000_000.0);
                        let yearlyReturns = investment.amount * (investment.apy / 100.0);
                        let currentReturns = yearlyReturns * (daysPassed / 365.0);
                        totalReturns += currentReturns;
                    };
                };
                
                totalReturns
            };
        }
    };
}