import { Link } from "react-router-dom";

"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Textarea } from "../components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import {
  Bitcoin,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  Eye,
  Crown,
  AlertTriangle,
  Search,
  Download,
  User,
  TrendingUp,
} from "lucide-react"

// Mock admin data based on your GovernanceKYC canister
const mockPendingKYC = [
  {
    userId: "user123",
    status: "pending" as "pending" | "verified" | "rejected" | "expired",
    submittedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    verifiedAt: null,
    documentHash: "0x1234567890abcdef...",
    tier: "premium" as "basic" | "premium",
    userInfo: {
      principalId: "rdmx6-jaaaa-aaaah-qcaiq-cai",
      email: "user@example.com",
      joinedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
  },
  {
    userId: "user456",
    status: "pending" as "pending" | "verified" | "rejected" | "expired",
    submittedAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    verifiedAt: null,
    documentHash: "0xabcdef1234567890...",
    tier: "basic" as "basic" | "premium",
    userInfo: {
      principalId: "rrkah-fqaaa-aaaah-qcaiq-cai",
      email: "user2@example.com",
      joinedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    },
  },
]

const mockVerifiedUsers = [
  {
    userId: "verified1",
    status: "verified" as "pending" | "verified" | "rejected" | "expired",
    submittedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    verifiedAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    documentHash: "0xverified123...",
    tier: "premium" as "basic" | "premium",
    votingPower: 5,
    userInfo: {
      principalId: "verified-principal-1",
      email: "verified@example.com",
      joinedAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    },
  },
  {
    userId: "verified2",
    status: "verified" as "pending" | "verified" | "rejected" | "expired",
    submittedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    verifiedAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
    documentHash: "0xverified456...",
    tier: "basic" as "basic" | "premium",
    votingPower: 1,
    userInfo: {
      principalId: "verified-principal-2",
      email: "verified2@example.com",
      joinedAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    },
  },
]

const mockAllProposals = [
  {
    id: 1,
    proposer: "alice.btc",
    title: "Increase Premium APY to 9.5%",
    description:
      "Proposal to increase the premium APY rate from 8.7% to 9.5% to remain competitive with other DeFi platforms.",
    proposalType: "parameterChange" as "parameterChange" | "newFeature" | "treasurySpend",
    votingPower: 5,
    votesFor: 45,
    votesAgainst: 12,
    status: "active" as "active" | "passed" | "rejected" | "executed",
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    votingDeadline: Date.now() + 4 * 24 * 60 * 60 * 1000,
    totalParticipants: 23,
  },
  {
    id: 2,
    proposer: "bob.crypto",
    title: "Add Ethereum Support",
    description: "Expand Nuru Finance to support Ethereum deposits and yield farming strategies.",
    proposalType: "newFeature" as "parameterChange" | "newFeature" | "treasurySpend",
    votingPower: 1,
    votesFor: 23,
    votesAgainst: 8,
    status: "active" as "active" | "passed" | "rejected" | "executed",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    votingDeadline: Date.now() + 2 * 24 * 60 * 60 * 1000,
    totalParticipants: 15,
  },
  {
    id: 3,
    proposer: "charlie.hodl",
    title: "Treasury Fund for Marketing",
    description: "Allocate 2 BTC from treasury for marketing campaigns.",
    proposalType: "treasurySpend" as "parameterChange" | "newFeature" | "treasurySpend",
    votingPower: 5,
    votesFor: 67,
    votesAgainst: 23,
    status: "passed" as "active" | "passed" | "rejected" | "executed",
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    votingDeadline: Date.now() - 3 * 24 * 60 * 60 * 1000,
    totalParticipants: 45,
  },
]

const mockPlatformStats = {
  totalUsers: 1247,
  verifiedUsers: 892,
  pendingKYC: 23,
  rejectedKYC: 12,
  totalProposals: 156,
  activeProposals: 8,
  passedProposals: 89,
  rejectedProposals: 59,
  totalVotingPower: 4567,
  averageParticipation: 67.3,
}

export default function AdminPage() {
  const [selectedKYC, setSelectedKYC] = useState<(typeof mockPendingKYC)[0] | null>(null)
  const [selectedProposal, setSelectedProposal] = useState<(typeof mockAllProposals)[0] | null>(null)
  const [isKYCDialogOpen, setIsKYCDialogOpen] = useState(false)
  const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  // const [statusFilter, setStatusFilter] = useState("all")
  // const [adminAction, setAdminAction] = useState("")

  const handleKYCVerification = (userId: string, approved: boolean, reason?: string) => {
    // In real app, this would call your GovernanceKYC canister's verifyKYC function
    console.log("KYC Verification:", { userId, approved, reason })
    setIsKYCDialogOpen(false)
    setSelectedKYC(null)
  }

  const handleExecuteProposal = (proposalId: number) => {
    // In real app, this would call your GovernanceKYC canister's executeProposal function
    console.log("Executing proposal:", proposalId)
    setIsProposalDialogOpen(false)
    setSelectedProposal(null)
  }

  const handleForceEndProposal = (proposalId: number) => {
    // Admin function to force end a proposal
    console.log("Force ending proposal:", proposalId)
  }

  const exportKYCData = () => {
    // Export KYC data for compliance
    console.log("Exporting KYC data...")
  }

  const exportProposalData = () => {
    // Export proposal data for analysis
    console.log("Exporting proposal data...")
  }

  const formatTimeAgo = (timestamp: number) => {
    const days = Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000))
    const hours = Math.floor(((Date.now() - timestamp) % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))

    if (days > 0) return `${days}d ${hours}h ago`
    return `${hours}h ago`
  }

  const formatTimeRemaining = (deadline: number) => {
    const remaining = deadline - Date.now()
    if (remaining <= 0) return "Ended"

    const days = Math.floor(remaining / (24 * 60 * 60 * 1000))
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))

    if (days > 0) return `${days}d ${hours}h remaining`
    return `${hours}h remaining`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-800"
      case "verified":
        return "text-green-400 bg-green-900/20 border-green-800"
      case "rejected":
        return "text-red-400 bg-red-900/20 border-red-800"
      case "active":
        return "text-blue-400 bg-blue-900/20 border-blue-800"
      case "passed":
        return "text-green-400 bg-green-900/20 border-green-800"
      case "executed":
        return "text-purple-400 bg-purple-900/20 border-purple-800"
      default:
        return "text-gray-400 bg-gray-900/20 border-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "verified":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      case "active":
        return <Clock className="w-4 h-4" />
      case "passed":
        return <CheckCircle className="w-4 h-4" />
      case "executed":
        return <Crown className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-gray-800">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-lg flex items-center justify-center">
            <Bitcoin className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">Nuru Finance Admin</span>
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
          <Link to="/governance" className="text-gray-300 hover:text-white transition-colors">
            Governance
          </Link>
          <Badge className="bg-red-900/50 text-red-400 border-red-800">
            <Crown className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage KYC verifications, proposals, and platform governance.</p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{mockPlatformStats.totalUsers}</p>
                  <p className="text-green-400 text-sm">{mockPlatformStats.verifiedUsers} verified</p>
                </div>
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending KYC</p>
                  <p className="text-2xl font-bold text-white">{mockPlatformStats.pendingKYC}</p>
                  <p className="text-yellow-400 text-sm">Requires review</p>
                </div>
                <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Proposals</p>
                  <p className="text-2xl font-bold text-white">{mockPlatformStats.activeProposals}</p>
                  <p className="text-blue-400 text-sm">Voting in progress</p>
                </div>
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Participation Rate</p>
                  <p className="text-2xl font-bold text-white">{mockPlatformStats.averageParticipation}%</p>
                  <p className="text-green-400 text-sm">Average voting</p>
                </div>
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="kyc" className="space-y-6">
          <TabsList className="bg-gray-900/50 border-gray-800">
            <TabsTrigger value="kyc" className="data-[state=active]:bg-yellow-600">
              KYC Management
            </TabsTrigger>
            <TabsTrigger value="proposals" className="data-[state=active]:bg-purple-600">
              Proposal Management
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
              User Management
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gray-600">
              Platform Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kyc" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">KYC Verification Queue</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700"
                  />
                </div>
                <Button
                  onClick={exportKYCData}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Pending KYC Table */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Pending Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-400">User</TableHead>
                      <TableHead className="text-gray-400">Tier</TableHead>
                      <TableHead className="text-gray-400">Submitted</TableHead>
                      <TableHead className="text-gray-400">Document</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPendingKYC.map((kyc) => (
                      <TableRow key={kyc.userId} className="border-gray-800">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">{kyc.userInfo.email}</p>
                            <p className="text-gray-400 text-sm">{kyc.userInfo.principalId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              kyc.tier === "premium"
                                ? "bg-purple-900/50 text-purple-400"
                                : "bg-blue-900/50 text-blue-400"
                            }
                          >
                            {kyc.tier}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">{formatTimeAgo(kyc.submittedAt)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => {
                                setSelectedKYC(kyc)
                                setIsKYCDialogOpen(true)
                              }}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="proposals" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Proposal Management</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search proposals..." className="pl-10 bg-gray-800 border-gray-700" />
                </div>
                <Button
                  onClick={exportProposalData}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Proposals Table */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">All Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-400">Proposal</TableHead>
                      <TableHead className="text-gray-400">Type</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Votes</TableHead>
                      <TableHead className="text-gray-400">Deadline</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAllProposals.map((proposal) => (
                      <TableRow key={proposal.id} className="border-gray-800">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">{proposal.title}</p>
                            <p className="text-gray-400 text-sm">by {proposal.proposer}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-orange-900/50 text-orange-400">{proposal.proposalType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(proposal.status)}>
                            {getStatusIcon(proposal.status)}
                            <span className="ml-1">{proposal.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="text-green-400">For: {proposal.votesFor}</p>
                            <p className="text-red-400">Against: {proposal.votesAgainst}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">{formatTimeRemaining(proposal.votingDeadline)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => {
                                setSelectedProposal(proposal)
                                setIsProposalDialogOpen(true)
                              }}
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            {proposal.status === "passed" && (
                              <Button
                                onClick={() => handleExecuteProposal(proposal.id)}
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                Execute
                              </Button>
                            )}
                            {proposal.status === "active" && (
                              <Button
                                onClick={() => handleForceEndProposal(proposal.id)}
                                size="sm"
                                variant="outline"
                                className="border-red-600 text-red-400 hover:bg-red-900/20"
                              >
                                Force End
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Verified Users</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search users..." className="pl-10 bg-gray-800 border-gray-700" />
                </div>
              </div>
            </div>

            {/* Verified Users Table */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Verified Users</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-400">User</TableHead>
                      <TableHead className="text-gray-400">Tier</TableHead>
                      <TableHead className="text-gray-400">Voting Power</TableHead>
                      <TableHead className="text-gray-400">Verified</TableHead>
                      <TableHead className="text-gray-400">Joined</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockVerifiedUsers.map((user) => (
                      <TableRow key={user.userId} className="border-gray-800">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">{user.userInfo.email}</p>
                            <p className="text-gray-400 text-sm">{user.userInfo.principalId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.tier === "premium"
                                ? "bg-purple-900/50 text-purple-400"
                                : "bg-blue-900/50 text-blue-400"
                            }
                          >
                            {user.tier}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">{user.votingPower}x</TableCell>
                        <TableCell className="text-gray-300">{formatTimeAgo(user.verifiedAt!)}</TableCell>
                        <TableCell className="text-gray-300">{formatTimeAgo(user.userInfo.joinedAt)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                          >
                            <User className="w-4 h-4 mr-1" />
                            Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-xl font-bold text-white">Platform Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Governance Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="quorum">Minimum Quorum</Label>
                    <Input id="quorum" type="number" defaultValue="10" className="bg-gray-800 border-gray-700" />
                  </div>
                  <div>
                    <Label htmlFor="votingPeriod">Voting Period (days)</Label>
                    <Input id="votingPeriod" type="number" defaultValue="7" className="bg-gray-800 border-gray-700" />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Update Parameters</Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">APY Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="baseApy">Base APY (%)</Label>
                    <Input
                      id="baseApy"
                      type="number"
                      step="0.1"
                      defaultValue="5.2"
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="premiumApy">Premium APY (%)</Label>
                    <Input
                      id="premiumApy"
                      type="number"
                      step="0.1"
                      defaultValue="8.7"
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">Update APY Rates</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* KYC Review Dialog */}
        <Dialog open={isKYCDialogOpen} onOpenChange={setIsKYCDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>KYC Review: {selectedKYC?.userInfo.email}</DialogTitle>
            </DialogHeader>
            {selectedKYC && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>User ID</Label>
                    <p className="text-gray-300">{selectedKYC.userInfo.principalId}</p>
                  </div>
                  <div>
                    <Label>Tier Requested</Label>
                    <Badge
                      className={
                        selectedKYC.tier === "premium"
                          ? "bg-purple-900/50 text-purple-400"
                          : "bg-blue-900/50 text-blue-400"
                      }
                    >
                      {selectedKYC.tier}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label>Document Hash</Label>
                  <p className="text-gray-300 font-mono text-sm">{selectedKYC.documentHash}</p>
                </div>

                <div>
                  <Label>Submitted</Label>
                  <p className="text-gray-300">{formatTimeAgo(selectedKYC.submittedAt)}</p>
                </div>

                <Alert className="border-blue-800 bg-blue-900/20">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-blue-300">
                    Review the submitted documents carefully.{" "}
                    {selectedKYC.tier === "premium"
                      ? "Premium tier grants 5x voting power."
                      : "Basic tier grants 1x voting power."}
                  </AlertDescription>
                </Alert>

                <div>
                  <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
                  <Textarea
                    id="adminNotes"
                    placeholder="Add any notes about this verification..."
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleKYCVerification(selectedKYC.userId, false)}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleKYCVerification(selectedKYC.userId, true)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Proposal Management Dialog */}
        <Dialog open={isProposalDialogOpen} onOpenChange={setIsProposalDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Proposal Details: {selectedProposal?.title}</DialogTitle>
            </DialogHeader>
            {selectedProposal && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Proposer</Label>
                    <p className="text-gray-300">{selectedProposal.proposer}</p>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Badge className="bg-orange-900/50 text-orange-400">{selectedProposal.proposalType}</Badge>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <p className="text-gray-300">{selectedProposal.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Votes For</Label>
                    <p className="text-green-400 text-xl font-bold">{selectedProposal.votesFor}</p>
                  </div>
                  <div>
                    <Label>Votes Against</Label>
                    <p className="text-red-400 text-xl font-bold">{selectedProposal.votesAgainst}</p>
                  </div>
                  <div>
                    <Label>Participants</Label>
                    <p className="text-blue-400 text-xl font-bold">{selectedProposal.totalParticipants}</p>
                  </div>
                </div>

                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedProposal.status)}>
                    {getStatusIcon(selectedProposal.status)}
                    <span className="ml-1">{selectedProposal.status}</span>
                  </Badge>
                </div>

                <div>
                  <Label>Deadline</Label>
                  <p className="text-gray-300">{formatTimeRemaining(selectedProposal.votingDeadline)}</p>
                </div>

                {selectedProposal.status === "passed" && (
                  <Alert className="border-green-800 bg-green-900/20">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-green-300">
                      This proposal has passed and is ready for execution.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex space-x-2">
                  <Button
                    onClick={() => setIsProposalDialogOpen(false)}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Close
                  </Button>
                  {selectedProposal.status === "passed" && (
                    <Button
                      onClick={() => handleExecuteProposal(selectedProposal.id)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Execute Proposal
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
