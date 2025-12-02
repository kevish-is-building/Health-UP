# Google OAuth Setup Instructions

## Setting up Google OAuth for Health-UP

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google Identity API

### 2. Create OAuth 2.0 Credentials
1. In the Google Cloud Console, navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure the consent screen if prompted
4. For Application type, select "Web application"
5. Add authorized JavaScript origins:
   - `http://localhost:5173` (for local development)
   - Your production domain when deploying
6. Add authorized redirect URIs (if needed):
   - `http://localhost:5173/auth/callback`
   - Your production callback URL
7. Copy the Client ID

### 3. Configure Environment Variables
1. Open the `.env` file in your project root
2. Replace `your_google_client_id_here` with your actual Google Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
   ```

### 4. Backend Integration
Make sure your backend API has an endpoint at `/auth/google` that accepts:
```json
{
  "credential": "google_jwt_token"
}
```

The backend should:
1. Verify the Google JWT token
2. Extract user information (name, email, profile picture)
3. Create or update user in your database
4. Return user data and authentication token

### 5. Test the Integration
1. Start your development server: `npm run dev`
2. Navigate to the login page
3. Click "Sign in with Google"
4. Complete the OAuth flow

### Security Notes
- Never commit your actual Google Client ID to version control if it contains sensitive information
- Use environment variables for all configuration
- Implement proper CSRF protection
- Validate JWT tokens on the backend

### Troubleshooting CORS and Network Issues

#### Common Error: "ERR_FAILED" and CORS Headers
If you see errors like:
```
The fetch of the id assertion endpoint resulted in a network error: ERR_FAILED
Server did not send the correct CORS headers
```

**Solutions:**
1. **Verify Authorized JavaScript Origins**: Make sure your development URL (`http://localhost:5173`) is added to the authorized JavaScript origins in Google Cloud Console
2. **Check Client ID**: Ensure your `VITE_GOOGLE_CLIENT_ID` in the `.env` file is correct
3. **Use HTTPS in Production**: Google Sign-In requires HTTPS in production
4. **Clear Browser Cache**: Sometimes cached credentials can cause issues
5. **Test in Incognito Mode**: This helps identify if browser extensions or cached data are causing issues

#### FedCM (Federated Credential Management) Issues
If you see FedCM-related errors, this is normal as we're using the button-based approach which is more reliable than the popup-based approach.

#### Button Not Rendering
If the Google Sign-In button doesn't appear:
1. Check browser console for JavaScript errors
2. Verify the Google Identity Services script is loading properly
3. Ensure your Client ID is set in the environment variables
4. Try refreshing the page after setting up the environment variables