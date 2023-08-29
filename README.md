# talkootunkki

## Getting started

1. Fill out `.env` file
2. Run `docker-compose up`

## Deploying to production

Deploying the app to production requires some extra steps, since Telegram requires using HTTPS for Telegram Web Apps

1. Fill out `.env` file
2. Start the TLS certificate setup containers:
```sh
docker-compose -f docker-compose.setup.yml up --build
```
3. When the certificate request is successful, shut down the containers (`CTRL+C`)
4. Generate dhparams:
```sh
cd nginx
sudo ./dhparam.sh
```
5. Go back to the root folder and run the app containers:
```sh
docker-compose -f docker-compose.prod.yml up --build
```