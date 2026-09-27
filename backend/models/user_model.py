"""
User & Security Principal Model Skeleton.
Defines user credentials, security clearance levels, and role-based permissions.

NOTE FOR TEAMMATES (Security Module Team):
Extend this model to implement access control matrices, capability lists, or sandboxing flags.
"""

from dataclasses import dataclass, asdict
from typing import Dict, Any, List


@dataclass
class UserModel:
    """Data model representing a system user / security subject."""
    id: int
    username: str
    role: str = "guest"  # root, admin, operator, guest
    clearance_level: int = 1  # 1: Unclassified, 2: Confidential, 3: Secret, 4: Top Secret
    allowed_syscalls: List[str] = None

    def __post_init__(self):
        if self.allowed_syscalls is None:
            self.allowed_syscalls = ["read", "write", "exec"]

    def to_dict(self) -> Dict[str, Any]:
        """Convert user instance to dictionary."""
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "UserModel":
        """
        Create UserModel from dictionary.
        
        TODO [Security Module]:
        Add credential verification, token mapping, and RBAC rules.
        """
        return cls(
            id=int(data.get("id", 0)),
            username=str(data.get("username", "anonymous")),
            role=str(data.get("role", "guest")),
            clearance_level=int(data.get("clearance_level", 1)),
            allowed_syscalls=data.get("allowed_syscalls", ["read", "write", "exec"]),
        )
