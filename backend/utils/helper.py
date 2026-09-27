"""
Utility helpers for the OS Simulator backend.
Provides standardized JSON API response formatters, timestamp helpers, and validators.
"""

from datetime import datetime, timezone
from typing import Any, Dict, Optional, Tuple
from flask import jsonify, Response


def format_response(
    success: bool = True,
    message: str = "Operation completed successfully",
    data: Optional[Any] = None,
    error: Optional[str] = None,
    status_code: int = 200
) -> Tuple[Response, int]:
    """
    Standardize API JSON responses across all routes.
    """
    payload: Dict[str, Any] = {
        "success": success,
        "message": message,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "data": data if data is not None else {},
    }
    if error is not None:
        payload["error"] = error

    return jsonify(payload), status_code


def get_current_iso_time() -> str:
    """Return current UTC time in ISO-8601 string."""
    return datetime.now(timezone.utc).isoformat()
