<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1lr9t6s5KF3p2YErK6gRW2A5zdlA0wx3a

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## Docker (VPS / Hostinger)

This project is now Docker-ready. The provided `Dockerfile` builds the app with Vite and serves it using Nginx.

### Build the image

```bash
docker build -t my-app:latest .
```

### Run locally

```bash
docker run --rm -p 80:80 my-app:latest
```

Then visit: http://localhost

### Run with Docker Compose

```bash
docker-compose up --build
```

Then visit: http://localhost

### Deploy on a Hostinger VPS

1. Ensure Docker is installed on your VPS.
2. Copy the project to the VPS (git clone / rsync / scp).
3. Build the container on the VPS:
   `docker build -t my-app:latest .`
4. Run it:
   `docker run -d --restart unless-stopped -p 80:80 my-app:latest`

> **Tip:** If you use a custom domain, point it to your VPS IP and make sure port 80/443 are open in your firewall.
# AstroWebGagan
