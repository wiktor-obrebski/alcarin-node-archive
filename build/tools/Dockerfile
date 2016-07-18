FROM node:5.10.1
MAINTAINER psychowico <psychowico@gmail.com>


RUN apt-get update && apt-get install default-jre graphviz unzip postgresql-client -y

RUN wget -O /opt/schemaSpy.jar "http://downloads.sourceforge.net/project/schemaspy/schemaspy/SchemaSpy%205.0.0/schemaSpy_5.0.0.jar?r=https%3A%2F%2Fsourceforge.net%2Fprojects%2Fschemaspy%2F%3Fsource%3Dtyp_redirect&ts=1467825955&use_mirror=jaist"
RUN wget -O /tmp/postgresql-8.0-312.jdbc3.jar.zip http://www.java2s.com/Code/JarDownload/postgresql/postgresql-8.0-312.jdbc3.jar.zip && \
    unzip /tmp/postgresql-8.0-312.jdbc3.jar.zip -d /opt

RUN npm install -g pg node-pg-migrate typings

WORKDIR /app
