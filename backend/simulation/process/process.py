"""
Process Control Block (PCB) and Process Entity.

NOTE FOR TEAMMATE (Process Module Lead):
Implement the simulated process control block (PCB), context switching state,
instruction counter, burst cycles, and memory boundaries here.
"""

from typing import Dict, Any, Optional
from models.process_model import ProcessModel, ProcessState, ProcessPriority


class Process:
    """
    Simulated Process entity representing an active PCB in OS memory.
    """

    def __init__(
        self,
        pid: int,
        name: str,
        priority: str = ProcessPriority.MEDIUM.value,
        ppid: int = 0,
        user: str = "root"
    ):
        self.pid = pid
        self.name = name
        self.priority = priority
        self.ppid = ppid
        self.user = user
        self.state = ProcessState.READY.value
        self.cpu_percent = 0.0
        self.memory_mb = 16.0
        self.isolated = False

        # TODO [Process Module]:
        # - Add Program Counter (PC)
        # - Add Register states
        # - Add I/O burst and CPU burst tracking
        # - Add Memory allocation bounds (base & limit registers)

    def transition_state(self, new_state: str) -> None:
        """
        Transition process state.
        
        TODO [Process Module]:
        Validate state transition graph (e.g., READY -> RUNNING, RUNNING -> BLOCKED).
        """
        self.state = new_state

    def to_model(self) -> ProcessModel:
        """Export current PCB state to ProcessModel DTO."""
        return ProcessModel(
            pid=self.pid,
            name=self.name,
            state=self.state,
            priority=self.priority,
            ppid=self.ppid,
            cpu_percent=self.cpu_percent,
            memory_mb=self.memory_mb,
            user=self.user,
            isolated=self.isolated,
        )
