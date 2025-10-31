# Deployment Guide

## Prerequisites
1. GitHub account
2. Render account
3. OpenAI API key

## Steps

### 1. Prepare Repository
```bash
# Ensure all changes are committed
git status
git add .
git commit -m "Prepare for deployment"
git push
```

### 2. Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect to your GitHub repository
4. Configure service:
   - Name: lead-scoring-backend
   - Environment: Node
   - Build Command: npm install
   - Start Command: npm start
   - Plan: Free
   
5. Add environment variables:
   - OPENAI_API_KEY=sk-...
   - NODE_ENV=production
   - PORT=10000

6. Click "Create Web Service"

### 3. Verify Deployment

1. Wait for deployment to complete (5-10 minutes)
2. Test the base URL:
```bash
curl https://your-app-name.onrender.com
```

3. Test core endpoints:
```bash
# Create offer
curl -X POST https://your-app-name.onrender.com/api/offer \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","ideal_use_cases":["Test"]}'

# Check it worked
curl https://your-app-name.onrender.com/api/offer
```

### 4. Update Documentation

1. Add your live URL to README.md
2. Test all endpoints with Postman collection
3. Commit and push the update:
```bash
git add README.md
git commit -m "Add live API URL"
git push
```

### Troubleshooting

1. Build Failures
- Check build logs in Render dashboard
- Verify all dependencies are in package.json
- Check Node.js version compatibility

2. Runtime Errors
- Check logs in Render dashboard
- Verify environment variables
- Check for port conflicts

3. API Issues
- Verify OPENAI_API_KEY is set correctly
- Check rate limits
- Test endpoints locally first

### Monitoring

1. View logs in Render dashboard
2. Check usage metrics
3. Monitor OpenAI API usage

### Maintenance

1. Keep dependencies updated
2. Monitor OpenAI API costs
3. Review logs periodically
4. Update API key if needed