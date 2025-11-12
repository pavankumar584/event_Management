# 🎟️ Event Booking & Ticket Management System (Node.js + Express + JWT + MongoDB)

## 📌 Objective
Build a scalable and secure backend system for event booking and ticket management.  
The application allows users to browse events, book tickets, and manage their profiles, while organizers and admins have role-based privileges for managing events and users.

---

## 🚀 Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT (JSON Web Tokens)  
- **Authorization:** Role-Based Access Control (RBAC)  
- **Caching (optional):** Redis  
- **Documentation:** Swagger / OpenAPI  
- **Payment (optional):** Stripe (Test Mode)  
- **Other Tools:** Nodemailer, QR Code Generator, WebSockets  

---

## ⚙️ Core Features

### 🧑‍💻 User Management
- Register with **username, email, and password**
- Passwords securely hashed (bcrypt)
- JWT-based login & authentication
- Roles: **Admin**, **Organizer**, **User**
- View and update personal profile (Authenticated routes)

---

### 🎫 Event Management (Organizer Only)
- Create, update, and delete events
- Event fields:
  - Title, Description, Category, Date, Time
  - Total Tickets, Location, Ticket Price
- Publish / Unpublish events
- Organizer can view **only their own events**

---

### 🌍 Event Browsing (Public + Authenticated)
- View all **published & upcoming** events
- **Search** and **filter** by:
  - Category, Location, Date, Price
- **Sort** by:
  - Popularity, Lowest Price, Newest

---

### 🎟️ Ticket Booking (User Only)
- Book tickets for events
- Validate ticket availability
- View personal booking history
- Prevent overbooking and sold-out scenarios

---

### 🛠️ Admin Controls
- View all users and bookings
- Ban or delete user accounts
- Delete any event
- Monitor total events, users, and revenue (Analytics Dashboard)

---

## 💡 Bonus / Advanced Features
- ✅ Stripe Payment Integration (Test Mode)
- ✅ Email confirmation for bookings
- ✅ QR Code generation for tickets
- ✅ Waitlist feature for sold-out events
- ✅ Redis caching for event list optimization
- ✅ Live seat count using WebSockets
- ✅ Admin Analytics Dashboard

---

## 🧱 Technical Implementation

### 🧩 Middleware
- **JWT Authentication** — validates access tokens  
- **RBAC Authorization** — restricts actions by role  
- **Rate Limiting** — prevents brute-force login attempts  
- **Validation Middleware** — checks incoming request data  
- **Error Handler** — centralized error management

### 🧰 Folder Structure
/src
├── config/ # Environment variables & DB config
├── controllers/ # Route logic
├── models/ # Mongoose schemas
├── routes/ # Express route definitions
├── middlewares/ # Auth, RBAC, rate limiters, etc.
├── services/ # Business logic
├── utils/ # Helper functions
└── app.js # Main Express entry point

