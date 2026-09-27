"""
Resource Monitor Subsystem Skeleton.

NOTE FOR TEAMMATE (Resource Monitoring Module Lead):
Implement real-time periodic metrics collection, history ring-buffers,
process-level resource consumption aggregators, and thrashing/leak detectors here.
"""

from typing import Dict, Any, List
from simulation.resource.stats import CPUStats, MemoryStats, DiskStats
from simulation.logger.logger_service import log_info


class ResourceMonitor:
    """
    Subsystem for monitoring CPU, RAM, Disk, and Process-level resource utilization.
    """

    def __init__(self):
        # Simulated baseline stats
        self.cpu = CPUStats()
        self.memory = MemoryStats()
        self.disk = DiskStats()

    def get_cpu_metrics(self) -> Dict[str, Any]:
        """
        Fetch CPU usage and core breakdown.
        
        TODO [Resource Module]:
        Sample CPU ticks from /proc/stat or simulation clock tick deltas.
        """
        return self.cpu.to_dict()

    def get_memory_metrics(self) -> Dict[str, Any]:
        """
        Fetch Memory usage and paging stats.
        
        TODO [Resource Module]:
        Track allocated physical frames vs virtual page tables.
        """
        return self.memory.to_dict()

    def get_disk_metrics(self) -> Dict[str, Any]:
        """
        Fetch Disk utilization and I/O metrics.
        
        TODO [Resource Module]:
        Simulate disk block allocation (inode / FAT table simulator) and throughput.
        """
        return self.disk.to_dict()

    def get_process_resource_summary(self) -> List[Dict[str, Any]]:
        """
        Fetch resource consumption breakdown per simulated process.
        
        TODO [Resource Module]:
        Aggregate CPU burst %, RSS memory, and open file descriptors per active PID.
        """
        return [
            {"pid": 1001, "name": "systemd", "cpu_percent": 1.2, "memory_mb": 45.5, "threads": 4},
            {"pid": 1002, "name": "kthreadd", "cpu_percent": 0.4, "memory_mb": 20.0, "threads": 2},
            {"pid": 1003, "name": "syslogd", "cpu_percent": 0.8, "memory_mb": 32.1, "threads": 1},
            {"pid": 1004, "name": "sec_guard", "cpu_percent": 1.5, "memory_mb": 64.0, "threads": 3},
            {"pid": 1005, "name": "worker_pool", "cpu_percent": 0.0, "memory_mb": 18.2, "threads": 8},
        ]


# Singleton instance for integration
resource_monitor_instance = ResourceMonitor()
