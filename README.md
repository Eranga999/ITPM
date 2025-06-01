# 🛠️ Easy Fix – Streamlining Appliance Repairs

**Easy Fix** is a comprehensive web application designed to connect customers with verified technicians, offering efficient and transparent appliance repair services.

## 🚀 Live Demo
//todo

---

## 🧰 Tech Stack

### Backend
- **Node.js** with **Express.js**: Handles RESTful API and server-side logic.
- **MongoDB**: Manages data storage for users, service requests, and technician information.

### Frontend
- **React.js**: Provides a dynamic and responsive user interface.
- **Tailwind CSS**: Ensures a sleek and modern design.
- **YouTube Embed API**: Integrates video tutorials within the Instant Fix Mode.

### Additional Tools
- **JWT **: Manages authentication and session security.
- **Stripe** (or **Razorpay**): Facilitates secure digital payments.
- **Socket.IO**: Enables real-time communication for service tracking.

---

## 💡 Key Features

### 🔧 Instant Fix Mode
- Offers interactive troubleshooting tips for minor appliance issues.
- Embeds relevant YouTube video tutorials for visual guidance.

### 📅 Booking & Scheduling
- Allows real-time scheduling of repair appointments.
- Provides options to select preferred time slots and service types.

### 📍 Service Tracking
- Enables real-time tracking of technician locations and service statuses.
- Updates users on technician arrival times and service progress.

### 💸 Transparent Pricing
- Delivers automated cost estimates based on the nature of the issue.
- Presents detailed service breakdowns upfront to avoid hidden charges.

### 💳 Secure Payments
- Integrates secure payment gateways for hassle-free transactions.
- Issues digital receipts and comprehensive service summaries post-payment.

### ⭐ Review & Rating System
- Allows customers to rate technicians and provide feedback.
- Displays technician profiles with ratings and service histories.

### 👥 Admin & Technician Dashboards
- **Admin Dashboard**: Manages technicians, service requests, and user feedback.
- **Technician Panel**: Enables technicians to view assignments, update statuses, and communicate with customers.

---

## 📸 Screenshots
![image](https://github.com/user-attachments/assets/b2857ad4-4130-4200-97fb-4338d10b596b)
[image](https://github.com/user-attachments/assets/22554168-ac50-43f5-a331-e88560f63f69)
er-attachments/assets/a6d8ed9a-d813-4a98-880a-40941c47b757)
![chrome-capture-2025-6-1 (2)](https://github.com/user-attachments/assets/425e6409-da97-4a58-b41b-4ea21a8d7d1c)
![image](https://github.com/user-attachments/assets/fe5c5959-5d5f-458e-89d7-4cd4af9317d8)

---

## 📂 Project Structure

```bash
EasyFix/
├── backend/                 # Backend with Node.js and Express
│   ├── controllers/         # Handles request logic
│   ├── models/              # MongoDB schema models
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic for processing requests
│   └── server.js            # Entry point for backend server
├── frontend/                # Frontend using React and Tailwind CSS
│   ├── public/              # Public assets (e.g., images, icons)
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Page-level React components
│       ├── assets/          # Static files (e.g., logos, images, videos)
│       └── App.js           # Root component
├── node_modules/            # Project dependencies
├── package.json             # Project metadata and scripts
└── README.md                # Project documentation

