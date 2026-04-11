# 💳 Razorpay Payment Integration

A full-stack web application that integrates **Razorpay**, a popular Indian payment gateway, to enable secure online payment processing. The app displays a product card with a "Pay Now" button that triggers the Razorpay checkout flow.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Payment Flow](#-payment-flow)
- [Screenshots](#-screenshots)
- [Important Notes](#-important-notes)
- [License](#-license)

---

## ✨ Features

- **Product Display**: Fetches and displays products from MongoDB with image, title, description, and price
- **Razorpay Checkout**: Seamless payment experience with Razorpay's checkout modal
- **Payment Verification**: Secure signature verification on the backend
- **Payment Tracking**: Records all payment attempts in MongoDB with status tracking (PENDING → COMPLETED)
- **Responsive UI**: Clean, modern interface built with React and Vite
- **Auto-Reload**: Nodemon for backend, Vite HMR for frontend during development

---

## 🛠 Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **Mongoose** | MongoDB ODM |
| **Razorpay SDK** | Payment gateway integration |
| **dotenv** | Environment variable management |
| **cors** | Cross-origin resource sharing |
| **Nodemon** | Development auto-restart |

### Frontend

| Technology | Purpose |
|---|---|
| **React** | UI library |
| **Vite** | Build tool & dev server |
| **Axios** | HTTP client |
| **Razorpay Checkout.js** | Payment checkout widget (CDN) |

---

## 📁 Project Structure

```
razorpay/
├── Backend/
│   ├── server.js                    # Entry point (port 3000)
│   ├── package.json                 # Backend dependencies & scripts
│   ├── .gitignore                   # Ignores node_modules, .env
│   └── src/
│       ├── app.js                   # Express app & middleware setup
│       ├── db/
│       │   └── db.js                # MongoDB connection
│       ├── models/
│       │   ├── product.model.js     # Product schema (image, title, description, price)
│       │   └── payment.model.js     # Payment schema (orderId, paymentId, signature, status)
│       ├── controllers/
│       │   ├── product.controller.js  # createProduct, getItem
│       │   └── payment.controller.js  # createOrder, verifyPayment
│       └── routes/
│           ├── product.routes.js      # POST /, GET /get-item
│           └── payment.routes.js      # POST /create-order, POST /verify-payment
│
└── Frontend/
    ├── index.html                   # HTML entry point
    ├── vite.config.js               # Vite configuration
    ├── package.json                 # Frontend dependencies & scripts
    └── src/
        ├── main.jsx                 # React entry point
        ├── App.jsx                  # Main component (product card)
        ├── App.css                  # Product card styling
        ├── index.css                # Global styles
        ├── PaymentButton.jsx        # Razorpay payment flow
        └── assets/
            ├── hero.png
            ├── react.svg
            └── vite.svg
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher recommended)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager
- **Git** (for cloning the repository)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd razorpay
```

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../Frontend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
MONGODB_URI=mongodb://localhost:27017/razorpay-db
RAZORPAY_KEY_ID=rzp_test_SbnKEyMHieWhee
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

> **Note**: Replace `your_razorpay_key_secret_here` with your actual Razorpay secret key. You can find your keys in the [Razorpay Dashboard](https://dashboard.razorpay.com/).

---

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | ✅ Yes |
| `RAZORPAY_KEY_ID` | Razorpay public key ID | ✅ Yes |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key for signature verification | ✅ Yes |

---

## 🏃 Running the Application

You need to run **both** the backend and frontend servers simultaneously.

### Start Backend Server

```bash
cd Backend
npm run dev        # With nodemon (recommended for development)
# OR
npm run start      # Without nodemon
```

The backend server will start on **http://localhost:3000**

### Start Frontend Server

Open a new terminal and run:

```bash
cd Frontend
npm run dev
```

The frontend will start on **http://localhost:5173** (or another port if 5173 is in use).

---

## 🌐 API Endpoints

### Product Routes (`/api/products`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/products/` | Create a new product in the database |
| `GET` | `/api/products/get-item` | Fetch the first product from the database |

### Payment Routes (`/api/payments`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/payments/create-order` | Create a Razorpay order (returns order object with `id`, `amount`, `currency`) |
| `POST` | `/api/payments/verify-payment` | Verify payment signature and update payment status |

---

## 💸 Payment Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     PAYMENT FLOW                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User clicks "Pay Now" button                            │
│         ↓                                                   │
│  2. Frontend sends POST to /api/payments/create-order       │
│         ↓                                                   │
│  3. Backend creates order via Razorpay SDK                  │
│         ↓                                                   │
│  4. Backend saves payment record (status: PENDING) to MongoDB│
│         ↓                                                   │
│  5. Backend returns order details to frontend               │
│         ↓                                                   │
│  6. Razorpay checkout modal opens                           │
│         ↓                                                   │
│  7. User completes payment                                  │
│         ↓                                                   │
│  8. Frontend sends payment details to /verify-payment       │
│         ↓                                                   │
│  9. Backend verifies signature & updates status to COMPLETED│
│         ↓                                                   │
│  10. Success! Payment recorded in database                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🖼 Screenshots

The application features:

- **Product Card**: Clean, modern card layout displaying product image, title, description, and price
- **Payment Button**: Prominent "Pay Now" button styled with Razorpay's brand colors
- **Checkout Modal**: Razorpay's secure payment interface for entering payment details

---

## 📝 Important Notes

### ⚠️ Known Limitations

1. **Hardcoded Razorpay Key**: The `key_id` is currently hardcoded in `Frontend/src/PaymentButton.jsx`. It should ideally be fetched from the backend via an API endpoint.

2. **Single Product**: The `getItem` endpoint uses `findOne()` without query parameters, so it always returns the first product. Modify to support multiple products.

3. **No Authentication**: There is no user authentication system. Anyone can create products and initiate payments.

4. **Hardcoded API URL**: The frontend makes API calls to `http://localhost:3000` hardcoded. Update this for production deployment.

5. **No `.env.example`**: No template file exists for environment variables. Refer to the [Environment Variables](#-environment-variables) section above.

### 🔧 Seeding a Product

Before testing, you need to add at least one product to the database. Send a `POST` request to `http://localhost:3000/api/products/` with the following body:

```json
{
  "title": "Sample Product",
  "image": "https://example.com/image.jpg",
  "description": "A sample product description.",
  "price": {
    "amount": 499,
    "currency": "INR"
  }
}
```

> **Note**: The `amount` is in paise (1 INR = 100 paise). The frontend displays it as `amount / 100`.

You can use tools like [Postman](https://www.postman.com/), [Thunder Client](https://www.thunderclient.com/), or [curl](https://curl.se/) to make this request.

---

## 📄 License

This project is for educational purposes. Please ensure you comply with Razorpay's [Terms of Service](https://razorpay.com/terms/) and [API documentation](https://razorpay.com/docs/) when using this code.

---

## 🤝 Contributing

Feel free to fork this repository and submit pull requests for improvements. Some areas for enhancement:

- [ ] Add user authentication
- [ ] Support multiple products with a catalog page
- [ ] Add payment history dashboard
- [ ] Implement webhook handling for payment updates
- [ ] Add error handling and loading states
- [ ] Create `.env.example` template
- [ ] Move Razorpay key to environment variable

---

## 📞 Support

For issues or questions:

- Check the [Razorpay Documentation](https://razorpay.com/docs/)
- Review the [Mongoose Documentation](https://mongoosejs.com/)
- Open an issue on the repository

---

**Happy Coding! 🎉**
