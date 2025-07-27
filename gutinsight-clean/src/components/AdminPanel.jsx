import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Users, 
  FileText, 
  ShoppingCart,
  BarChart3,
  Lock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  RefreshCw,
  DollarSign,
  TrendingUp,
  UserCheck,
  Brain
} from 'lucide-react';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPayments: 0,
    totalRevenue: 0,
    completedAnalyses: 0
  });
  const [questions, setQuestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    category: 'digestive_symptoms',
    type: 'scale',
    options: '',
    help_text: ''
  });
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    affiliate_url: '',
    match_criteria: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple demo authentication
    if (credentials.username === 'admin' && credentials.password === 'demo123') {
      setIsAuthenticated(true);
      await fetchDashboardData();
    } else {
      alert('Demo credentials: admin / demo123');
    }
    setLoading(false);
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch('http://localhost:5000/api/admin/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch questions
      const questionsResponse = await fetch('http://localhost:5000/api/questions');
      if (questionsResponse.ok) {
        const questionsData = await questionsResponse.json();
        setQuestions(questionsData);
      }

      // Fetch products
      const productsResponse = await fetch('http://localhost:5000/api/products');
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData);
      }

      // Fetch users
      const usersResponse = await fetch('http://localhost:5000/api/admin/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const handleSaveQuestion = async () => {
    try {
      const method = editingQuestion ? 'PUT' : 'POST';
      const url = editingQuestion 
        ? `http://localhost:5000/api/questions/${editingQuestion.id}`
        : 'http://localhost:5000/api/questions';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingQuestion || newQuestion)
      });

      if (response.ok) {
        await fetchDashboardData();
        setEditingQuestion(null);
        setNewQuestion({
          text: '',
          category: 'digestive_symptoms',
          type: 'scale',
          options: '',
          help_text: ''
        });
      }
    } catch (error) {
      console.error('Failed to save question:', error);
    }
  };

  const handleSaveProduct = async () => {
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct 
        ? `http://localhost:5000/api/products/${editingProduct.id}`
        : 'http://localhost:5000/api/products';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct || newProduct)
      });

      if (response.ok) {
        await fetchDashboardData();
        setEditingProduct(null);
        setNewProduct({
          name: '',
          category: '',
          description: '',
          price: '',
          affiliate_url: '',
          match_criteria: ''
        });
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (confirm('Are you sure you want to delete this question?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/questions/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          await fetchDashboardData();
        }
      } catch (error) {
        console.error('Failed to delete question:', error);
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          await fetchDashboardData();
        }
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Admin Login
            </CardTitle>
            <CardDescription>
              Access the administrative panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Demo credentials: admin / demo123
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={fetchDashboardData}
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAuthenticated(false)}
              >
                Logout
              </Button>
            </div>
          </div>
          <p className="text-gray-600">Manage your gut health application</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">${stats.totalRevenue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Paid Users</p>
                  <p className="text-2xl font-bold">{stats.totalPayments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Analyses</p>
                  <p className="text-2xl font-bold">{stats.completedAnalyses}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Questions Management */}
          <TabsContent value="questions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Question Management</CardTitle>
                <CardDescription>
                  Add, edit, and manage questionnaire questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add New Question Form */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-4">
                      {editingQuestion ? 'Edit Question' : 'Add New Question'}
                    </h3>
                    <div className="grid gap-4">
                      <div>
                        <Label>Question Text</Label>
                        <Input
                          value={editingQuestion?.text || newQuestion.text}
                          onChange={(e) => {
                            if (editingQuestion) {
                              setEditingQuestion({...editingQuestion, text: e.target.value});
                            } else {
                              setNewQuestion({...newQuestion, text: e.target.value});
                            }
                          }}
                          placeholder="Enter question text"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Category</Label>
                          <select 
                            className="w-full p-2 border rounded"
                            value={editingQuestion?.category || newQuestion.category}
                            onChange={(e) => {
                              if (editingQuestion) {
                                setEditingQuestion({...editingQuestion, category: e.target.value});
                              } else {
                                setNewQuestion({...newQuestion, category: e.target.value});
                              }
                            }}
                          >
                            <option value="digestive_symptoms">Digestive Symptoms</option>
                            <option value="dietary_patterns">Dietary Patterns</option>
                            <option value="lifestyle_factors">Lifestyle Factors</option>
                            <option value="bowel_health">Bowel Health</option>
                            <option value="health_goals">Health Goals</option>
                          </select>
                        </div>
                        <div>
                          <Label>Type</Label>
                          <select 
                            className="w-full p-2 border rounded"
                            value={editingQuestion?.type || newQuestion.type}
                            onChange={(e) => {
                              if (editingQuestion) {
                                setEditingQuestion({...editingQuestion, type: e.target.value});
                              } else {
                                setNewQuestion({...newQuestion, type: e.target.value});
                              }
                            }}
                          >
                            <option value="scale">Scale (1-10)</option>
                            <option value="multiple_choice">Multiple Choice</option>
                            <option value="text">Text Input</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <Label>Help Text</Label>
                        <Textarea
                          value={editingQuestion?.help_text || newQuestion.help_text}
                          onChange={(e) => {
                            if (editingQuestion) {
                              setEditingQuestion({...editingQuestion, help_text: e.target.value});
                            } else {
                              setNewQuestion({...newQuestion, help_text: e.target.value});
                            }
                          }}
                          placeholder="Optional help text for users"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveQuestion}>
                          <Save className="w-4 h-4 mr-2" />
                          {editingQuestion ? 'Update' : 'Add'} Question
                        </Button>
                        {editingQuestion && (
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingQuestion(null)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-2">
                    {questions.map((question) => (
                      <div key={question.id} className="border rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{question.text}</h4>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary">{question.category}</Badge>
                            <Badge variant="outline">{question.type}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingQuestion(question)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Management */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>
                  Manage affiliate products and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add New Product Form */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-4">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Product Name</Label>
                          <Input
                            value={editingProduct?.name || newProduct.name}
                            onChange={(e) => {
                              if (editingProduct) {
                                setEditingProduct({...editingProduct, name: e.target.value});
                              } else {
                                setNewProduct({...newProduct, name: e.target.value});
                              }
                            }}
                            placeholder="Product name"
                          />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Input
                            value={editingProduct?.category || newProduct.category}
                            onChange={(e) => {
                              if (editingProduct) {
                                setEditingProduct({...editingProduct, category: e.target.value});
                              } else {
                                setNewProduct({...newProduct, category: e.target.value});
                              }
                            }}
                            placeholder="e.g., Probiotics, Digestive Enzymes"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={editingProduct?.description || newProduct.description}
                          onChange={(e) => {
                            if (editingProduct) {
                              setEditingProduct({...editingProduct, description: e.target.value});
                            } else {
                              setNewProduct({...newProduct, description: e.target.value});
                            }
                          }}
                          placeholder="Product description"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Price</Label>
                          <Input
                            value={editingProduct?.price || newProduct.price}
                            onChange={(e) => {
                              if (editingProduct) {
                                setEditingProduct({...editingProduct, price: e.target.value});
                              } else {
                                setNewProduct({...newProduct, price: e.target.value});
                              }
                            }}
                            placeholder="$29.99"
                          />
                        </div>
                        <div>
                          <Label>Affiliate URL</Label>
                          <Input
                            value={editingProduct?.affiliate_url || newProduct.affiliate_url}
                            onChange={(e) => {
                              if (editingProduct) {
                                setEditingProduct({...editingProduct, affiliate_url: e.target.value});
                              } else {
                                setNewProduct({...newProduct, affiliate_url: e.target.value});
                              }
                            }}
                            placeholder="https://amazon.com/..."
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Match Criteria</Label>
                        <Textarea
                          value={editingProduct?.match_criteria || newProduct.match_criteria}
                          onChange={(e) => {
                            if (editingProduct) {
                              setEditingProduct({...editingProduct, match_criteria: e.target.value});
                            } else {
                              setNewProduct({...newProduct, match_criteria: e.target.value});
                            }
                          }}
                          placeholder="When to recommend this product (e.g., high bloating, low fiber intake)"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveProduct}>
                          <Save className="w-4 h-4 mr-2" />
                          {editingProduct ? 'Update' : 'Add'} Product
                        </Button>
                        {editingProduct && (
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingProduct(null)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Products List */}
                  <div className="space-y-2">
                    {products.map((product) => (
                      <div key={product.id} className="border rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-gray-600">{product.category} - {product.price}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage user accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant={user.has_paid ? "default" : "secondary"}>
                            {user.has_paid ? "Paid" : "Free"}
                          </Badge>
                          <Badge variant="outline">
                            Joined: {new Date(user.created_at).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  View application performance and user metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="text-center py-8">
                    <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                    <p className="text-gray-600">
                      Detailed analytics and reporting features will be available in the next update.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>
                  Configure application settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">AI Configuration</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>AI Model</Label>
                        <Input value="gpt-4o-mini" disabled />
                      </div>
                      <div>
                        <Label>Analysis Prompt Template</Label>
                        <Textarea 
                          rows={6}
                          defaultValue="You are a gut health expert. Analyze the user's responses and provide personalized recommendations..."
                          placeholder="AI prompt template for analysis"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Payment Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Analysis Price</Label>
                        <Input defaultValue="$47.00" />
                      </div>
                      <div>
                        <Label>Payment Mode</Label>
                        <select className="w-full p-2 border rounded">
                          <option value="demo">Demo Mode</option>
                          <option value="live">Live Mode</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;

