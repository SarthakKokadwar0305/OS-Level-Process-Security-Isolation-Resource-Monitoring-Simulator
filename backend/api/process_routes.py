"""
Process Management REST API Routes (Blueprint: process_bp).

NOTE FOR TEAMMATE (Process Module Lead):
These endpoints connect the HTTP interface to the ProcessManager subsystem.
Business logic must be implemented inside simulation/process/.
Keep these route handlers lean and focused on request validation and response formatting.
"""

from flask import Blueprint, request
from utils.helper import format_response
from simulation.process.process_manager import process_manager_instance
from simulation.logger.logger_service import log_info, log_error

process_bp = Blueprint("process_bp", __name__, url_prefix="/api/process")


@process_bp.route("/list", methods=["GET"])
def get_process_list():
    """
    GET /api/process/list
    Returns list of all active/managed processes.
    """
    try:
        # TODO [Process Module]: Connect with custom filters / pagination if needed
        processes = process_manager_instance.list_processes()
        return format_response(
            success=True,
            message="Process list retrieved successfully",
            data={"processes": processes, "count": len(processes)},
            status_code=200
        )
    except Exception as e:
        log_error(f"Error fetching process list: {str(e)}", module="API_PROCESS")
        return format_response(
            success=False,
            message="Failed to retrieve processes",
            error=str(e),
            status_code=500
        )


@process_bp.route("/create", methods=["POST"])
def create_process():
    """
    POST /api/process/create
    Body: { "name": "worker_1", "priority": "HIGH", "user": "root" }
    """
    try:
        payload = request.get_json(silent=True) or {}
        name = payload.get("name", "custom_task")
        priority = payload.get("priority", "MEDIUM")
        user = payload.get("user", "user")

        # TODO [Process Module]: Validate memory limits, command arguments, and privileges
        new_process = process_manager_instance.create_process(name=name, priority=priority, user=user)

        return format_response(
            success=True,
            message=f"Process '{name}' created successfully",
            data={"process": new_process},
            status_code=201
        )
    except Exception as e:
        log_error(f"Error creating process: {str(e)}", module="API_PROCESS")
        return format_response(
            success=False,
            message="Failed to create process",
            error=str(e),
            status_code=500
        )


@process_bp.route("/kill", methods=["POST"])
def kill_process():
    """
    POST /api/process/kill
    Body: { "pid": 1001 }
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

        # TODO [Process Module]: Propagate termination signal down process tree if PPID
        result = process_manager_instance.kill_process(int(pid))
        if result is None:
            return format_response(
                success=False,
                message=f"Process with PID {pid} not found",
                error="PID_NOT_FOUND",
                status_code=404
            )

        return format_response(
            success=True,
            message=f"Process PID {pid} terminated successfully",
            data=result,
            status_code=200
        )
    except Exception as e:
        log_error(f"Error terminating process: {str(e)}", module="API_PROCESS")
        return format_response(
            success=False,
            message="Failed to kill process",
            error=str(e),
            status_code=500
        )


@process_bp.route("/suspend", methods=["POST"])
def suspend_process():
    """
    POST /api/process/suspend
    Body: { "pid": 1001 }
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

        # TODO [Process Module]: Save context and pause scheduler timeslice
        result = process_manager_instance.suspend_process(int(pid))
        if result is None:
            return format_response(
                success=False,
                message=f"Process with PID {pid} not found",
                error="PID_NOT_FOUND",
                status_code=404
            )

        return format_response(
            success=True,
            message=f"Process PID {pid} suspended successfully",
            data={"process": result},
            status_code=200
        )
    except Exception as e:
        log_error(f"Error suspending process: {str(e)}", module="API_PROCESS")
        return format_response(
            success=False,
            message="Failed to suspend process",
            error=str(e),
            status_code=500
        )


@process_bp.route("/resume", methods=["POST"])
def resume_process():
    """
    POST /api/process/resume
    Body: { "pid": 1001 }
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

        # TODO [Process Module]: Enqueue process back into active scheduler run-queue
        result = process_manager_instance.resume_process(int(pid))
        if result is None:
            return format_response(
                success=False,
                message=f"Process with PID {pid} not found",
                error="PID_NOT_FOUND",
                status_code=404
            )

        return format_response(
            success=True,
            message=f"Process PID {pid} resumed successfully",
            data={"process": result},
            status_code=200
        )
    except Exception as e:
        log_error(f"Error resuming process: {str(e)}", module="API_PROCESS")
        return format_response(
            success=False,
            message="Failed to resume process",
            error=str(e),
            status_code=500
        )
