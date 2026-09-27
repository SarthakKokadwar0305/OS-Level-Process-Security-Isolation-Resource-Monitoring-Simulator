"""
Process Model Skeleton.
Defines data structures and representations for OS Processes.

NOTE FOR TEAMMATES (Process Module Team):
Do NOT implement heavy scheduling or lifecycle algorithms in this file.
Use this class as the data transfer object (DTO) / model for process representation.
"""

from dataclasses import dataclass, asdict
from enum import Enum
from typing import Optional, Dict, Any
from datetime import datetime, timezone


class ProcessState(str, Enum):
    """Standard OS Process Lifecycle States."""
    NEW = "NEW"
    READY = "READY"
    RUNNING = "RUNNING"
    BLOCKED = "BLOCKED"
    SUSPENDED = "SUSPENDED"
    TERMINATED = "TERMINATED"


class ProcessPriority(str, Enum):
    """Process Execution Priorities."""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


@dataclass
class ProcessModel:
    """
    Data model representing a simulated OS process.
    """
    pid: int
    name: str
    state: str = ProcessState.READY.value
    priority: str = ProcessPriority.MEDIUM.value
    ppid: int = 0
    cpu_percent: float = 0.0
    memory_mb: float = 16.0
    user: str = "root"
    threads_count: int = 1
    created_at: Optional[str] = None
    isolated: bool = False

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

    def to_dict(self) -> Dict[str, Any]:
        """Convert process instance to JSON serializable dictionary."""
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ProcessModel":
        """
        Create ProcessModel instance from dictionary.
        
        TODO [Process Module]:
        Add custom parsing, validations, or default CPU burst attributes here.
        """
        return cls(
            pid=int(data.get("pid", 0)),
            name=str(data.get("name", "proc")),
            state=data.get("state", ProcessState.READY.value),
            priority=data.get("priority", ProcessPriority.MEDIUM.value),
            ppid=int(data.get("ppid", 0)),
            cpu_percent=float(data.get("cpu_percent", 0.0)),
            memory_mb=float(data.get("memory_mb", 16.0)),
            user=str(data.get("user", "user")),
            threads_count=int(data.get("threads_count", 1)),
            created_at=data.get("created_at"),
            isolated=bool(data.get("isolated", False)),
        )
