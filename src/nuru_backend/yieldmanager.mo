import Principal "mo:base/Principal";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Float "mo:base/Float";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

actor YieldManager {
    
    type UserId = Principal;
    type StrategyId = Text;
    
    type YieldStrategy = {
        id: StrategyId;
        name: Text;
        baseApy: Float;
        riskLevel: { #low; #medium; #high };
        minAmount: Float;
        isActive: Bool;
    };
    
    type UserPosition = {
        userId: UserId;
        strategyId: StrategyId;
        amount: Float;
        entryTime: Time.Time;
        currentYield: Float;
        claimedYield: Float;
    };
    
    private var strategies = HashMap.HashMap<StrategyId, YieldStrategy>(10, func(a: Text, b: Text): Bool { a == b }, Text.hash);
    private var positions = HashMap.HashMap<UserId, [UserPosition]>(10, Principal.equal, Principal.hash);
    
    // Initialize default strategies
    private func initStrategies() {
        let btcHodl: YieldStrategy = {
            id = "btc_hodl";
            name = "Bitcoin HODL";
            baseApy = 4.5;
            riskLevel = #low;
            minAmount = 0.001;
            isActive = true;
        };
        
        let btcLending: YieldStrategy = {
            id = "btc_lending";
            name = "Bitcoin Lending";
            baseApy = 7.2;
            riskLevel = #medium;
            minAmount = 0.01;
            isActive = true;
        };
        
        let defiYield: YieldStrategy = {
            id = "defi_yield";
            name = "DeFi Yield Farming";
            baseApy = 12.8;
            riskLevel = #high;
            minAmount = 0.1;
            isActive = true;
        };
        
        strategies.put("btc_hodl", btcHodl);
        strategies.put("btc_lending", btcLending);
        strategies.put("defi_yield", defiYield);
    };
    
    public func init(): async () {
        initStrategies();
    };
    
    public query func getAvailableStrategies(): async [YieldStrategy] {
        let strategiesArray = strategies.vals() |> Iter.toArray(_);
        Array.filter(strategiesArray, func(s: YieldStrategy): Bool { s.isActive })
    };
    
    public shared(msg) func enterPosition(strategyId: StrategyId, amount: Float): async Result.Result<Text, Text> {
        let userId = msg.caller;
        
        switch(strategies.get(strategyId)) {
            case null { #err("Strategy not found") };
            case (?strategy) {
                if (not strategy.isActive) {
                    return #err("Strategy not active");
                };
                
                if (amount < strategy.minAmount) {
                    return #err("Amount below minimum");
                };
                
                let newPosition: UserPosition = {
                    userId = userId;
                    strategyId = strategyId;
                    amount = amount;
                    entryTime = Time.now();
                    currentYield = 0.0;
                    claimedYield = 0.0;
                };
                
                let userPositions = switch(positions.get(userId)) {
                    case null { [newPosition] };
                    case (?existing) { Array.append(existing, [newPosition]) };
                };
                
                positions.put(userId, userPositions);
                #ok("Position entered in " # strategy.name)
            };
        }
    };
    
    public shared(msg) func calculateCurrentYield(): async Result.Result<Float, Text> {
        let userId = msg.caller;
        
        switch(positions.get(userId)) {
            case null { #ok(0.0) };
            case (?userPositions) {
                var totalYield: Float = 0.0;
                let currentTime = Time.now();
                
                for (position in userPositions.vals()) {
                    switch(strategies.get(position.strategyId)) {
                        case (?strategy) {
                            let timeHeld = currentTime - position.entryTime;
                            let daysHeld = Float.fromInt(timeHeld) / (24.0 * 60.0 * 60.0 * 1_000_000_000.0);
                            
                            // Dynamic APY based on market conditions (simplified)
                            let currentApy = strategy.baseApy + getMarketBonus();
                            let yearlyYield = position.amount * (currentApy / 100.0);
                            let currentPositionYield = yearlyYield * (daysHeld / 365.0);
                            
                            totalYield += currentPositionYield;
                        };
                        case null { };
                    };
                };
                
                #ok(totalYield)
            };
        }
    };
    
    public shared(msg) func claimYields(): async Result.Result<Float, Text> {
        let userId = msg.caller;
        
        switch(positions.get(userId)) {
            case null { #err("No positions found") };
            case (?userPositions) {
                var totalClaimable: Float = 0.0;
                let currentTime = Time.now();
                
                let updatedPositions = Array.map<UserPosition, UserPosition>(userPositions, func(position) {
                    switch(strategies.get(position.strategyId)) {
                        case (?strategy) {
                            let timeHeld = currentTime - position.entryTime;
                            let daysHeld = Float.fromInt(timeHeld) / (24.0 * 60.0 * 60.0 * 1_000_000_000.0);
                            
                            let currentApy = strategy.baseApy + getMarketBonus();
                            let yearlyYield = position.amount * (currentApy / 100.0);
                            let totalYield = yearlyYield * (daysHeld / 365.0);
                            let claimableYield = totalYield - position.claimedYield;
                            
                            totalClaimable += claimableYield;
                            
                            {
                                position with
                                currentYield = totalYield;
                                claimedYield = totalYield;
                            }
                        };
                        case null { position };
                    }
                });
                
                positions.put(userId, updatedPositions);
                #ok(totalClaimable)
            };
        }
    };
    
    public query(msg) func getUserPositions(): async [UserPosition] {
        let userId = msg.caller;
        
        switch(positions.get(userId)) {
            case null { [] };
            case (?userPositions) { userPositions };
        }
    };
    
    // Simulated market bonus based on current conditions
    private func getMarketBonus(): Float {
        let currentTime = Time.now();
        let timeVar = Float.fromInt(currentTime % 1000000);
        let bonus = (timeVar / 100000.0) * 2.0; // 0-2% bonus
        Float.min(bonus, 3.0) // Cap at 3%
    };
    
    public query func getStrategyPerformance(strategyId: StrategyId): async Result.Result<Float, Text> {
        switch(strategies.get(strategyId)) {
            case null { #err("Strategy not found") };
            case (?strategy) {
                let currentApy = strategy.baseApy + getMarketBonus();
                #ok(currentApy)
            };
        }
    };
    
    // Compound interest calculation
    public query func projectReturns(amount: Float, strategyId: StrategyId, days: Nat): async Result.Result<Float, Text> {
        switch(strategies.get(strategyId)) {
            case null { #err("Strategy not found") };
            case (?strategy) {
                let apy = strategy.baseApy / 100.0;
                let dailyRate = apy / 365.0;
                let compoundFactor = Float.pow(1.0 + dailyRate, Float.fromInt(days));
                let finalAmount = amount * compoundFactor;
                #ok(finalAmount - amount) // Return only the profit
            };
        }
    };
}