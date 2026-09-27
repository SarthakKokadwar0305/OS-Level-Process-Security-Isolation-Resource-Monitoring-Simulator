"""
Security Subsystem REST API Routes (Blueprint: security_bp).

NOTE FOR TEAMMATE (Security Module Lead):
These endpoints connect the security dashboard to the SecurityService subsystem.
Business logic must be implemented inside simulation/security/.
"""

from flask import Blueprint, request
from utils.helper import format_response
from simulation.security.security import security_service_instance
from simulation.logger.logger_service import log_info, log_error

security_bp = Blueprint("security_bp", __name__, url_prefix="/api/security")


@security_bp.route("/logs", methods=["GET"])
def get_security_logs():
    """
    GET /api/security/logs
    Query param: limit (default: 50)
    Returns list of security audit events and threat alerts.
    """
    try:
        limit = int(request.args.get("limit", 50))
        # TODO [Security Module]: Fetch audited security events from DB/service
        logs = security_service_instance.get_security_logs(limit=limit)
        return format_response(
            success=True,
            message="Security logs retrieved successfully",
            data={"logs": logs, "count": len(logs)},
            status_code=200
        )
    except Exception as e:
        log_error(f"Error fetching security logs: {str(e)}", module="API_SECURITY")
        return format_response(
            success=False,
            message="Failed to retrieve security logs",
            error=str(e),
            status_code=500
        )


@security_bp.route("/check", methods=["POST"])
def check_permission():
    """
    POST /api/security/check
    Body: { "user": "guest", "action": "kill", "pid": 1001 }
    Checks authorization for an operation.
    """
    try:
        payload = request.get_json(silent=True) or {}
        user = payload.get("user", "guest")
        action = payload.get("action", "read")
        pid = payload.get("pid", 0)

        # TODO [Security Module]: Evaluate complex policies, Bell-LaPadula rules, or ACLs
        result = security_service_instance.verify_action(user=user, action=action, pid=int(pid))

        return format_response(
            success=True,
            message="Security policy evaluation completed",
            data=result,
            status_code=200
        )
    except Exception as e:
        log_error(f"Error checking security permission: {str(e)}", module="API_SECURITY")
        return format_response(
            success=False,
            message="Failed to evaluate security policy",
            error=str(e),
            status_code=500
        )


@security_bp.route("/isolate", methods=["POST"])
def isolate_process():
    """
    POST /api/security/isolate
    Body: { "pid": 1005, "reason": "High network egress anomaly" }
    Quarantines a process into an isolated sandbox jail.
    """
    try:
        payload = request.get_json(silent=True) or {}
        pid = payload.get("pid")
        if pid is None:
            return format_response(
                success=False,
                message="Missing required field: 'pid'",
                error="PID is required",
                status_code=400
            )

        reason = payload.get("reason", "Manual quarantine triggered via API")

        # TODO [Security Module]: Enforce cgroups / namespace sandbox jail on process
        result = security_service_instance.isolate_process(pid=int(pid), reason=reason)

        return format_response(
            success=True,
            message=f"Process PID {pid} has been quarantined to isolation sandbox",
            data=result,
            status_code=200
        )
    except Exception as e:
        log_error(f"Error isolating process: {str(e)}", module="API_SECURITY")
        return format_response(
            success=False,
            message="Failed to isolate process",
            error=str(e),
            status_code=500
        )
