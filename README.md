```
docker run -d \
  -p 80:5555 \
  -e S3_BUCKET=whatsup-myapp \
  fijimunkii/whatsup:latest

curl http://localhost:80
```
