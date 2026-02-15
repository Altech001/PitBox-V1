#!/bin/bash
set -e

# Configuration
BACKEND_URL="https://pitbox-ten.vercel.app"
FRONTEND_PROJECT="."  # Script is in the project root
API_OUTPUT="$FRONTEND_PROJECT/src/lib/api"

echo "🔍 Checking for OpenAPI schema..."

if [ -f "openapi.json" ]; then
    echo "✓ Using local openapi.json"
else
    # Try different possible OpenAPI paths
    OPENAPI_PATHS=(
        "$BACKEND_URL/openapi.json"
        "$BACKEND_URL/api/openapi.json"
        "$BACKEND_URL/api/v1/openapi.json"
    )

    OPENAPI_URL=""
    for path in "${OPENAPI_PATHS[@]}"; do
        if curl -s -f "$path" > /dev/null 2>&1; then
            OPENAPI_URL="$path"
            echo "✓ Found OpenAPI schema at: $path"
            break
        fi
    done

    if [ -z "$OPENAPI_URL" ]; then
        echo "❌ Error: Could not find OpenAPI schema"
        exit 1
    fi

    echo "📥 Downloading OpenAPI schema..."
    curl -f -s "$OPENAPI_URL" > openapi.json
fi

echo "🔧 Generating TypeScript client (using swagger-typescript-api)..."

# Ensure API directory exists
mkdir -p "$API_OUTPUT"

# Generate the API client
npx -y swagger-typescript-api generate -p openapi.json -o "$API_OUTPUT" -n api.ts

# Create a configured API client file
cat > "$API_OUTPUT/client.ts" << 'EOF'
import { Api } from './api'

// Get base URL from environment or use default
const BASE_URL = import.meta.env.VITE_API_URL || 'https://pitbox-ten.vercel.app'

// Create and export API client instance
export const apiClient = new Api({
  baseUrl: BASE_URL,
})

// Helper to set auth token
export function setAuthToken(token: string) {
  // @ts-ignore - Setting auth token on the client's internal instance
  apiClient.setSecurityData(token)
}

// Helper to clear auth token
export function clearAuthToken() {
  // @ts-ignore
  apiClient.setSecurityData(null)
}
EOF

# Create index.ts to export everything
cat > "$API_OUTPUT/index.ts" << 'EOF'
export * from './api'
export * from './client'
EOF

# Create README
cat > "$API_OUTPUT/README.md" << 'EOF'
# API Client

Auto-generated API client from OpenAPI schema using swagger-typescript-api.

## Regenerate

```bash
./generate.sh
```

## Usage

```typescript
import { apiClient } from '@/lib/api'

// Login example
const response = await apiClient.auth.loginAuthLoginPost({
  username: 'user@example.com',
  password: 'password'
})

// Set token
import { setAuthToken } from '@/lib/api'
setAuthToken(response.data.access_token)
```
EOF

echo ""
echo "✅ API client generated successfully!"
echo "📁 Location: $API_OUTPUT"
echo "�️ Documentation UI: /docs"
echo ""