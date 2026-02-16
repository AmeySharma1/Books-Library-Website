# Deployment Guide for Books Library App

## MongoDB Atlas Migration

### Step 1: Create MongoDB Atlas Account
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (M0 Sandbox - free tier)

### Step 2: Configure Database Access
1. Go to **Database Access** in Atlas dashboard
2. Add new database user with:
   - Username: `library_user` (or your choice)
   - Password: Generate a strong password
   - Permissions: Read and write to any database

### Step 3: Configure Network Access
1. Go to **Network Access** 
2. Add IP Address: `0.0.0.0/0` (required for Render)

### Step 4: Get Connection String
1. Go to **Clusters** → **Connect**
2. Choose **Connect your application**
3. Driver: Node.js, Version: 4.0 or later
4. Copy the connection string

### Step 5: Update Environment Variables

**Server (.env file):**
```env
PORT=5000
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/library_db
JWT_SECRET=your_very_long_random_secret_key_here_min_32_characters
CLIENT_URL=https://your-frontend-domain.onrender.com
NODE_ENV=production
```

**Client (.env file):**
```env
VITE_API_URL=https://your-backend-domain.onrender.com
```

## Render Deployment

### Backend Deployment
1. Push your code to GitHub
2. Go to [Render](https://render.com) and create account
3. Create new **Web Service**
4. Connect your GitHub repository
5. Configuration:
   - **Name**: books-library-backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add all from your `.env` file
   - **Auto Deploy**: Yes

### Frontend Deployment
1. Create new **Static Site** on Render
2. Configuration:
   - **Name**: books-library-frontend
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**: Add `VITE_API_URL` with your backend URL

## Important Notes

### Image Upload Limitation
⚠️ **Current Limitation**: Image uploads are stored locally in `/server/uploads` directory. This won't work on Render since it's a stateless environment.

**Solutions**:
1. **Temporary**: Remove image upload feature for deployment
2. **Recommended**: Integrate with cloud storage (Cloudinary, AWS S3, etc.)

### Testing Before Deployment
1. Test locally with Atlas connection first
2. Update `.env` with Atlas connection string
3. Run both frontend and backend locally
4. Verify all functionality works

### Security Considerations
- Never commit `.env` files to version control
- Use strong JWT secrets (32+ characters)
- Regularly rotate database passwords
- Enable MongoDB Atlas security features

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure `CLIENT_URL` matches your frontend domain
2. **Database Connection**: Verify Atlas IP whitelist includes `0.0.0.0/0`
3. **Environment Variables**: Double-check all variables are set correctly in Render
4. **Build Failures**: Check Node.js version compatibility

### Useful Commands:
```bash
# Test MongoDB connection locally
npm run dev

# Build frontend for production
cd client && npm run build

# Check for errors
npm run dev  # in server directory
```