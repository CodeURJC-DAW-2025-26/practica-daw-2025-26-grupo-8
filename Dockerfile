FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM maven:3.9-eclipse-temurin-21 AS backend-builder
WORKDIR /workspace

COPY backend/pom.xml backend/pom.xml
RUN mvn -f backend/pom.xml -B -Djava.version=21 dependency:go-offline

COPY backend/src backend/src
COPY --from=frontend-builder /app/frontend/build/client backend/src/main/resources/static/new
RUN mvn -f backend/pom.xml -B -Djava.version=21 package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=backend-builder /workspace/backend/target/pizzeria-0.0.1-SNAPSHOT.jar /app/app.jar

EXPOSE 8443

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
