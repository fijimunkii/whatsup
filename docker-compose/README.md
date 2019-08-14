# docker-compose

[non-https.yml](non-https.yml)
`wget -O docker-compose.yml https://raw.githubusercontent.com/fijimunkii/whatsup/master/docker-compose/non-https.yml`

[https.yml](https.yml)
`wget -O docker-compose.yml https://raw.githubusercontent.com/fijimunkii/whatsup/master/docker-compose/https.yml`

[traefik-letsencrypt.yml](traefik-letsencrypt.yml)
* `touch acme.json`
* `chmod 600 acme.json`
`wget -O docker-compose.yml https://raw.githubusercontent.com/fijimunkii/whatsup/master/docker-compose/traefik-letsencrypt.yml`

```sh
echo "
docker-compose up --force-recreate --build -d
docker image prune -f
" > start.sh

chmod +x start.sh

./start.sh
```
