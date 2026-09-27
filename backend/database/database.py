"""
Database Module for OS-Level Process Security & Resource Monitoring Simulator.
Provides SQLite database connection management and initialization hooks.

NOTE FOR TEAMMATES:
Actual table schemas (processes, users, audit logs, metrics) are NOT created yet.
Implement your module-specific schemas in your respective Git branches as indicated by TODOs.
"""

import sqlite3
from contextlib import contextmanager
from typing import Generator
from config import get_config

config = get_config()


def get_db_connection() -> sqlite3.Connection:
    """
    Establish and return a new SQLite database connection.
    Enables row factory for dictionary-like access to columns.
    """
    conn = sqlite3.connect(config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@contextmanager
def get_db() -> Generator[sqlite3.Connection, None, None]:
    """
    Context manager for database connections.
    Ensures commit on success and automatic closing on exit or error.
    """
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db() -> None:
    """
    Initialize SQLite database connection and run schema migrations.
    Currently acts as an empty helper placeholder.
    
    TODO [Database / Integration Lead]:
    Define migration scripts or execute table creation DDLs:
      - processes: (pid, name, ppid, state, priority, user_id, created_at)
      - security_logs: (id, timestamp, event_type, pid, severity, details)
      - resource_metrics: (id, timestamp, cpu_percent, memory_mb, disk_usage)
      - users: (id, username, role, security_clearance)
    """
    with get_db() as conn:
        cursor = conn.cursor()
        # Empty execution placeholder
        cursor.execute("PRAGMA foreign_keys = ON;")
        # Teammates: Add schema initialization SQL commands here
        pass
