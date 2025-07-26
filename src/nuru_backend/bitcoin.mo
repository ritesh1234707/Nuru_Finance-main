import Principal "mo:base/Principal";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Float "mo:base/Float";

actor BitcoinWallet {
    
    type UserId = Principal;
    type BitcoinAddress = Text;
    type Satoshi = Nat64;
    
    type Wallet = {
        owner: UserId;
        address: BitcoinAddress;
        balance: Satoshi;
        createdAt: Time.Time;
    };
    
    type Transaction = {
        from: BitcoinAddress;
        to: BitcoinAddress;
        amount: Satoshi;
        timestamp: Time.Time;
        status: { #pending; #confirmed; #failed };
    };
    
    private var wallets = HashMap.HashMap<UserId, Wallet>(10, Principal.equal, Principal.hash);
    private var transactions = HashMap.HashMap<Text, Transaction>(10, func(a: Text, b: Text): Bool { a == b }, Text.hash);
    
    // Simplified Bitcoin address generation (in production, use threshold ECDSA)
    private func generateBitcoinAddress(userId: UserId): BitcoinAddress {
        let principal_text = Principal.toText(userId);
        let hash = Principal.fromText(principal_text);
        "bc1q" # Principal.toText(hash) # "mock" // Mock address for hackathon
    };
    
    public shared(msg) func createWallet(): async Result.Result<BitcoinAddress, Text> {
        let userId = msg.caller;
        
        switch(wallets.get(userId)) {
            case (?wallet) { #ok(wallet.address) };
            case null {
                let address = generateBitcoinAddress(userId);
                let newWallet: Wallet = {
                    owner = userId;
                    address = address;
                    balance = 0;
                    createdAt = Time.now();
                };
                wallets.put(userId, newWallet);
                #ok(address)
            };
        }
    };
    
    public shared(msg) func getBalance(): async Result.Result<Satoshi, Text> {
        let userId = msg.caller;
        
        switch(wallets.get(userId)) {
            case null { #err("Wallet not found") };
            case (?wallet) { #ok(wallet.balance) };
        }
    };
    
    // Simplified deposit (in production, this would listen to Bitcoin network)
    public shared(msg) func simulateDeposit(amount: Satoshi): async Result.Result<Text, Text> {
        let userId = msg.caller;
        
        switch(wallets.get(userId)) {
            case null { #err("Wallet not found") };
            case (?wallet) {
                let updatedWallet = {
                    wallet with balance = wallet.balance + amount
                };
                wallets.put(userId, updatedWallet);
                #ok("Deposit of " # Nat64.toText(amount) # " satoshis confirmed")
            };
        }
    };
    
    public shared(msg) func transferToSavings(amount: Satoshi, poolId: Nat): async Result.Result<Text, Text> {
        let userId = msg.caller;
        
        switch(wallets.get(userId)) {
            case null { #err("Wallet not found") };
            case (?wallet) {
                if (wallet.balance < amount) {
                    return #err("Insufficient balance");
                };
                
                let updatedWallet = {
                    wallet with balance = wallet.balance - amount
                };
                wallets.put(userId, updatedWallet);
                
                // Create transaction record
                let txId = Principal.toText(userId) # Int.toText(Time.now()) # Nat.toText(poolId);
                let transaction: Transaction = {
                    from = wallet.address;
                    to = "savings_pool_" # Nat.toText(poolId);
                    amount = amount;
                    timestamp = Time.now();
                    status = #confirmed;
                };
                transactions.put(txId, transaction);
                
                #ok("Transfer successful, TxID: " # txId)
            };
        }
    };
    
    // Convert satoshis to BTC for display
    public query func satoshiToBtc(satoshi: Satoshi): async Float {
        Float.fromInt(Nat64.toNat(satoshi)) / 100_000_000.0
    };
    
    // Convert BTC to satoshis for transactions
    public query func btcToSatoshi(btc: Float): async Satoshi {
        Nat64.fromNat(Int.abs(Float.toInt(btc * 100_000_000.0)))
    };
    
    public query(msg) func getWalletInfo(): async Result.Result<Wallet, Text> {
        let userId = msg.caller;
        
        switch(wallets.get(userId)) {
            case null { #err("Wallet not found") };
            case (?wallet) { #ok(wallet) };
        }
    };
    
    public query func getTransaction(txId: Text): async Result.Result<Transaction, Text> {
        switch(transactions.get(txId)) {
            case null { #err("Transaction not found") };
            case (?tx) { #ok(tx) };
        }
    };
}