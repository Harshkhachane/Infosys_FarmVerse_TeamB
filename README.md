<<<<<<< HEAD
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/2a327e54-74cc-40a5-80c9-71fdb90033a1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
=======
# 🌱 FarmVerse – Precision Agriculture Management Platform

## 📖 Overview

FarmVerse is a full-stack web application developed as part of the **Infosys Springboard Internship**. The platform provides a centralized solution for managing agricultural operations, enabling users to efficiently maintain farm records, crop information, irrigation schedules, expenses, and harvesting activities. It is designed to simplify farm management through a secure, scalable, and user-friendly system.

## 🛠 Technology Stack

### Frontend
- React.js
- TypeScript
- Vite
- HTML5
- CSS3
- Bootstrap

### Backend
- Java
- Spring Boot
- Maven

### Database
- MongoDB Atlas

### Version Control
- Git
- GitHub


## ✨ Key Features

- Secure User Authentication
- Farm Management
- Crop Management
- MongoDB Atlas Cloud Database
- RESTful APIs using Spring Boot
- Responsive React Frontend
- Database Schema Validation
- Organized Project Documentation

## 📂 Project Structure

```text
Infosys_FarmVerse_TeamB
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   ├── mvnw
│   └── .mvn/
│
├── Frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│
├── docs/
│   ├── Project_Plan_Documents/
│   ├── FarmVerse API Structure.docx
│   └── MongoDB Atlas Database Details.md
│
|── LICENSE
|
|── FarmVerse.pptx
|
└── README.md
```

## 📑 Documentation

The **docs** directory contains all project-related documentation.

| Document                              | Description
|---------------------------------------|----------------------------------------------------------------------------------------------------------------|
| **FarmVerse API Structure.docx**      | Complete API documentation including endpoints, request methods, request/response format, and module-wise APIs |
| **MongoDB Atlas Database Details.md** | Database schema, collections, validation rules, and sample documents                                           |
| **Project_Plan_Documents/**           | Project planning and supporting documentation                                                                  |

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/Harshkhachane/Infosys_FarmVerse_TeamB.git
cd Infosys_FarmVerse_TeamB
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

The frontend will start on the default Vite development server.

### Backend Setup

```bash
cd backend
mvnw.cmd spring-boot:run
```

The Spring Boot server will start locally.

---

## 🗄 Database

FarmVerse uses **MongoDB Atlas** as its cloud database.

The database includes collections such as:

- Users
- Farms
- Crops

JSON Schema Validation is implemented to ensure data consistency and integrity.

Detailed database documentation is available in:

```text
docs/MongoDB Atlas Database Details.md
```

---

## 📡 API Documentation

Complete API documentation is available in:

```text
docs/FarmVerse API Structure.docx
```

The API documentation includes:

- Authentication APIs
- User Management APIs
- Farm Management APIs
- Crop Management APIs
- Request & Response Formats
- HTTP Methods
- Status Codes
- Sample API Requests

---

## 👥 Team

**Project:** FarmVerse – Precision Agriculture Management Platform

**Organization:** Infosys Springboard Internship

**Team:** Team B Group 1
>>>>>>> 19993613e34f66478bb230adfdddf8d65f88cac6
