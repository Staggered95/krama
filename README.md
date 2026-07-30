
# Krama

A minimalist, full-stack project management and issue-tracking platform engineered for clarity and workflow efficiency. Krama provides robust role-based access control, real-time Kanban state management, and a theme-aware UI, all backed by a secure Spring Boot and PostgreSQL architecture.

## ✨ Features

* **Role-Based Access Control (RBAC):** Strict security matrix tailored for Admins, Managers, Developers, and Testers. Controls visibility and interaction permissions at both the API and UI layers.
* **Interactive Kanban Boards:** Responsive project boards with minimal, theme-matched scrollbars and automated status-workflow state engines.
* **Temporal Audit Trails:** Comprehensive history tracking that logs and visualizes issue state transitions and assignment changes.
* **Spatial Theme Engine:** Dynamic dark/light mode switching powered by the native View Transitions API for seamless, geometric spatial animations.
* **Stateless Authentication:** Secure, JWT-based authentication integrated deeply with Spring Security.
* **Optimistic UI Updates:** Lightning-fast frontend rendering that prevents race conditions and UI-blocking database reads.

## 🛠️ Tech Stack

**Frontend**
* React (Vite)
* Tailwind CSS (Custom thematic variables)
* Lucide React (Minimalist iconography)

**Backend**
* Java / Spring Boot 3.x
* Spring Security (Stateless JWT)
* Spring Data JPA / Hibernate

**Database & Infrastructure**
* PostgreSQL
* Maven

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Java (v17 or v21)
* PostgreSQL (v14+)
* Maven

### 1. Database Setup
Create a PostgreSQL database named `krama`:
```bash
psql -U postgres -c "CREATE DATABASE krama;"

```

### 2. Backend Configuration

Navigate to the backend directory and configure your environment variables.
Create or update `backend/src/main/resources/application.properties`:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/krama
spring.datasource.username=postgres
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update

# Security
app.jwt.secret=generate-a-secure-random-key-at-least-256-bits-long
app.jwt.expiration=86400000

```

Start the Spring Boot server:

```bash
cd backend
mvn spring-boot:run

```

*Note: On its first run against an empty database, the backend will automatically seed dummy data containing a full project team and sample issues.*

### 3. Frontend Configuration

Navigate to the frontend directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev

```

The application will be running at `http://localhost:5173`.

## 🧹 Database Management

If you need to completely wipe the database to trigger a fresh data seed, run the following command in your PostgreSQL terminal to bypass foreign-key constraints safely:

```sql
TRUNCATE TABLE comments, issue_history, issues, project_members, projects, users CASCADE;

```

Upon restarting the backend, the `DatabaseSeeder` will detect the empty schema and provision a fresh set of dummy data.

## 👤 Author

**Shubham Singh**

* GitHub: [@Staggered95](https://www.google.com/search?q=https://github.com/Staggered95)
* LinkedIn: [Shubham Singh](https://www.google.com/search?q=https://linkedin.com/in/shubham-singh-7b2555265)
* Portfolio: [know-shubham.vercel.app](https://www.google.com/search?q=https://know-shubham.vercel.app)

```

```