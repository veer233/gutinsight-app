import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Brain, 
  Zap, 
  Target,
  ShoppingCart,
  ExternalLink,
  Download,
  Share2,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp,
  Award,
  Sparkles,
  Loader2,
  ArrowLeft,
  Apple,
  Pill,
  Clock,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const Results = ({ userResponses, currentUser, paymentStatus }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get user data from location state or props
  const userData = location.state?.userData || currentUser;

  useEffect(() => {
    // Check if user has paid
    if (!userData?.has_paid && !paymentStatus) {
      navigate('/payment');
      return;
    }

    // Generate analysis based on user responses
    generateAnalysis();
  }, [userData, paymentStatus, userResponses, navigate]);

  const generateAnalysis = async () => {
    setLoading(true);
    try {
      // Simulate analysis generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate comprehensive analysis based on responses
      const responses = userData?.responses || userResponses || {};
      const analysis = createPersonalizedAnalysis(responses);
      
      setAnalysisData(analysis);
    } catch (error) {
      setError('Failed to generate analysis. Please try again.');
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPersonalizedAnalysis = (responses) => {
    // Calculate gut health score based on responses
    const scores = Object.values(responses).filter(val => typeof val === 'number');
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 7;
    const gutHealthScore = Math.round(avgScore * 10);

    // Determine health status
    let healthStatus, statusColor, statusIcon;
    if (gutHealthScore >= 80) {
      healthStatus = 'Excellent';
      statusColor = 'text-green-600';
      statusIcon = CheckCircle;
    } else if (gutHealthScore >= 60) {
      healthStatus = 'Good';
      statusColor = 'text-blue-600';
      statusIcon = Info;
    } else if (gutHealthScore >= 40) {
      healthStatus = 'Needs Attention';
      statusColor = 'text-yellow-600';
      statusIcon = AlertCircle;
    } else {
      healthStatus = 'Requires Improvement';
      statusColor = 'text-red-600';
      statusIcon = AlertCircle;
    }

    return {
      gutHealthScore,
      healthStatus,
      statusColor,
      statusIcon,
      keyFindings: [
        {
          category: 'Digestive Function',
          score: Math.max(30, gutHealthScore - 10),
          description: gutHealthScore > 70 ? 'Your digestive system shows good functionality with regular patterns.' : 'Some digestive irregularities detected that could benefit from targeted support.',
          recommendations: gutHealthScore > 70 ? ['Maintain current dietary habits', 'Continue regular meal timing'] : ['Consider digestive enzymes', 'Increase fiber intake gradually', 'Practice mindful eating']
        },
        {
          category: 'Microbiome Balance',
          score: Math.max(25, gutHealthScore - 5),
          description: gutHealthScore > 60 ? 'Microbiome appears relatively balanced with room for optimization.' : 'Microbiome diversity may be compromised, requiring targeted intervention.',
          recommendations: gutHealthScore > 60 ? ['Include fermented foods daily', 'Vary your vegetable intake'] : ['Take a high-quality probiotic', 'Eliminate processed foods', 'Add prebiotic-rich foods']
        },
        {
          category: 'Inflammation Markers',
          score: Math.max(20, gutHealthScore),
          description: gutHealthScore > 65 ? 'Low inflammatory indicators suggest good gut barrier function.' : 'Elevated inflammation markers may indicate gut barrier compromise.',
          recommendations: gutHealthScore > 65 ? ['Continue anti-inflammatory foods', 'Maintain stress management'] : ['Reduce inflammatory foods', 'Add omega-3 supplements', 'Consider gut healing protocol']
        }
      ],
      dietaryRecommendations: [
        {
          category: 'Foods to Emphasize',
          items: [
            'Fermented vegetables (sauerkraut, kimchi)',
            'Bone broth and collagen-rich foods',
            'Prebiotic fibers (garlic, onions, asparagus)',
            'Anti-inflammatory spices (turmeric, ginger)',
            'Wild-caught fish and grass-fed meats'
          ]
        },
        {
          category: 'Foods to Minimize',
          items: [
            'Processed and packaged foods',
            'Refined sugars and artificial sweeteners',
            'Excessive alcohol consumption',
            'Trans fats and vegetable oils',
            'Foods you\'ve identified as triggers'
          ]
        }
      ],
      lifestyleRecommendations: [
        {
          title: 'Stress Management',
          description: 'Chronic stress significantly impacts gut health through the gut-brain axis.',
          actions: ['Practice daily meditation or deep breathing', 'Maintain regular sleep schedule', 'Engage in moderate exercise']
        },
        {
          title: 'Meal Timing',
          description: 'Consistent meal timing supports healthy digestive rhythms.',
          actions: ['Eat meals at regular intervals', 'Allow 12-hour overnight fasting', 'Avoid late-night eating']
        },
        {
          title: 'Hydration',
          description: 'Proper hydration supports digestive function and nutrient absorption.',
          actions: ['Drink 8-10 glasses of filtered water daily', 'Limit caffeine and alcohol', 'Consider electrolyte balance']
        }
      ],
      supplementRecommendations: [
        {
          name: 'High-Quality Probiotic',
          purpose: 'Support microbiome diversity and balance',
          dosage: '25-50 billion CFU daily',
          timing: 'With breakfast',
          amazonLink: 'https://amazon.com/dp/B07TGRD8S8',
          priority: 'High'
        },
        {
          name: 'Digestive Enzymes',
          purpose: 'Enhance nutrient breakdown and absorption',
          dosage: '1-2 capsules with meals',
          timing: 'Before eating',
          amazonLink: 'https://amazon.com/dp/B01BTBGBTC',
          priority: gutHealthScore < 60 ? 'High' : 'Medium'
        },
        {
          name: 'L-Glutamine',
          purpose: 'Support gut lining repair and integrity',
          dosage: '5-10g daily',
          timing: 'Between meals',
          amazonLink: 'https://amazon.com/dp/B00E7IODXQ',
          priority: gutHealthScore < 50 ? 'High' : 'Low'
        },
        {
          name: 'Omega-3 Fatty Acids',
          purpose: 'Reduce inflammation and support gut barrier',
          dosage: '1000-2000mg daily',
          timing: 'With dinner',
          amazonLink: 'https://amazon.com/dp/B00CAZAU62',
          priority: 'Medium'
        }
      ],
      timeline: {
        week1: ['Start probiotic supplementation', 'Eliminate processed foods', 'Begin stress management practices'],
        week2: ['Add digestive enzymes if needed', 'Increase fermented food intake', 'Establish regular meal timing'],
        week4: ['Assess initial improvements', 'Consider additional supplements', 'Fine-tune dietary approach'],
        week8: ['Evaluate overall progress', 'Adjust supplement protocol', 'Plan long-term maintenance']
      }
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Gut Health</h2>
          <p className="text-gray-600">Creating your personalized recommendations...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Analysis Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatusIcon = analysisData.statusIcon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-900">Your Gut Health Analysis</h1>
          </div>
          <p className="text-lg text-gray-600">
            Personalized insights and recommendations for optimal digestive wellness
          </p>
        </motion.div>

        {/* Gut Health Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <StatusIcon className="h-12 w-12" />
                  <div>
                    <h2 className="text-3xl font-bold">{analysisData.gutHealthScore}/100</h2>
                    <p className="text-blue-100">Gut Health Score</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {analysisData.healthStatus}
                </Badge>
                <p className="mt-4 text-blue-100">
                  Based on your comprehensive assessment, here's your personalized gut health profile
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="diet">Diet Plan</TabsTrigger>
            <TabsTrigger value="supplements">Supplements</TabsTrigger>
            <TabsTrigger value="timeline">Action Plan</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {analysisData.keyFindings.map((finding, index) => (
                <motion.div
                  key={finding.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        {finding.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Score</span>
                          <span className="text-sm font-bold">{finding.score}/100</span>
                        </div>
                        <Progress value={finding.score} className="h-2" />
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{finding.description}</p>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Key Recommendations:</h4>
                        {finding.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Diet Plan Tab */}
          <TabsContent value="diet" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {analysisData.dietaryRecommendations.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Apple className="h-5 w-5 text-green-600" />
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {category.items.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Lifestyle Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {analysisData.lifestyleRecommendations.map((rec, index) => (
                    <div key={rec.title} className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        {rec.title}
                      </h4>
                      <p className="text-sm text-gray-600">{rec.description}</p>
                      <div className="space-y-2">
                        {rec.actions.map((action, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-xs">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supplements Tab */}
          <TabsContent value="supplements" className="space-y-6">
            <div className="grid gap-4">
              {analysisData.supplementRecommendations.map((supplement, index) => (
                <motion.div
                  key={supplement.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Pill className="h-5 w-5 text-blue-600" />
                            <h3 className="font-bold text-lg">{supplement.name}</h3>
                            <Badge variant={supplement.priority === 'High' ? 'destructive' : supplement.priority === 'Medium' ? 'default' : 'secondary'}>
                              {supplement.priority} Priority
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{supplement.purpose}</p>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-semibold">Dosage:</span> {supplement.dosage}
                            </div>
                            <div>
                              <span className="font-semibold">Timing:</span> {supplement.timing}
                            </div>
                          </div>
                        </div>
                        <Button asChild className="ml-4">
                          <a href={supplement.amazonLink} target="_blank" rel="noopener noreferrer">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Buy Now
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Your 8-Week Gut Health Transformation Plan
                </CardTitle>
                <CardDescription>
                  Follow this timeline for optimal results and sustainable improvements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(analysisData.timeline).map(([period, actions], index) => (
                    <motion.div
                      key={period}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-blue-600">
                            {period.replace('week', 'W')}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2 capitalize">
                          {period.replace('week', 'Week ')}
                        </h4>
                        <div className="space-y-2">
                          {actions.map((action, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-4 mt-8"
        >
          <Button size="lg" className="gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share Results
          </Button>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-12 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="font-bold text-lg mb-2">Ready to Transform Your Gut Health?</h3>
          <p className="text-gray-600 mb-4">
            Start implementing these recommendations today and track your progress over the next 8 weeks.
          </p>
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Join thousands who have transformed their health with personalized gut analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default Results;

