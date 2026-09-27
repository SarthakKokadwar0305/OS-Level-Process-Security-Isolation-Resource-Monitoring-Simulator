"""
Process Manager Subsystem Skeleton.

NOTE FOR TEAMMATE (Process Module Lead):
Connect this manager with the simulated Kernel PCB table, Scheduler, and memory allocator.
This skeleton provides ready-to-use boilerplate and simulated memory stores so that
the REST API and frontend can interact immediately.
"""

from typing import List, Dict, Any, Optional
from models.process_model import ProcessModel, ProcessState, ProcessPriority
from simulation.process.process import Process
from simulation.process.scheduler import Scheduler
from simulation.logger.logger_service import log_info, log_warning, log_error


class ProcessManager:
    """
    Core OS Process Manager simulation controller.
    Manages process lifecycle, PID allocation, and scheduler integration.
    """

    def __init__(self):
        self._next_pid = 1001
        self._processes: Dict[int, Process] = {}
        self.scheduler = Scheduler()

        # Seed with initial simulated system processes
        self._seed_initial_processes()

    def _seed_initial_processes(self) -> None:
        """Seed dummy processes for integration readiness."""
        initial_seeds = [
            ("systemd", ProcessPriority.CRITICAL.value, "root", ProcessState.RUNNING.value, 1.2, 45.5),
            ("kthreadd", ProcessPriority.HIGH.value, "root", ProcessState.READY.value, 0.4, 20.0),
            ("syslogd", ProcessPriority.MEDIUM.value, "syslog", ProcessState.RUNNING.value, 0.8, 32.1),
            ("sec_guard", ProcessPriority.HIGH.value, "security", ProcessState.READY.value, 1.5, 64.0),
            ("worker_pool", ProcessPriority.LOW.value, "guest", ProcessState.BLOCKED.value, 0.0, 18.2),
        ]
        for name, prio, user, state, cpu, mem in initial_seeds:
            pid = self._next_pid
            self._next_pid += 1
            proc = Process(pid=pid, name=name, priority=prio, user=user)
            proc.state = state
            proc.cpu_percent = cpu
            proc.memory_mb = mem
            self._processes[pid] = proc

    def list_processes(self) -> List[Dict[str, Any]]:
        """
        List all tracked processes in the OS simulator.
        
        TODO [Process Module]:
        Query kernel PCB table or ready/blocked queues directly.
        """
        return [p.to_model().to_dict() for p in self._processes.values()]

    def create_process(self, name: str, priority: str = "MEDIUM", user: str = "user") -> Dict[str, Any]:
        """
        Simulate process creation (fork / exec).
        
        TODO [Process Module]:
        Allocate memory pages, initialize PCB registers, assign PID from pool,
        and enqueue into the Scheduler's ready queue.
        """
        pid = self._next_pid
        self._next_pid += 1
        proc = Process(pid=pid, name=name, priority=priority, user=user)
        proc.state = ProcessState.READY.value
        proc.cpu_percent = 0.5
        proc.memory_mb = 24.0
        self._processes[pid] = proc
        self.scheduler.add_to_ready_queue(proc)

        log_info(f"Process created: PID={pid}, Name={name}, Priority={priority}", module="PROCESS")
        return proc.to_model().to_dict()

    def kill_process(self, pid: int) -> Optional[Dict[str, Any]]:
        """
        Simulate SIGKILL signal to terminate a process.
        
        TODO [Process Module]:
        Free allocated memory, remove from scheduling queues, notify parent (SIGCHLD),
        and reclaim PID.
        """
        if pid not in self._processes:
            log_warning(f"Failed to kill: PID={pid} not found", module="PROCESS")
            return None

        proc = self._processes[pid]
        proc.state = ProcessState.TERMINATED.value
        del self._processes[pid]
        log_info(f"Process terminated: PID={pid}, Name={proc.name}", module="PROCESS")
        return {"pid": pid, "status": "TERMINATED", "name": proc.name}

    def suspend_process(self, pid: int) -> Optional[Dict[str, Any]]:
        """
        Simulate SIGSTOP signal to suspend a process.
        
        TODO [Process Module]:
        Swap out process pages, move PCB to suspended/blocked queue.
        """
        if pid not in self._processes:
            log_warning(f"Failed to suspend: PID={pid} not found", module="PROCESS")
            return None

        proc = self._processes[pid]
        proc.state = ProcessState.SUSPENDED.value
        log_info(f"Process suspended: PID={pid}, Name={proc.name}", module="PROCESS")
        return proc.to_model().to_dict()

    def resume_process(self, pid: int) -> Optional[Dict[str, Any]]:
        """
        Simulate SIGCONT signal to resume a suspended process.
        
        TODO [Process Module]:
        Reload working set into RAM, move PCB to ready queue.
        """
        if pid not in self._processes:
            log_warning(f"Failed to resume: PID={pid} not found", module="PROCESS")
            return None

        proc = self._processes[pid]
        proc.state = ProcessState.READY.value
        log_info(f"Process resumed: PID={pid}, Name={proc.name}", module="PROCESS")
        return proc.to_model().to_dict()


# Singleton instance for integration
process_manager_instance = ProcessManager()
