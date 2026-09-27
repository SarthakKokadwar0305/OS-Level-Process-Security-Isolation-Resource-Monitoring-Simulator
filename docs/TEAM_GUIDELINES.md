# Team Collaboration & Git Workflow Guidelines

## Project: OS-Level Process Security, Isolation & Resource Monitoring Simulator

### Branching Strategy

Our team uses a **Feature Branch Workflow** branching off `main`:

```
main (Protected, stable production code)
  ├── feat/process-management   (Member 2: Process Subsystem)
  ├── feat/security-isolation   (Member 3: Security & RBAC Subsystem)
  └── feat/resource-monitoring  (Member 4: Resource Telemetry Subsystem)
```

---

## 1. Member Allocations & Scope

### Member 1: Team Lead & Architecture / Integration
- **Branch**: `main` / `chore/integration-core`
- **Ownership**:
  - Flask backend application skeleton (`app.py`, `config.py`)
  - REST API contracts (`api/*`)
  - SQLite database foundation (`database/database.py`)
  - React (Vite) frontend dashboard, routing, and Chart.js integration
  - Code reviews, conflict resolution, and final demonstration release.

### Member 2: Process & Scheduling Subsystem Lead
- **Branch**: `feat/process-management`
- **Ownership**:
  - `backend/simulation/process/process.py`
  - `backend/simulation/process/scheduler.py`
  - `backend/simulation/process/process_manager.py`
  - `backend/models/process_model.py`
- **Primary Goals**:
  - Implement Process Control Block (PCB) states and transitions.
  - Implement CPU scheduling algorithms (e.g., Round Robin with configurable quantum, Priority Scheduling, FCFS).
  - Handle process lifecycle signals (kill, suspend, resume).

### Member 3: Security, RBAC & Isolation Subsystem Lead
- **Branch**: `feat/security-isolation`
- **Ownership**:
  - `backend/simulation/security/security.py`
  - `backend/simulation/security/permissions.py`
  - `backend/simulation/security/isolation.py`
  - `backend/models/user_model.py`
- **Primary Goals**:
  - Implement Role-Based Access Control (RBAC) matrices and capability checks.
  - Implement process sandboxing (quarantine jail, restricted syscall lists).
  - Implement threat and anomaly detection heuristics.

### Member 4: Resource Monitoring & Telemetry Subsystem Lead
- **Branch**: `feat/resource-monitoring`
- **Ownership**:
  - `backend/simulation/resource/resource_monitor.py`
  - `backend/simulation/resource/stats.py`
- **Primary Goals**:
  - Implement time-series CPU telemetry (core load, user vs kernel time).
  - Implement simulated RAM allocation (paging, RSS accounting, buffer cache).
  - Implement disk storage metrics and thread count tracking.

---

## 2. Git Rules & Commits

1. **Never commit directly to `main`**:
   All new features must be implemented in their dedicated branch.
2. **Sync with `main` frequently**:
   ```bash
   git checkout main
   git pull origin main
   git checkout feat/<your-branch>
   git merge main
   ```
3. **Commit Messages**:
   Use semantic commit messages:
   - `feat(process): implement round-robin scheduling algorithm`
   - `feat(security): add capability token checking in isolation manager`
   - `feat(resource): calculate real-time CPU core percentages`
   - `fix(logger): resolve log file rotation lock`
4. **Pull Requests (PRs)**:
   - PRs require at least 1 review approval from the Team Lead before merging.
   - Ensure backend compilation passes: `python -m py_compile backend/**/*.py`
   - Ensure frontend builds: `npm run build` inside `frontend/`
