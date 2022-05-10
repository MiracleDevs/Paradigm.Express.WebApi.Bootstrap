FROM mysql:8.0
COPY ./database/creation-script.sql /docker-entrypoint-initdb.d/00-creation-script.sql
COPY ./docker/db.cnf /etc/mysql/conf.d/