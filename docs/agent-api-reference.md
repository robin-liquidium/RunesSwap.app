# API Reference

The application provides REST API endpoints for interacting with Bitcoin Runes data via Ordiscan and SatsTerminal services. All endpoints return standardized JSON responses with `success` boolean and either `data` or `error` fields.

## Response Format

```json
{
  "success": true,
  "data": <response_data>
}
```

## Ordiscan API

### GET `/api/ordiscan/list-runes`

Lists all available runes from Ordiscan.

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/ordiscan/list-runes"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "840000:3",
      "name": "DOGGOTOTHEMOON",
      "formatted_name": "DOG•GO•TO•THE•MOON",
      "spacers": 596,
      "number": 3,
      "decimals": 5,
      "symbol": "🐕",
      "mint_count_cap": null,
      "amount_per_mint": null,
      "premined_supply": "10000000000000000"
    }
  ]
}
```

### GET `/api/ordiscan/rune-info`

Get detailed information about a specific rune by name.

**Query Parameters:**
- `name` (required): Rune name (supports bullet separators)

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/ordiscan/rune-info?name=DOG•GO•TO•THE•MOON"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "840000:3",
    "name": "DOGGOTOTHEMOON",
    "formatted_name": "DOG•GO•TO•THE•MOON",
    "spacers": 596,
    "number": 3,
    "inscription_id": "e79134080a83fe3e0e06ed6990c5a9b63b362313341745707a2bff7d788a1375i0",
    "decimals": 5,
    "mint_count_cap": null,
    "symbol": "🐕",
    "etching_txid": "e79134080a83fe3e0e06ed6990c5a9b63b362313341745707a2bff7d788a1375",
    "amount_per_mint": null,
    "timestamp_unix": "1713571767",
    "premined_supply": "10000000000000000",
    "mint_start_block": null,
    "mint_end_block": null,
    "current_supply": "10000000000000000",
    "current_mint_count": 2,
    "last_updated_at": "2025-04-13T18:32:45.839+00:00"
  }
}
```

### GET `/api/ordiscan/rune-balances`

Get rune balances for a specific Bitcoin address.

**Query Parameters:**
- `address` (required): Bitcoin address

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/ordiscan/rune-balances?address=bc1p70u2wvle72p5g89thzprx9zdp3fuzvtwfm5j2pyefl0cuwy83gkqvdmvdn"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "DOGGOTOTHEMOON",
      "balance": "23983700000"
    },
    {
      "name": "LIQUIDIUMTOKEN",
      "balance": "90006579"
    },
    {
      "name": "PUPSWORLDPEACE",
      "balance": "750000000000000000000"
    }
  ]
}
```

### GET `/api/ordiscan/btc-balance`

Get BTC balance for a specific address.

**Query Parameters:**
- `address` (required): Bitcoin address

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/ordiscan/btc-balance?address=bc1p70u2wvle72p5g89thzprx9zdp3fuzvtwfm5j2pyefl0cuwy83gkqvdmvdn"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "balance": 116000
  }
}
```

### GET `/api/ordiscan/rune-activity`

Get activity/transactions for a specific address.

**Query Parameters:**
- `address` (required): Bitcoin address

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/ordiscan/rune-activity?address=bc1p70u2wvle72p5g89thzprx9zdp3fuzvtwfm5j2pyefl0cuwy83gkqvdmvdn"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "txid": "931e577cebf2420a783a47de1a600009ea42025263f10a88989ec61460630670",
      "runestone_messages": [
        {
          "rune": "LIQUIDIUMTOKEN",
          "type": "TRANSFER"
        }
      ],
      "inputs": [
        {
          "address": "bc1pwlljtjyc6rladmvy8wkpd5mue90eplkytu075ztx5g5pznuh82rs7x4ma6",
          "output": "01e8bac04950e9585e6f7fa71794b6c2314704befd9fa5a240edae6a36a2c573:2",
          "rune": "LIQUIDIUMTOKEN",
          "rune_amount": "96600"
        }
      ],
      "outputs": [
        {
          "address": "bc1p70u2wvle72p5g89thzprx9zdp3fuzvtwfm5j2pyefl0cuwy83gkqvdmvdn",
          "vout": 0,
          "rune": "LIQUIDIUMTOKEN",
          "rune_amount": "96600"
        }
      ],
      "timestamp": "2025-08-09T00:01:42.000Z"
    }
  ]
}
```

## SatsTerminal API

### GET `/api/sats-terminal/search`

Search for runes on SatsTerminal.

**Query Parameters:**
- `query` (required): Search term
- `limit` (optional): Number of results (default: 20)

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/sats-terminal/search?query=DOG&limit=5"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "840000:3",
      "name": "DOG•GO•TO•THE•MOON",
      "imageURI": "https://icon.unisat.io/icon/runes/DOG•GO•TO•THE•MOON"
    },
    {
      "id": "840000:252",
      "name": "BITCOIN•IS•TOP•DOG",
      "imageURI": "https://icon.unisat.io/icon/runes/BITCOIN•IS•TOP•DOG"
    }
  ]
}
```

### POST `/api/sats-terminal/quote`

Get a swap quote from SatsTerminal.

**Body Parameters:**
- `btcAmount` (required): BTC amount as string
- `address` (required): Bitcoin address
- `runeName` (required): Rune name
- `sell` (optional): Boolean for sell/buy direction (default: false)

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/sats-terminal/quote" \
  -H "Content-Type: application/json" \
  -d '{
    "btcAmount": "0.001", 
    "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    "runeName": "DOG•GO•TO•THE•MOON",
    "sell": false
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "bestMarketplace": "MagicEden",
    "selectedOrders": [
      {
        "amount": "3000000000",
        "formattedAmount": "30000",
        "createdAt": "2025-08-13T10:31:08.254Z",
        "expiresAt": "2025-08-20T18:31:08.000Z",
        "id": "ee0da374-fdb4-44b5-aca5-f3ddebcd7ff7",
        "rune": "DOGGOTOTHEMOON",
        "maker": "bc1pt65exley6pv6uqws7xr3ku7u922tween0nfyz257rnl5300cjnrsjp9er6",
        "price": 90597,
        "side": "sell",
        "status": "valid",
        "formattedUnitPrice": "3.019900"
      }
    ],
    "totalFormattedAmount": "30000.00000000",
    "totalPrice": "0.00090590",
    "totalFeePercentage": "0.02",
    "metrics": {
      "magiceden": {
        "percentFulfilled": "90.60",
        "totalPurchased": "30000.00000000",
        "averageUnitPrice": "0.00000003"
      }
    }
  }
}
```

## Other Endpoints

### GET `/api/popular-runes`

Get list of popular/featured runes.

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/popular-runes"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "token_id": "840010:907",
      "token": "LIQUIDIUM•TOKEN",
      "symbol": "🫠",
      "icon": "https://icon.unisat.io/icon/runes/LIQUIDIUM•TOKEN",
      "is_verified": true
    },
    {
      "token_id": "840000:3",
      "token": "DOG•GO•TO•THE•MOON",
      "symbol": "🐕",
      "icon": "https://icon.unisat.io/icon/runes/DOG•GO•TO•THE•MOON",
      "is_verified": true
    }
  ]
}
```

### GET `/api/portfolio-data`

Get comprehensive portfolio data including balances, rune info, and market data.

**Query Parameters:**
- `address` (required): Bitcoin address

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/portfolio-data?address=bc1p70u2wvle72p5g89thzprx9zdp3fuzvtwfm5j2pyefl0cuwy83gkqvdmvdn"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "balances": [
      {
        "name": "DOGGOTOTHEMOON",
        "balance": "23983700000"
      },
      {
        "name": "LIQUIDIUMTOKEN",
        "balance": "90006579"
      }
    ],
    "runeInfos": {
      "DOGGOTOTHEMOON": {
        "id": "840000:3",
        "name": "DOGGOTOTHEMOON",
        "formatted_name": "DOG•GO•TO•THE•MOON",
        "decimals": 5,
        "symbol": "🐕",
        "current_supply": "10000000000000000"
      }
    },
    "marketData": {
      "DOGGOTOTHEMOON": {
        "price_in_sats": 2.9998,
        "price_in_usd": 0.00361374,
        "market_cap_in_btc": 2999,
        "market_cap_in_usd": 361277534
      }
    }
  }
}
```

### GET `/api/rune-price-history`

Get price history for a specific rune.

**Query Parameters:**
- `slug` (required): Rune slug identifier
- `timeframe` (optional): Time range (1h, 24h, 7d, etc.)

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/rune-price-history?slug=dog-go-to-the-moon&timeframe=24h"
```

**Example Response:**
```json
{
    "success": true,
    "data": {
        "slug": "LIQUIDIUMTOKEN",
        "prices": [
            {
                "timestamp": 1755079200000,
                "price": 165.996
            },
            {
                "timestamp": 1755075600000,
                "price": 166
            },
            {
                "timestamp": 1755068400000,
                "price": 169.618
            }
        ],
        "available": true
    }
}
```

## Bitcoin Fee Rates API

Bitcoin fee rates are fetched from mempool.space API with the following response format:

**Sample Response:**
```json
{
  "fastestFee": 2,
  "halfHourFee": 1,
  "hourFee": 1,
  "economyFee": 1,
  "minimumFee": 1
}
```

