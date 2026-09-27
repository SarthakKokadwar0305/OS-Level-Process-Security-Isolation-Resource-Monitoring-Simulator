"""
Resource Statistics Data Structures.

NOTE FOR TEAMMATE (Resource Monitoring Module Lead):
Define real-time sample buffers, history time-series data, and peak load detectors here.
"""

from dataclasses import dataclass, asdict
from typing import Dict, Any, List
from datetime import datetime, timezone


@dataclass
class CPUStats:
    """CPU usage statistics."""
    usage_percent: float = 24.5
    user_percent: float = 14.2
    system_percent: float = 8.1
    idle_percent: float = 75.5
    core_count: int = 4
    load_avg: List[float] = None

    def __post_init__(self):
        if self.load_avg is None:
            self.load_avg = [0.45, 0.52, 0.48]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class MemoryStats:
    """RAM memory usage statistics."""
    total_mb: float = 8192.0
    used_mb: float = 3450.0
    free_mb: float = 4742.0
    cached_mb: float = 1200.0
    usage_percent: float = 42.1

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class DiskStats:
    """Storage usage statistics."""
    total_gb: float = 256.0
    used_gb: float = 88.5
    free_gb: float = 167.5
    usage_percent: float = 34.6
    read_mbps: float = 12.4
    write_mbps: float = 5.8

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
