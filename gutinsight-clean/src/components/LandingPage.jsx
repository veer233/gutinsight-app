import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  Brain, 
  Zap, 
  Shield, 
  CheckCircle, 
  Star,
  ArrowRight,
  Users,
  Clock,
  Award,
  Sparkles
} from 'lucide-react'
import { motion } from 'framer-motion'

const LandingPage = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [showSignup, setShowSignup] = useState(false)

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/questionnaire')
    } else {
      setShowSignup(true)
    }
  }

  const handleSignup = (e) => {
    e.preventDefault()
    if (email && name) {
      setCurrentUser({ email, name, id: Date.now() })
      navigate('/questionnaire')
    }
  }

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms analyze your responses to create personalized gut health insights"
    },
    {
      icon: Heart,
      title: "Personalized Recommendations",
      description: "Get tailored supplement and lifestyle recommendations based on your unique profile"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Receive your comprehensive gut health plan within minutes of completing the assessment"
    },
    {
      icon: Shield,
      title: "Science-Based",
      description: "All recommendations are backed by the latest research in gut health and microbiome science"
    }
  ]

  const benefits = [
    "Identify potential digestive issues",
    "Optimize your gut microbiome",
    "Improve energy and mood",
    "Enhance nutrient absorption",
    "Reduce bloating and discomfort",
    "Strengthen immune function"
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      rating: 5,
      text: "This analysis completely changed my approach to gut health. The recommendations were spot-on!"
    },
    {
      name: "Mike R.",
      rating: 5,
      text: "Finally found answers to my digestive issues. The personalized plan actually works!"
    },
    {
      name: "Emma L.",
      rating: 5,
      text: "The questionnaire was fun and engaging. Results were incredibly detailed and helpful."
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              GutWise
            </span>
          </motion.div>
          
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {currentUser.name}</span>
              <Button onClick={() => navigate('/questionnaire')}>
                Continue Assessment
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setShowSignup(true)}>
              Sign In
            </Button>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            <Award className="w-4 h-4 mr-1" />
            AI-Powered Gut Health Analysis
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Discover Your Perfect
            <br />
            Gut Health Plan
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Take our interactive 5-minute assessment and get a personalized gut health analysis 
            with AI-powered recommendations for supplements, diet, and lifestyle changes.
          </p>
          
          <div className="flex items-center justify-center space-x-6 mb-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              10,000+ analyzed
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              5 minutes
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-500" />
              4.9/5 rating
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg"
              onClick={handleGetStarted}
            >
              Start Your Analysis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
          
          <p className="text-sm text-gray-500 mt-4">
            Complete analysis for just $47 • Money-back guarantee
          </p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose GutWise?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our advanced AI analysis combines the latest gut health research with your personal health profile
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Transform Your Gut Health</h2>
              <p className="text-gray-600 mb-8">
                Our comprehensive analysis helps you understand your digestive system and provides 
                actionable steps to optimize your gut health for better overall wellness.
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">What You'll Receive:</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Comprehensive gut health assessment</li>
                <li>• Personalized supplement recommendations</li>
                <li>• Custom dietary guidelines</li>
                <li>• Lifestyle optimization tips</li>
                <li>• Product links for easy shopping</li>
                <li>• Ongoing support resources</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600">Join thousands who have transformed their gut health</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                  <p className="font-semibold text-emerald-600">- {testimonial.name}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-teal-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Optimize Your Gut Health?
          </h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands who have discovered their personalized path to better digestive health
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-emerald-600 hover:bg-gray-50 px-8 py-6 text-lg rounded-xl"
            onClick={handleGetStarted}
          >
            Start Your Analysis Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Signup Modal */}
      {showSignup && !currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>
                  Create your account to begin your gut health analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1">
                      Continue
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowSignup(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 GutWise. All rights reserved.</p>
          <p className="text-sm mt-2">
            This assessment is for educational purposes only and does not replace professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

