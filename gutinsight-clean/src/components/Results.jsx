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
  Mail,
  Facebook,
  Twitter,
  Copy
} from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';

const Results = ({ userResponses, currentUser, paymentStatus }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Get user data from location state or props
  const userData = location.state?.userData || currentUser;

  useEffect(() => {
    // Generate mock analysis data since backend isn't available
    generateMockAnalysis();
  }, [userData, paymentStatus, userResponses, navigate]);

  const generateMockAnalysis = () => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockData = {
        gut_health_score: 72,
        analysis: `Based on your responses, your gut health shows several areas for improvement. Your digestive symptoms suggest an imbalanced gut microbiome, which is common and treatable.

Key findings:
• Moderate bloating and gas indicate potential food sensitivities
• Your diet could benefit from more fiber and probiotics
• Stress levels are impacting your digestive health
• Sleep quality improvements could significantly help gut healing

Your gut health score of 72/100 indicates "Good" status with room for optimization. With the right approach, you can expect to see improvements within 2-4 weeks.`,
        
        priority_areas: [
          "Reduce bloating and gas",
          "Improve gut microbiome diversity", 
          "Manage stress levels",
          "Optimize sleep quality",
          "Increase fiber intake"
        ],
        
        recommendations: [
          {
            category: "diet",
            title: "Increase Prebiotic Foods",
            description: "Add foods like garlic, onions, asparagus, and bananas to feed beneficial gut bacteria.",
            priority: "high"
          },
          {
            category: "supplements",
            title: "High-Quality Probiotic",
            description: "Take a multi-strain probiotic with at least 50 billion CFUs daily.",
            priority: "high"
          },
          {
            category: "lifestyle",
            title: "Stress Management",
            description: "Practice daily meditation or deep breathing for 10-15 minutes.",
            priority: "medium"
          },
          {
            category: "diet",
            title: "Eliminate Trigger Foods",
            description: "Consider removing gluten and dairy for 2-3 weeks to identify sensitivities.",
            priority: "medium"
          }
        ],
        
        product_recommendations: [
          {
            name: "Garden of Life Dr. Formulated Probiotics",
            category: "Probiotics",
            description: "50 billion CFU, 16 probiotic strains, shelf-stable",
            price: "$39.99",
            affiliate_url: "https://amazon.com/dp/B00Y8MP4G6",
            match_reason: "High CFU count and diverse strains perfect for your gut imbalance"
          },
          {
            name: "Heather's Tummy Fiber",
            category: "Fiber Supplement", 
            description: "Organic acacia senegal fiber, gentle and effective",
            price: "$24.95",
            affiliate_url: "https://amazon.com/dp/B000PKEJR0",
            match_reason: "Soluble fiber helps reduce bloating while feeding good bacteria"
          },
          {
            name: "Enzymedica Digest Gold",
            category: "Digestive Enzymes",
            description: "Advanced enzyme formula for better digestion",
            price: "$29.99", 
            affiliate_url: "https://amazon.com/dp/B0013OXKHC",
            match_reason: "Helps break down foods that may be causing gas and bloating"
          }
        ]
      };
      
      setAnalysisData(mockData);
      setLoading(false);
    }, 2000);
  };

  const downloadPDFReport = () => {
    if (!analysisData) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    let yPosition = 30;

    // Title
    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.text('Your Gut Health Analysis Report', margin, yPosition);
    yPosition += 20;

    // Score
    pdf.setFontSize(16);
    pdf.text(`Gut Health Score: ${analysisData.gut_health_score}/100`, margin, yPosition);
    yPosition += 15;

    // Analysis
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Analysis:', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    const analysisLines = pdf.splitTextToSize(analysisData.analysis, pageWidth - 2 * margin);
    pdf.text(analysisLines, margin, yPosition);
    yPosition += analysisLines.length * 5 + 10;

    // Priority Areas
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 30;
    }

    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Priority Areas:', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    analysisData.priority_areas.forEach((area, index) => {
      pdf.text(`${index + 1}. ${area}`, margin, yPosition);
      yPosition += 7;
    });

    // Recommendations
    yPosition += 10;
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 30;
    }

    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Recommendations:', margin, yPosition);
    yPosition += 10;

    analysisData.recommendations.forEach((rec, index) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 30;
      }

      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text(`${index + 1}. ${rec.title}`, margin, yPosition);
      yPosition += 7;

      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      const descLines = pdf.splitTextToSize(rec.description, pageWidth - 2 * margin);
      pdf.text(descLines, margin, yPosition);
      yPosition += descLines.length * 5 + 5;
    });

    // Save the PDF
    pdf.save('gut-health-analysis-report.pdf');
  };

  const shareResults = (platform) => {
    const shareText = `I just completed my gut health analysis and got a score of ${analysisData?.gut_health_score}/100! 🌟 Get your personalized gut health plan at`;
    const shareUrl = window.location.origin;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=Check out my gut health results&body=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareText + ' ' + shareUrl);
        alert('Link copied to clipboard!');
        break;
    }
    setShowShareMenu(false);
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
          <Button size="lg" onClick={downloadPDFReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF Report
          </Button>
          
          <div className="relative">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share Results
            </Button>
            
            {showShareMenu && (
              <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border p-2 z-10">
                <div className="flex flex-col gap-2 min-w-[150px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareResults('twitter')}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareResults('facebook')}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareResults('email')}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareResults('copy')}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;

