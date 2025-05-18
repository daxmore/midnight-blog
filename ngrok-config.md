# Configuring ngrok with Vite for Midnight Blog

You're experiencing WebSocket connection issues when trying to use ngrok with Vite. Here's an updated guide to resolve these issues:

## Solution 1: Disable HMR (Hot Module Replacement) when using ngrok

We've already updated your `vite.config.js` to disable HMR when accessing through ngrok, as WebSockets often don't work properly through ngrok tunnels. This means:

- Your site will still work through ngrok
- Changes to code won't automatically refresh the page (you'll need to manually refresh)
- This is a reasonable compromise for testing

## How to use ngrok with your Vite app:

1. **Start your Vite development server**
   ```
   npm run dev
   ```

2. **Start ngrok in a separate terminal**
   ```
   ngrok http 5173
   ```
   
3. **Use the HTTPS URL provided by ngrok** in your browser, but remember that you'll need to manually refresh to see changes

## Solution 2: Tunnel WebSockets properly (advanced)

If you need HMR to work through ngrok:

1. Use ngrok with the `--subdomain` flag to ensure a consistent URL:
   ```
   ngrok http --subdomain=midnightblog 5173
   ```

2. Update your `vite.config.js` to use tunneling configuration:
   ```js
   server: {
     host: '0.0.0.0',
     port: 5173,
     hmr: {
       protocol: 'wss',
       host: 'midnightblog.ngrok.io', // Your consistent ngrok subdomain
       clientPort: 443
     }
   }
   ```

## Solution 3: Use Vite's built-in network access instead

The simplest solution might be to avoid ngrok entirely:

1. Run `npm run dev`
2. Look for the "Network" URL in the console output (e.g., http://192.168.x.x:5173/)
3. Use this URL from any device on your local network

This approach provides the best development experience with working HMR. 