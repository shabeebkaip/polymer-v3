# Socket Connection Troubleshooting

## Problem: Socket Connection Spam
If you're getting repeated socket connection errors like:
```
🔌 Attempting to connect to chat server: http://localhost:3001 (attempt 1/2)
⚠️ Chat server not available, switching to offline mode
🔄 Retrying in 5000ms... (1/2)
```

## Solution: Disable Socket Connections

### For Development
Add this to your `.env.local` file:
```bash
NEXT_PUBLIC_DISABLE_SOCKET=true
```

### For Production
Set the environment variable in your deployment:
```bash
NEXT_PUBLIC_DISABLE_SOCKET=true
```

## What Happens When Disabled
- ✅ Chat functionality still works (uses API-only mode)
- ✅ No socket connection attempts or error spam
- ✅ Notifications work via polling
- ✅ All features remain functional
- ❌ Real-time features disabled (typing indicators, instant notifications)

## Re-enabling Sockets
Remove the environment variable or set it to `false`:
```bash
NEXT_PUBLIC_DISABLE_SOCKET=false
```

## Alternative: Manual Disable in Code
You can also disable in the socket service:
```typescript
// In lib/socketService.ts
private hasDisabledSocket: boolean = true; // Set to true to disable
```

## Testing Socket Functionality
1. Remove `NEXT_PUBLIC_DISABLE_SOCKET` from `.env.local`
2. Start a Socket.IO server on port 3001
3. Restart your Next.js application
4. Chat will automatically use real-time mode

## Current Status
- Socket connections are **DISABLED** via environment variable
- Chat works in **offline mode** using API polling
- No error spam in console
- All features remain functional
