FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install gunicorn  # Add gunicorn for production server

# Copy production environment file first
COPY .env.prod .env

# Set environment variables
ENV FLASK_APP=run.py \
    PYTHONUNBUFFERED=1 \
    FLASK_ENV=production

# Copy application code
COPY . .

# Create a non-root user and switch to it
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Expose the port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:5000/health || exit 1

# Run the application with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "run:app"]
