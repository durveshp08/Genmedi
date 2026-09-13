# GitHub Secrets Configuration Guide

This guide explains how to configure GitHub secrets for automated deployment workflows.

## Required GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions → New repository secret):

### Render Deployment Secrets

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `RENDER_API_KEY` | Render API key for triggering deployments | 1. Go to [Render Dashboard](https://dashboard.render.com)<br>2. Click your avatar → "Account Settings"<br>3. Scroll to "API Keys"<br>4. Create new API key |
| `RENDER_SERVICE_ID` | Your Render service ID | 1. Go to your Render service page<br>2. The service ID is in the URL: `https://dashboard.render.com/srv/SERVICE_ID`<br>3. Copy the SERVICE_ID part |

### Vercel Deployment Secrets

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `VERCEL_TOKEN` | Vercel authentication token | 1. Go to [Vercel Dashboard](https://vercel.com/account/tokens)<br>2. Create new token<br>3. Copy the token |
| `VERCEL_ORG_ID` | Your Vercel organization ID | 1. Install Vercel CLI: `npm i -g vercel`<br>2. Run: `vercel login`<br>3. Run: `vercel link` in your project<br>4. Check `.vercel/project.json` for `orgId` |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | 1. After linking project with Vercel CLI<br>2. Check `.vercel/project.json` for `projectId` |

## Setting Up GitHub Secrets

### Manual Setup

1. Go to your GitHub repository
2. Click "Settings" tab
3. Click "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each secret with its name and value
6. Click "Add secret"

### Using GitHub CLI

```bash
# Login to GitHub
gh auth login

# Add secrets
gh secret set RENDER_API_KEY
gh secret set RENDER_SERVICE_ID
gh secret set VERCEL_TOKEN
gh secret set VERCEL_ORG_ID
gh secret set VERCEL_PROJECT_ID
```

## Getting Render Service ID

1. Navigate to your service in Render dashboard
2. Look at the URL: `https://dashboard.render.com/srv/abc123xyz789`
3. The service ID is `abc123xyz789`

## Getting Vercel IDs (Alternative Method)

If you don't want to use Vercel CLI:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Settings" → "General"
4. The Project ID is displayed
5. For Organization ID, check your organization settings or use the CLI method above

## Testing GitHub Actions

After setting up secrets:

1. Push to main branch:
```bash
git add .
git commit -m "Configure GitHub secrets"
git push origin main
```

2. Go to your GitHub repository
3. Click "Actions" tab
4. Watch the deployment workflow run

## Troubleshooting

### Render Deployment Fails

**Error**: "Invalid API key"
- **Solution**: Verify RENDER_API_KEY is correct and has proper permissions

**Error**: "Service not found"
- **Solution**: Verify RENDER_SERVICE_ID matches your actual service ID

### Vercel Deployment Fails

**Error**: "Invalid token"
- **Solution**: Verify VERCEL_TOKEN is valid and not expired

**Error**: "Project not found"
- **Solution**: Verify VERCEL_ORG_ID and VERCEL_PROJECT_ID are correct

### Workflow Not Triggering

**Error**: Workflow doesn't run on push
- **Solution**: Check workflow file is in `.github/workflows/` directory
- **Solution**: Verify branch name matches (default: `main`)

## Security Best Practices

1. **Never commit secrets to repository** - Use GitHub Secrets only
2. **Rotate secrets regularly** - Update API keys periodically
3. **Use least privilege** - Give API keys minimal required permissions
4. **Monitor usage** - Check GitHub Actions logs for suspicious activity
5. **Revoke compromised keys** - Immediately rotate if a secret is exposed

## Additional Resources

- [GitHub Actions Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Render API Documentation](https://render.com/docs/api)
- [Vercel API Documentation](https://vercel.com/docs/rest-api)