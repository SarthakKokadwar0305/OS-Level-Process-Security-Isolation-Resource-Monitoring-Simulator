"""
Core Security Subsystem Coordinator.

NOTE FOR TEAMMATE (Security Module Lead):
Integrate permission validation, privilege checks, anomaly/threat detection heuristics,
and security event auditing in this module.
"""

from typing import Dict, Any, List
from simulation.security.permissions import PermissionManager
from simulation.security.isolation import IsolationManager
from simulation.logger.logger_service import log_info, log_warning


class SecurityService:
    """
    Coordinates security policies, permission verification, and process isolation.
    """

    def __init__(self):
        self.permission_mgr = PermissionManager()
        self.isolation_mgr = IsolationManager()
        self._security_events: List[Dict[str, Any]] = [
            {
                "id": 1,
                "timestamp": "2026-09-27 18:00:15",
                "severity": "INFO",
                "event": "SECURITY_SUBSYSTEM_INITIALIZED",
                "pid": 0,
                "details": "Kernel security monitor active with default RBAC"
            },
            {
                "id": 2,
                "timestamp": "2026-09-27 18:05:22",
                "severity": "WARNING",
                "event": "UNAUTHORIZED_SYSCALL_ATTEMPT",
                "pid": 1005,
                "details": "Process attempted restricted sys_ptrace without root capability"
            }
        ]

    def verify_action(self, user: str, action: str, pid: int = 0) -> Dict[str, Any]:
        """
        Check if an action on a process or system resource is permitted.
        
        TODO [Security Module]:
        Connect with ProcessManager to evaluate owner/UID matching and capability tokens.
        """
        result = self.permission_mgr.check_permission(user_role=user, action=action, resource_id=str(pid))
        if not result["authorized"]:
            log_warning(f"Security check failed: user '{user}' denied action '{action}' on PID {pid}", module="SECURITY")
        else:
            log_info(f"Security check passed: user '{user}' granted '{action}' on PID {pid}", module="SECURITY")
        return result

    def isolate_process(self, pid: int, reason: str = "Administrator quarantine") -> Dict[str, Any]:
        """
        Trigger process isolation.
        
        TODO [Security Module]:
        Update process status in ProcessManager and emit security event.
        """
        res = self.isolation_mgr.isolate_process(pid=pid, reason=reason)
        self._security_events.append({
            "id": len(self._security_events) + 1,
            "timestamp": "2026-09-27 18:10:00",
            "severity": "CRITICAL",
            "event": "PROCESS_QUARANTINED",
            "pid": pid,
            "details": f"Process isolated. Reason: {reason}"
        })
        return res

    def get_security_logs(self, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Return audit trail of simulated security events.
        
        TODO [Security Module]:
        Read from SQLite security_logs table once schema is implemented.
        """
        return list(reversed(self._security_events[-limit:]))


# Singleton instance for integration
security_service_instance = SecurityService()
