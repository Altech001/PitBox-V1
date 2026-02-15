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
