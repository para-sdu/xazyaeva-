FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /workspace

COPY ["src 2/pom.xml", "./pom.xml"]
COPY ["src 2/main", "./main"]
COPY ["src 2/test", "./test"]

RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /workspace/target/project-1.0.0.jar ./app.jar

ENV PORT=8080
EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
