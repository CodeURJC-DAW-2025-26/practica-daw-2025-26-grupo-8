FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /workspace

# Cache dependencies first
COPY backend/pom.xml backend/pom.xml
RUN mvn -f backend/pom.xml -B -Djava.version=21 dependency:go-offline

# Copy source and build the executable JAR (tests skipped)
COPY backend/src backend/src
RUN mvn -f backend/pom.xml -B -Djava.version=21 package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=builder /workspace/backend/target/*.jar /app/app.jar

EXPOSE 8443

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
