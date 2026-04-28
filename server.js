// server.js - Next Horizon Careers Backend
// Install dependencies: npm install express cors dotenv stripe mongoose bcryptjs jsonwebtoken

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ==================== DATABASE MODELS ====================

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String },
  country: String,
  services: [String],
  createdAt: { type: Date, default: Date.now },
  accountStatus: { type: String, default: 'active' }
});

const paymentSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  stripePaymentId: String,
  amount: Number,
  currency: { type: String, default: 'USD' },
  services: [String],
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const jobApplicationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  jobId: String,
  jobTitle: String,
  company: String,
  applicationDate: { type: Date, default: Date.now },
  status: { type: String, default: 'submitted' }
});

// Models
const User = mongoose.model('User', userSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

// ==================== AUTHENTICATION ROUTES ====================

// Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phone, password, country } = req.body;

    // Validate input
    if (!fullName || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password || 'tempPassword123', 10);

    // Create user
    const user = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
      country
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, fullName, email, phone },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      user: { id: user._id, fullName: user.fullName, email: user.email },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PAYMENT ROUTES ====================

// Create Payment Intent (Stripe)
app.post('/api/payments/create-intent', async (req, res) => {
  try {
    const { amount, email, services, fullName } = req.body;

    if (!amount || !email) {
      return res.status(400).json({ error: 'Amount and email required' });
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      receipt_email: email,
      metadata: {
        services: JSON.stringify(services),
        fullName: fullName
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm Payment and Create User
app.post('/api/payments/confirm', async (req, res) => {
  try {
    const { fullName, email, phone, paymentIntentId, services, country } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID required' });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not confirmed' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        fullName,
        email,
        phone,
        country,
        services
      });
      await user.save();
    }

    // Record payment
    const payment = new Payment({
      userId: user._id,
      stripePaymentId: paymentIntentId,
      amount: paymentIntent.amount / 100,
      services,
      status: 'completed'
    });
    await payment.save();

    // Generate access token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '30d' });

    res.json({
      message: 'Payment successful',
      user: { id: user._id, fullName, email, phone },
      token,
      payment: { amount: paymentIntent.amount / 100, services }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Payment History
app.get('/api/payments/:userId', async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER ROUTES ====================

// Get User Profile
app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Profile
app.put('/api/users/:userId', async (req, res) => {
  try {
    const { fullName, phone, country, services } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { fullName, phone, country, services },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== JOB ROUTES ====================

const jobListings = [
  { id: 1, title: 'Cruise Ship Crew Member', company: 'Global Maritime Lines', location: 'Caribbean', salary: '$2,500-$3,500/month', description: 'Join our international crew' },
  { id: 2, title: 'Logistics Coordinator', company: 'International Shipping Co', location: 'USA', salary: '$45,000-$55,000/year', description: 'Manage supply chains' },
  { id: 3, title: 'Ship Maintenance Officer', company: 'Ocean Voyage Services', location: 'UK', salary: '£35,000-£45,000/year', description: 'Maritime maintenance expertise' },
  { id: 4, title: 'Supply Chain Manager', company: 'Global Logistics Ltd', location: 'UAE', salary: 'AED 120,000-150,000/year', description: 'Lead logistics operations' },
  { id: 5, title: 'Port Operations Manager', company: 'Harbor Services International', location: 'Singapore', salary: '$60,000-$75,000/year', description: 'Port management' },
  { id: 6, title: 'Cruise Director', company: 'Luxury Cruise Experiences', location: 'USA', salary: '$3,000-$4,500/month + tips', description: 'Entertainment & guest services' }
];

// Get All Jobs
app.get('/api/jobs', (req, res) => {
  res.json(jobListings);
});

// Get Single Job
app.get('/api/jobs/:jobId', (req, res) => {
  const job = jobListings.find(j => j.id === parseInt(req.params.jobId));
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(job);
});

// Apply for Job
app.post('/api/jobs/apply', async (req, res) => {
  try {
    const { userId, jobId, jobTitle, company } = req.body;

    if (!userId || !jobId) {
      return res.status(400).json({ error: 'User ID and Job ID required' });
    }

    const application = new JobApplication({
      userId,
      jobId,
      jobTitle,
      company
    });

    await application.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User's Job Applications
app.get('/api/applications/:userId', async (req, res) => {
  try {
    const applications = await JobApplication.find({ userId: req.params.userId }).sort({ applicationDate: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SERVICES ROUTES ====================

const servicesInfo = [
  { id: 'registration', name: 'Job Application Registration', price: 200, description: 'Complete profile setup and job matching' },
  { id: 'medical', name: 'Medical Certification', price: 50, description: 'Maritime medical examination support' },
  { id: 'cv', name: 'International CV & Cover Letter', price: 30, description: 'Professional document preparation' },
  { id: 'revamp', name: 'CV Revamp', price: 16, description: 'Resume enhancement service' }
];

// Get All Services
app.get('/api/services', (req, res) => {
  res.json(servicesInfo);
});

// ==================== CONTACT ROUTE ====================

// Contact Form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // In production, send email using nodemailer
    console.log(`Contact from ${name} (${email}): ${message}`);

    res.json({
      message: 'Message received. We will get back to you soon!'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'Next Horizon Careers API is running', timestamp: new Date() });
});

// ==================== ERROR HANDLER ====================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;

// Connect to MongoDB (optional - for production)
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nexthorizon', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

app.listen(PORT, () => {
  console.log(`🌊 Next Horizon Careers Server running on port ${PORT}`);
  console.log(`📱 Contact: +1 (816) 827-0407`);
  console.log(`📧 Email: nexthorizoncareers@gmail.com`);
});

module.exports = app;
