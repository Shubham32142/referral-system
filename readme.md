# Referral System API

## 🚀 Project Overview

This is a **Referral System API** that allows businesses to create referral campaigns and track their performance. Users can register, generate referral links, track clicks and conversions, and receive rewards for successful referrals. Admins can manage users and approve/reject referral rewards.

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, JWT Authentication
- **Frontend**: React.js, TypeScript, TailwindCSS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Notifications**: Twilio (SMS), Nodemailer (Email)

## 📦 Installation & Setup

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/Shubham32142/referral-system.git
cd referral-system
```

### 2️⃣ Install Dependencies

```sh
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3️⃣ Set Up Environment Variables

Create a **.env** file in the `backend/` directory with:

```env
MONGODB_URI=your-mongodb-connection-string
SECRET_KEY=your-jwt-secret
SMTP_HOST=smtp.your-email.com
SMTP_PORT=your-smtp-port
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

### 4️⃣ Start the Backend Server

```sh
npm run dev
```

### 5️⃣ Start the Frontend Server

```sh
npm run dev
```

## 🔥 Features

### 🔹 User Authentication

- Register/Login with JWT
- Role-based access (User, Business, Admin)

### 🔹 Referral Management

- Generate unique referral links
- Track referral clicks & conversions
- View referral stats (clicks, conversions, rewards)

### 🔹 Business Features

- Create & manage referral campaigns
- Track referral performance

### 🔹 Admin Panel

- Manage users & referrals
- Approve or reject referral rewards

### 🔹 Notifications

- Send SMS & Email notifications for referral updates

## 🔗 API Endpoints

### 🟢 **Authentication**

| Method | Endpoint    | Description         |
| ------ | ----------- | ------------------- |
| POST   | `/register` | Register a new user |
| POST   | `/login`    | User login          |

### 🟢 **Referral System**

| Method | Endpoint                    | Description                     |
| ------ | --------------------------- | ------------------------------- |
| POST   | `/create/referral`          | Generate referral link          |
| GET    | `/trackClick/:referralCode` | Track referral click            |
| POST   | `/trackConversion`          | Record conversion               |
| GET    | `/referral-stats`           | Get user referral stats         |
| GET    | `/referral-rewards`         | Admin: Get all referral rewards |
| PUT    | `/rewardStatus/:id`         | Admin: Approve/Reject rewards   |

### 🟢 **Campaigns**

| Method | Endpoint        | Description           |
| ------ | --------------- | --------------------- |
| POST   | `/`             | Create a new campaign |
| GET    | `/`             | Get all campaigns     |
| PUT    | `/:id`          | Update campaign       |
| DELETE | `/campaign/:id` | Delete campaign       |

### 🟢 **Admin**

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| GET    | `/dashboard`     | Get dashboard stats |
| GET    | `/users`         | Get all users       |
| DELETE | `/users/:id`     | Delete user         |
| GET    | `/referrals`     | Get all referrals   |
| PUT    | `/referrals/:id` | Update referrals    |

## 🎯 Future Enhancements

- Implement **OAuth Login (Google, Facebook)**
- Add **Real-Time Updates (WebSockets)**
- Generate **Referral Reports & CSV Export**

## 🙌 Contributors

- \*_shubham dubey_ - Developer

---

🚀 **Built with Node.js, Express, and React!**
