# 🚀 CompHub - Spring Boot Backend

Backend for Component Hub. It provides authentication, user management, and API endpoints for the **Angular frontend**.

## 📌 Features
- 🔐 **JWT Authentication** (JSON Web Tokens)
- 📩 **Mail Service** (Using MailDev for development)
- 🗄 **PostgreSQL Database** (With Flyway migrations)
- 📊 **Spring Boot Actuator** (For monitoring)
- 🛫 **Flyway** (For database migrations)
- 🛠 **Docker Compose Setup**

---

## 📦 Tech Stack
- **Spring Boot 3.4.0**
- **PostgreSQL**
- **FlywayDB**
- **JWT (io.jsonwebtoken)**
- **MailDev (SMTP for testing)**
- **Docker & Docker Compose**

---

## 🛠 Setup & Installation

### 📌 Prerequisites
- Java 21
- Maven
- Docker & Docker Compose

### 🚀 Running Locally

1️⃣ **Clone the repository**
```sh
git clone https://github.com/Thompson6626/ComponentHub.git
cd ComponentHub/CompHub
```

2️⃣ **Start PostgreSQL, MailDev & Keycloak with Docker**
```sh
docker-compose up -d
```

3️⃣ **Run the application**
```sh
mvn spring-boot:run
```

4️⃣ **Access the API**
```
http://localhost:8080
```

---

## ⚙️ Configuration

### **🔐 Environment Variables**
| Variable | Description |
|----------|-------------|
| `DATABASE_USERNAME` | PostgreSQL Username |
| `DATABASE_PASSWORD` | PostgreSQL Password |
| `JWT_SECRET` | Secret key for signing JWT |

---

## 🛠 API Endpoints

### **🔑 Authentication**
| Method | Endpoint                             | Description                                      |
|--------|--------------------------------------|--------------------------------------------------|
| `POST` | `/auth/login`                        | Authenticate user & get JWT                      |
| `POST` | `/auth/register`                     | Register new user and send verification email    |
| `POST` | `/verify-email?token=`               | Verify a user's email by the token               |
| `POST` | `/auth/resend-verification`          | Resend user verification email |
| `POST` | `/auth/refresh`                      | Refresh JWT token                                |

### **📝 UI Components**
| Method | Endpoint                | Description                                        |
|--------|-------------------------|----------------------------------------------------|
| `GET` | `/components`           | Get all UI components                              |
| `POST` | `/components`           | Create a new component                             |
| `PUT` | `/components/{id}`      | Update a component                                 |
| `DELETE` | `/components/{id}`      | Delete a component                                 |
| `GET` | `/components/search?q=` | Get all UI components  that match the search query |
---



