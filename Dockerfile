# Stage 1: Build JAR
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy Maven files and source
COPY pom.xml .
COPY src ./src

# Build the jar
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the app
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy the built jar from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Start the app
ENTRYPOINT ["java","-jar","/app/app.jar"]
