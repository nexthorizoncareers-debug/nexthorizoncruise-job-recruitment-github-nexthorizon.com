# Next Horizon Careers - Complete Setup & Deployment Guide

## 📋 Project Overview
**Next Horizon Careers** is a professional platform for global cruise ship and logistics job applications with integrated payment processing via Stripe.

- **Frontend**: React-based responsive UI
- **Backend**: Node.js/Express REST API
- **Database**: MongoDB (optional for local development)
- **Payment**: Stripe integration for secure transactions
- **Authentication**: JWT-based user authentication

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional - can use in-memory for testing)
- Stripe account (free tier available)

### 1. Clone & Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your Stripe keys and configuration
nano .env

# Start development server
npm run dev
```

Server will run on `http://localhost:5000`

### 2. Setup Frontend

```bash
# In a new terminal, navigate to frontend
cd frontend

# For React, install dependencies
npm install

# Start React development server
npm start
```

Frontend will run on `http://localhost:3000`

---

## 🔐 Payment Gateway Configuration (Stripe)

### Step 1: Create Stripe Account
1. Visit https://dashboard.stripe.com/register
2. Sign up and verify your email
3. Complete account setup

### Step 2: Get API Keys
1. Go to Dashboard → API Keys
2. Copy **Publishable Key** (starts with `pk_`)
3. Copy **Secret Key** (starts with `sk_`)
4. Add to `.env`:
```
STRIPE_PUBLIC_KEY=pk_your_key_here
STRIPE_SECRET_KEY=sk_your_key_here
```

### Step 3: Configure Webhooks (Optional for production)
1. Go to Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.failed`
4. Copy signing secret to `.env`

---

## 📦 Service Pricing Structure

| Service | Price | Description |
|---------|-------|-------------|
| Job Application Registration | $200 | Complete profile + matching |
| Medical Certification Support | $50 | Maritime medical exam assistance |
| International CV & Cover Letter | $30 | Professional document prep |
| CV Revamp | $16 | Resume enhancement |

**Total Registration Fee Range**: $16 - $296 USD

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment and create user
- `GET /api/payments/:userId` - Get payment history

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile

### Jobs
- `GET /api/jobs` - List all available jobs
- `GET /api/jobs/:jobId` - Get job details
- `POST /api/jobs/apply` - Submit job application
- `GET /api/applications/:userId` - Get user applications

### Services
- `GET /api/services` - List all services with pricing

### Contact
- `POST /api/contact` - Submit contact form

### Health
- `GET /api/health` - Check API status

---

## 🗄️ Database Schema (MongoDB)

### Users Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  country: String,
  services: [String],
  accountStatus: String,
  createdAt: Date
}
```

### Payments Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  stripePaymentId: String,
  amount: Number,
  currency: String,
  services: [String],
  status: String,
  createdAt: Date
}
```

### Job Applications Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  jobId: String,
  jobTitle: String,
  company: String,
  applicationDate: Date,
  status: String
}
```

---

## 🚢 Global Service Coverage

**Currently Serving**:
- 🇺🇸 United States
- 🇬🇧 United Kingdom
- 🇦🇪 United Arab Emirates
- 🇸🇬 Singapore
- 🇨🇦 Canada
- 🇦🇺 Australia
- And expanding globally...

---

## 📱 Responsive Design Features

✅ Mobile-first approach (320px and up)
✅ Tablet optimization (768px+)
✅ Desktop experience (1024px+)
✅ Touch-friendly buttons and forms
✅ Fast loading times
✅ Accessibility (WCAG 2.1 AA)

---

## 🔒 Security Features

- **HTTPS**: All connections encrypted
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs with salt rounds
- **CORS Protection**: Configurable domain restrictions
- **Stripe PCI Compliance**: Level 1 certified
- **Environment Variables**: Sensitive data protected

---

## 📊 Contact Information

**Next Horizon Careers**
- 📞 Phone: +1 (816) 827-0407
- 📧 Email: nexthorizoncareers@gmail.com
- 🌐 Website: https://www.nexthorizoncareers.com

---

## 🚀 Production Deployment

### Option 1: Heroku Deployment (Simple)

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create new Heroku app
heroku create next-horizon-careers

# Set environment variables
heroku config:set STRIPE_SECRET_KEY=sk_live_...
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret_key

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Option 2: AWS Deployment

1. Use AWS Elastic Beanstalk for auto-scaling
2. RDS for MongoDB Atlas connection
3. CloudFront for CDN
4. S3 for static files

### Option 3: DigitalOcean Deployment

```bash
# SSH into droplet
ssh root@your_droplet_ip

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone your_repo_url
cd next-horizon-careers

# Install dependencies and start
npm install
npm start
```

---

## 🧪 Testing

### Test Payment Integration
```javascript
// Use Stripe test card
Card Number: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123

// Successful payment simulation
```

### Test User Flow
1. Register new account
2. Select services (total should calculate correctly)
3. Enter test card details
4. Verify payment confirmation
5. Check user profile creation
6. Browse and apply for jobs

---

## 📈 Performance Optimization

- **Frontend**: Code splitting, lazy loading, minification
- **Backend**: Request caching, database indexing, CDN integration
- **Database**: Connection pooling, query optimization
- **Images**: Cruise ship logo optimized SVG format

---

## 🛠️ Troubleshooting

### Issue: Payment fails
**Solution**: Verify Stripe API keys are correct and account is active

### Issue: CORS errors
**Solution**: Update CORS_ORIGIN in .env to match frontend URL

### Issue: Database connection fails
**Solution**: Check MONGODB_URI is correct and IP whitelist includes your server

### Issue: Slow page load
**Solution**: Enable caching headers, optimize images, use CDN

---

## 📄 License

MIT License - Free for commercial use with attribution

---

## 🎯 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Video interview preparation
- [ ] Real-time job notifications
- [ ] Multiple language support
- [ ] Advanced job matching algorithm
- [ ] Direct messaging with employers
- [ ] Document verification system
- [ ] Background check integration

---

## 📞 Support

For issues or questions:
- Email: nexthorizoncareers@gmail.com
- Phone: +1 (816) 827-0407
- Response time: Within 24 hours

---

**Last Updated**: February 2024
**Status**: Production Ready ✅
