# FinFleet Academy - Full-Stack Financial Education Platform

FinFleet Academy is a comprehensive, full-stack financial education platform built using the **MERN** stack (MongoDB, Express, React, Node.js). It provides users with structured learning paths, financial management tools, and an AI-driven trading assistant.

## 🚀 Key Features

### 🔐 User System
- **Secure Authentication**: JWT-based sessions with Bcrypt password hashing.
- **Role-Based Access**: Specialized views for Students and Administrators.
- **Subscription Management**: Support for Free, Pro, Elite, and Elite Prime tiers.

### 📊 Financial Wellness
- **Budget Tracker**: Real-time CRUD operations for tracking income and expenses.
- **Visual Overview**: Spend analysis directly on the user dashboard.

### 🎓 Academy & Learning
- **Dynamic Curriculum**: Courses and lessons fetched from the database.
- **Progress Tracking**: Persistent completion status tracking for every student.
- **Interactive Lessons**: Resume learning exactly where you left off.

### 🛡️ Admin Suite
- **User Control**: Manage user plans and subscription statuses.
- **Promotional Tools**: Generate and manage discount coupons for the community.
- **Broadcast System**: Send global notifications to all academy students.

---

## 🛠 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Lucide React (Icons), Framer Motion (Animations), Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose ODM.
- **Security**: JSON Web Tokens (JWT), Bcrypt.js, CORS.

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local instance or Atlas URI)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd FinFleet-Academy
   ```

2. **Frontend Setup**:
   ```bash
   npm install
   ```

3. **Backend Setup**:
   ```bash
   cd server
   npm install
   ```

### Configuration

Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

### Running the Application

1. **Start the Backend**:
   ```bash
   cd server
   npm start
   ```

2. **Start the Frontend**:
   ```bash
   # In the root directory
   npm run dev
   ```

3. **Seed Initial Data** (Optional):
   ```bash
   cd server
   node seed.js
   ```

---

## 📂 Project Structure

```text
├── server/
│   ├── controllers/    # API logic
│   ├── middleware/     # Auth & validation
│   ├── models/         # Database schemas
│   ├── routes/         # API endpoints
│   └── index.js        # Main entry point
├── src/
│   ├── components/     # UI Components
│   ├── context/        # Auth & Theme state
│   ├── pages/          # Application views
│   └── App.jsx         # Routing logic
└── tailwind.config.js  # Styling configuration
```

---
