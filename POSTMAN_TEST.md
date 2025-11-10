# Guía para Probar el Servicio con Postman

## Configuración Inicial

1. **Inicia el servidor:**
   ```bash
   npm run start:dev
   ```
   El servidor estará disponible en `http://localhost:3000`

## Configuración en Postman

### 1. Crear una Nueva Request

1. Abre Postman
2. Crea una nueva request (POST)
3. Configura la URL: `http://localhost:3000/transactions`

### 2. Configurar Headers

**IMPORTANTE**: No necesitas configurar `X-API-Key` ni `Authorization` - nuestro servicio los maneja automáticamente usando las credenciales del `.env`.

Solo necesitas estos headers:

```
Content-Type: application/json
Accept: application/json
```

### 3. Configurar el Body

Selecciona **Body** → **raw** → **JSON** y pega el siguiente JSON:

```json
{
    "assetId": "XLM_USDC_T_CEKS",
    "source": {
        "type": "EXCHANGE_ACCOUNT",
        "id": "300d1b9a-f46b-4ee6-be99-659fcd3cd802"
    },
    "amount": "1",
    "feeLevel": "MEDIUM",
    "note": "",
    "operation": "TRANSFER",
    "customerRefId": "payoutCircleExternal",
    "externalTxId": "circleTest",
    "destination": {
        "type": "EXTERNAL_WALLET",
        "id": "56216a51-5fad-4433-ac89-d4416fad7c0d"
    }
}
```

### 4. Enviar la Request

Haz clic en **Send** y deberías recibir la respuesta de Fireblocks.

## Ejemplo Completo de cURL (para referencia)

```bash
curl --location 'http://localhost:3000/transactions' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--data '{
    "assetId": "XLM_USDC_T_CEKS",
    "source": {
        "type": "EXCHANGE_ACCOUNT",
        "id": "300d1b9a-f46b-4ee6-be99-659fcd3cd802"
    },
    "amount": "1",
    "feeLevel": "MEDIUM",
    "note": "",
    "operation": "TRANSFER",
    "customerRefId": "payoutCircleExternal",
    "externalTxId": "circleTest",
    "destination": {
        "type": "EXTERNAL_WALLET",
        "id": "56216a51-5fad-4433-ac89-d4416fad7c0d"
    }
}'
```

## Diferencias con la API Directa de Fireblocks

| Aspecto | API Directa de Fireblocks | Nuestro Servicio Proxy |
|---------|---------------------------|------------------------|
| URL | `https://api.fireblocks.io/v1/transactions` | `http://localhost:3000/transactions` |
| Headers requeridos | `X-API-Key` + `Authorization` (JWT) | Solo `Content-Type` y `Accept` |
| Autenticación | Manual (debes generar JWT) | Automática (usa `.env`) |

## Respuestas Esperadas

### ✅ Éxito (200 OK)
```json
{
    "id": "transaction-id-from-fireblocks",
    "status": "SUBMITTED"
}
```

### ❌ Error de Validación (400 Bad Request)
```json
{
    "statusCode": 400,
    "message": ["property should not exist"],
    "error": "Bad Request"
}
```

### ❌ Error de Fireblocks (502 Bad Gateway)
```json
{
    "message": "Fireblocks API error",
    "code": 1001
}
```

## Troubleshooting

1. **Error: "Fireblocks private key file not found"**
   - Verifica que `fireblocks_secret.key` existe en el directorio raíz
   - Verifica que `FIREBLOCKS_SECRET_KEY_PATH` en `.env` apunta al archivo correcto

2. **Error: "FIREBLOCKS_API_KEY is not configured"**
   - Verifica que el `.env` tiene `FIREBLOCKS_API_KEY` configurado

3. **Error de conexión**
   - Asegúrate de que el servidor está corriendo (`npm run start:dev`)
   - Verifica que estás usando `http://localhost:3000` (no `https://`)

4. **Error 400 de validación**
   - Verifica que el JSON está bien formateado
   - Asegúrate de que todos los campos requeridos están presentes
