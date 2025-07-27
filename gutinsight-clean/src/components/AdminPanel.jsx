import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Users, 
  FileText, 
  ShoppingCart, 
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  EyeOff,
  LogOut,
  Shield
} from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Mock data - in real app this would come from API
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "How often do you experience bloating?",
      category: "Digestive Symptoms",
      type: "scale",
      min: 1,
      max: 10,
      order: 1
    },
    {
      id: 2,
      text: "How often do you experience gas?",
      category: "Digestive Symptoms", 
      type: "scale",
      min: 1,
      max: 10,
      order: 2
    },
    {
      id: 3,
      text: "Rate your stomach pain/discomfort",
      category: "Digestive Symptoms",
      type: "scale", 
      min: 1,
      max: 10,
      order: 3
    }
  ]);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Garden of Life Dr. Formulated Probiotics",
      category: "Probiotics",
      price: "$39.99",
      affiliate_url: "https://amazon.com/dp/B00Y8MP4G6",
      description: "50 billion CFU, 16 probiotic strains, shelf-stable"
    },
    {
      id: 2,
      name: "Heather's Tummy Fiber",
      category: "Fiber Supplement",
      price: "$24.95", 
      affiliate_url: "https://amazon.com/dp/B000PKEJR0",
      description: "Organic acacia senegal fiber, gentle and effective"
    }
  ]);

  const [users] = useState([
    { id: 1, email: "user1@example.com", completed_date: "2025-01-15", score: 72, paid: true },
    { id: 2, email: "user2@example.com", completed_date: "2025-01-14", score: 85, paid: true },
    { id: 3, email: "user3@example.com", completed_date: "2025-01-13", score: 68, paid: false }
  ]);

  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple authentication - in real app use proper auth
    if (loginForm.username === 'admin' && loginForm.password === 'gutinsight2025') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
    } else {
      alert('Invalid credentials. Use admin / gutinsight2025');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    navigate('/');
  };

  useEffect(() => {
    // Check if already authenticated
    const isAuth = localStorage.getItem('admin_authenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const saveQuestion = (questionData) => {
    if (editingQuestion) {
      setQuestions(questions.map(q => q.id === editingQuestion.id ? { ...questionData, id: editingQuestion.id } : q));
    } else {
      setQuestions([...questions, { ...questionData, id: Date.now() }]);
    }
    setEditingQuestion(null);
  };

  const deleteQuestion = (id) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const saveProduct = (productData) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p));
    } else {
      setProducts([...products, { ...productData, id: Date.now() }]);
    }
    setEditingProduct(null);
  };

  const deleteProduct = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Access the GutInsight admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    placeholder="Enter password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Login to Admin Panel
              </Button>
              <p className="text-sm text-gray-600 text-center">
                Demo credentials: admin / gutinsight2025
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">GutInsight Admin</h1>
                <p className="text-sm text-gray-600">Manage your gut health platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                View Site
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Paid Users</p>
                      <p className="text-3xl font-bold text-green-600">{users.filter(u => u.paid).length}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Questions</p>
                      <p className="text-3xl font-bold text-purple-600">{questions.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Products</p>
                      <p className="text-3xl font-bold text-orange-600">{products.length}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 5).map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{user.email}</p>
                        <p className="text-sm text-gray-600">Completed: {user.completed_date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.paid ? "default" : "secondary"}>
                          {user.paid ? "Paid" : "Free"}
                        </Badge>
                        <span className="text-lg font-bold">Score: {user.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Questions</h2>
              <Button onClick={() => setEditingQuestion({})}>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            {editingQuestion && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingQuestion.id ? 'Edit Question' : 'Add New Question'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <QuestionForm 
                    question={editingQuestion}
                    onSave={saveQuestion}
                    onCancel={() => setEditingQuestion(null)}
                  />
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {questions.map(question => (
                <Card key={question.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{question.text}</h3>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{question.category}</Badge>
                          <Badge variant="secondary">Order: {question.order}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingQuestion(question)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Products</h2>
              <Button onClick={() => setEditingProduct({})}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {editingProduct && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingProduct.id ? 'Edit Product' : 'Add New Product'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductForm 
                    product={editingProduct}
                    onSave={saveProduct}
                    onCancel={() => setEditingProduct(null)}
                  />
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <Card key={product.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription>{product.category}</CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">{product.price}</span>
                      <Button size="sm" variant="outline" onClick={() => window.open(product.affiliate_url, '_blank')}>
                        View Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <h2 className="text-2xl font-bold">User Management</h2>
            
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Email</th>
                        <th className="text-left py-2">Completed Date</th>
                        <th className="text-left py-2">Score</th>
                        <th className="text-left py-2">Payment Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} className="border-b">
                          <td className="py-3">{user.email}</td>
                          <td className="py-3">{user.completed_date}</td>
                          <td className="py-3">
                            <span className="font-semibold">{user.score}/100</span>
                          </td>
                          <td className="py-3">
                            <Badge variant={user.paid ? "default" : "secondary"}>
                              {user.paid ? "Paid ($47)" : "Unpaid"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Application Settings</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="app-name">Application Name</Label>
                  <Input id="app-name" defaultValue="GutInsight" />
                </div>
                <div>
                  <Label htmlFor="payment-amount">Payment Amount ($)</Label>
                  <Input id="payment-amount" type="number" defaultValue="47" />
                </div>
                <div>
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input id="support-email" type="email" defaultValue="support@gutinsight.co" />
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <Input id="openai-key" type="password" placeholder="sk-..." />
                </div>
                <div>
                  <Label htmlFor="stripe-key">Stripe Publishable Key</Label>
                  <Input id="stripe-key" type="password" placeholder="pk_..." />
                </div>
                <Button>Update API Keys</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Question Form Component
const QuestionForm = ({ question, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    text: question.text || '',
    category: question.category || 'Digestive Symptoms',
    type: question.type || 'scale',
    min: question.min || 1,
    max: question.max || 10,
    order: question.order || 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="question-text">Question Text</Label>
        <Textarea
          id="question-text"
          value={formData.text}
          onChange={(e) => setFormData({...formData, text: e.target.value})}
          placeholder="Enter the question text"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            placeholder="e.g., Digestive Symptoms"
            required
          />
        </div>
        <div>
          <Label htmlFor="order">Order</Label>
          <Input
            id="order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
            min="1"
            required
          />
        </div>
      </div>
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save Question
        </Button>
      </div>
    </form>
  );
};

// Product Form Component
const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product.name || '',
    category: product.category || '',
    price: product.price || '',
    affiliate_url: product.affiliate_url || '',
    description: product.description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="product-name">Product Name</Label>
        <Input
          id="product-name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Enter product name"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="product-category">Category</Label>
          <Input
            id="product-category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            placeholder="e.g., Probiotics"
            required
          />
        </div>
        <div>
          <Label htmlFor="product-price">Price</Label>
          <Input
            id="product-price"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            placeholder="e.g., $39.99"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="affiliate-url">Affiliate URL</Label>
        <Input
          id="affiliate-url"
          type="url"
          value={formData.affiliate_url}
          onChange={(e) => setFormData({...formData, affiliate_url: e.target.value})}
          placeholder="https://amazon.com/dp/..."
          required
        />
      </div>
      <div>
        <Label htmlFor="product-description">Description</Label>
        <Textarea
          id="product-description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Enter product description"
          required
        />
      </div>
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save Product
        </Button>
      </div>
    </form>
  );
};

export default AdminPanel;

