# Task Management App

A full-stack task management application built with **ASP.NET Core 8 Web API** and **React (Vite)**. Features secure JWT authentication, CRUD task management with status filtering, comprehensive unit test coverage, Serilog logging, and global exception handling.

---

## 🌐 Live Deployment

* **Frontend (Vercel):** https://cohort-9-dotnet-16902-muhammad-delta.vercel.app
* **Backend API & Swagger (Railway):** `cohort-9-dotnet-16902-muhammad-production.up.railway.app`

---

## 🛠️ Tech Stack

* **Backend:** ASP.NET Core 8.0 Web API, C#, Entity Framework Core (SQLite & In-Memory for testing)
* **Frontend:** React, Vite, Axios, TailwindCSS / CSS Modules, React Router
* **Security & Auth:** JWT Bearer Authentication, Password Hashing
* **Logging & Monitoring:** Serilog (Console & daily rolling file sink)
* **Testing:** xUnit, FluentAssertions, EF Core In-Memory Database (16/16 passing)
* **DevOps & Hosting:** Docker, Railway, Vercel

---

## ✨ Features

* **Authentication & Authorization:** Secure registration and login issuing signed JWT tokens.
* **Task Lifecycle Management:** Create, view, update, and delete tasks with validated title, description, due date, and status.
* **Strict Date & Status Controls:** HTML5 date-only inputs, required due dates, and synchronized status enums (`Pending`, `In Progress`, `Completed`).
* **Dashboard Metrics:** Real-time summary counts reflecting status updates and task transitions.
* **Global Exception Handling:** Centralized middleware intercepting uncaught runtime errors, logging full stack traces via Serilog, and returning safe standardized JSON payloads.
* **Isolated Testing Strategy:** Unit tests executed against ephemeral in-memory database instances with zero side effects on production data.

---

## 🔍 Code Quality & Static Analysis

This project integrates **SonarQube** to enforce clean code standards, detect bugs, and manage technical debt across the ASP.NET Core API and React frontend. 

**Local Execution:**
Analysis is triggered via a shell script at the project root:
```bash
./scan.sh

---

## 🚀 Getting Started Locally

### Prerequisites
* [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
* [Node.js (v18+)](https://nodejs.org/) & npm

### 1. Backend Setup

```bash
cd TaskManagementApp/TaskManagementApp.Api
dotnet restore
dotnet run
