<?php
/**
 * Plugin Name: ecommerco.ai Currency Switcher
 * Plugin URI: https://ecommerco.ai
 * Description: Branded AED/USD currency switcher for WooCommerce with fixed conversion rate (1 USD = 3.67 AED).
 * Version: 1.0.0
 * Author: ecommerco.ai
 * Author URI: https://ecommerco.ai
 * Text Domain: ecommerco-ai-currency-switcher
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('EcommercoAiCurrencySwitcher')) {
    final class EcommercoAiCurrencySwitcher {
        private const BASE_CURRENCY = 'AED';
        private const TARGET_CURRENCY = 'USD';
        private const AED_PER_USD = 3.67;
        private const QUERY_KEY = 'ecommerco_currency';
        private const COOKIE_KEY = 'ecommerco_currency';
        private const BRIDGE_OPTION_KEY = 'ecommerco_ai_bridge_wc_config';
        private const BRIDGE_TOKEN_OPTION_KEY = 'ecommerco_ai_bridge_token';

        public function __construct() {
            add_action('plugins_loaded', [$this, 'bootstrap']);
        }

        public function bootstrap(): void {
            if (!class_exists('WooCommerce')) {
                return;
            }

            add_action('init', [$this, 'handle_currency_request'], 1);
            add_filter('woocommerce_currency', [$this, 'filter_currency']);
            add_filter('woocommerce_product_get_price', [$this, 'convert_price'], 99);
            add_filter('woocommerce_product_get_regular_price', [$this, 'convert_price'], 99);
            add_filter('woocommerce_product_get_sale_price', [$this, 'convert_price'], 99);
            add_filter('woocommerce_product_variation_get_price', [$this, 'convert_price'], 99);
            add_filter('woocommerce_product_variation_get_regular_price', [$this, 'convert_price'], 99);
            add_filter('woocommerce_product_variation_get_sale_price', [$this, 'convert_price'], 99);
            add_filter('woocommerce_get_price_decimals', [$this, 'force_decimals'], 99);
            add_action('woocommerce_checkout_create_order', [$this, 'attach_order_meta'], 10, 2);

            add_action('admin_menu', [$this, 'register_admin_page']);
            add_action('admin_post_ecommerco_ai_currency_save', [$this, 'save_settings']);
            add_action('rest_api_init', [$this, 'register_rest_routes']);
        }

        public function handle_currency_request(): void {
            if (!isset($_GET[self::QUERY_KEY])) {
                return;
            }

            $requested = strtoupper(sanitize_text_field(wp_unslash($_GET[self::QUERY_KEY])));
            if (!in_array($requested, [self::BASE_CURRENCY, self::TARGET_CURRENCY], true)) {
                return;
            }

            if (function_exists('WC') && WC()->session) {
                WC()->session->set(self::COOKIE_KEY, $requested);
            }

            setcookie(
                self::COOKIE_KEY,
                $requested,
                [
                    'expires' => time() + (DAY_IN_SECONDS * 30),
                    'path' => COOKIEPATH ? COOKIEPATH : '/',
                    'domain' => COOKIE_DOMAIN ?: '',
                    'secure' => is_ssl(),
                    'httponly' => false,
                    'samesite' => 'Lax',
                ]
            );
        }

        public function filter_currency(string $currency): string {
            $selected = $this->get_selected_currency();
            return $selected ?: $currency;
        }

        public function convert_price($price) {
            if ($price === '' || $price === null) {
                return $price;
            }

            $selected = $this->get_selected_currency();
            if ($selected !== self::TARGET_CURRENCY) {
                return $price;
            }

            $float_price = (float) $price;
            if ($float_price <= 0) {
                return $price;
            }

            $converted = $float_price / $this->get_rate();
            return (string) round($converted, 2);
        }

        public function force_decimals(int $decimals): int {
            $selected = $this->get_selected_currency();
            if ($selected === self::TARGET_CURRENCY || $selected === self::BASE_CURRENCY) {
                return 2;
            }
            return $decimals;
        }

        public function attach_order_meta($order, $data): void {
            $selected = $this->get_selected_currency();
            if ($selected) {
                $order->update_meta_data('_ecommerco_ai_selected_currency', $selected);
                $order->update_meta_data('_ecommerco_ai_rate', (string) $this->get_rate());
            }
        }

        private function get_rate(): float {
            $rate = (float) get_option('ecommerco_ai_aed_per_usd', (string) self::AED_PER_USD);
            return $rate > 0 ? $rate : self::AED_PER_USD;
        }

        private function get_selected_currency(): string {
            if (function_exists('WC') && WC()->session) {
                $session_value = WC()->session->get(self::COOKIE_KEY);
                if (in_array($session_value, [self::BASE_CURRENCY, self::TARGET_CURRENCY], true)) {
                    return $session_value;
                }
            }

            if (isset($_COOKIE[self::COOKIE_KEY])) {
                $cookie_value = strtoupper(sanitize_text_field(wp_unslash($_COOKIE[self::COOKIE_KEY])));
                if (in_array($cookie_value, [self::BASE_CURRENCY, self::TARGET_CURRENCY], true)) {
                    return $cookie_value;
                }
            }

            return self::BASE_CURRENCY;
        }

        public function register_rest_routes(): void {
            register_rest_route('ecommerco-ai/v1', '/bridge-config', [
                [
                    'methods' => 'GET',
                    'callback' => [$this, 'bridge_get_config'],
                    'permission_callback' => '__return_true',
                ],
                [
                    'methods' => 'POST',
                    'callback' => [$this, 'bridge_save_config'],
                    'permission_callback' => '__return_true',
                ],
            ]);
        }

        private function get_bridge_token(): string {
            $saved = get_option(self::BRIDGE_TOKEN_OPTION_KEY, 'admin123');
            if (!is_string($saved) || $saved === '') {
                return 'admin123';
            }
            return $saved;
        }

        private function is_bridge_authorized($request): bool {
            $header = $request->get_header('x-ecommerco-bridge-token');
            $token = is_string($header) && $header !== ''
                ? $header
                : (string) $request->get_param('token');
            return hash_equals($this->get_bridge_token(), $token);
        }

        public function bridge_get_config($request) {
            if (!$this->is_bridge_authorized($request)) {
                return new WP_REST_Response(['success' => false, 'error' => 'Unauthorized'], 401);
            }

            $config = get_option(self::BRIDGE_OPTION_KEY, []);
            if (!is_array($config)) {
                $config = [];
            }

            return new WP_REST_Response([
                'success' => true,
                'config' => $config,
            ], 200);
        }

        public function bridge_save_config($request) {
            if (!$this->is_bridge_authorized($request)) {
                return new WP_REST_Response(['success' => false, 'error' => 'Unauthorized'], 401);
            }

            $payload = $request->get_json_params();
            if (!is_array($payload)) {
                $payload = [];
            }

            $store = [];
            if (isset($payload['store']) && is_array($payload['store'])) {
                $store = $this->sanitize_store_payload($payload['store']);
            }

            $config = [
                'storeUrl' => isset($payload['storeUrl']) ? esc_url_raw((string) $payload['storeUrl']) : '',
                'consumerKey' => isset($payload['consumerKey']) ? sanitize_text_field((string) $payload['consumerKey']) : '',
                'consumerSecret' => isset($payload['consumerSecret']) ? sanitize_text_field((string) $payload['consumerSecret']) : '',
                'store' => $store,
            ];

            update_option(self::BRIDGE_OPTION_KEY, $config, false);

            return new WP_REST_Response([
                'success' => true,
            ], 200);
        }

        private function sanitize_store_payload(array $store): array {
            return [
                'storeName' => isset($store['storeName']) ? sanitize_text_field((string) $store['storeName']) : '',
                'tagline' => isset($store['tagline']) ? sanitize_text_field((string) $store['tagline']) : '',
                'currency' => isset($store['currency']) ? sanitize_text_field((string) $store['currency']) : 'AED',
                'usdRate' => isset($store['usdRate']) ? sanitize_text_field((string) $store['usdRate']) : '3.67',
                'whatsappNumber' => isset($store['whatsappNumber']) ? sanitize_text_field((string) $store['whatsappNumber']) : '',
                'contactEmail' => isset($store['contactEmail']) ? sanitize_email((string) $store['contactEmail']) : '',
                'contactPhone' => isset($store['contactPhone']) ? sanitize_text_field((string) $store['contactPhone']) : '',
                'address' => isset($store['address']) ? sanitize_text_field((string) $store['address']) : '',
                'facebookUrl' => isset($store['facebookUrl']) ? esc_url_raw((string) $store['facebookUrl']) : '',
                'instagramUrl' => isset($store['instagramUrl']) ? esc_url_raw((string) $store['instagramUrl']) : '',
                'developerName' => isset($store['developerName']) ? sanitize_text_field((string) $store['developerName']) : '',
                'developerUrl' => isset($store['developerUrl']) ? esc_url_raw((string) $store['developerUrl']) : '',
            ];
        }

        public function register_admin_page(): void {
            add_submenu_page(
                'woocommerce',
                'ecommerco.ai Currency',
                'ecommerco.ai Currency',
                'manage_woocommerce',
                'ecommerco-ai-currency',
                [$this, 'render_admin_page']
            );
        }

        public function render_admin_page(): void {
            if (!current_user_can('manage_woocommerce')) {
                return;
            }

            $rate = get_option('ecommerco_ai_aed_per_usd', (string) self::AED_PER_USD);
            ?>
            <div class="wrap">
                <h1 style="display:flex;align-items:center;gap:10px;">
                    <img src="<?php echo esc_url(plugin_dir_url(__FILE__) . 'assets/icon-e-yellow.svg'); ?>" alt="E icon" width="24" height="24" />
                    ecommerco.ai Currency Switcher
                </h1>
                <p>Brand currency plugin for WooCommerce. Default supports AED and USD.</p>
                <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                    <?php wp_nonce_field('ecommerco_ai_currency_save'); ?>
                    <input type="hidden" name="action" value="ecommerco_ai_currency_save" />
                    <table class="form-table" role="presentation">
                        <tr>
                            <th scope="row"><label for="ecommerco_ai_aed_per_usd">AED per 1 USD</label></th>
                            <td>
                                <input
                                    id="ecommerco_ai_aed_per_usd"
                                    name="ecommerco_ai_aed_per_usd"
                                    type="number"
                                    step="0.0001"
                                    min="0.0001"
                                    value="<?php echo esc_attr($rate); ?>"
                                />
                                <p class="description">Current default: 3.67</p>
                            </td>
                        </tr>
                    </table>
                    <?php submit_button('Save Rate'); ?>
                </form>
            </div>
            <?php
        }

        public function save_settings(): void {
            if (!current_user_can('manage_woocommerce')) {
                wp_die('Not allowed');
            }
            check_admin_referer('ecommerco_ai_currency_save');

            $rate = isset($_POST['ecommerco_ai_aed_per_usd'])
                ? (float) sanitize_text_field(wp_unslash($_POST['ecommerco_ai_aed_per_usd']))
                : self::AED_PER_USD;

            if ($rate <= 0) {
                $rate = self::AED_PER_USD;
            }

            update_option('ecommerco_ai_aed_per_usd', (string) $rate);
            wp_safe_redirect(admin_url('admin.php?page=ecommerco-ai-currency&saved=1'));
            exit;
        }
    }
}

new EcommercoAiCurrencySwitcher();
