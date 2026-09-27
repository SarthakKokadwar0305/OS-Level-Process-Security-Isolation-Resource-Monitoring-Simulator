"""
System Logger Service for OS-Level Simulator.
Configures Python standard logging to output to both console and logs/system.log.
Provides helper methods for cross-module structured logging.
"""

import logging
import os
from pathlib import Path
from typing import List, Dict, Any
from config import get_config

config = get_config()

# Ensure logs directory exists
log_path = Path(config.LOG_FILE_PATH)
log_path.parent.mkdir(parents=True, exist_ok=True)

# Create and configure the system logger
LOGGER_NAME = "OS_Simulator"
logger = logging.getLogger(LOGGER_NAME)

# Avoid duplicate handlers on hot reload
if not logger.handlers:
    logger.setLevel(getattr(logging, config.LOG_LEVEL.upper(), logging.INFO))
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [%(name)s] [%(module)s:%(lineno)d] - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # File Handler - writing to logs/system.log
    file_handler = logging.FileHandler(config.LOG_FILE_PATH, encoding="utf-8")
    file_handler.setLevel(getattr(logging, config.LOG_LEVEL.upper(), logging.INFO))
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    # Console Handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(getattr(logging, config.LOG_LEVEL.upper(), logging.INFO))
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)


def get_logger() -> logging.Logger:
    """Return the configured system logger instance."""
    return logger


def log_info(message: str, module: str = "SYSTEM") -> None:
    """Log informational message."""
    logger.info(f"[{module}] {message}")


def log_warning(message: str, module: str = "SYSTEM") -> None:
    """Log warning message."""
    logger.warning(f"[{module}] {message}")


def log_error(message: str, module: str = "SYSTEM", exc_info: bool = False) -> None:
    """Log error message with optional traceback."""
    logger.error(f"[{module}] {message}", exc_info=exc_info)


def get_recent_logs(limit: int = 50) -> List[Dict[str, Any]]:
    """
    Helper to read recent log entries from logs/system.log.
    Returns structured log items for the REST API / frontend.
    """
    logs: List[Dict[str, Any]] = []
    if not log_path.exists():
        return logs

    try:
        with open(log_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
            for idx, line in enumerate(reversed(lines[-limit:])):
                line_str = line.strip()
                if not line_str:
                    continue
                
                # Basic parsing: [YYYY-MM-DD HH:MM:SS] [LEVEL] [LOGGER] [FILE:LINE] - [MODULE] MESSAGE
                level = "INFO"
                if "[WARNING]" in line_str:
                    level = "WARNING"
                elif "[ERROR]" in line_str:
                    level = "ERROR"

                logs.append({
                    "id": idx + 1,
                    "raw": line_str,
                    "level": level,
                    "timestamp": line_str[1:20] if line_str.startswith("[") and len(line_str) >= 20 else "N/A",
                    "message": line_str.split(" - ", 1)[-1] if " - " in line_str else line_str
                })
    except Exception as e:
        logger.error(f"Failed to read log file: {e}")

    return logs
