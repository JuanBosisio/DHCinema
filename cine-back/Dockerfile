# Usar una imagen base con JDK 11 y Maven
FROM maven:3.8.4-openjdk-17

# Instalar JDK 20 manualmente
RUN apt-get update && \
    apt-get install -y wget && \
    cd /tmp && \
    wget https://github.com/adoptium/temurin20-binaries/releases/download/jdk-20.0.1%2B9/OpenJDK20U-jdk-sources_20.0.1_9.tar.gz && \
    tar -xf jdk20.tar.gz && \
    mv jdk20 /opt && \
    rm jdk20.tar.gz

# Establecer las variables de entorno para el JDK 20
ENV JAVA_HOME=/opt/jdk20
ENV PATH=${JAVA_HOME}/bin:${PATH}

FROM maven:4.0.0-openjdk-20 AS build

# Establecer un directorio de trabajo
WORKDIR /app

# Copiar archivos de tu proyecto al directorio de trabajo
COPY . /app

# Ejecutar Maven para construir el proyecto
RUN mvn clean package

# Crear una nueva imagen basada en OpenJDK 11
FROM openjdk:20-jdk

# Exponer el puerto que utilizará la aplicación
EXPOSE 8080

# Copiar el archivo JAR construido desde la etapa anterior
COPY --from=build /app/target/PI-BackEnd-0.0.1-SNAPSHOT.jar /app/PI-BackEnd-0.0.1-SNAPSHOT.jar

# Establecer el punto de entrada para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "/app/PI-BackEnd-0.0.1-SNAPSHOT.jar"]