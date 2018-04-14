FROM postgres:alpine
LABEL maintainer="Tom Belov <humantom88@gmail.com>"

# Creating user for easy access to DB
RUN addgroup -S docker \
    && adduser -S -g docker docker \
    && mkdir -p /home/docker \
    && chown docker:docker /home/docker

# Copy configure script
COPY configure.sh /docker-entrypoint-initdb.d/configure.sh
RUN chmod 755 /docker-entrypoint-initdb.d/configure.sh
