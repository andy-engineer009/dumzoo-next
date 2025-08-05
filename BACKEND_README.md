# Influencer Marketing Platform - Backend Documentation

## 🚀 Project Overview

This is a comprehensive backend API for an influencer marketing platform that connects influencers with brands/promoters. The platform supports user authentication, profile management, chat functionality, discovery, and payment processing.

## 🏗️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Joi/Yup
- **Real-time**: Socket.io (for chat)
- **Payment**: Stripe/Razorpay integration
- **Email/SMS**: Twilio, SendGrid

## 📋 Database Schema

### 1. Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  phone_number VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  username VARCHAR(100) UNIQUE,
  profile_image VARCHAR(500),
  bio TEXT,
  location VARCHAR(255),
  user_role ENUM('influencer', 'promoter', 'admin') DEFAULT 'influencer',
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  referral_code VARCHAR(20) UNIQUE,
  referred_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (referred_by) REFERENCES users(id)
);
```

### 2. Influencer Profiles Table
```sql
CREATE TABLE influencer_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  gender ENUM('male', 'female', 'other'),
  age INT,
  follower_count INT DEFAULT 0,
  instagram_url VARCHAR(500),
  youtube_url VARCHAR(500),
  facebook_url VARCHAR(500),
  audience_type ENUM('general', 'niche', 'specific'),
  audience_age_group ENUM('13-18', '19-25', '26-35', '36-45', '46-55', '56+'),
  starting_price DECIMAL(10,2),
  is_listed BOOLEAN DEFAULT TRUE,
  work_image VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. Categories Table
```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Influencer Categories (Many-to-Many)
```sql
CREATE TABLE influencer_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  influencer_id INT NOT NULL,
  category_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (influencer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE KEY unique_influencer_category (influencer_id, category_id)
);
```

### 5. Languages Table
```sql
CREATE TABLE languages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  code VARCHAR(10) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Influencer Languages (Many-to-Many)
```sql
CREATE TABLE influencer_languages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  influencer_id INT NOT NULL,
  language_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (influencer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
  UNIQUE KEY unique_influencer_language (influencer_id, language_id)
);
```

### 7. Pricing Offers Table
```sql
CREATE TABLE pricing_offers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  influencer_id INT NOT NULL,
  offer_type ENUM('single', 'combo') NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (influencer_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 8. Offer Items Table
```sql
CREATE TABLE offer_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  offer_id INT NOT NULL,
  content_type ENUM('post', 'story', 'reel', 'youtube_video', 'youtube_shorts', 'facebook_post', 'facebook_reel', 'facebook_story') NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (offer_id) REFERENCES pricing_offers(id) ON DELETE CASCADE
);
```

### 9. Chat Conversations Table
```sql
CREATE TABLE chat_conversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  influencer_id INT NOT NULL,
  promoter_id INT NOT NULL,
  last_message TEXT,
  last_message_time TIMESTAMP,
  unread_count_influencer INT DEFAULT 0,
  unread_count_promoter INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (influencer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (promoter_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_conversation (influencer_id, promoter_id)
);
```

### 10. Chat Messages Table
```sql
CREATE TABLE chat_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
  message TEXT NOT NULL,
  message_type ENUM('text', 'image', 'file') DEFAULT 'text',
  file_url VARCHAR(500),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 11. Booster Plans Table
```sql
CREATE TABLE booster_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  duration_days INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2) NOT NULL,
  discount_percentage INT NOT NULL,
  features JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 12. User Booster Subscriptions Table
```sql
CREATE TABLE user_booster_subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  plan_id INT NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  payment_id VARCHAR(255),
  amount_paid DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES booster_plans(id) ON DELETE CASCADE
);
```

### 13. OTP Verification Table
```sql
CREATE TABLE otp_verifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  phone_number VARCHAR(15) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 14. User Sessions Table
```sql
CREATE TABLE user_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  device_info TEXT,
  ip_address VARCHAR(45),
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔐 Authentication Flow

### 1. Phone Number Registration/Login
```
POST /api/auth/send-otp
Body: { phone_number: string }
Response: { success: boolean, message: string }
```

### 2. OTP Verification
```
POST /api/auth/verify-otp
Body: { phone_number: string, otp: string }
Response: { 
  success: boolean, 
  token: string, 
  user: UserObject,
  is_new_user: boolean 
}
```

### 3. Token Refresh
```
POST /api/auth/refresh-token
Headers: { Authorization: Bearer <token> }
Response: { success: boolean, token: string }
```

### 4. Logout
```
POST /api/auth/logout
Headers: { Authorization: Bearer <token> }
Response: { success: boolean, message: string }
```

## 👤 User Management

### 1. Get User Profile
```
GET /api/user/profile
Headers: { Authorization: Bearer <token> }
Response: { success: boolean, user: UserObject }
```

### 2. Update User Profile
```
PUT /api/user/profile
Headers: { Authorization: Bearer <token> }
Body: FormData (multipart)
Response: { success: boolean, user: UserObject }
```

### 3. Switch User Role
```
POST /api/user/switch-role
Headers: { Authorization: Bearer <token> }
Body: { role: 'influencer' | 'promoter' }
Response: { success: boolean, user: UserObject }
```

## 🎭 Influencer Profile Management

### 1. Get Influencer Profile
```
GET /api/influencer/profile
Headers: { Authorization: Bearer <token> }
Response: { success: boolean, profile: InfluencerProfileObject }
```

### 2. Update Influencer Profile
```
PUT /api/influencer/profile
Headers: { Authorization: Bearer <token> }
Body: FormData (multipart)
Response: { success: boolean, profile: InfluencerProfileObject }
```

### 3. Upload Profile Image
```
POST /api/influencer/upload-image
Headers: { Authorization: Bearer <token> }
Body: FormData (image file)
Response: { success: boolean, image_url: string }
```

### 4. Get Categories
```
GET /api/categories
Response: { success: boolean, categories: CategoryObject[] }
```

### 5. Get Languages
```
GET /api/languages
Response: { success: boolean, languages: LanguageObject[] }
```

## 💰 Pricing Management

### 1. Create Pricing Offer
```
POST /api/influencer/pricing
Headers: { Authorization: Bearer <token> }
Body: {
  offer_type: 'single' | 'combo',
  price: number,
  description: string,
  items: Array<{
    content_type: string,
    quantity: number
  }>
}
Response: { success: boolean, offer: PricingOfferObject }
```

### 2. Get Influencer Pricing
```
GET /api/influencer/pricing
Headers: { Authorization: Bearer <token> }
Response: { success: boolean, offers: PricingOfferObject[] }
```

### 3. Update Pricing Offer
```
PUT /api/influencer/pricing/:offerId
Headers: { Authorization: Bearer <token> }
Body: { price: number, description: string, items: Array }
Response: { success: boolean, offer: PricingOfferObject }
```

### 4. Delete Pricing Offer
```
DELETE /api/influencer/pricing/:offerId
Headers: { Authorization: Bearer <token> }
Response: { success: boolean, message: string }
```

## 🔍 Discovery & Search

### 1. Search Influencers
```
GET /api/discover/influencers
Query Parameters: {
  search: string,
  category: string,
  location: string,
  min_followers: number,
  max_followers: number,
  min_price: number,
  max_price: number,
  gender: string,
  language: string,
  page: number,
  limit: number
}
Response: { 
  success: boolean, 
  influencers: InfluencerObject[], 
  total: number,
  page: number,
  total_pages: number
}
```

### 2. Get Influencer Details
```
GET /api/influencer/:id
Response: { success: boolean, influencer: InfluencerDetailObject }
```

### 3. Get Featured Influencers
```
GET /api/discover/featured
Response: { success: boolean, influencers: InfluencerObject[] }
```

## 💬 Chat System

### 1. Get Chat Conversations
```
GET /api/chat/conversations
Headers: { Authorization: Bearer <token> }
Response: { success: boolean, conversations: ConversationObject[] }
```

### 2. Get Chat Messages
```
GET /api/chat/conversations/:conversationId/messages
Headers: { Authorization: Bearer <token> }
Query Parameters: { page: number, limit: number }
Response: { success: boolean, messages: MessageObject[], total: number }
```

### 3. Send Message
```
POST /api/chat/conversations/:conversationId/messages
Headers: { Authorization: Bearer <token> }
Body: { message: string, message_type: 'text' | 'image' | 'file' }
Response: { success: boolean, message: MessageObject }
```

### 4. Start New Conversation
```
POST /api/chat/conversations
Headers: { Authorization: Bearer <token> }
Body: { influencer_id: number, promoter_id: number }
Response: { success: boolean, conversation: ConversationObject }
```

### 5. Mark Messages as Read
```
PUT /api/chat/conversations/:conversationId/read
Headers: { Authorization: Bearer <token> }
Response: { success: boolean, message: string }
```

### 6. Delete Conversation
```
DELETE /api/chat/conversations/:conversationId
Headers: { Authorization: Bearer <token> }
Response: { success: boolean, message: string }
```

## 🚀 Booster Plans

### 1. Get Booster Plans
```
GET /api/booster/plans
Response: { success: boolean, plans: BoosterPlanObject[] }
```

### 2. Subscribe to Booster Plan
```
POST /api/booster/subscribe
Headers: { Authorization: Bearer <token> }
Body: { plan_id: number, payment_method: string }
Response: { success: boolean, subscription: SubscriptionObject }
```

### 3. Get User Subscriptions
```
GET /api/booster/subscriptions
Headers: { Authorization: Bearer <token> }
Response: { success: boolean, subscriptions: SubscriptionObject[] }
```

### 4. Cancel Subscription
```
DELETE /api/booster/subscriptions/:subscriptionId
Headers: { Authorization: Bearer <token> }
Response: { success: boolean, message: string }
```

## 🎁 Referral System

### 1. Submit Referral Code
```
POST /api/referral/submit
Headers: { Authorization: Bearer <token> }
Body: { referral_code: string }
Response: { success: boolean, message: string }
```

### 2. Skip Referral
```
POST /api/referral/skip
Headers: { Authorization: Bearer <token> }
Response: { success: boolean, message: string }
```

### 3. Get User Referral Code
```
GET /api/referral/code
Headers: { Authorization: Bearer <token> }
Response: { success: boolean, referral_code: string }
```

## 📱 Real-time Features (Socket.io)

### 1. Connection Events
- `connect`: User connects to socket
- `disconnect`: User disconnects from socket
- `user_online`: User goes online
- `user_offline`: User goes offline

### 2. Chat Events
- `join_conversation`: Join a specific conversation
- `leave_conversation`: Leave a conversation
- `send_message`: Send a new message
- `message_received`: Message received by recipient
- `message_read`: Message marked as read
- `typing_start`: User starts typing
- `typing_stop`: User stops typing

### 3. Notification Events
- `new_message`: New message notification
- `profile_view`: Profile view notification
- `new_follower`: New follower notification

## 🔒 Security & Middleware

### 1. Authentication Middleware
```javascript
const authenticateToken = (req, res, next) => {
  // Verify JWT token
  // Add user to request object
  // Handle token expiration
}
```

### 2. Role-based Authorization
```javascript
const authorizeRole = (roles) => {
  return (req, res, next) => {
    // Check if user has required role
    // Allow/deny access accordingly
  }
}
```

### 3. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');
// Implement rate limiting for API endpoints
```

### 4. Input Validation
```javascript
const validateInput = (schema) => {
  return (req, res, next) => {
    // Validate request body/query/params
    // Return validation errors if any
  }
}
```

## 📊 Error Handling

### Standard Error Response Format
```javascript
{
  success: false,
  error: {
    code: string,
    message: string,
    details: object (optional)
  },
  timestamp: string
}
```

### Common Error Codes
- `AUTH_001`: Invalid token
- `AUTH_002`: Token expired
- `AUTH_003`: Insufficient permissions
- `VAL_001`: Validation error
- `DB_001`: Database error
- `FILE_001`: File upload error
- `PAYMENT_001`: Payment processing error

## 🚀 API Response Format

### Success Response
```javascript
{
  success: true,
  data: object | array,
  message: string (optional),
  pagination: {
    page: number,
    limit: number,
    total: number,
    total_pages: number
  } (optional)
}
```

### Error Response
```javascript
{
  success: false,
  error: {
    code: string,
    message: string,
    details: object (optional)
  }
}
```

## 📁 File Structure

```
backend/
├── config/
│   ├── database.js
│   ├── redis.js
│   └── socket.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── influencerController.js
│   ├── chatController.js
│   ├── discoveryController.js
│   ├── boosterController.js
│   └── referralController.js
├── middleware/
│   ├── auth.js
│   ├── validation.js
│   ├── rateLimit.js
│   └── upload.js
├── models/
│   ├── User.js
│   ├── InfluencerProfile.js
│   ├── Chat.js
│   ├── BoosterPlan.js
│   └── Referral.js
├── routes/
│   ├── auth.js
│   ├── user.js
│   ├── influencer.js
│   ├── chat.js
│   ├── discovery.js
│   ├── booster.js
│   └── referral.js
├── services/
│   ├── authService.js
│   ├── chatService.js
│   ├── paymentService.js
│   ├── notificationService.js
│   └── fileUploadService.js
├── utils/
│   ├── database.js
│   ├── validation.js
│   ├── helpers.js
│   └── constants.js
├── socket/
│   ├── chatHandler.js
│   └── notificationHandler.js
├── app.js
├── server.js
└── package.json
```

## 🔧 Environment Variables

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=influencer_platform
DB_USER=root
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Payment Configuration (Stripe)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Socket.io Configuration
SOCKET_CORS_ORIGIN=http://localhost:3000
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Database
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE influencer_platform;

# Run migrations
npm run migrate
```

### 3. Set Environment Variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Start Production Server
```bash
npm start
```

## 📝 API Testing

### Using Postman/Insomnia
1. Import the provided API collection
2. Set up environment variables
3. Test all endpoints with proper authentication

### Using Jest for Unit Tests
```bash
npm test
```

## 🔄 Deployment

### 1. Build for Production
```bash
npm run build
```

### 2. Deploy to Server
```bash
# Using PM2
pm2 start ecosystem.config.js

# Using Docker
docker build -t influencer-backend .
docker run -p 3000:3000 influencer-backend
```

## 📈 Monitoring & Logging

### 1. Application Logs
- Use Winston for structured logging
- Log all API requests and responses
- Log errors with stack traces

### 2. Performance Monitoring
- Use New Relic or DataDog
- Monitor database query performance
- Track API response times

### 3. Health Checks
```
GET /api/health
Response: { status: 'healthy', timestamp: string }
```

## 🔐 Security Checklist

- [ ] JWT token validation
- [ ] Rate limiting on all endpoints
- [ ] Input validation and sanitization
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CORS configuration
- [ ] File upload security
- [ ] HTTPS enforcement
- [ ] Environment variable protection
- [ ] Database connection security

## 📞 Support

For any questions or issues:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

---

**Note**: This documentation should be updated as new features are added or existing ones are modified. Always keep the API documentation in sync with the actual implementation. 