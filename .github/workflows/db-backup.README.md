# Daily MongoDB → Google Drive backup

`db-backup.yml` dumps the production `hawkstars` MongoDB database from the VPS and
uploads a gzipped archive to a Google Drive folder every day at **03:17 UTC**.
You can also run it on demand from the **Actions** tab (“Run workflow”).

## How it works

The database listens only on `localhost:27017` on the VPS, so the job connects
over SSH (reusing the same credentials as `deploy.yml`), runs `mongodump` on the
server, then uploads the archive to Google Drive with the existing Google OAuth
refresh token. Backups older than 14 days (`RETENTION_DAYS`) are pruned.

## One-time setup

### 1. VPS prerequisites

The script needs `mongodump`, `curl`, and `jq` on the VPS:

```bash
# MongoDB Database Tools (provides mongodump)
# https://www.mongodb.com/docs/database-tools/installation/installation-linux/
sudo apt-get install -y mongodb-database-tools jq curl
mongodump --version   # verify
```

### 2. Google Drive folder

Create a folder in Google Drive to hold the backups and copy its ID from the URL:

```
https://drive.google.com/drive/folders/THIS_PART_IS_THE_ID
```

Share the folder with the Google account that owns the OAuth credentials (the
account behind `GOOGLE_REFRESH_TOKEN`) so it can write to it.

### 3. GitHub secrets

Most secrets already exist (from `deploy.yml`). Add the one new secret:

| Secret | Status | Purpose |
| --- | --- | --- |
| `VPS_HOST`, `VPS_USERNAME`, `SSH_PRIVATE_KEY`, `SSH_PASSPHRASE` | already set | SSH into the VPS |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` | already set | Google Drive upload |
| `GDRIVE_BACKUP_FOLDER_ID` | **add this** | Destination Drive folder ID |

> **Drive scope:** the OAuth refresh token must include
> `https://www.googleapis.com/auth/drive.file` (or a broader Drive scope). The
> existing token was issued for Gmail/Nodemailer; if uploads fail with a 403,
> regenerate the refresh token with the Drive scope added and update
> `GOOGLE_REFRESH_TOKEN`.

### 4. Test it

Trigger a manual run: **Actions → Daily MongoDB Backup to Google Drive → Run
workflow**. Check the logs for `Uploaded successfully` and confirm the `.gz`
file appears in the Drive folder.

## Tuning

- **Schedule** — edit the `cron` line (`17 3 * * *`).
- **Retention** — change `RETENTION_DAYS` in the workflow `env`.
- **Database name** — change `DB_NAME` if it ever differs from `hawkstars`.
