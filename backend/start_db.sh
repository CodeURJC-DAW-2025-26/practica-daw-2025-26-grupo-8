#!/bin/sh

# Starts a MySQL container for the local pizzeria database.
docker run --rm -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=pizzeria -p 3306:3306 -d mysql:9.2