# Nginx Deployment Template

This folder stores the Nginx deployment template for the Google Cloud VM. Nginx runs on the server, not on local development machines. The template is committed to GitHub so the deployment configuration can be reviewed and version-controlled with the project.

The frontend must be built before Nginx can serve it. This template expects the Vue production files at:

```text
/var/www/project-fyp-mall
```

Apply the template on the VM:

```bash
sudo cp /opt/project-fyp-mall/deploy/nginx/project-fyp-mall.conf /etc/nginx/sites-available/project-fyp-mall
sudo ln -sf /etc/nginx/sites-available/project-fyp-mall /etc/nginx/sites-enabled/project-fyp-mall
sudo nginx -t
sudo systemctl reload nginx
```

The backend should run on `127.0.0.1:9191`, and uploaded files should be stored under `/opt/project-fyp-mall/uploads`.

The current template intentionally strips the first public `/api/` segment before forwarding to the backend. With the existing frontend code and `VUE_APP_API_BASE_URL=/api`, this means:

- Frontend calls to backend `/api/*` routes are public as `/api/api/*`.
- Backend root routes such as `/login` and `/userid` are public as `/api/login` and `/api/userid`.
- Uploaded file and avatar routes are public as `/api/file/*` and `/api/avatar/*`.

For manual API checks, use `/api/api/good` rather than `/api/good`.

Do not commit `/etc/project-fyp-mall.env` or any real environment files. They can contain database credentials, SMTP keys, and other secrets.
