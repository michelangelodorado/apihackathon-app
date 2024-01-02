# apihackathon-app

docker build -t vuln-app .
docker run -p 3000:3000 -p 8081:8081 --name vuln-app --network mynetwork -d vuln-app
