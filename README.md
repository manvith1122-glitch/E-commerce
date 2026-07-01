# 🛍️ ShopElite — Full-Stack E-Commerce Application

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![React](https://img.shields.io/badge/Frontend-React%2018-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

A complete full-stack e-commerce platform built with the MERN stack featuring product management, shopping cart, order tracking, and role-based admin dashboard.

## 📸 Features

### 👤 User Features
- ✅ Register / Login with JWT authentication
- ✅ Browse products with search and filters
- ✅ Filter by category, sort by price/rating
- ✅ Product detail page with image gallery
- ✅ Customer reviews and ratings
- ✅ Add to cart, update quantity, remove items
- ✅ Persistent cart using localStorage
- ✅ 3-step checkout (Shipping → Payment → Review)
- ✅ Order history with real-time status tracking
- ✅ Visual order progress tracker
- ✅ Edit profile and change password

### 🔑 Admin Features
- ✅ Dashboard with revenue stats and charts
- ✅ Product management (Create, Read, Update, Delete)
- ✅ Order management with status updates
- ✅ User management with role toggle
- ✅ Admin panel at /admin

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, React Router v6, Axios  |
| Styling    | Pure CSS (Custom Design System)   |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB with Mongoose ODM         |
| Auth       | JWT + bcryptjs                    |
| Toasts     | react-toastify                    |

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 1. Clone the Repository
```bash
git clone https://github.com/manvith1122-glitch/E-commerce.git
cd E-commerce
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

Seed the database:
```bash
node seed.js
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

Open **http://localhost:3000**

---

## 🔐 Demo Credentials

| Role  | Email          | Password |
|-------|----------------|----------|
| Admin | admin@shop.com | admin123 |
| User  | user@shop.com  | user123  |

---

## 🛠️ API Endpoints

### Auth
| Method | Endpoint                   | Access  | Description      |
|--------|----------------------------|---------|------------------|
| POST   | /api/auth/register         | Public  | Register user    |
| POST   | /api/auth/login            | Public  | Login            |
| GET    | /api/auth/me               | Private | Get profile      |
| PUT    | /api/auth/me               | Private | Update profile   |
| PUT    | /api/auth/change-password  | Private | Change password  |

### Products
| Method | Endpoint                  | Access  | Description      |
|--------|---------------------------|---------|------------------|
| GET    | /api/products             | Public  | List products    |
| GET    | /api/products/:id         | Public  | Single product   |
| GET    | /api/products/categories  | Public  | All categories   |
| POST   | /api/products             | Admin   | Create product   |
| PUT    | /api/products/:id         | Admin   | Update product   |
| DELETE | /api/products/:id         | Admin   | Delete product   |
| POST   | /api/products/:id/reviews | Private | Add review       |

### Orders
| Method | Endpoint               | Access  | Description      |
|--------|------------------------|---------|------------------|
| POST   | /api/orders            | Private | Place order      |
| GET    | /api/orders/my         | Private | My orders        |
| GET    | /api/orders/:id        | Private | Order detail     |
| GET    | /api/orders            | Admin   | All orders       |
| PUT    | /api/orders/:id/status | Admin   | Update status    |
| GET    | /api/orders/stats      | Admin   | Dashboard stats  |

### Users
| Method | Endpoint        | Access | Description    |
|--------|-----------------|--------|----------------|
| GET    | /api/users      | Admin  | All users      |
| PUT    | /api/users/:id  | Admin  | Update role    |
| DELETE | /api/users/:id  | Admin  | Delete user    |

---

## 🔧 Troubleshooting

| Problem | Fix |
|---------|-----|
| MongoDB not connecting | Run `mongod` in terminal |
| Port 5000 in use | Change PORT in .env |
| Port 3000 in use | Press Y when React asks for 3001 |
| npm install fails | Delete node_modules and run again |
| git push rejected | Run `git pull origin main --rebase` |

---

## 🚀 Deployment

| Service  | Platform |
|----------|----------|
| Frontend | Vercel   |
| Backend  | Render   |
| Database | MongoDB Atlas |

---

## 👨‍💻 Author

**Manvith**
- GitHub: [@manvith1122-glitch](https://github.com/manvith1122-glitch)

---
## 📄 License
This project is licensed under the MIT License.
