# ecommerco.ai Currency Switcher

Branded WooCommerce currency switcher plugin for `AED` and `USD`.

## Features

- Brand name: `ecommerco.ai Currency Switcher`
- Brand icon: yellow `E` mark
- Fixed default conversion rate: `1 USD = 3.67 AED`
- Supports URL switch key: `?ecommerco_currency=USD` or `?ecommerco_currency=AED`
- Persists customer currency in Woo session/cookie
- Converts Woo prices and order totals when USD is selected

## Install

1. Zip the plugin folder:
   - `ecommerco-ai-currency-switcher/`
2. WordPress Admin > Plugins > Add New > Upload Plugin
3. Activate the plugin
4. Open:
   - WooCommerce > ecommerco.ai Currency
5. Confirm rate (default `3.67`)

## Frontend Integration

When user selects currency in your storefront, redirect/append to Woo URL with:

- `?ecommerco_currency=USD`
- `?ecommerco_currency=AED`

Example:

- `https://your-woo-site.com/checkout/?ecommerco_currency=USD`
