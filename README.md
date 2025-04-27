# talkootunkki

A web application designed for organizing volunteer work events ("talkoot"), integrated with a Telegram bot and Google Sheets.

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Docker](https://docs.docker.com/get-docker/)
*   [Docker Compose](https://docs.docker.com/compose/install/)

## Environment Setup

1.  Copy the sample environment file:
    ```bash
    cp .env.sample .env
    ```
2.  Edit the `.env` file and fill in the required values. The necessary variables are described in `.env.sample`. Key variables include:
    *   `POSTGRES_USER`, `POSTGRES_PASSWORD`: Credentials for the PostgreSQL database.
    *   `TG_BOT_API_TOKEN`: Your Telegram Bot API token.
    *   `JWT_SECRET_KEY`: A secret key for signing JSON Web Tokens.
    *   `ADMIN_USERNAME`, `ADMIN_PASSWORD`: Credentials for an administrative user.
    *   `GOOGLE_SHEETS_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`: Credentials for accessing Google Sheets API.
    *   `BACKEND_URL` (for dev): The URL where the frontend can reach the backend (e.g., `http://localhost:3001`).
    *   `TELEGRAM_GROUP_LINK`: Link to the associated Telegram group.
    *   `DOMAIN_NAME` (for prod setup): The domain name for which to obtain SSL certificates.
    *   `CERTBOT_EMAIL` (for prod setup): Email address for Let's Encrypt notifications.

## Development Setup

1.  **Build and Run Containers:**
    ```bash
    docker-compose up --build
    ```
    This command builds the images if they don't exist and starts the development containers (frontend, backend, postgres, adminer). The `-d` flag can be added to run them in the background.

2.  **Access Services:**
    *   Frontend: [http://localhost:3000](http://localhost:3000)
    *   Backend: [http://localhost:3001](http://localhost:3001)
    *   Adminer (Database GUI): [http://localhost:8080](http://localhost:8080) (Server: `postgres`, Username/Password: from `.env`)

3.  **Stopping Containers:**
    ```bash
    docker-compose down
    ```

## Production Setup

Deploying to production requires HTTPS, handled via Nginx and Let's Encrypt certificates.

1.  **Ensure `.env` is complete:** Make sure all necessary variables, including `DOMAIN_NAME` and `CERTBOT_EMAIL`, are set in your `.env` file.
2.  **Configure DNS:** Ensure the `DOMAIN_NAME` specified in `.env` points to the server where you are deploying the application.
3.  **Initial Certificate Setup:**
    *   Run the certificate setup container. This uses `certbot` to obtain the *initial* certificates for your domain.
      ```bash
      docker-compose -f docker-compose.setup.yml up --build
      ```
    *   Follow the prompts from `certbot`. Once successful, shut down the containers (usually `CTRL+C`).
4.  **Generate Diffie-Hellman Parameters:**
    This enhances security for TLS.
    ```bash
    cd nginx
    sudo ./dhparam.sh # This might take a while
    cd ..
    ```
    *Note: Ensure `dhparam.sh` has execute permissions (`chmod +x nginx/dhparam.sh`). You only need to do this once.*
5.  **Build and Run Production Containers:**
    ```bash
    docker-compose -f docker-compose.prod.yml up --build -d
    ```
    This starts the application backend, database, Nginx reverse proxy, and the Certbot renewal service.

6.  **Automatic Certificate Renewal:**
    The `certbot` service included in `docker-compose.prod.yml` automatically checks for certificate renewals twice a day. If a certificate is due for renewal, it obtains a new one and automatically reloads Nginx to apply it. No manual intervention is needed for renewals.

7.  **Stopping Production Containers:**
    ```bash
    docker-compose -f docker-compose.prod.yml down
    ```

## Technology Stack

*   **Frontend:** Vite-based framework (React/Vue/Svelte - check `./frontend/package.json`)
*   **Backend:** Node.js (check `./backend/package.json`)
*   **Database:** PostgreSQL
*   **Web Server/Proxy:** Nginx
*   **Containerization:** Docker, Docker Compose
*   **SSL Certificates:** Let's Encrypt via Certbot (with automated renewal)

---

*This README provides a general setup guide. Specific implementation details might require inspecting the source code in the `frontend` and `backend` directories.*
