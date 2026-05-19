# Nginx Deployment Template

This folder stores the Nginx deployment template for the Google Cloud VM. Nginx runs on the server, not on local development machines. The template is committed to GitHub so the deployment configuration can be reviewed and version-controlled with the project.

The frontend must be built before Nginx can serve it. This template expects the Vue production files at:

```text
/opt/project-fyp-mall/ElectronicMallVue/dist
```

Apply the template on the VM:

```bash
sudo ln -sf /opt/project-fyp-mall/deploy/nginx/project-fyp-mall.conf /etc/nginx/sites-enabled/project-fyp-mall
sudo nginx -t
sudo systemctl reload nginx
```

The backend should run on `127.0.0.1:9191`, and uploaded files should be stored under `/opt/project-fyp-mall/uploads`.

Do not commit `/etc/project-fyp-mall.env` or any real environment files. They can contain database credentials, SMTP keys, and other secrets.
