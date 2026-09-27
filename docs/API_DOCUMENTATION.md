# REST API Specification

This document details all REST API endpoints implemented in the Flask backend. All endpoints respond with `Content-Type: application/json`.

---

## 1. System Health & Logging

### Health Check
- **Endpoint**: `GET /api/health`
- **Description**: Verifies backend availability and simulation subsystem readiness.
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "OS Simulator Backend is operational",
  "timestamp": "2026-09-27T18:45:00Z",
  "data": {
    "status": "UP",
    "version": "1.0.0",
    "environment": "development",
    "subsystems": {
      "process_manager": "ACTIVE",
      "security_monitor": "ACTIVE",
      "resource_monitor": "ACTIVE",
      "database": "CONNECTED",
      "logger": "STREAMING"
    }
  }
}
```

### System Logs
- **Endpoint**: `GET /api/system/logs`
- **Query Params**: `limit` (int, default: 50)
- **Description**: Returns recent structured system logs recorded to `logs/system.log`.

---

## 2. Process Management Blueprint (`/api/process/*`)

### List Processes
- **Endpoint**: `GET /api/process/list`
- **Description**: Returns all simulated processes in the PCB table.

### Create Process
- **Endpoint**: `POST /api/process/create`
- **Request Body**:
```json
{
  "name": "worker_pool",
  "priority": "HIGH",
  "user": "root"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Process 'worker_pool' created successfully",
  "data": {
    "process": {
      "pid": 1006,
      "name": "worker_pool",
      "state": "READY",
      "priority": "HIGH",
      "ppid": 0,
      "cpu_percent": 0.5,
      "memory_mb": 24.0,
      "user": "root",
      "isolated": false
    }
  }
}
```

### Kill Process
- **Endpoint**: `POST /api/process/kill`
- **Request Body**: `{ "pid": 1005 }`
- **Description**: Simulates SIGKILL signal delivery and termination.

### Suspend Process
- **Endpoint**: `POST /api/process/suspend`
- **Request Body**: `{ "pid": 1005 }`
- **Description**: Simulates SIGSTOP signal delivery to move PCB to suspended state.

### Resume Process
- **Endpoint**: `POST /api/process/resume`
- **Request Body**: `{ "pid": 1005 }`
- **Description**: Simulates SIGCONT signal delivery to restore PCB to ready queue.

---

## 3. Security & Isolation Blueprint (`/api/security/*`)

### Security Logs & Audit Trail
- **Endpoint**: `GET /api/security/logs`
- **Query Params**: `limit` (int, default: 50)
- **Description**: Returns audited security events and anomaly flags.

### Check Permission Policy
- **Endpoint**: `POST /api/security/check`
- **Request Body**:
```json
{
  "user": "guest",
  "action": "kill",
  "pid": 1001
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Security policy evaluation completed",
  "data": {
    "authorized": false,
    "role": "guest",
    "action": "kill",
    "resource": "1001",
    "policy": "DEFAULT_RBAC_POLICY"
  }
}
```

### Isolate Process (Sandbox Quarantine)
- **Endpoint**: `POST /api/security/isolate`
- **Request Body**:
```json
{
  "pid": 1005,
  "reason": "Anomalous sys_ptrace execution"
}
```

---

## 4. Resource Monitoring Blueprint (`/api/resource/*`)

### CPU Telemetry
- **Endpoint**: `GET /api/resource/cpu`
- **Description**: Returns CPU load percentage, user/sys times, core count.

### Memory Telemetry
- **Endpoint**: `GET /api/resource/memory`
- **Description**: Returns total RAM, used RAM, cached buffers, free memory.

### Disk Telemetry
- **Endpoint**: `GET /api/resource/disk`
- **Description**: Returns disk capacity, free storage, and simulated I/O rate.

### Process Resource Breakdown
- **Endpoint**: `GET /api/resource/processes`
- **Description**: Returns per-process resource allocations (threads, memory, CPU share).
