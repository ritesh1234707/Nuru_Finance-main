import Principal "mo:base/Principal";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Nat32 "mo:base/Nat32";



actor GovernanceKYC {

    type UserId = Principal;
    type ProposalId = Nat;

    type KYCStatus = {
        #pending;
        #verified;
        #rejected;
        #expired;
    };

    type KYCData = {
        userId: UserId;
        status: KYCStatus;
        submittedAt: Time.Time;
        verifiedAt: ?Time.Time;
        documentHash: ?Text;
        tier: { #basic; #premium };
    };

    type Proposal = {
        id: ProposalId;
        proposer: UserId;
        title: Text;
        description: Text;
        proposalType: { #parameterChange; #newFeature; #treasurySpend };
        votingPower: Nat;
        votesFor: Nat;
        votesAgainst: Nat;
        status: { #active; #passed; #rejected; #executed };
        createdAt: Time.Time;
        votingDeadline: Time.Time;
    };

    type Vote = {
        voter: UserId;
        proposalId: ProposalId;
        vote: { #for_; #against };
        votingPower: Nat;
        timestamp: Time.Time;
    };

    private stable var nextProposalId: Nat = 0;
    var kycRecords = HashMap.HashMap<UserId, KYCData>(10, Principal.equal, Principal.hash);
    var proposals = HashMap.HashMap<ProposalId, Proposal>(10, func(a: Nat, b: Nat): Bool { a == b }, func(n: Nat): Nat32 { Nat32.fromNat(n) });
    var votes = HashMap.HashMap<Text, Vote>(10, func(a: Text, b: Text): Bool { a == b }, Text.hash);
    var userVotingPower = HashMap.HashMap<UserId, Nat>(10, Principal.equal, Principal.hash);
    
    // KYC Functions
    public shared(msg) func submitKYC(documentHash: Text, tier: { #basic; #premium }): async Result.Result<Text, Text> {
        let userId = msg.caller;
        
        let kycData: KYCData = {
            userId = userId;
            status = #pending;
            submittedAt = Time.now();
            verifiedAt = null;
            documentHash = ?documentHash;
            tier = tier;
        };
        
        kycRecords.put(userId, kycData);
        #ok("KYC submitted for review")
    };
    
    // Admin function to verify KYC (simplified for hackathon)
    public shared(_msg) func verifyKYC(userId: UserId, approved: Bool): async Result.Result<Text, Text> {
        switch(kycRecords.get(userId)) {
            case null { #err("KYC record not found") };
            case (?kyc) {
                let status = if (approved) { #verified } else { #rejected };
                let updatedKYC = {
                    kyc with 
                    status = status;
                    verifiedAt = ?Time.now();
                };
                kycRecords.put(userId, updatedKYC);
                
                // Grant voting power based on tier
                if (approved) {
                    let votingPower = switch(kyc.tier) {
                        case (#basic) { 1 };
                        case (#premium) { 5 };
                    };
                    userVotingPower.put(userId, votingPower);
                };
                
                #ok("KYC " # (if approved "approved" else "rejected"))
            };
        }
    };
    
    public query(msg) func getKYCStatus(): async Result.Result<KYCData, Text> {
        let userId = msg.caller;
        
        switch(kycRecords.get(userId)) {
            case null { #err("No KYC record found") };
            case (?kyc) { #ok(kyc) };
        }
    };
    
    // Governance Functions
    public shared(msg) func createProposal(title: Text, description: Text, proposalType: { #parameterChange; #newFeature; #treasurySpend }): async Result.Result<ProposalId, Text> {
        let userId = msg.caller;
        
        // Check if user is KYC verified
        switch(kycRecords.get(userId)) {
            case (?kyc) {
                if (kyc.status != #verified) {
                    return #err("KYC verification required");
                };
            };
            case null { return #err("KYC verification required") };
        };
        
        let proposalId = nextProposalId;
        nextProposalId += 1;
        
        let votingPower = switch(userVotingPower.get(userId)) {
            case (?power) { power };
            case null { 0 };
        };
        
        let proposal: Proposal = {
            id = proposalId;
            proposer = userId;
            title = title;
            description = description;
            proposalType = proposalType;
            votingPower = votingPower;
            votesFor = 0;
            votesAgainst = 0;
            status = #active;
            createdAt = Time.now();
            votingDeadline = Time.now() + (7 * 24 * 60 * 60 * 1_000_000_000); // 7 days
        };
        
        proposals.put(proposalId, proposal);
        #ok(proposalId)
    };
    
    public shared(msg) func vote(proposalId: ProposalId, voteChoice: { #for_; #against }): async Result.Result<Text, Text> {
        let userId = msg.caller;
        
        // Check voting power
        let votingPower = switch(userVotingPower.get(userId)) {
            case (?power) { power };
            case null { return #err("No voting power - KYC verification required") };
        };
        
        switch(proposals.get(proposalId)) {
            case null { #err("Proposal not found") };
            case (?proposal) {
                if (proposal.status != #active) {
                    return #err("Proposal not active");
                };
                
                if (Time.now() > proposal.votingDeadline) {
                    return #err("Voting period ended");
                };
                
                let voteKey = Principal.toText(userId) # "_" # Nat.toText(proposalId);
                
                // Check if already voted
                switch(votes.get(voteKey)) {
                    case (?_existingVote) { return #err("Already voted on this proposal") };
                    case null { };
                };
                
                let newVote: Vote = {
                    voter = userId;
                    proposalId = proposalId;
                    vote = voteChoice;
                    votingPower = votingPower;
                    timestamp = Time.now();
                };
                
                votes.put(voteKey, newVote);
                
                // Update proposal vote counts
                let updatedProposal = switch(voteChoice) {
                    case (#for_) {
                        { proposal with votesFor = proposal.votesFor + votingPower }
                    };
                    case (#against) {
                        { proposal with votesAgainst = proposal.votesAgainst + votingPower }
                    };
                };
                
                proposals.put(proposalId, updatedProposal);
                #ok("Vote recorded")
            };
        }
    };
    
    public func executeProposal(proposalId: ProposalId): async Result.Result<Text, Text> {
        switch(proposals.get(proposalId)) {
            case null { #err("Proposal not found") };
            case (?proposal) {
                if (proposal.status != #active) {
                    return #err("Proposal not active");
                };
                
                if (Time.now() <= proposal.votingDeadline) {
                    return #err("Voting period not ended");
                };
                
                let totalVotes = proposal.votesFor + proposal.votesAgainst;
                let quorum = 10; // Minimum votes needed
                
                if (totalVotes < quorum) {
                    let updatedProposal = { proposal with status = #rejected };
                    proposals.put(proposalId, updatedProposal);
                    return #ok("Proposal rejected - insufficient participation");
                };
                
                let passed = proposal.votesFor > proposal.votesAgainst;
                let status = if (passed) { #executed } else { #rejected };
                
                let updatedProposal = { proposal with status = status };
                proposals.put(proposalId, updatedProposal);
                
                #ok(if passed "Proposal executed" else "Proposal rejected")
            };
        }
    };
    
    public query func getProposal(proposalId: ProposalId): async Result.Result<Proposal, Text> {
        switch(proposals.get(proposalId)) {
            case null { #err("Proposal not found") };
            case (?proposal) { #ok(proposal) };
        }
    };
    
    public query func getActiveProposals(): async [Proposal] {
        let proposalsArray = proposals.vals() |> Iter.toArray(_);
        Array.filter(proposalsArray, func(p: Proposal): Bool { 
            p.status == #active and Time.now() <= p.votingDeadline 
        })
    };
    
    public query(msg) func getVotingPower(): async Nat {
        let userId = msg.caller;
        switch(userVotingPower.get(userId)) {
            case (?power) { power };
            case null { 0 };
        }
    };
    
    public query(msg) func getUserVotes(): async [Vote] {
        let userId = msg.caller;
        let allVotes = votes.vals() |> Iter.toArray(_);
        Array.filter(allVotes, func(v: Vote): Bool { v.voter == userId })
    };
    
    // Admin functions for compliance
    public query func getPendingKYC(): async [KYCData] {
        let allKYC = kycRecords.vals() |> Iter.toArray(_);
        Array.filter(allKYC, func(kyc: KYCData): Bool { kyc.status == #pending })
    };
    
    public query func getVerifiedUsers(): async [UserId] {
        let allKYC = kycRecords.vals() |> Iter.toArray(_);
        let verified = Array.filter(allKYC, func(kyc: KYCData): Bool { kyc.status == #verified });
        Array.map(verified, func(kyc: KYCData): UserId { kyc.userId });
    };
}