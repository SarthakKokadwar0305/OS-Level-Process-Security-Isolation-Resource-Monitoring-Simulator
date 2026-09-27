"""
CPU Scheduling Subsystem Skeleton.

NOTE FOR TEAMMATE (Process Module Lead):
Implement CPU scheduling algorithms here (e.g., Round Robin, FCFS, Priority Scheduling, MLFQ).
Maintain ready queue, run queue, and context-switching dispatching.
"""

from typing import List, Optional
from simulation.process.process import Process


class Scheduler:
    """
    Simulated OS CPU Scheduler.
    """

    def __init__(self, algorithm: str = "ROUND_ROBIN", quantum: int = 100):
        self.algorithm = algorithm
        self.quantum = quantum  # Time quantum in ms
        self.ready_queue: List[Process] = []
        self.running_process: Optional[Process] = None

        # TODO [Process Module]:
        # Initialize ready queue, waiting queue, and priority queues.

    def add_to_ready_queue(self, process: Process) -> None:
        """
        Add a newly arrived or resumed process to the scheduling queue.
        
        TODO [Process Module]:
        Implement insertion based on selected algorithm (e.g., priority order or tail insert).
        """
        self.ready_queue.append(process)

    def schedule_next(self) -> Optional[Process]:
        """
        Select next process to dispatch to simulated CPU.
        
        TODO [Process Module]:
        Implement dispatch logic for Round Robin, FCFS, or Multilevel Feedback Queue.
        """
        if not self.ready_queue:
            return None
        return self.ready_queue[0]

    def tick(self) -> None:
        """
        Simulation clock cycle tick.
        
        TODO [Process Module]:
        Decrement time quantum, compute CPU burst, and trigger preemption when quantum expires.
        """
        pass
