# Step 1: Build stage
FROM eclipse-temurin:21-jdk-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy the Maven build file and your source code into the container
COPY pom.xml .
COPY src ./src

# Install Maven (if not using the wrapper)
RUN apk add --no-cache maven

# Download dependencies and build the Spring Boot app
RUN mvn clean package -DskipTests

# Step 2: Run stage
FROM eclipse-temurin:21-jre-alpine

# Set the working directory
WORKDIR /app

# Copy the jar file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Set environment variables (optional, you can override these at runtime)
ENV SPRING_PROFILES_ACTIVE=${PROFILE}
ENV DATABASE_URL=${DATABASE_URL}
ENV DATABASE_USERNAME=${DATABASE_USERNAME}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV JWT_SECRET_KEY=${JWT_SECRET_KEY}

# Expose the port the app will run on
EXPOSE 8080

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
