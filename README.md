# OS-Level Process Security, Isolation & Resource Monitoring Simulator

[![Python Version](https://img.shields.io/badge/python-3.12%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/backend-Flask%203.x-green.svg)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/frontend-React%20%2B%20Vite-cyan.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/styling-Tailwind%20CSS%20v3-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)

An enterprise-grade Operating Systems engineering simulator providing an interactive visual cockpit for exploring process control blocks (PCBs), preemptive CPU scheduling algorithms, role-based access control (RBAC), sandboxed isolation boundaries, and real-time hardware telemetry.

Designed with a clean decoupled micro-kernel-like architecture, this repository serves as the unified base project for a 4-member software team collaborating via Git feature branches.

---

## Table of Contents
1. [Project Description](#project-description)
2. [Key Objectives](#key-objectives)
3. [System Architecture](#system-architecture)
4. [Folder Structure](#folder-structure)
5. [Tech Stack](#tech-stack)
6. [Installation & Setup](#installation--setup)
7. [REST API Endpoints](#rest-api-endpoints)
8. [Team Responsibilities & Module Ownership](#team-responsibilities--module-ownership)
9. [Git Workflow & Collaboration Rules](#git-workflow--collaboration-rules)
10. [Future Scope](#future-scope)

---

## 1. Project Description

Modern Operating Systems enforce strict isolation between user space and kernel space, schedule processes across CPU cores, and protect system integrity via permissions and sandboxing. 

The **OS-Level Process Security, Isolation & Resource Monitoring Simulator** models these core operating system subsystems inside an extensible simulation environment. Users can interactively create processes, simulate signals (`SIGKILL`, `SIGSTOP`, `SIGCONT`), inspect Process Control Blocks, enforce capability-based security policies, isolate misbehaving tasks in quarantine jails, and observe live resource consumption across simulated CPU, RAM, Disk, and Kernel Threads.

---

## 2. Key Objectives

- **Process Lifecycle Simulation**: Model the finite state machine of processes (`READY`, `RUNNING`, `BLOCKED`, `SUSPENDED`, `TERMINATED`) with PCB data structures and dispatch queues.
- **CPU Scheduling**: Provide modular hooks for standard scheduling algorithms including Round Robin (quantum-based), Priority Preemption, and First-Come-First-Served (FCFS).
- **Security & Authorization**: Simulate Role-Based Access Control (RBAC) matrices, least-privilege ring validation, and capability token verification.
- **Process Isolation & Sandboxing**: Implement virtual sandbox containment that restricts syscall privileges and isolates rogue processes from memory boundaries.
- **Resource Profiling**: Track simulated CPU utilization, physical/virtual RAM paging, storage I/O, and concurrent kernel threads using interactive Chart.js graphs.
- **Structured Auditing**: Maintain a unified logging pipeline recording operational telemetry to both console and `logs/system.log`.

---

## 3. System Architecture

The project adopts a modular client-server architecture:

```
[ Frontend: React + Vite + Tailwind CSS ]
             │
             ▼ (HTTP / RESTful JSON APIs via Axios)
[ Backend: Flask Application Factory (app.py) ]
  ├── [ Blueprint: /api/process   ] ──> [ Process Manager & Scheduler   ]
  ├── [ Blueprint: /api/security  ] ──> [ Security & Isolation Engine   ]
  ├── [ Blueprint: /api/resource  ] ──> [ Resource Telemetry Subsystem  ]
  ├── [ Service:   Logger         ] ──> [ logs/system.log + Stream      ]
  └── [ Database:  SQLite Helper  ] ──> [ database/simulator.db         ]
```

Detailed architectural blueprints, subsystem interaction diagrams, and sequence flows are documented in [docs/ARCHITECTURE.md](file:///c:/Users/Sarthak%20kokadwar/Documents/COLLEGE%20FILES/SEM_5/OS/OS_CP/docs/ARCHITECTURE.md).

---

## 4. Folder Structure

```
OS-Level-Process-Security-Simulator/
│
├── backend/
│   ├── app.py                          # Flask application factory & server entry point
│   ├── config.py                       # Multi-environment configuration (Dev/Prod/Test)
│   ├── requirements.txt                # Python dependencies
│   ├── logs/                           # System log outputs (e.g. system.log)
│   │
│   ├── api/                            # Flask REST API Blueprints
│   │   ├── __init__.py                 # Blueprint registration
│   │   ├── process_routes.py           # /api/process/* routes
│   │   ├── security_routes.py          # /api/security/* routes
│   │   └── resource_routes.py          # /api/resource/* routes
│   │
│   ├── simulation/                     # Core OS Simulation Subsystems
│   │   ├── process/                    # Process Management Module (Member 2)
│   │   │   ├── __init__.py
│   │   │   ├── process.py              # Simulated PCB and lifecycle states
│   │   │   ├── scheduler.py            # CPU scheduling algorithms (RR, Priority)
│   │   │   └── process_manager.py      # Process table controller & signal hooks
│   │   │
│   │   ├── security/                   # Security & Isolation Module (Member 3)
│   │   │   ├── __init__.py
│   │   │   ├── security.py             # Security coordinator & audit trail
│   │   │   ├── permissions.py          # RBAC matrix & authorization rules
│   │   │   └── isolation.py            # Process sandboxing & quarantine jail
│   │   │
│   │   ├── resource/                   # Resource Monitoring Module (Member 4)
│   │   │   ├── __init__.py
│   │   │   ├── resource_monitor.py     # Metric aggregators & sample collectors
│   │   │   └── stats.py                # CPU, Memory, and Disk data models
│   │   │
│   │   └── logger/                     # Centralized Logging Service
│   │       ├── __init__.py
│   │       └── logger_service.py       # Python logging to console & file
│   │
│   ├── models/                         # Data Transfer Objects & Schemas
│   │   ├── __init__.py
│   │   ├── process_model.py            # ProcessModel dataclass & enums
│   │   └── user_model.py               # UserModel dataclass & clearance levels
│   │
│   ├── database/                       # Database Helpers
│   │   └── database.py                 # SQLite connection manager & init_db hook
│   │
│   └── utils/                          # Cross-cutting Utilities
│       ├── __init__.py
│       └── helper.py                   # Standardized JSON response formatter
│
├── frontend/                           # React (Vite) Single Page Application
│   ├── index.html                      # HTML5 entry with Inter & JetBrains Mono
│   ├── package.json                    # NPM dependencies & scripts
│   ├── vite.config.js                  # Vite bundler configuration
│   ├── tailwind.config.js              # Tailwind CSS theme setup
│   ├── postcss.config.js               # PostCSS configuration
│   │
│   └── src/
│       ├── main.jsx                    # React root mounter
│       ├── App.jsx                     # React Router page definitions
│       ├── index.css                   # Tailwind directives & glassmorphic styling
│       │
│       ├── components/                 # Reusable UI Components
│       │   ├── Navbar.jsx              # System status bar & kernel time
│       │   ├── Sidebar.jsx             # Navigation menu & branch indicators
│       │   ├── DashboardCard.jsx       # Metric counter cards with gradients
│       │   ├── ProcessTable.jsx        # Process list & signal actions
│       │   ├── ResourceChart.jsx       # Chart.js visualization wrappers
│       │   └── AlertPanel.jsx          # Security threat alert feed
│       │
│       ├── layouts/                    # Application Layouts
│       │   └── MainLayout.jsx          # Shell with sticky header & sidebar
│       │
│       ├── pages/                      # Application Views
│       │   ├── Dashboard.jsx           # High-level overview & telemetry preview
│       │   ├── ProcessPage.jsx         # Process lifecycle & signal controls
│       │   ├── SecurityPage.jsx        # RBAC verification & sandbox isolation
│       │   ├── ResourcePage.jsx        # CPU, RAM, Disk & Threads Chart.js graphs
│       │   └── LogsPage.jsx            # System audit logs table & export
│       │
│       └── services/                   # Frontend Network Layer
│           └── api.js                  # Axios client mapped to Flask backend
│
├── docs/                               # Architecture & Developer Documentation
│   ├── ARCHITECTURE.md                 # System architecture & mermaid diagrams
│   ├── API_DOCUMENTATION.md            # Detailed REST API specification
│   └── TEAM_GUIDELINES.md              # Git workflow & branch strategy
│
├── assets/                             # Diagrams, screenshots, and presentation slides
│   └── README.md
│
├── .gitignore                          # Comprehensive ignore rules
└── README.md                           # Master Project Readme
```

---

## 5. Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18+ (Vite) | Fast HMR, component-driven UI architecture |
| **Styling** | Tailwind CSS v3 | Custom dark glassmorphism, responsive grid |
| **Routing** | React Router v6 | Client-side routing for 5 core modules |
| **HTTP Client** | Axios | Configured with base URLs and response interceptors |
| **Visualizations** | Chart.js & React-Chartjs-2 | Line, Bar, and Doughnut telemetry graphs |
| **Backend Framework** | Flask (Python 3.12+) | Application Factory, Blueprint modularization |
| **CORS Middleware** | Flask-CORS | Cross-origin resource sharing support |
| **Database** | SQLite3 | Native relational database engine |
| **Logging** | Python `logging` | Structured multi-handler streaming (`logs/system.log`) |

---

## 6. Installation & Setup

### Prerequisites
- **Python 3.12+**
- **Node.js 18+** and **npm**
- **Git**

---

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/OS-Level-Process-Security-Simulator.git
cd OS-Level-Process-Security-Simulator
```

---

### Step 2: Backend Setup (Flask)

1. Open a terminal in the project root:
   ```bash
   cd backend
   ```
2. (Optional but recommended) Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask server:
   ```bash
   python app.py
   ```
   *The backend will boot up at `http://127.0.0.1:5000` with the health check available at `http://127.0.0.1:5000/api/health`.*

---

### Step 3: Frontend Setup (React + Vite)

1. Open a second terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 7. REST API Endpoints

All APIs are pre-configured to return dummy JSON data and connect seamlessly to the frontend:

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | System health check & subsystem status | `200 OK` |
| `GET` | `/api/system/logs` | Fetch recent system logs from `system.log` | `200 OK` |
| `GET` | `/api/process/list` | List all processes in the simulated PCB table | `200 OK` |
| `POST` | `/api/process/create` | Create a new simulated process | `201 Created` |
| `POST` | `/api/process/kill` | Terminate process by PID (`SIGKILL`) | `200 OK` |
| `POST` | `/api/process/suspend` | Suspend process by PID (`SIGSTOP`) | `200 OK` |
| `POST` | `/api/process/resume` | Resume process by PID (`SIGCONT`) | `200 OK` |
| `GET` | `/api/security/logs` | Fetch security events and audit trails | `200 OK` |
| `POST` | `/api/security/check` | Check authorization permissions for action/role | `200 OK` |
| `POST` | `/api/security/isolate` | Quarantine process into a sandbox jail | `200 OK` |
| `GET` | `/api/resource/cpu` | Fetch CPU load % and core usage statistics | `200 OK` |
| `GET` | `/api/resource/memory` | Fetch RAM memory and paging metrics | `200 OK` |
| `GET` | `/api/resource/disk` | Fetch storage capacity and I/O metrics | `200 OK` |
| `GET` | `/api/resource/processes` | Fetch per-process resource breakdown table | `200 OK` |

*Refer to [docs/API_DOCUMENTATION.md](file:///c:/Users/Sarthak%20kokadwar/Documents/COLLEGE%20FILES/SEM_5/OS/OS_CP/docs/API_DOCUMENTATION.md) for full request/response schemas.*

---

## 8. Team Responsibilities & Module Ownership

| Member | Role | Assigned Subsystem & Files | Git Branch |
| :--- | :--- | :--- | :--- |
| **Member 1 (Lead)** | System Architect & Integration | Backend skeleton, API Blueprints, SQLite, React UI Shell | `main` |
| **Member 2** | Process Module Lead | `backend/simulation/process/` (`process.py`, `scheduler.py`, `process_manager.py`) | `feat/process-management` |
| **Member 3** | Security Module Lead | `backend/simulation/security/` (`security.py`, `permissions.py`, `isolation.py`) | `feat/security-isolation` |
| **Member 4** | Resource Module Lead | `backend/simulation/resource/` (`resource_monitor.py`, `stats.py`) | `feat/resource-monitoring` |

---

## 9. Git Workflow & Collaboration Rules

To ensure clean teamwork without merge conflicts:

1. **Branch Naming**: Each member creates their feature branch off `main`:
   ```bash
   git checkout -b feat/your-module-name
   ```
2. **Work within Your Assigned Directory**:
   - Process Module Lead works primarily in `backend/simulation/process/`.
   - Security Module Lead works in `backend/simulation/security/`.
   - Resource Module Lead works in `backend/simulation/resource/`.
3. **Inspect the `TODO` Comments**:
   Every placeholder method contains clearly labeled `TODO [ModuleName]` comments outlining the required algorithm or data manipulation.
4. **Pull Requests (PRs)**:
   - Push your branch to GitHub: `git push origin feat/your-module-name`
   - Open a PR targeting `main`.
   - Ensure `npm run build` and `python -m py_compile backend/**/*.py` pass before merging.

*Detailed branching guidance can be found in [docs/TEAM_GUIDELINES.md](file:///c:/Users/Sarthak%20kokadwar/Documents/COLLEGE%20FILES/SEM_5/OS/OS_CP/docs/TEAM_GUIDELINES.md).*

---

## 10. Future Scope

- **Real-Time WebSockets**: Transition from HTTP polling to WebSockets (via Flask-SocketIO) for microsecond process dispatch animations.
- **Inter-Process Communication (IPC)**: Simulate pipes, message queues, and shared memory segments between processes.
- **Memory Management Unit (MMU)**: Visual page fault handling, TLB cache hit/miss simulation, and LRU page replacement algorithm.
- **Deadlock Detection**: Implementation of Banker's Algorithm with interactive resource allocation graphs (RAG).

---

## Contributors & Credits
- **Project Lead**: Sarthak Kokadwar
- **Course**: Operating Systems (SEM 5)
- **Institution**: College Engineering Project
