"""
Configuration Module for OS-Level Process Security & Resource Monitoring Simulator.
Contains environment-specific configuration classes and path setups.
"""

import os
from pathlib import Path

# Base Directory of backend
BASE_DIR = Path(__file__).resolve().parent

# Ensure logs and database directories exist
LOGS_DIR = BASE_DIR / "logs"
DATABASE_DIR = BASE_DIR / "database"
LOGS_DIR.mkdir(parents=True, exist_ok=True)
DATABASE_DIR.mkdir(parents=True, exist_ok=True)


class Config:
    """Base Configuration Class."""
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-os-simulator-2026")
    HOST = os.environ.get("FLASK_RUN_HOST", "127.0.0.1")
    PORT = int(os.environ.get("FLASK_RUN_PORT", 5000))
    DEBUG = False
    TESTING = False

    # Database Configuration
    DATABASE_PATH = os.environ.get("DATABASE_PATH", str(DATABASE_DIR / "simulator.db"))

    # Logging Configuration
    LOG_FILE_PATH = os.environ.get("LOG_FILE_PATH", str(LOGS_DIR / "system.log"))
    LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")

    # CORS Settings
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*").split(",")

    # Simulation Defaults (Can be tuned by teammates in their modules)
    # TODO [Process Module]: Define scheduler quantum, max processes
    SCHEDULER_QUANTUM_MS = 100
    MAX_PROCESSES = 64

    # TODO [Security Module]: Define security policy rules & thresholds
    DEFAULT_SECURITY_LEVEL = "HIGH"

    # TODO [Resource Module]: Define polling interval & resource bounds
    RESOURCE_SAMPLE_INTERVAL_SEC = 1.0


class DevelopmentConfig(Config):
    """Development Configuration."""
    DEBUG = True


class TestingConfig(Config):
    """Testing Configuration."""
    TESTING = True
    DATABASE_PATH = ":memory:"


class ProductionConfig(Config):
    """Production Configuration."""
    DEBUG = False


config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}


def get_config():
    """Retrieve configuration based on FLASK_ENV or APP_ENV."""
    env = os.environ.get("APP_ENV", "development").lower()
    return config_by_name.get(env, DevelopmentConfig)
