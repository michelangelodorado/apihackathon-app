#!/bin/bash
docker stop vuln-app && docker rm vuln-app
wait
docker build -t vuln-app .
wait
docker run -p 3000:3000 -p 80:80 --name vuln-app --network mynetwork -d vuln-app
