# 🔐 Project Flow: User Authentication System (Node.js + MongoDB)
Welcome! This guide outlines the steps to build a basic User Authentication API using Node.js, Express, and MongoDB.

## 🚀 Features:

- User Registration (Sign up)
- User Login (Sign in)
- Get User Details (Protected Route)
- Logout (Placeholder)

## 🛠 Tech Stack:

- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB & Mongoose
- Utils: dotenv (for environment variables)

## 📂 1. Initial Setup
Sabse pehle project initialize karenge aur zaroori packages install karenge.

### Initialize Project
Creates a package.json file.

```bash
npm init -y
```

### Install Dependencies
express: Server creation ke liye.

mongoose: Database interaction ke liye.

dotenv: Environment variables manage karne ke liye.

```bash
npm i express mongoose dotenv
```

## 🏗 2. Project Structure
Aapka project folder kuch aisa dikhna chahiye:

```
/auth-project
├── node_modules/
├── src/
│   ├── db/
│   │   └── db.js
│   ├── models/
│   │   └── user.model.js
│   ├── routes/
│   │   └── auth.routes.js
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
└── package.json
```

## ⚙️ 3. Configuration & Database

### Environment Variables (.env)
Create a .env file in the root directory.

**⚠️ Note:** Never commit this file to GitHub!

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/auth_demo
```

### Git Ignore (.gitignore)
Ye files humein version control mein nahi daalni hain.

```
node_modules
.env
```

### Database Connection (src/db/db.js)
Logic to connect Mongoose with MongoDB.

```javascript
const mongoose = require('mongoose');

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectToDB;
```

## 🧠 4. User Model (src/models/user.model.js)
Defines how a user looks in the database.

**🔒 Security Note:** For this demo, we are storing passwords as plain text. In a real app, ALWAYS use bcrypt to hash passwords.

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
```

## 🛣 5. Routes (src/routes/auth.routes.js)
Handles Registration, Login, and User details.

```javascript
const express = require('express');
const User = require('../models/user.model');
const router = express.Router();

// 📝 POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Create new user
    const user = await User.create({ username, password });
    
    res.status(201).json({
      message: 'User created successfully',
      user: { username: user.username },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 🔑 POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Validate password (Direct comparison for demo only!)
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ 
      message: 'Login successful', 
      user: { username: user.username } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 👤 GET /auth/user (Placeholder for protected route)
router.get('/user', (req, res) => {
  res.json({ message: 'User details (protected)' });
});

// 👋 GET /auth/logout (Placeholder)
router.get('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

module.exports = router;
```

## 🚀 6. Server Setup

### App Configuration (src/app.js)
Middleware and route mounting.

```javascript
const express = require('express');
const connectToDB = require('./db/db');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Connect to Database
connectToDB();

// Middleware
app.use(express.json()); // Parses incoming JSON

// Routes
app.use('/auth', authRoutes);

module.exports = app;
```

### Entry Point (src/server.js)
Starts the server.

```javascript
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
```

## 🧪 7. How to Run
Make sure MongoDB is running locally.

Start the server:

```bash
# Using node
node src/server.js

# OR using nodemon (recommended for dev)
npx nodemon src/server.js
```

### Expected Output:

```
🚀 Server is running on port 3000
✅ Connected to MongoDB
```

```javascript
  res.json({ message: 'Logged out' });
});

module.exports = router;
```

## Running the Project

Ensure MongoDB is running.

Start the server:

```bash
node src/server.js
```

Or with nodemon:

```bash
npx nodemon src/server.js
```
