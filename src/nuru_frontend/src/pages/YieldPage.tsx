import { Link } from "react-router-dom";
"use client"

import { useState, useEffect } from "react"
import { useApp } from "../contexts/AppContext"
import type { YieldStrategy } from "../../../declarations/canister_four/canister_four.did"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Alert, AlertDescription } from "../components/ui/alert"
import {
  TrendingUp,
  Shield,
  AlertTriangle,
  Zap,
  Plus,
  ArrowUpRight,
  Clock,
  Target,
  DollarSign,
  Info,
} from "lucide-react"

export default function YieldPage() {
  const { 
    yieldStrategies, 
    userPositions, 
    refreshYieldStrategies,
    getUserPositions,
    enterPosition,
    claimYields,
    projectReturns
  } = useApp();

  const [selectedStrategy, setSelectedStrategy] = useState<(typeof yieldStrategies)[0] | null>(null)
  const [investAmount, setInvestAmount] = useState("")
  const [duration, setDuration] = useState("30")
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false)
  const [projectedReturns, setProjectedReturns] = useState<number | null>(null)

  // Load data on component mount
  useEffect(() => {
    refreshYieldStrategies();
    getUserPositions();
  }, [refreshYieldStrategies, getUserPositions]);

  const getRiskColor = (riskLevel: YieldStrategy['riskLevel']) => {
    if ('low' in riskLevel) {
      return "text-green-400 bg-green-900/20 border-green-800"
    } else if ('medium' in riskLevel) {
      return "text-yellow-400 bg-yellow-900/20 border-yellow-800"
    } else if ('high' in riskLevel) {
      return "text-red-400 bg-red-900/20 border-red-800"
    } else {
      return "text-gray-400 bg-gray-900/20 border-gray-800"
    }
  }

  const getRiskIcon = (riskLevel: YieldStrategy['riskLevel']) => {
    if ('low' in riskLevel) {
      return <Shield className="w-4 h-4" />
    } else if ('medium' in riskLevel) {
      return <AlertTriangle className="w-4 h-4" />
    } else if ('high' in riskLevel) {
      return <Zap className="w-4 h-4" />
    } else {
      return <Shield className="w-4 h-4" />
    }
  }

  const getRiskText = (riskLevel: YieldStrategy['riskLevel']) => {
    if ('low' in riskLevel) return 'low'
    if ('medium' in riskLevel) return 'medium'
    if ('high' in riskLevel) return 'high'
    return 'unknown'
  }

  const handleEnterPosition = async () => {
    if (!selectedStrategy || !investAmount) return

    try {
      const success = await enterPosition(selectedStrategy.id, Number.parseFloat(investAmount));
      if (success) {
        setIsInvestDialogOpen(false);
        setSelectedStrategy(null);
        setInvestAmount("");
        setDuration("30");
      }
    } catch (err) {
      console.error("Failed to enter position:", err);
    }
  }

  const handleClaimYields = async () => {
    try {
      await claimYields();
    } catch (err) {
      console.error("Failed to claim yields:", err);
    }
  }

  const calculateProjectedReturns = async () => {
    if (!selectedStrategy || !investAmount || !duration) return

    try {
      const amount = Number.parseFloat(investAmount);
      const durationBigInt = BigInt(duration);
      const projected = await projectReturns(amount, selectedStrategy.id, durationBigInt);
      setProjectedReturns(projected);
    } catch (err) {
      console.error("Error calculating projected returns:", err);
    }
  }

  const formatTimeAgo = (timestamp: bigint) => {
    const timestampMs = Number(timestamp) / 1000000; // Convert nanoseconds to milliseconds
    const days = Math.floor((Date.now() - timestampMs) / (24 * 60 * 60 * 1000));
    return `${days} days ago`;
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
          <Link to="/governance" className="text-gray-300 hover:text-white transition-colors">
            Governance
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
          <h1 className="text-3xl font-bold text-white mb-2">Yield Strategies</h1>
          <p className="text-gray-400">Maximize your Bitcoin returns with our diversified yield farming strategies.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Invested</p>
                  <p className="text-2xl font-bold text-white">
                    ₿{userPositions.reduce((sum, pos) => sum + pos.amount, 0).toFixed(3)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Current Yield</p>
                  <p className="text-2xl font-bold text-white">
                    ₿{userPositions.reduce((sum, pos) => sum + pos.currentYield, 0).toFixed(5)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Claimed Yield</p>
                  <p className="text-2xl font-bold text-white">
                    ₿{userPositions.reduce((sum, pos) => sum + pos.claimedYield, 0).toFixed(5)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg APY</p>
                  <p className="text-2xl font-bold text-white">
                    {userPositions.length > 0
                      ? (
                          yieldStrategies
                            .filter(strategy => userPositions.some(pos => pos.strategyId === strategy.id))
                            .reduce((sum, strategy) => sum + strategy.baseApy, 0) / 
                          yieldStrategies.filter(strategy => userPositions.some(pos => pos.strategyId === strategy.id)).length
                        ).toFixed(1)
                      : "0.0"}
                    %
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="strategies" className="space-y-6">
          <TabsList className="bg-gray-900/50 border-gray-800 text-white">
            <TabsTrigger value="strategies" className="data-[state=active]:bg-green-600">
              Available Strategies
            </TabsTrigger>
            <TabsTrigger value="positions" className="data-[state=active]:bg-orange-600">
              My Positions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="strategies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yieldStrategies.map((strategy) => (
                <Card
                  key={strategy.id}
                  className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{strategy.name}</CardTitle>
                      <Badge className={getRiskColor(strategy.riskLevel)}>
                        {getRiskIcon(strategy.riskLevel)}
                        <span className="ml-1">{getRiskText(strategy.riskLevel)}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Base APY</p>
                        <p className="text-2xl font-bold text-green-400">{strategy.baseApy}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Min Amount</p>
                        <p className="text-white font-medium">₿{strategy.minAmount}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setSelectedStrategy(strategy)
                        setIsInvestDialogOpen(true)
                      }}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={!strategy.isActive}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Enter Position
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="positions" className="space-y-6">
            {userPositions.length === 0 ? (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-12 text-center">
                  <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Active Positions</h3>
                  <p className="text-gray-400 mb-6">
                    Start earning yield by entering a position in one of our strategies.
                  </p>
                  <Button
                    onClick={() => {
                      // Switch to strategies tab
                      const strategiesTab = document.querySelector('[value="strategies"]') as HTMLElement
                      strategiesTab?.click()
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Browse Strategies
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userPositions.map((position, index) => {
                  const strategy = yieldStrategies.find(s => s.id === position.strategyId);
                  if (!strategy) return null;
                  
                  return (
                    <Card key={index} className="bg-gray-900/50 border-gray-800">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-lg">{strategy.name}</CardTitle>
                          <Badge className={getRiskColor(strategy.riskLevel)}>
                            {getRiskIcon(strategy.riskLevel)}
                            <span className="ml-1">{getRiskText(strategy.riskLevel)}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>Entered {formatTimeAgo(position.entryTime)}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400 text-sm">Amount</p>
                            <p className="text-white font-medium">₿{position.amount}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Base APY</p>
                            <p className="text-green-400 font-medium">{strategy.baseApy}%</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Current Yield</span>
                            <span className="text-green-400">₿{position.currentYield.toFixed(6)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Claimed Yield</span>
                            <span className="text-white">₿{position.claimedYield.toFixed(6)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Claimable</span>
                            <span className="text-orange-400">
                              ₿{(position.currentYield - position.claimedYield).toFixed(6)}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            onClick={handleClaimYields}
                            className="flex-1 bg-orange-600 hover:bg-orange-700"
                            disabled={position.currentYield <= position.claimedYield}
                          >
                            Claim Yield
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedStrategy(strategy)
                              setIsInvestDialogOpen(true)
                            }}
                            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            Add More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Investment Dialog */}
        <Dialog open={isInvestDialogOpen} onOpenChange={setIsInvestDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Enter Position: {selectedStrategy?.name}</DialogTitle>
            </DialogHeader>
            {selectedStrategy && (
              <div className="space-y-4">
                <Alert className="border-blue-800 bg-blue-900/20">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-blue-300">
                    Base APY: {selectedStrategy.baseApy}% | Risk Level: {getRiskText(selectedStrategy.riskLevel)}
                  </AlertDescription>
                </Alert>

                <div>
                  <Label htmlFor="amount">Investment Amount (BTC)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.001"
                    min={selectedStrategy.minAmount}
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    placeholder={`Min: ${selectedStrategy.minAmount} BTC`}
                    className="bg-gray-800 border-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum: ₿{selectedStrategy.minAmount}</p>
                </div>

                <div>
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <Button
                  onClick={calculateProjectedReturns}
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                  disabled={!investAmount || !duration}
                >
                  Calculate Projected Returns
                </Button>

                {projectedReturns !== null && (
                  <Alert className="border-green-800 bg-green-900/20">
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription className="text-green-300">
                      Projected profit after {duration} days: ₿{projectedReturns.toFixed(6)}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex space-x-2">
                  <Button
                    onClick={() => setIsInvestDialogOpen(false)}
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEnterPosition}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={!investAmount || Number.parseFloat(investAmount) < selectedStrategy.minAmount}
                  >
                    Enter Position
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
