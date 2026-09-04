# Milestone 1 Progress Report

**Project:** FarmVerse – Precision Agriculture Management Platform  
**Milestone:** 1  
**Duration:** 29 June 2026 – 9 July 2026  
**Status:** Completed

---

## Executive Summary

Milestone 1 established the foundational development environment for the FarmVerse Precision Agriculture Management Platform. During this milestone, the team focused on setting up the project repository, cloud database, database schema, backend framework, authentication mechanism, database connectivity, API endpoints, and initial frontend interfaces.

The team successfully divided responsibilities across Database Administration, Backend Development, and Frontend Development. The database infrastructure was established using MongoDB Atlas with schema validation, while the backend environment was planned and initialized using Spring Boot 3 with JWT-based authentication and user-management endpoints. The frontend team established the initial application theme, page structure, login and registration interfaces, and dashboard designs.

**Team Size:** 5 members  
**Milestone Duration:** 29 June 2026 – 9 July 2026  
**Core Areas:** Database, Backend, Frontend, Authentication, Version Control

---

# Objectives & Deliverables

## 1. GitHub Repository Setup

**Owner:** Harsh Khachane  
**Status:** Completed

### Details:

- Created and configured the centralized GitHub repository for team collaboration.
- Established the initial project repository structure.
- Enabled team members to collaborate through a common version-control platform.
- Organized project files and code for coordinated development.
- Established GitHub as the primary platform for maintaining and managing project source code.

### Deliverables:

- Centralized GitHub repository
- Initial project structure
- Version-control setup
- Team collaboration through GitHub

### Impact:

The GitHub setup provides a centralized environment for collaborative development, source-code management, version tracking, and future integration of frontend, backend, and database-related work.

---

## 2. Cloud Database Setup & Schema Validation

**Owner:** Harsh Khachane  
**Role:** Database Administrator  
**Status:** Completed

### Details:

- Set up the cloud database environment using **MongoDB Atlas**.
- Created the project database and required collections.
- Designed the initial database schema for the application.
- Implemented **MongoDB JSON Schema validation** to maintain data consistency.
- Inserted sample documents to verify the database structure.
- Tested the schema validation rules using valid and invalid data.
- Established the foundation for connecting the backend application with the cloud database.

### Database Technology:

- **Database:** MongoDB
- **Cloud Platform:** MongoDB Atlas
- **Schema:** MongoDB JSON Schema
- **Database Type:** NoSQL

### Deliverables:

- MongoDB Atlas cloud database
- Initial database collections
- Schema definitions
- Schema validation rules
- Sample database records

### Impact:

The cloud database setup provides a centralized and scalable data-storage environment for the application and establishes a structured foundation for future backend development.

---

## 3. Backend Framework Initialization & Authentication

**Owners:** Gopal Bawaskar, Samitha  
**Role:** Backend Developers  
**Status:** Completed

### Details:

The backend development team established the application backend using **Spring Boot 3**.

The initial backend work included:

- Set up the **Spring Boot 3** framework.
- Established the backend project structure.
- Configured the required backend components.
- Implemented **JWT-based tokenization/authentication**.
- Prepared the backend for secure user authentication.
- Established connectivity between the backend and cloud database.
- Started development of user-management functionality.

### Technology:

- **Framework:** Spring Boot 3
- **Authentication:** JWT
- **Database:** MongoDB Atlas
- **Architecture:** Backend REST API

### Deliverables:

- Spring Boot 3 backend project
- JWT authentication/tokenization setup
- Database connectivity
- Initial REST API structure
- User-management functionality

### Impact:

The backend foundation provides the core server-side infrastructure required for authentication, database operations, API development, and future implementation of FarmVerse modules.

---

## 4. User Authentication & Management APIs

**Owners:** Gopal Bawaskar, Samitha  
**Role:** Backend Developers  
**Status:** Completed

### Details:

The backend team worked on the initial authentication and user-management API endpoints.

### Implemented/Planned Endpoints:

#### Authentication

- `@Login`
- `@Register`

#### User Management

- `@Get User / Users`
- `@Update / Modify Users`
- `@Delete Users`

The authentication flow was designed around JWT tokenization so that authenticated requests can be securely handled by the backend.

### Deliverables:

- Login endpoint
- Registration endpoint
- Get User/Users endpoint
- Update/Modify User endpoint
- Delete User endpoint
- JWT tokenization mechanism

### Impact:

These APIs establish the initial communication layer between the frontend and backend and provide the foundation for secure user registration, authentication, and user management.

---

## 5. Frontend Theme & Application Structure

**Owners:** Harshitha Kalivarapu, Siva Kumar Reddy  
**Role:** Frontend Developers  
**Status:** Completed

### Details:

The frontend development team established the initial visual and structural foundation of the application.

The work included:

- Defined the initial application **theme**.
- Identified the list of pages required to start frontend development.
- Planned the initial navigation and page structure.
- Established the visual direction of the application.
- Prepared the frontend structure for integration with backend APIs.

### Initial Frontend Pages:

- Login
- Registration
- Dashboard
- Other planned application pages

### Deliverables:

- Initial application theme
- Page list
- Frontend structure
- Initial navigation planning
- UI foundation for further development

### Impact:

The frontend structure establishes a consistent user interface and provides a foundation for connecting the application with backend authentication and database services.

---

## 6. Login & Registration Pages

**Owners:** Harshitha Kalivarapu, Siva Kumar Reddy  
**Role:** Frontend Developers  
**Status:** Completed

### Details:

The frontend team developed the initial authentication interfaces for the application.

### Login Page:

- User login interface
- Input fields for authentication credentials
- Login interaction structure
- Prepared for JWT-based backend integration

### Registration Page:

- New-user registration interface
- Required registration input fields
- Registration interaction structure
- Prepared for integration with the backend registration API

### Deliverables:

- Login page
- Registration page
- Authentication UI structure
- Frontend authentication flow foundation

### Impact:

The authentication interfaces provide users with the primary entry point into the application and establish the frontend foundation for secure backend authentication.

---

## 7. Dashboard Development

**Owners:** Harshitha Kalivarapu, Siva Kumar Reddy  
**Role:** Frontend Developers  
**Status:** Completed

### Details:

The frontend team established the initial dashboard interfaces for the application.

The dashboard work included:

- Initial dashboard structure.
- Dashboard layout and navigation.
- Theme consistency across dashboard interfaces.
- Preparation for displaying application data.
- Foundation for future integration with backend APIs.

### Deliverables:

- Initial dashboard interfaces
- Dashboard layout
- Navigation structure
- UI foundation for future application modules

### Impact:

The dashboard provides the foundation for presenting important application information to users and will serve as the central interface for future FarmVerse functionality.

---

# Team Contributions

| Team Member | Role | Major Deliverables |
|---|---|---|
| **Harsh Khachane** | Database Administrator | MongoDB Atlas setup, database schema, schema validation, GitHub repository setup |
| **Gopal Bawaskar** | Backend Developer | Spring Boot 3, JWT tokenization, database connectivity, authentication and user APIs |
| **Harshitha Kalivarapu** | Frontend Developer | Application theme, page structure, Login/Register pages, dashboards |
| **Samitha** | Backend Developer | Spring Boot 3, JWT tokenization, database connectivity, authentication and user APIs |
| **Siva Kumar Reddy** | Frontend Developer | Application theme, page structure, Login/Register pages, dashboards |

---

# Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Frontend UI technologies |
| **Backend** | Spring Boot 3 |
| **Authentication** | JWT |
| **Database** | MongoDB |
| **Cloud Database** | MongoDB Atlas |
| **Schema Validation** | MongoDB JSON Schema |
| **Version Control** | Git / GitHub |

---

# Testing & Validation

## Database Testing

- Verified the MongoDB Atlas database setup.
- Tested database collections.
- Tested insertion of sample documents.
- Applied and verified schema validation.
- Checked valid and invalid data against the defined schema.

## Backend Testing

- Verified Spring Boot 3 backend setup.
- Verified JWT tokenization/authentication configuration.
- Tested database connectivity.
- Developed and tested initial authentication and user-management endpoints.

## Frontend Testing

- Verified initial Login and Registration interfaces.
- Checked dashboard interfaces.
- Verified consistency of the selected application theme.
- Reviewed the initial page structure.

## Integration Preparation

The frontend, backend, and database layers were prepared for further integration. The backend provides the API layer, MongoDB Atlas provides cloud data storage, and the frontend provides the user-facing interfaces.

---

# Development Environment

### Backend

- **Framework:** Spring Boot 3
- **Authentication:** JWT

### Database

- **Database:** MongoDB
- **Cloud Provider:** MongoDB Atlas

### Frontend

- Initial UI structure
- Login/Register interfaces
- Dashboard interfaces

### Version Control

- **Platform:** GitHub
- **Purpose:** Source-code management and team collaboration

---

# Milestone 1 Challenges & Solutions

| Challenge | Solution |
|---|---|
| Establishing a centralized development environment | Created a centralized GitHub repository |
| Maintaining consistency in database records | Implemented MongoDB JSON Schema validation |
| Setting up a cloud-hosted database | Configured MongoDB Atlas |
| Establishing secure authentication | Implemented JWT tokenization |
| Connecting backend with database | Configured backend database connectivity |
| Establishing the initial UI structure | Defined theme, pages, authentication screens, and dashboards |

---

# Milestone 1 Outcome

Milestone 1 successfully established the foundational architecture of the FarmVerse application. The team completed the initial setup across all three major development layers: **Frontend, Backend, and Database**.

The database infrastructure was established using MongoDB Atlas with schema validation. The backend foundation was created using Spring Boot 3 with JWT authentication and initial user-management APIs. The frontend team established the application's theme, initial page structure, Login/Register interfaces, and dashboards. GitHub was also configured to support collaborative development.

These accomplishments provide a strong foundation for the next milestone, where the team can proceed with deeper frontend-backend integration, implementation of additional application modules, expanded APIs, and complete database-driven functionality.

**Milestone 1 Status: COMPLETED**

**Duration:** 29 June 2026 – 9 July 2026