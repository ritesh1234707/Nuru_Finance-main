import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Shield, Users, TrendingUp, Wallet, Vote, Bitcoin, ArrowRight, CheckCircle, Zap } from "lucide-react"
import { Link } from "react-router-dom"
import { AuthComponent } from "../components/AuthComponent"

export default function HomePage(): JSX.Element {
  // const { user, yieldStrategies, proposals } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated background particles */}
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-2 h-2 bg-orange-400 rounded-full animate-pulse animate-float"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000 animate-float"></div>
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse delay-500 animate-float"></div>
        <div className="absolute bottom-60 right-40 w-1 h-1 bg-orange-400 rounded-full animate-pulse delay-700 animate-float"></div>
        <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-glow animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-pulse-glow animate-float"></div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-purple-500/5 animate-gradient"></div>

      {/* Navigation with glass effect */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto glass-dark rounded-lg mx-6 mt-4 animate-slide-up">
       {/* Replace this section */}
<div className="flex items-center space-x-2">
  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
    <img 
      src="/Nuru_logo.svg" 
      alt="Nuru_logo" 
      className="w-12 h-12 object-contain"
    />
  </div>
  <span className="text-white font-bold text-xl">Nuru Finance</span>
</div>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/dashboard" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
            Dashboard
          </Link>
          <Link to="/savings" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
            Savings
          </Link>
          <Link to="/yield" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
            Yield
          </Link>
          <Link to="/governance" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
            Governance
          </Link>
          <Link to="/wallet" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
            Wallet
          </Link>
        </div>
        <AuthComponent />
      </nav>

      {/* Hero Section with enhanced animations */}
      <div className="relative z-10 text-center px-6 mb-16 animate-slide-up">

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight animate-typing">
          Your Bitcoin,
          <br />
          <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent animate-gradient">
            Your Control
          </span>
        </h1>

        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8 animate-slide-up delay-300">
          Save, invest, and govern with complete control over your Bitcoin. Join verified communities and earn
          sustainable yields through our decentralized platform.
        </p>

        <Link to="/dashboard">
          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 animate-bounce-in ripple hover-lift animate-pulse-glow"
          >
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5 animate-pulse" />
          </Button>
        </Link>
      </div>

      {/* Enhanced Feature Cards Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {/* Non-Custodial Savings */}
        <Card className="bg-gradient-to-br from-orange-900/20 to-yellow-900/20 border-orange-800/50 glass hover-lift card-hover group animate-scale-in">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full animate-pulse opacity-20"></div>
              <div className="relative w-full h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <Shield className="w-10 h-10 text-white animate-float" />
              </div>
            </div>
            <CardTitle className="text-white text-2xl font-bold transition-all duration-300">
              Non-Custodial Savings
            </CardTitle>
            <p className="text-gray-300 text-sm">Full control over your funds</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-green-400 animate-slide-up">
              <CheckCircle className="w-4 h-4 animate-pulse" />
              <span className="text-sm">Individual & Group Pools</span>
            </div>
            <div className="flex items-center space-x-2 text-green-400 animate-slide-up delay-100">
              <CheckCircle className="w-4 h-4 animate-pulse" />
              <span className="text-sm">5.2% Base APY, 8.7% Premium</span>
            </div>
            <div className="flex items-center space-x-2 text-green-400 animate-slide-up delay-200">
              <CheckCircle className="w-4 h-4 animate-pulse" />
              <span className="text-sm">Smart contract security</span>
            </div>
            <Link to="/savings">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white mt-4 ripple hover-lift animate-shimmer">
                View Savings Pools
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* High Yield Strategies */}
        <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800/50 glass hover-lift card-hover group animate-scale-in delay-100">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full animate-pulse opacity-20"></div>
              <div className="relative w-full h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center animate-pulse">
                <TrendingUp className="w-10 h-10 text-white animate-float" />
              </div>
            </div>
            <CardTitle className="text-white text-2xl font-bold transition-all duration-300">
              Yield Strategies
            </CardTitle>
            <p className="text-gray-300 text-sm">Multiple risk levels available</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center animate-slide-up">
                <span className="text-gray-300 text-sm">Bitcoin HODL</span>
                <Badge className="bg-green-900/50 text-green-400 animate-pulse">
                  4.5% APY
                </Badge>
              </div>
              <div className="flex justify-between items-center animate-slide-up delay-100">
                <span className="text-gray-300 text-sm">BTC Lending</span>
                <Badge className="bg-yellow-900/50 text-yellow-400 animate-pulse">
                  7.2% APY
                </Badge>
              </div>
              <div className="flex justify-between items-center animate-slide-up delay-200">
                <span className="text-gray-300 text-sm">DeFi Farming</span>
                <Badge className="bg-red-900/50 text-red-400 animate-pulse">
                  12.8% APY
                </Badge>
              </div>
            </div>
            <Link to="/yield">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white ripple hover-lift animate-shimmer">
                Explore Strategies
                <TrendingUp className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* KYC & Governance */}
        <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-800/50 glass hover-lift card-hover group animate-scale-in delay-200">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full animate-pulse opacity-20"></div>
              <div className="relative w-full h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full flex items-center justify-center animate-pulse">
                <Vote className="w-10 h-10 text-white animate-float" />
              </div>
            </div>
            <CardTitle className="text-white text-2xl font-bold transition-all duration-300">
              KYC & Governance
            </CardTitle>
            <p className="text-gray-300 text-sm">Verified community voting</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between animate-slide-up">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center animate-pulse">
                  <Vote className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Voting Power</div>
                  <div className="text-gray-400 text-xs">Basic: 1x, Premium: 5x</div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-purple-400 animate-slide-up delay-100">
                <CheckCircle className="w-4 h-4 animate-pulse" />
                <span className="text-sm">KYC verification required</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-400 animate-slide-up delay-200">
                <CheckCircle className="w-4 h-4 animate-pulse" />
                <span className="text-sm">7-day voting periods</span>
              </div>
            </div>
            <Link to="/governance">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white ripple hover-lift animate-shimmer">
                View Proposals
                <Users className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Bitcoin Wallet */}
        <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-800/50 glass hover-lift card-hover group animate-scale-in delay-300">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-pulse opacity-20"></div>
              <div className="relative w-full h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center animate-pulse">
                <Wallet className="w-10 h-10 text-white animate-float" />
              </div>
            </div>
            <CardTitle className="text-white text-2xl font-bold transition-all duration-300">Bitcoin Wallet</CardTitle>
            <p className="text-gray-300 text-sm">Native Bitcoin integration</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center space-x-4 animate-slide-up">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center animate-pulse">
                <Bitcoin className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center animate-pulse delay-200">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-center animate-slide-up delay-100">
              <div className="text-2xl font-bold text-blue-400 mb-1">₿0.00000000</div>
              <div className="text-xs text-gray-400">Connect to view balance</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-blue-400 animate-slide-up delay-200">
                <CheckCircle className="w-4 h-4 animate-pulse" />
                <span className="text-sm">Native Bitcoin addresses</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-400 animate-slide-up delay-300">
                <CheckCircle className="w-4 h-4 animate-pulse" />
                <span className="text-sm">Direct pool transfers</span>
              </div>
            </div>
            <Link to="/wallet">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white ripple hover-lift animate-shimmer">
                Manage Wallet
                <Wallet className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Stats Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center glass p-6 rounded-lg hover-lift animate-bounce-in">
            <div className="text-3xl font-bold text-orange-400 mb-2 animate-pulse">$2.4M+</div>
            <div className="text-gray-400">Total Value Locked</div>
            <Zap className="w-6 h-6 text-orange-400 mx-auto mt-2 animate-pulse" />
          </div>
          <div className="text-center glass p-6 rounded-lg hover-lift animate-bounce-in delay-100">
            <div className="text-3xl font-bold text-green-400 mb-2 animate-pulse">1,247</div>
            <div className="text-gray-400">Active Savers</div>
            <Users className="w-6 h-6 text-green-400 mx-auto mt-2 animate-pulse" />
          </div>
          <div className="text-center glass p-6 rounded-lg hover-lift animate-bounce-in delay-200">
            <div className="text-3xl font-bold text-purple-400 mb-2 animate-pulse">156</div>
            <div className="text-gray-400">Governance Proposals</div>
            <Vote className="w-6 h-6 text-purple-400 mx-auto mt-2 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="relative z-10 text-center px-6 pb-16 animate-slide-up">
        <div className="glass p-8 rounded-lg max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to take control of your Bitcoin?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already earning sustainable yields while maintaining full custody of their
            Bitcoin through our decentralized platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 ripple hover-lift animate-pulse-glow"
              >
                Launch App
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent glass ripple"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}