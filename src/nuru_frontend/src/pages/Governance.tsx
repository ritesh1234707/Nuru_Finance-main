import { Link } from "react-router-dom";
"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Progress } from "../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Alert, AlertDescription } from "../components/ui/alert"
import {
  Vote,
  Shield,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Upload,
  User,
  Crown,
  Info,
} from "lucide-react"


// Mock data based on your GovernanceKYC canister
const mockKYCData = {
  userId: "user123",
  status: "verified" as "pending" | "verified" | "rejected" | "expired",
  submittedAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
  verifiedAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
  tier: "premium" as "basic" | "premium",
}

const mockVotingPower = 5 // Premium tier = 5x voting power

const mockProposals = [
  {
    id: 1,
    proposer: "alice.btc",
    title: "Increase Premium APY to 9.5%",
    description:
      "Proposal to increase the premium APY rate from 8.7% to 9.5% to remain competitive with other DeFi platforms and attract more premium users.",
    proposalType: "parameterChange" as "parameterChange" | "newFeature" | "treasurySpend",
    votingPower: 5,
    votesFor: 45,
    votesAgainst: 12,
    status: "active" as "active" | "passed" | "rejected" | "executed",
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    votingDeadline: Date.now() + 4 * 24 * 60 * 60 * 1000, // 4 days from now
  },
  {
    id: 2,
    proposer: "bob.crypto",
    title: "Add Ethereum Support",
    description:
      "Expand Nuru Finance to support Ethereum deposits and yield farming strategies, enabling multi-chain functionality.",
    proposalType: "newFeature" as "parameterChange" | "newFeature" | "treasurySpend",
    votingPower: 1,
    votesFor: 23,
    votesAgainst: 8,
    status: "active" as "active" | "passed" | "rejected" | "executed",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    votingDeadline: Date.now() + 2 * 24 * 60 * 60 * 1000, // 2 days from now
  },
  {
    id: 3,
    proposer: "charlie.hodl",
    title: "Treasury Fund for Marketing",
    description: "Allocate 2 BTC from treasury for marketing campaigns to increase platform adoption and user base.",
    proposalType: "treasurySpend" as "parameterChange" | "newFeature" | "treasurySpend",
    votingPower: 5,
    votesFor: 67,
    votesAgainst: 23,
    status: "passed" as "active" | "passed" | "rejected" | "executed",
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
    votingDeadline: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago (ended)
  },
]

const mockUserVotes = [
  {
    voter: "user123",
    proposalId: 3,
    vote: "for_" as "for_" | "against",
    votingPower: 5,
    timestamp: Date.now() - 8 * 24 * 60 * 60 * 1000,
  },
]

export default function GovernancePage() {
  const [isCreateProposalOpen, setIsCreateProposalOpen] = useState(false)
  const [isKYCDialogOpen, setIsKYCDialogOpen] = useState(false)
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    proposalType: "parameterChange" as "parameterChange" | "newFeature" | "treasurySpend",
  })
  const [kycForm, setKycForm] = useState({
    documentHash: "",
    tier: "basic" as "basic" | "premium",
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-900/20 border-green-800"
      case "passed":
        return "text-blue-400 bg-blue-900/20 border-blue-800"
      case "rejected":
        return "text-red-400 bg-red-900/20 border-red-800"
      case "executed":
        return "text-purple-400 bg-purple-900/20 border-purple-800"
      default:
        return "text-gray-400 bg-gray-900/20 border-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="w-4 h-4" />
      case "passed":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      case "executed":
        return <Crown className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getProposalTypeColor = (type: string) => {
    switch (type) {
      case "parameterChange":
        return "text-orange-400 bg-orange-900/20"
      case "newFeature":
        return "text-blue-400 bg-blue-900/20"
      case "treasurySpend":
        return "text-purple-400 bg-purple-900/20"
      default:
        return "text-gray-400 bg-gray-900/20"
    }
  }

  const formatTimeRemaining = (deadline: number) => {
    const remaining = deadline - Date.now()
    if (remaining <= 0) return "Ended"

    const days = Math.floor(remaining / (24 * 60 * 60 * 1000))
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))

    if (days > 0) return `${days}d ${hours}h remaining`
    return `${hours}h remaining`
  }

  const handleCreateProposal = () => {
    if (!newProposal.title || !newProposal.description) return

    // In real app, this would call your GovernanceKYC canister's createProposal function
    console.log("Creating proposal:", newProposal)

    setIsCreateProposalOpen(false)
    setNewProposal({
      title: "",
      description: "",
      proposalType: "parameterChange",
    })
  }

  const handleVote = (proposalId: number, voteChoice: "for_" | "against") => {
    // In real app, this would call your GovernanceKYC canister's vote function
    console.log("Voting:", { proposalId, voteChoice })
  }

  const handleSubmitKYC = () => {
    if (!kycForm.documentHash) return

    // In real app, this would call your GovernanceKYC canister's submitKYC function
    console.log("Submitting KYC:", kycForm)

    setIsKYCDialogOpen(false)
    setKycForm({
      documentHash: "",
      tier: "basic",
    })
  }

  const hasUserVoted = (proposalId: number) => {
    return mockUserVotes.some((vote) => vote.proposalId === proposalId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-gray-800">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
    <img 
      src="/Nuru_logo.svg" 
      alt="Nuru_logo" 
      className="w-12 h-12 object-contain"
    />
  </div>
          <span className="text-white font-bold text-xl">Nuru Finance</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link to="/savings" className="text-gray-300 hover:text-white transition-colors">
            Savings
          </Link>
          <Link to="/yield" className="text-gray-300 hover:text-white transition-colors">
            Yield
          </Link>
          <Link to="/wallet" className="text-gray-300 hover:text-white transition-colors">
            Wallet
          </Link>
          <Button className="bg-green-600 hover:bg-green-700 text-white">Connected</Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Governance & KYC</h1>
          <p className="text-gray-400">Participate in platform governance and manage your KYC verification status.</p>
        </div>

        {/* KYC Status Card */}
        <Card className="bg-gray-900/50 border-gray-800 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">KYC Status</h3>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={
                        mockKYCData.status === "verified"
                          ? "bg-green-900/50 text-green-400"
                          : mockKYCData.status === "pending"
                            ? "bg-yellow-900/50 text-yellow-400"
                            : "bg-red-900/50 text-red-400"
                      }
                    >
                      {mockKYCData.status}
                    </Badge>
                    <Badge className="bg-purple-900/50 text-purple-400">{mockKYCData.tier} tier</Badge>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Voting Power: {mockVotingPower}x</p>
                </div>
              </div>
              <div className="text-right">
                {mockKYCData.status !== "verified" && (
                  <Dialog open={isKYCDialogOpen} onOpenChange={setIsKYCDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Upload className="w-4 h-4 mr-2" />
                        Submit KYC
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-800 text-white">
                      <DialogHeader>
                        <DialogTitle>Submit KYC Verification</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Alert className="border-blue-800 bg-blue-900/20">
                          <Info className="h-4 w-4" />
                          <AlertDescription className="text-blue-300">
                            KYC verification is required to participate in governance. Basic tier provides 1x voting
                            power, Premium tier provides 5x voting power.
                          </AlertDescription>
                        </Alert>

                        <div>
                          <Label htmlFor="documentHash">Document Hash</Label>
                          <Input
                            id="documentHash"
                            value={kycForm.documentHash}
                            onChange={(e) => setKycForm({ ...kycForm, documentHash: e.target.value })}
                            placeholder="Enter document hash"
                            className="bg-gray-800 border-gray-700"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Upload your identity document and enter the hash here
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="tier">Verification Tier</Label>
                          <Select
                            value={kycForm.tier}
                            onValueChange={(value: "basic" | "premium") => setKycForm({ ...kycForm, tier: value })}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-700">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="basic">Basic (1x voting power)</SelectItem>
                              <SelectItem value="premium">Premium (5x voting power)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            onClick={() => setIsKYCDialogOpen(false)}
                            variant="outline"
                            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSubmitKYC}
                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                            disabled={!kycForm.documentHash}
                          >
                            Submit KYC
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Proposals</p>
                  <p className="text-2xl font-bold text-white">
                    {mockProposals.filter((p) => p.status === "active").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <Vote className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Proposals</p>
                  <p className="text-2xl font-bold text-white">{mockProposals.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">My Votes</p>
                  <p className="text-2xl font-bold text-white">{mockUserVotes.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Voting Power</p>
                  <p className="text-2xl font-bold text-white">{mockVotingPower}x</p>
                </div>
                <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="proposals" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-gray-900/50 border-gray-800 text-white">
              <TabsTrigger value="proposals" className="data-[state=active]:bg-purple-600">
                Proposals
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-blue-600">
                Voting History
              </TabsTrigger>
            </TabsList>

            {mockKYCData.status === "verified" && (
              <Dialog open={isCreateProposalOpen} onOpenChange={setIsCreateProposalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Proposal
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Proposal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Proposal Title</Label>
                      <Input
                        id="title"
                        value={newProposal.title}
                        onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                        placeholder="Enter proposal title"
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>

                    <div>
                      <Label htmlFor="type">Proposal Type</Label>
                      <Select
                        value={newProposal.proposalType}
                        onValueChange={(value: "parameterChange" | "newFeature" | "treasurySpend") =>
                          setNewProposal({ ...newProposal, proposalType: value })
                        }
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="parameterChange">Parameter Change</SelectItem>
                          <SelectItem value="newFeature">New Feature</SelectItem>
                          <SelectItem value="treasurySpend">Treasury Spend</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProposal.description}
                        onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                        placeholder="Describe your proposal in detail..."
                        className="bg-gray-800 border-gray-700 min-h-[120px]"
                      />
                    </div>

                    <Alert className="border-yellow-800 bg-yellow-900/20">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-yellow-300">
                        Proposals require a minimum of 10 votes to pass and have a 7-day voting period.
                      </AlertDescription>
                    </Alert>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setIsCreateProposalOpen(false)}
                        variant="outline"
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateProposal}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        disabled={!newProposal.title || !newProposal.description}
                      >
                        Create Proposal
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <TabsContent value="proposals" className="space-y-6">
            <div className="space-y-4">
              {mockProposals.map((proposal) => (
                <Card key={proposal.id} className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getStatusColor(proposal.status)}>
                            {getStatusIcon(proposal.status)}
                            <span className="ml-1">{proposal.status}</span>
                          </Badge>
                          <Badge className={getProposalTypeColor(proposal.proposalType)}>{proposal.proposalType}</Badge>
                        </div>
                        <CardTitle className="text-white text-lg mb-2">{proposal.title}</CardTitle>
                        <p className="text-gray-400 text-sm">{proposal.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{proposal.proposer}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTimeRemaining(proposal.votingDeadline)}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">For</span>
                          <span className="text-green-400">{proposal.votesFor} votes</span>
                        </div>
                        <Progress
                          value={(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Against</span>
                          <span className="text-red-400">{proposal.votesAgainst} votes</span>
                        </div>
                        <Progress
                          value={(proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst)) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>

                    {proposal.status === "active" && mockKYCData.status === "verified" && (
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleVote(proposal.id, "for_")}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          disabled={hasUserVoted(proposal.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Vote For
                        </Button>
                        <Button
                          onClick={() => handleVote(proposal.id, "against")}
                          className="flex-1 bg-red-600 hover:bg-red-700"
                          disabled={hasUserVoted(proposal.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Vote Against
                        </Button>
                      </div>
                    )}

                    {hasUserVoted(proposal.id) && (
                      <Alert className="border-blue-800 bg-blue-900/20">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription className="text-blue-300">
                          You have already voted on this proposal.
                        </AlertDescription>
                      </Alert>
                    )}

                    {mockKYCData.status !== "verified" && (
                      <Alert className="border-yellow-800 bg-yellow-900/20">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-yellow-300">
                          KYC verification required to vote on proposals.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {mockUserVotes.length === 0 ? (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-12 text-center">
                  <Vote className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Voting History</h3>
                  <p className="text-gray-400 mb-6">You haven't voted on any proposals yet.</p>
                  <Button
                    onClick={() => {
                      // Switch to proposals tab
                      const proposalsTab = document.querySelector('[value="proposals"]') as HTMLElement
                      proposalsTab?.click()
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    View Active Proposals
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {mockUserVotes.map((vote, index) => {
                  const proposal = mockProposals.find((p) => p.id === vote.proposalId)
                  if (!proposal) return null

                  return (
                    <Card key={index} className="bg-gray-900/50 border-gray-800">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-medium mb-1">{proposal.title}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={
                                  vote.vote === "for_" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
                                }
                              >
                                {vote.vote === "for_" ? "Voted For" : "Voted Against"}
                              </Badge>
                              <span className="text-gray-400 text-sm">with {vote.votingPower}x voting power</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 text-sm">{new Date(vote.timestamp).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
