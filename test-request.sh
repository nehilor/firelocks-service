#!/bin/bash
# Script para probar el endpoint desde la terminal

echo "🚀 Probando el endpoint POST /transactions..."
echo ""

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

echo ""
echo ""
echo "✅ Request completado"
