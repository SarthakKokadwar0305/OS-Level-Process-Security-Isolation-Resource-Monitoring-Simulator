"""
Main Flask Application Factory and Server Entry Point.
OS-Level Process Security, Isolation & Resource Monitoring Simulator.

Features:
- Modular Flask Blueprints (process_bp, security_bp, resource_bp)
- Flask-CORS configuration for cross-origin frontend communication
- Centralized structured logging to console and logs/system.log
- Standardized JSON responses for all routes and error handlers
"""

import os
import sys
from pathlib import Path

# Add backend directory to sys.path for clean relative/absolute imports
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from flask import Flask, request, jsonify
from flask_cors import CORS

from config import get_config
from database.database import init_db
from simulation.logger.logger_service import (
    log_info,
    log_warning,
    log_error,
    get_recent_logs,
)
from utils.helper import format_response
from api.process_routes import process_bp
from api.security_routes import security_bp
from api.resource_routes import resource_bp


def create_app(config_class=None) -> Flask:
    """
    Application Factory Pattern for Flask application.
    """
    app = Flask(__name__)

    # Load configuration
    if config_class is None:
        config_class = get_config()
    app.config.from_object(config_class)

    # Initialize CORS
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization", "X-Requested-With"]
    )

    # Initialize SQLite database helper (no tables created yet)
    with app.app_context():
        try:
            init_db()
            log_info("Database initialized successfully", module="DATABASE")
        except Exception as e:
            log_error(f"Failed to initialize database: {e}", module="DATABASE")

    # Register Blueprints
    app.register_blueprint(process_bp)
    app.register_blueprint(security_bp)
    app.register_blueprint(resource_bp)

    # Base Health Check Endpoint
    @app.route("/api/health", methods=["GET"])
    def health_check():
        """
        GET /api/health
        System health check endpoint verifying backend and simulation subsystems.
        """
        return format_response(
            success=True,
            message="OS Simulator Backend is operational",
            data={
                "status": "UP",
                "version": "1.0.0",
                "environment": app.config.get("ENV", "development"),
                "subsystems": {
                    "process_manager": "ACTIVE",
                    "security_monitor": "ACTIVE",
                    "resource_monitor": "ACTIVE",
                    "database": "CONNECTED",
                    "logger": "STREAMING",
                }
            },
            status_code=200
        )

    # System Logs API Endpoint (serves raw/structured logs for LogsPage)
    @app.route("/api/system/logs", methods=["GET"])
    def get_system_logs():
        """
        GET /api/system/logs
        Query param: limit (default 50)
        Returns recent system logs parsed from logs/system.log.
        """
        limit = int(request.args.get("limit", 50))
        logs = get_recent_logs(limit=limit)
        return format_response(
            success=True,
            message="System logs retrieved",
            data={"logs": logs, "count": len(logs)},
            status_code=200
        )

    # Global Error Handlers
    @app.errorhandler(404)
    def not_found_handler(error):
        return format_response(
            success=False,
            message="Endpoint not found",
            error=str(error),
            status_code=404
        )

    @app.errorhandler(500)
    def internal_error_handler(error):
        log_error(f"Internal Server Error: {str(error)}", module="FLASK_SERVER")
        return format_response(
            success=False,
            message="Internal Server Error",
            error=str(error),
            status_code=500
        )

    log_info("Flask application initialized and ready to serve requests", module="INIT")
    return app


app = create_app()

if __name__ == "__main__":
    host = app.config.get("HOST", "127.0.0.1")
    port = app.config.get("PORT", 5000)
    debug = app.config.get("DEBUG", True)

    print(f"\n=======================================================")
    print(f" OS-Level Process Security & Resource Monitoring Simulator")
    print(f" Server running at: http://{host}:{port}")
    print(f" Health check:      http://{host}:{port}/api/health")
    print(f"=======================================================\n")

    app.run(host=host, port=port, debug=debug)
