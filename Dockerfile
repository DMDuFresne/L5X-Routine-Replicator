# Use the official Python slim image as a base
FROM python:3.12.3-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy requirements file and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create a non-root user
RUN useradd --no-log-init --system --home /nonexistent --shell /bin/false unicorn

# Copy application files and set appropriate ownership
COPY --chown=unicorn:unicorn . .

# Switch to the non-root user
USER unicorn

# Expose the port the application will run on
EXPOSE 8000

# Set default environment variable for log level
ENV LOG_LEVEL=info

# Define the entry point for the container
ENTRYPOINT ["sh", "-c", "gunicorn -w 2 --log-level ${LOG_LEVEL} -b 0.0.0.0:8000 app:app"]
