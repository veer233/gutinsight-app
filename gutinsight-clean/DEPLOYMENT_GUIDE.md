# GutWise Deployment Guide

## 🚀 **Quick Deploy to Vercel**

### **Step 1: Fork This Repository**
1. Click "Fork" button on GitHub
2. Create fork in your account
3. Clone to your local machine (optional)

### **Step 2: Connect to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your forked repository
5. Click "Deploy"

### **Step 3: Configure Environment Variables**
In Vercel dashboard, go to Settings → Environment Variables:

```
OPENAI_API_KEY = sk-proj-your-key-here
STRIPE_PUBLISHABLE_KEY = pk_test_your-key
STRIPE_SECRET_KEY = sk_test_your-key
```

### **Step 4: Add Custom Domain**
1. In Vercel project settings
2. Go to "Domains" 
3. Add your custom domain
4. Follow DNS configuration instructions

## 🔧 **Alternative Deployment Options**

### **Netlify Deployment**
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables

### **Railway Deployment** 
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### **Traditional Hosting**
1. Build project: `npm run build`
2. Upload `dist` folder to web server
3. Configure backend separately

## 📊 **Post-Deployment Checklist**

- [ ] Test questionnaire flow
- [ ] Verify payment processing
- [ ] Check mobile responsiveness  
- [ ] Test admin panel access
- [ ] Confirm email notifications
- [ ] Validate analytics tracking

## 🎯 **Going Live**

1. **Switch to live Stripe keys**
2. **Test real payment flow**
3. **Set up domain and SSL**
4. **Configure analytics**
5. **Launch marketing campaigns**

## 📞 **Need Help?**

Contact for deployment assistance:
- Technical issues
- Custom domain setup
- Payment configuration
- Performance optimization

