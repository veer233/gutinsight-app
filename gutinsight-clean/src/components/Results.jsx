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
  ArrowLeft
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

    // Fetch AI analysis
    fetchAnalysis();
  }, [userData, paymentStatus, userResponses, navigate]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError('');

      if (!userData?.id) {
        setError('User information not found. Please start over.');
        return;
      }

      // Check payment status first
      const paymentResponse = await fetch(`http://localhost:5000/api/payment/payment-status/${userData.id}`);
      const paymentData = await paymentResponse.json();

      if (!paymentData.can_access_results) {
        navigate('/payment');
        return;
      }

      // Get AI analysis
      const analysisResponse = await fetch('http://localhost:5000/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.id,
          responses: userResponses || {
            bloating_frequency: 7,
            gas_frequency: 6,
            stomach_pain: 4,
            diet_type: 'Standard Western Diet',
            fiber_intake: 3,
            stress_level: 8,
            sleep_quality: 4,
            exercise_frequency: '1-2 times',
            bowel_movement_frequency: '3-6 times per week',
            stool_consistency: 'Hard lumps',
            primary_goal: 'Reduce bloating'
          }
        }),
      });

      const analysis = await analysisResponse.json();

      if (analysis.error) {
        setError(analysis.error);
      } else {
        setAnalysisData(analysis);
      }
    } catch (error) {
      console.error('Failed to fetch analysis:', error);
      setError('Failed to load your analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Gut Health</h2>
          <p className="text-gray-600">Our AI is processing your responses to create your personalized plan...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => navigate('/')}>Start Over</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Info className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Analysis Available</h2>
              <p className="text-gray-600 mb-4">Unable to load your gut health analysis.</p>
              <Button onClick={() => navigate('/')}>Start Over</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Personalized Gut Health Analysis
            </h1>
            <p className="text-lg text-gray-600">
              Based on your responses, here's your comprehensive gut health plan
            </p>
          </motion.div>
        </div>

        {/* Gut Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 mr-2" />
                  <h2 className="text-2xl font-bold">Your Gut Health Score</h2>
                </div>
                <div className="text-6xl font-bold mb-2">{analysisData.gut_health_score}</div>
                <div className="text-xl mb-4">{getScoreLabel(analysisData.gut_health_score)}</div>
                <Progress 
                  value={analysisData.gut_health_score} 
                  className="w-full max-w-md mx-auto h-3"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="analysis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700">
                      {analysisData.analysis}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {analysisData.priority_areas && analysisData.priority_areas.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Priority Areas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {analysisData.priority_areas.map((area, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                          <span className="font-medium text-gray-900">{area}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {analysisData.recommendations && analysisData.recommendations.length > 0 ? (
                <div className="grid gap-6">
                  {analysisData.recommendations.map((rec, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {rec.category === 'diet' && <Heart className="h-5 w-5 text-green-600" />}
                              {rec.category === 'lifestyle' && <Zap className="h-5 w-5 text-blue-600" />}
                              {rec.category === 'supplements' && <Sparkles className="h-5 w-5 text-purple-600" />}
                              {rec.title}
                            </CardTitle>
                          </div>
                          <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                            {rec.priority} priority
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{rec.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-500">
                      <Info className="h-12 w-12 mx-auto mb-4" />
                      <p>No specific recommendations available at this time.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {analysisData.product_recommendations && analysisData.product_recommendations.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analysisData.product_recommendations.map((product, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription>{product.category}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                        {product.match_reason && (
                          <div className="bg-blue-50 p-3 rounded-lg mb-4">
                            <p className="text-sm text-blue-800">
                              <strong>Why this helps:</strong> {product.match_reason}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-600">{product.price}</span>
                          <Button 
                            size="sm" 
                            onClick={() => window.open(product.affiliate_url, '_blank')}
                            className="flex items-center gap-2"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Buy Now
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-500">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-4" />
                      <p>No product recommendations available at this time.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Expected Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 rounded-full p-2">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Week 1-2: Initial Changes</h4>
                        <p className="text-gray-600">Begin implementing dietary recommendations and lifestyle modifications.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-yellow-100 rounded-full p-2">
                        <CheckCircle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Week 3-4: Early Improvements</h4>
                        <p className="text-gray-600">You may start noticing improvements in digestion and energy levels.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 rounded-full p-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Month 2-3: Significant Progress</h4>
                        <p className="text-gray-600">Substantial improvements in gut health symptoms and overall well-being.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap gap-4 justify-center"
        >
          <Button size="lg" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF Report
          </Button>
          <Button variant="outline" size="lg" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Results
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;

