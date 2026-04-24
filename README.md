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
    *   `APP_SECRET_KEY`: A secret key for signing JSON Web Tokens and encrypting stored credentials.
    *   `ADMIN_USERNAME`, `ADMIN_PASSWORD`: Credentials for an administrative user.
    *   Google Sheets are linked per event in the admin UI. Service account credentials are validated there and stored encrypted in the database.
    *   `BACKEND_URL` (for dev): The URL where the frontend can reach the backend (e.g., `http://localhost:3001`).
    *   `TELEGRAM_GROUP_LINK`: Link to the associated Telegram group.
    *   `DOMAIN_NAME` (for prod): The public host name for nginx-proxy and Let's Encrypt.
    *   `ACME_EMAIL` (for prod): Email address for Let's Encrypt notifications.
    *   `CF_Token`, `CF_Account_ID`, `CF_Zone_ID` (for prod): Cloudflare DNS API values for DNS-01 certificates. `CF_Zone_ID` is optional when `CF_Account_ID` is set.

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

Deploying to production requires HTTPS, handled via nginx-proxy and acme-companion.

1.  **Ensure `.env` is complete:** Make sure all necessary variables, including `DOMAIN_NAME` and `ACME_EMAIL`, are set in your `.env` file.
2.  **Configure Cloudflare DNS:** Ensure the `DOMAIN_NAME` specified in `.env` exists in Cloudflare. Create a Cloudflare API token with `Zone > DNS > Edit` and `Zone > Zone > Read`, then set `CF_Token` and `CF_Account_ID` in `.env`. `CF_Zone_ID` can be set for a single zone or left empty.
3.  **Check Nginx vhost include:** The custom nginx-proxy include is `nginx/vhost.d/talkoot.kampusjaosto.fi`. If `DOMAIN_NAME` changes, rename this file to match the new host.
4.  **Build and Run Production Containers:**
    ```bash
    docker-compose -f docker-compose.prod.yml up --build -d
    ```
    This starts the application backend, nginx-proxy, and acme-companion. Certificates are created through Cloudflare DNS-01 using the `ACMESH_DNS_API_CONFIG` in `docker-compose.prod.yml`.

5.  **Check certificate/proxy logs:**
    ```bash
    docker-compose -f docker-compose.prod.yml logs -f nginx-proxy acme-companion
    ```

6.  **Automatic Certificate Renewal:**
    The `acme-companion` service automatically checks for certificate renewals and reloads nginx-proxy after certificate changes.

7.  **Stopping Production Containers:**
    ```bash
    docker-compose -f docker-compose.prod.yml down
    ```

## Technology Stack

*   **Frontend:** Vite-based framework (React/Vue/Svelte - check `./frontend/package.json`)
*   **Backend:** Node.js (check `./backend/package.json`)
*   **Database:** PostgreSQL
*   **Web Server/Proxy:** nginx-proxy
*   **Containerization:** Docker, Docker Compose
*   **SSL Certificates:** Let's Encrypt via acme-companion and Cloudflare DNS-01

---

*This README provides a general setup guide. Specific implementation details might require inspecting the source code in the `frontend` and `backend` directories.*
