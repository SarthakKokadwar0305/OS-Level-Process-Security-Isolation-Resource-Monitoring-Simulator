"""
Security Permissions & Access Control Subsystem Skeleton.

NOTE FOR TEAMMATE (Security Module Lead):
Implement Role-Based Access Control (RBAC), Access Control Lists (ACLs),
or Capability Lists for simulated system calls and resource handles.
"""

from typing import Dict, List, Set, Any


class PermissionManager:
    """
    Simulated OS Permission and Access Control Checker.
    """

    def __init__(self):
        # Default placeholder matrix: role -> allowed operations
        self.role_permissions: Dict[str, Set[str]] = {
            "root": {"read", "write", "exec", "kill", "suspend", "isolate", "sys_admin"},
            "admin": {"read", "write", "exec", "kill", "suspend"},
            "operator": {"read", "exec", "suspend"},
            "guest": {"read", "exec"},
        }

    def check_permission(self, user_role: str, action: str, resource_id: str = "*") -> Dict[str, Any]:
        """
        Check if a given user/role has authorization to perform an action.
        
        TODO [Security Module]:
        Implement multi-level security policies (e.g. Bell-LaPadula, Biba)
        or capabilities token validation.
        """
        allowed = action.lower() in self.role_permissions.get(user_role.lower(), set())
        return {
            "authorized": allowed,
            "role": user_role,
            "action": action,
            "resource": resource_id,
            "policy": "DEFAULT_RBAC_POLICY"
        }
