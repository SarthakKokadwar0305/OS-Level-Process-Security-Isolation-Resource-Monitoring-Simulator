"""
Resource Monitoring REST API Routes (Blueprint: resource_bp).

NOTE FOR TEAMMATE (Resource Monitoring Module Lead):
These endpoints connect the monitoring graphs to the ResourceMonitor subsystem.
Business logic must be implemented inside simulation/resource/.
"""

from flask import Blueprint
from utils.helper import format_response
from simulation.resource.resource_monitor import resource_monitor_instance
from simulation.logger.logger_service import log_info, log_error

resource_bp = Blueprint("resource_bp", __name__, url_prefix="/api/resource")


@resource_bp.route("/cpu", methods=["GET"])
def get_cpu_stats():
    """
    GET /api/resource/cpu
    Returns CPU utilization percentage and core metrics.
    """
    try:
        # TODO [Resource Module]: Pull real-time sampled CPU utilization
        metrics = resource_monitor_instance.get_cpu_metrics()
        return format_response(
            success=True,
            message="CPU metrics fetched successfully",
            data=metrics,
            status_code=200
        )
    except Exception as e:
        log_error(f"Error fetching CPU metrics: {str(e)}", module="API_RESOURCE")
        return format_response(
            success=False,
            message="Failed to fetch CPU metrics",
            error=str(e),
            status_code=500
        )


@resource_bp.route("/memory", methods=["GET"])
def get_memory_stats():
    """
    GET /api/resource/memory
    Returns RAM / virtual memory utilization metrics.
    """
    try:
        # TODO [Resource Module]: Pull memory pages, RSS, and swap stats
        metrics = resource_monitor_instance.get_memory_metrics()
        return format_response(
            success=True,
            message="Memory metrics fetched successfully",
            data=metrics,
            status_code=200
        )
    except Exception as e:
        log_error(f"Error fetching Memory metrics: {str(e)}", module="API_RESOURCE")
        return format_response(
            success=False,
            message="Failed to fetch Memory metrics",
            error=str(e),
            status_code=500
        )


@resource_bp.route("/disk", methods=["GET"])
def get_disk_stats():
    """
    GET /api/resource/disk
    Returns Disk capacity, free space, and I/O throughput metrics.
    """
    try:
        # TODO [Resource Module]: Calculate storage blocks and read/write IOPS
        metrics = resource_monitor_instance.get_disk_metrics()
        return format_response(
            success=True,
            message="Disk metrics fetched successfully",
            data=metrics,
            status_code=200
        )
    except Exception as e:
        log_error(f"Error fetching Disk metrics: {str(e)}", module="API_RESOURCE")
        return format_response(
            success=False,
            message="Failed to fetch Disk metrics",
            error=str(e),
            status_code=500
        )


@resource_bp.route("/processes", methods=["GET"])
def get_processes_resource_breakdown():
    """
    GET /api/resource/processes
    Returns process-level breakdown of CPU, RAM, and Thread usage.
    """
    try:
        # TODO [Resource Module]: Aggregate resource usage table per process
        process_stats = resource_monitor_instance.get_process_resource_summary()
        return format_response(
            success=True,
            message="Process resource breakdown fetched successfully",
            data={"process_resources": process_stats, "count": len(process_stats)},
            status_code=200
        )
    except Exception as e:
        log_error(f"Error fetching process resource stats: {str(e)}", module="API_RESOURCE")
        return format_response(
            success=False,
            message="Failed to fetch process resource breakdown",
            error=str(e),
            status_code=500
        )
