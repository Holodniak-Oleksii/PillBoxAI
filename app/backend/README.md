# PillBoxAI Backend

## Project Overview
PillBoxAI is a comprehensive medication management system that helps users track their medications, set reminders, and manage their health records. This repository contains the backend service built with Spring Boot that powers the PillBoxAI application.

### 🤖 AI-Powered Features
- **Smart Pill Scanning**: Use AI (Gemini 2.0 Flash) to extract medication information from photos
- **Automatic Data Extraction**: Name, active substance, dosage, expiry date, and more
- **RAG-based Recommendations**: (Coming soon) Personalized medication advice using Retrieval-Augmented Generation

## Prerequisites
- Java 21 or higher
- Gradle 8.x
- PostgreSQL 16+
- Docker (optional, for containerized deployment)

## Getting Started

### Local Development
1. Clone the repository
   ```bash
   git clone https://github.com/Holodniak-Oleksii/PillBoxAI.git
   cd PillBoxAI/app/backend
   ```

2. Configure the database:
   - Create a PostgreSQL database named `pillbox`
   - Update the database configuration in `src/main/resources/application.properties`

3. Configure AI features (optional):
   - Copy `.env.example` to `.env`
   - Set your OpenRouter API key: `OPENROUTER_API_KEY=your_key_here`
   
4. Run the application:
   ```bash
   ./gradlew bootRun
   ```
   The application will start on `http://localhost:8080`

### Using Docker

#### Option 1: Local Deployment (Recommended for Development)
1. Make sure Docker and Docker Compose are installed
2. From the backend directory, run:
   ```bash
   docker compose -f local_deploy.yaml up --build
   ```
   This will:
   - Build the Spring Boot application using multi-stage Docker build
   - Start a PostgreSQL 16 database on port 5433
   - Start the application on port 8080
   - Automatically configure database connections and environment variables

3. To run in detached mode:
   ```bash
   docker compose -f local_deploy.yaml up -d --build
   ```

4. To stop the services:
   ```bash
   docker compose -f local_deploy.yaml down
   ```

5. To stop and remove volumes (clean database):
   ```bash
   docker compose -f local_deploy.yaml down -v
   ```

#### Option 2: Default Docker Compose
1. From the project root, run:
   ```bash
   docker-compose up -d
   ```
   This will start the application and a PostgreSQL database in containers.

## API Documentation

### Swagger UI
Access the interactive API documentation at:
- [Local Development](http://localhost:8080/swagger-ui.html)
- [Production](https://your-production-url/swagger-ui.html)

### OpenAPI Specification
Download the OpenAPI specification from:
- [English Version](/src/main/resources/static/openapi-en.yaml)
- [Ukrainian Version](/src/main/resources/static/openapi-uk.yaml)

### AI Endpoints
The AI module provides the following endpoints:
- `POST /api/v1/ai/pills/scan` - Scan medication image and create pill entity
- `POST /api/v1/ai/pills/scan/preview` - Preview scan results without saving
- `GET /api/v1/ai/pills/health` - AI service health check

See [src/main/java/com/pill/box/api/ai/README.md](src/main/java/com/pill/box/api/ai/README.md) for detailed AI module documentation.

## Development

### Building the Project
```bash
./gradlew build
```

### Running Tests
```bash
./gradlew test
```