"""
Logger service initialization and helper re-exports.
"""

from .logger_service import (
    get_logger,
    log_info,
    log_warning,
    log_error,
    get_recent_logs,
)

__all__ = [
    "get_logger",
    "log_info",
    "log_warning",
    "log_error",
    "get_recent_logs",
]
