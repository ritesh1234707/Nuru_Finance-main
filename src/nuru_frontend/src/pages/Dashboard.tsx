import { Link } from "react-router-dom";
"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Bitcoin, TrendingUp, Users, Shield, Plus, ArrowUpRight, Wallet, Vote, Sparkles } from "lucide-react"

// Mock data - in real app, this would come from your canisters
const mockUserData = {
  totalSavings: 0.15432,
  totalInvested: 0.08765,
  totalReturns: 0.00234,
  btcBalance: 0.24197,
  kycStatus: "verified" as "pending" | "verified" | "rejected",
  votingPower: 5,
}

const mockSavingsPools = [
  {
    id: 1,
    name: "Emergency Fund Pool",
    currentAmount: 2.45,
    targetAmount: 5.0,
    members: 12,
    deadline: "2024-06-15",
    type: "group" as "individual" | "group",
  },
  {
    id: 2,
    name: "Personal Savings",
    currentAmount: 0.87,
    targetAmount: 2.0,
    members: 1,
    deadline: "2024-08-30",
    type: "individual" as "individual" | "group",
  },
]

const mockYieldPositions = [
  {
    strategyId: "btc_hodl",
    name: "Bitcoin HODL",
    amount: 0.05,
    apy: 4.5,
    currentYield: 0.00123,
    riskLevel: "low" as "low" | "medium" | "high",
  },
  {
    strategyId: "btc_lending",
    name: "Bitcoin Lending",
    amount: 0.03,
    apy: 7.2,
    currentYield: 0.00089,
    riskLevel: "medium" as "low" | "medium" | "high",
  },
]

const mockProposals = [
  {
    id: 1,
    title: "Increase Premium APY to 9.5%",
    status: "active" as "active" | "passed" | "rejected",
    votesFor: 45,
    votesAgainst: 12,
    deadline: "2024-02-20",
  },
  {
    id: 2,
    title: "Add Ethereum Support",
    status: "active" as "active" | "passed" | "rejected",
    votesFor: 23,
    votesAgainst: 8,
    deadline: "2024-02-25",
  },
]

export default function DashboardPage() {
  const [isConnected, setIsConnected] = useState(false)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-400 bg-green-900/20"
      case "medium":
        return "text-yellow-400 bg-yellow-900/20"
      case "high":
        return "text-red-400 bg-red-900/20"
      default:
        return "text-gray-400 bg-gray-900/20"
    }
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
          <Link to="/savings" className="text-gray-300 hover:text-white transition-colors">
            Savings
          </Link>
          <Link to="/yield" className="text-gray-300 hover:text-white transition-colors">
            Yield
          </Link>
          <Link to="/governance" className="text-gray-300 hover:text-white transition-colors">
            Governance
          </Link>
          <Link to="/wallet" className="text-gray-300 hover:text-white transition-colors">
            Wallet
          </Link>
          <Button
            onClick={() => setIsConnected(!isConnected)}
            variant={isConnected ? "default" : "outline"}
            className={
              isConnected
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "border-orange-500 text-orange-300 hover:bg-orange-500 hover:text-white bg-transparent"
            }
          >
            {isConnected ? "Connected" : "Connect Wallet"}
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {!isConnected ? (
          // Enhanced connection prompt
          <div className="text-center py-20 animate-slide-up">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <Wallet className="w-10 h-10 text-white animate-float" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4 neon-text animate-typing">Connect Your Wallet</h1>
            <p className="text-gray-400 mb-8 max-w-md mx-auto animate-slide-up delay-300">
              Connect your wallet to access your Nuru Finance dashboard and start managing your Bitcoin savings and
              investments.
            </p>
            <Button
              onClick={() => setIsConnected(true)}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white ripple hover-lift animate-bounce-in animate-pulse-glow"
            >
              <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
              Connect Wallet
            </Button>
          </div>
        ) : (
          <>
            {/* Enhanced Header */}
            <div className="mb-8 animate-slide-up">
              <h1 className="text-3xl font-bold text-white mb-2 neon-text">Dashboard</h1>
              <p className="text-gray-400">Welcome back! Here's your portfolio overview.</p>
            </div>

            {/* Enhanced Portfolio Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gray-900/50 border-gray-800 glass hover-lift card-hover animate-scale-in">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Savings</p>
                      <p className="text-2xl font-bold text-white neon-text">₿{mockUserData.totalSavings}</p>
                      <p className="text-green-400 text-sm flex items-center animate-pulse">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        +5.2% APY
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center animate-pulse-glow">
                      <Shield className="w-6 h-6 text-orange-400 animate-float" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 glass hover-lift card-hover animate-scale-in delay-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Invested</p>
                      <p className="text-2xl font-bold text-white neon-text">₿{mockUserData.totalInvested}</p>
                      <p className="text-green-400 text-sm flex items-center animate-pulse">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        +7.8% Avg APY
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center animate-pulse-glow">
                      <TrendingUp className="w-6 h-6 text-green-400 animate-float" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 glass hover-lift card-hover animate-scale-in delay-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Returns</p>
                      <p className="text-2xl font-bold text-white neon-text">₿{mockUserData.totalReturns}</p>
                      <p className="text-green-400 text-sm flex items-center animate-pulse">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        This month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center animate-pulse-glow">
                      <Bitcoin className="w-6 h-6 text-purple-400 animate-float" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 glass hover-lift card-hover animate-scale-in delay-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Voting Power</p>
                      <p className="text-2xl font-bold text-white neon-text">{mockUserData.votingPower}x</p>
                      <Badge
                        className={`text-xs animate-pulse ${mockUserData.kycStatus === "verified" ? "bg-green-900/50 text-green-400" : "bg-yellow-900/50 text-yellow-400"}`}
                      >
                        {mockUserData.kycStatus === "verified" ? "KYC Verified" : "KYC Pending"}
                      </Badge>
                    </div>
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center animate-pulse-glow">
                      <Vote className="w-6 h-6 text-blue-400 animate-float" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="savings" className="space-y-6">
              <TabsList className="bg-gray-900/50 border-gray-800">
                <TabsTrigger value="savings" className="data-[state=active]:bg-orange-600">
                  Savings Pools
                </TabsTrigger>
                <TabsTrigger value="yield" className="data-[state=active]:bg-green-600">
                  Yield Positions
                </TabsTrigger>
                <TabsTrigger value="governance" className="data-[state=active]:bg-purple-600">
                  Governance
                </TabsTrigger>
              </TabsList>

              <TabsContent value="savings" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Your Savings Pools</h2>
                  <Link to="/savings">
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Pool
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockSavingsPools.map((pool) => (
                    <Card key={pool.id} className="bg-gray-900/50 border-gray-800">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">{pool.name}</CardTitle>
                          <Badge
                            variant="secondary"
                            className={
                              pool.type === "group"
                                ? "bg-blue-900/50 text-blue-400"
                                : "bg-purple-900/50 text-purple-400"
                            }
                          >
                            {pool.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">
                              ₿{pool.currentAmount} / ₿{pool.targetAmount}
                            </span>
                          </div>
                          <Progress value={(pool.currentAmount / pool.targetAmount) * 100} className="h-2" />
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">
                              {pool.members} member{pool.members !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400">Due: {pool.deadline}</span>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                        >
                          Manage Pool
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="yield" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Your Yield Positions</h2>
                  <Link to="/yield">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      New Position
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockYieldPositions.map((position) => (
                    <Card key={position.strategyId} className="bg-gray-900/50 border-gray-800">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">{position.name}</CardTitle>
                          <Badge className={getRiskColor(position.riskLevel)}>{position.riskLevel} risk</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400 text-sm">Amount</p>
                            <p className="text-white font-medium">₿{position.amount}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">APY</p>
                            <p className="text-green-400 font-medium">{position.apy}%</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Current Yield</p>
                          <p className="text-white font-medium">₿{position.currentYield}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                          >
                            Claim Yield
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                          >
                            Add More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="governance" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Active Proposals</h2>
                  <Link to="/governance">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Proposal
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {mockProposals.map((proposal) => (
                    <Card key={proposal.id} className="bg-gray-900/50 border-gray-800">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white font-medium">{proposal.title}</h3>
                          <Badge className="bg-green-900/50 text-green-400">{proposal.status}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-6">
                            <div className="text-center">
                              <p className="text-green-400 font-medium">{proposal.votesFor}</p>
                              <p className="text-gray-400 text-sm">For</p>
                            </div>
                            <div className="text-center">
                              <p className="text-red-400 font-medium">{proposal.votesAgainst}</p>
                              <p className="text-gray-400 text-sm">Against</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 text-sm">Ends: {proposal.deadline}</p>
                            <Button size="sm" className="mt-2 bg-purple-600 hover:bg-purple-700">
                              Vote
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
