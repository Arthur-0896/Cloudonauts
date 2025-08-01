FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy production environment file
COPY .env.prod .env
COPY . .

ENV FLASK_APP=run.py
ENV PYTHONUNBUFFERED=1

EXPOSE 5000

CMD ["python", "run.py"]
