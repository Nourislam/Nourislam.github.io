const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./main-DbBC--MV.js","./_commonjsHelpers-DsqdWQfm.js","./electron-B2DkM-hn.js","./electron-B7bZ2iFX.js","./imageService-DyuHgwzM.js","./fs-B8HR2l73.js","./clothing-BLOwHUmY.js","./ticketCode-CZY-Dpuq.js","./preload-helper-PPVm8Dsz.js","./preload-CK_3ruek.js","./images-DlII4rWv.js","./main-Bwu2N1yX.js","./main-BBEBDtU3.css"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{b as E,s as u}from"./fs-B8HR2l73.js";import{w as m}from"./electron-B7bZ2iFX.js";(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const d of t.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function l(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=l(e);fetch(e.href,t)}})();var p={};globalThis.global=globalThis;globalThis.Buffer=E.Buffer;globalThis.process=globalThis.process||{};Object.assign(globalThis.process,{platform:"win32",arch:"x64",env:{...p||{},NODE_ENV:"production"},versions:{electron:"33.0.0",chrome:"130.0.0"},argv:[],execPath:"/afus/app",resourcesPath:"/afus/resources",type:"browser",cwd:()=>"/afus",on:()=>{},once:()=>{},exit:()=>{},nextTick:(n,...a)=>queueMicrotask(()=>n(...a)),hrtime:Object.assign(()=>[0,0],{bigint:()=>BigInt(Date.now())*1000000n}),memoryUsage:()=>({}),uptime:()=>performance.now()/1e3,getSystemVersion:()=>"10.0",emitWarning:()=>{}});const f=`-- E-commerce Integration Schema
-- Two-way inventory sync with Shopify, WooCommerce, and Etsy

-- E-commerce platform connections
CREATE TABLE IF NOT EXISTS ecommerce_connections (
    id TEXT PRIMARY KEY,
    platform TEXT NOT NULL, -- 'shopify', 'woocommerce', 'etsy'
    store_name TEXT,
    store_url TEXT NOT NULL,
    api_key TEXT,
    api_secret TEXT,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at DATETIME,
    shop_id TEXT, -- Etsy shop ID
    location_id TEXT, -- Shopify inventory location ID
    is_active INTEGER DEFAULT 1,
    sync_enabled INTEGER DEFAULT 1,
    sync_interval_minutes INTEGER DEFAULT 15,
    last_sync_at DATETIME,
    last_sync_status TEXT, -- 'success', 'error', 'partial'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Product mappings between local and remote platforms
CREATE TABLE IF NOT EXISTS ecommerce_product_mappings (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    connection_id TEXT REFERENCES ecommerce_connections(id) ON DELETE CASCADE,
    remote_product_id TEXT NOT NULL,
    remote_variant_id TEXT, -- Shopify variant ID, WooCommerce variation ID
    remote_sku TEXT,
    remote_inventory_item_id TEXT, -- Shopify inventory item ID
    last_local_quantity INTEGER,
    last_remote_quantity INTEGER,
    last_synced_at DATETIME,
    sync_status TEXT DEFAULT 'synced', -- 'synced', 'pending_push', 'pending_pull', 'error', 'conflict'
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, connection_id)
);

-- Sync operation logs
CREATE TABLE IF NOT EXISTS ecommerce_sync_logs (
    id TEXT PRIMARY KEY,
    connection_id TEXT REFERENCES ecommerce_connections(id) ON DELETE CASCADE,
    sync_type TEXT NOT NULL, -- 'push', 'pull', 'full', 'webhook'
    trigger_type TEXT DEFAULT 'manual', -- 'manual', 'scheduled', 'webhook', 'stock_change'
    status TEXT NOT NULL, -- 'started', 'completed', 'failed', 'partial'
    products_pushed INTEGER DEFAULT 0,
    products_pulled INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    details TEXT, -- JSON with detailed sync results
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ecommerce_connections_platform ON ecommerce_connections(platform);
CREATE INDEX IF NOT EXISTS idx_ecommerce_connections_active ON ecommerce_connections(is_active);
CREATE INDEX IF NOT EXISTS idx_ecommerce_mappings_product ON ecommerce_product_mappings(product_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_mappings_connection ON ecommerce_product_mappings(connection_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_mappings_remote ON ecommerce_product_mappings(remote_product_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_mappings_status ON ecommerce_product_mappings(sync_status);
CREATE INDEX IF NOT EXISTS idx_ecommerce_sync_logs_connection ON ecommerce_sync_logs(connection_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_sync_logs_status ON ecommerce_sync_logs(status);
`,T=`-- Afus Boutique database schema (base tables; later changes are in init.js and migrations.js)

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#6366f1',
    icon TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    sku TEXT UNIQUE,
    barcode TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    supplier_id TEXT REFERENCES suppliers(id) ON DELETE SET NULL,
    price REAL NOT NULL,
    cost REAL DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 5,
    max_stock_level INTEGER DEFAULT 20,
    tax_rate REAL DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    image_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    loyalty_points INTEGER DEFAULT 0,
    total_spent REAL DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Employees
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    pin TEXT NOT NULL,
    role TEXT DEFAULT 'cashier',
    is_active INTEGER DEFAULT 1,
    avatar_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sales
CREATE TABLE IF NOT EXISTS sales (
    id TEXT PRIMARY KEY,
    receipt_number TEXT UNIQUE NOT NULL,
    employee_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
    customer_id TEXT REFERENCES customers(id) ON DELETE SET NULL,
    subtotal REAL NOT NULL,
    tax_amount REAL DEFAULT 0,
    discount_amount REAL DEFAULT 0,
    total REAL NOT NULL,
    status TEXT DEFAULT 'completed',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sale Items
CREATE TABLE IF NOT EXISTS sale_items (
    id TEXT PRIMARY KEY,
    sale_id TEXT REFERENCES sales(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    discount REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    total REAL NOT NULL
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    sale_id TEXT REFERENCES sales(id) ON DELETE CASCADE,
    method TEXT NOT NULL,
    amount REAL NOT NULL,
    reference TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Logs
CREATE TABLE IF NOT EXISTS inventory_logs (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    quantity_change INTEGER NOT NULL,
    quantity_before INTEGER NOT NULL,
    quantity_after INTEGER NOT NULL,
    reason TEXT,
    employee_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Held Transactions
CREATE TABLE IF NOT EXISTS held_transactions (
    id TEXT PRIMARY KEY,
    employee_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
    customer_id TEXT REFERENCES customers(id) ON DELETE SET NULL,
    items_json TEXT NOT NULL,
    subtotal REAL NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Shifts
CREATE TABLE IF NOT EXISTS shifts (
    id TEXT PRIMARY KEY,
    employee_id TEXT REFERENCES employees(id) ON DELETE CASCADE,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    opening_cash REAL DEFAULT 0,
    closing_cash REAL,
    notes TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_employee ON sales(employee_id);
CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product ON sale_items(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_product ON inventory_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_payments_sale ON payments(sale_id);

-- ================================================
-- PHASE 2: ADVANCED FEATURES
-- ================================================

-- Gift Cards
CREATE TABLE IF NOT EXISTS gift_cards (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    initial_balance REAL NOT NULL,
    current_balance REAL NOT NULL,
    customer_id TEXT REFERENCES customers(id) ON DELETE SET NULL,
    is_active INTEGER DEFAULT 1,
    expires_at DATETIME,
    created_by TEXT REFERENCES employees(id) ON DELETE SET NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Gift Card Transactions
CREATE TABLE IF NOT EXISTS gift_card_transactions (
    id TEXT PRIMARY KEY,
    gift_card_id TEXT REFERENCES gift_cards(id) ON DELETE CASCADE,
    sale_id TEXT REFERENCES sales(id) ON DELETE SET NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL, -- 'redeem', 'reload', 'refund'
    balance_before REAL NOT NULL,
    balance_after REAL NOT NULL,
    employee_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Promotions/Discounts
CREATE TABLE IF NOT EXISTS promotions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- 'percentage', 'fixed', 'bogo', 'bundle', 'threshold'
    value REAL, -- discount value (percentage or fixed amount)
    min_purchase REAL DEFAULT 0,
    max_discount REAL, -- cap on discount amount
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    start_date DATETIME,
    end_date DATETIME,
    is_active INTEGER DEFAULT 1,
    applies_to TEXT DEFAULT 'all', -- 'all', 'category', 'product'
    applies_to_ids TEXT, -- JSON array of category/product IDs
    coupon_code TEXT UNIQUE, -- optional coupon code
    auto_apply INTEGER DEFAULT 1, -- auto-apply or require code
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bundles
CREATE TABLE IF NOT EXISTS bundles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    bundle_price REAL NOT NULL,
    original_price REAL, -- sum of individual items
    savings REAL, -- calculated savings
    is_active INTEGER DEFAULT 1,
    deduct_component_stock INTEGER DEFAULT 0, -- If 1, deducts stock from individual items instead of bundle
    stock_quantity INTEGER DEFAULT 0,
    image_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bundle Items
CREATE TABLE IF NOT EXISTS bundle_items (
    id TEXT PRIMARY KEY,
    bundle_id TEXT REFERENCES bundles(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1
);

-- Receipts (for tracking print/email history)
CREATE TABLE IF NOT EXISTS receipts (
    id TEXT PRIMARY KEY,
    sale_id TEXT REFERENCES sales(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'print', 'email', 'pdf'
    email_to TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
    error_message TEXT,
    sent_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Email Templates
CREATE TABLE IF NOT EXISTS email_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    template_type TEXT DEFAULT 'receipt', -- 'receipt', 'gift_card', 'promotion'
    is_default INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Additional indexes for new tables
CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards(code);
CREATE INDEX IF NOT EXISTS idx_gift_cards_customer ON gift_cards(customer_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_trans_card ON gift_card_transactions(gift_card_id);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_bundles_active ON bundles(is_active);
CREATE INDEX IF NOT EXISTS idx_receipts_sale ON receipts(sale_id);

-- Quotations
CREATE TABLE IF NOT EXISTS quotations (
    id TEXT PRIMARY KEY,
    quote_number TEXT UNIQUE NOT NULL,
    customer_id TEXT REFERENCES customers(id) ON DELETE SET NULL,
    subtotal REAL NOT NULL,
    tax_amount REAL DEFAULT 0,
    discount_amount REAL DEFAULT 0,
    total REAL NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'active', -- active, converted, expired
    valid_until DATETIME,
    created_by TEXT REFERENCES employees(id) ON DELETE SET NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quotation_items (
    id TEXT PRIMARY KEY,
    quotation_id TEXT REFERENCES quotations(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    discount REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    total REAL NOT NULL
);

-- Returns
CREATE TABLE IF NOT EXISTS returns (
    id TEXT PRIMARY KEY,
    sale_id TEXT REFERENCES sales(id) ON DELETE CASCADE,
    return_number TEXT UNIQUE NOT NULL,
    total_refund REAL NOT NULL,
    reason TEXT,
    employee_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS return_items (
    id TEXT PRIMARY KEY,
    return_id TEXT REFERENCES returns(id) ON DELETE CASCADE,
    sale_item_id TEXT REFERENCES sale_items(id) ON DELETE SET NULL,
    product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    refund_amount REAL NOT NULL,
    condition TEXT DEFAULT 'sellable' -- 'sellable', 'damaged'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_quotations_customer ON quotations(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotation_items_quote ON quotation_items(quotation_id);
CREATE INDEX IF NOT EXISTS idx_returns_sale ON returns(sale_id);
CREATE INDEX IF NOT EXISTS idx_return_items_return ON return_items(return_id);

-- ================================================
-- PHASE 4: SUPPLIER PO SYSTEM
-- ================================================

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    website TEXT,
    notes TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Orders (Supplier Quotes)
CREATE TABLE IF NOT EXISTS purchase_orders (
    id TEXT PRIMARY KEY,
    po_number TEXT UNIQUE NOT NULL,
    supplier_id TEXT REFERENCES suppliers(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'draft', -- draft, sent, received, cancelled
    expected_date DATETIME,
    subtotal REAL DEFAULT 0,
    tax_rate REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    discount_type TEXT DEFAULT 'fixed',
    discount_value REAL DEFAULT 0,
    shipping_cost REAL DEFAULT 0,
    total REAL DEFAULT 0,
    amount_paid REAL DEFAULT 0, -- Track separate from status
    payment_status TEXT DEFAULT 'unpaid',
    notes TEXT,
    created_by TEXT REFERENCES employees(id) ON DELETE SET NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
    id TEXT PRIMARY KEY,
    purchase_order_id TEXT REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL, -- snapshot in case product is deleted
    quantity INTEGER NOT NULL,
    unit_cost REAL DEFAULT 0, -- cost at time of PO
    tax_rate REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    discount_amount REAL DEFAULT 0,
    total_cost REAL DEFAULT 0
);

-- Indexes for Supplier System
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_po_items_po ON purchase_order_items(purchase_order_id);

-- Supplier Payments
CREATE TABLE IF NOT EXISTS supplier_payments (
    id TEXT PRIMARY KEY,
    purchase_order_id TEXT REFERENCES purchase_orders(id) ON DELETE CASCADE,
    supplier_id TEXT REFERENCES suppliers(id) ON DELETE CASCADE,
    amount REAL NOT NULL,
    payment_method TEXT NOT NULL,
    reference TEXT,
    notes TEXT,
    paid_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES employees(id)
);

-- Purchase Returns (Return to Vendor)
CREATE TABLE IF NOT EXISTS purchase_returns (
    id TEXT PRIMARY KEY,
    return_number TEXT UNIQUE NOT NULL,
    purchase_order_id TEXT REFERENCES purchase_orders(id) ON DELETE SET NULL,
    supplier_id TEXT REFERENCES suppliers(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'draft', -- draft, sent, completed
    total_amount REAL NOT NULL,
    notes TEXT,
    created_by TEXT REFERENCES employees(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchase_return_items (
    id TEXT PRIMARY KEY,
    return_id TEXT REFERENCES purchase_returns(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_cost REAL NOT NULL,
    reason TEXT
);

-- Indexes for Returns
CREATE INDEX IF NOT EXISTS idx_supplier_payments_supplier ON supplier_payments(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_returns_supplier ON purchase_returns(supplier_id);

-- Goods Receiving (GRN)
CREATE TABLE IF NOT EXISTS receivings (
    id TEXT PRIMARY KEY,
    receive_number TEXT UNIQUE NOT NULL,
    purchase_order_id TEXT REFERENCES purchase_orders(id) ON DELETE SET NULL,
    supplier_id TEXT REFERENCES suppliers(id) ON DELETE SET NULL,
    received_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'completed', -- completed (stock added)
    notes TEXT,
    created_by TEXT REFERENCES employees(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS receiving_items (
    id TEXT PRIMARY KEY,
    receiving_id TEXT REFERENCES receivings(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity_ordered INTEGER NOT NULL,
    quantity_received INTEGER NOT NULL,
    condition TEXT DEFAULT 'good'
);

CREATE INDEX IF NOT EXISTS idx_receivings_po ON receivings(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_receiving_items_receiving ON receiving_items(receiving_id);

-- Supplier Invoices
CREATE TABLE IF NOT EXISTS supplier_invoices (
    id TEXT PRIMARY KEY,
    purchase_order_id TEXT REFERENCES purchase_orders(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL,
    invoice_date DATETIME NOT NULL,
    due_date DATETIME,
    subtotal REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    total_amount REAL DEFAULT 0,
    match_status TEXT DEFAULT 'pending', -- pending, matched, mismatched
    payment_status TEXT DEFAULT 'unpaid', -- unpaid, partial, paid
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_supplier_invoices_po ON supplier_invoices(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_supplier_invoices_number ON supplier_invoices(invoice_number);


-- ================================================
-- PHASE 5: CREDIT SALE SYSTEM
-- ================================================

-- Add credit fields to customers table (via separate ALTER commands for compatibility)
-- Note: SQLite doesn't support ADD COLUMN IF NOT EXISTS, so we handle in init.js

-- Credit Sales (sales made on credit)
CREATE TABLE IF NOT EXISTS credit_sales (
    id TEXT PRIMARY KEY,
    sale_id TEXT REFERENCES sales(id) ON DELETE CASCADE,
    customer_id TEXT REFERENCES customers(id),
    invoice_number TEXT UNIQUE NOT NULL,
    amount_due REAL NOT NULL,
    amount_paid REAL DEFAULT 0,
    status TEXT DEFAULT 'pending', -- 'pending', 'partial', 'paid', 'overdue'
    due_date DATETIME NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Credit Payments (payments against credit sales)
CREATE TABLE IF NOT EXISTS credit_payments (
    id TEXT PRIMARY KEY,
    credit_sale_id TEXT REFERENCES credit_sales(id) ON DELETE CASCADE,
    amount REAL NOT NULL,
    payment_method TEXT NOT NULL,
    reference TEXT,
    received_by TEXT REFERENCES employees(id),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Credit Sales
CREATE INDEX IF NOT EXISTS idx_credit_sales_customer ON credit_sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_credit_sales_status ON credit_sales(status);
CREATE INDEX IF NOT EXISTS idx_credit_sales_due_date ON credit_sales(due_date);
CREATE INDEX IF NOT EXISTS idx_credit_payments_sale ON credit_payments(credit_sale_id);
`,_=`{
  "companyName": "Afus",
  "productName": "Afus Boutique",
  "shortName": "Afus",
  "appId": "dz.afus.boutique",
  "packageName": "afus-boutique",
  "executableName": "AfusBoutique",
  "dataDirName": "AfusBoutique",
  "databaseFile": "afus-boutique.db",
  "fileSlug": "afus-boutique"
}
`,A=`/**
 * What to buy next, from what sold: the same rules in the window (the buying
 * plan of an article) and in the main process (tests, reports).
 *
 * mix(items, key): for each size (or colour) the share of the pieces sold
 * (demand) and the share of the pieces that were there to sell (supply =
 * sold + left in stock). Demand above supply by more than 5 points: buy more
 * of it next time; below: buy less. Under MIN_SOLD pieces sold in all, the
 * figures are too thin to advise.
 *
 * plan(cells, total): split \`total\` new pieces between the colours / sizes in
 * proportion to what sold (a colour / size never sold still gets its small
 * share), in whole pieces that add up exactly to \`total\`.
 */
export const MIN_SOLD = 10;
const GAP = 0.05;

export function mix(items, key) {
    const groups = new Map();
    for (const item of items || []) {
        const k = item[key];
        if (k === null || k === undefined || k === '') continue;
        const g = groups.get(k) || { key: k, sold: 0, stock: 0 };
        g.sold += Math.max(0, Number(item.sold) || 0);
        g.stock += Math.max(0, Number(item.stock) || 0);
        groups.set(k, g);
    }
    const rows = [...groups.values()];
    const sold = rows.reduce((t, r) => t + r.sold, 0);
    const supply = rows.reduce((t, r) => t + r.sold + r.stock, 0);
    const enough = sold >= MIN_SOLD;
    return {
        sold,
        enough,
        rows: rows.map(r => {
            const demand = sold > 0 ? r.sold / sold : 0;
            const offer = supply > 0 ? (r.sold + r.stock) / supply : 0;
            const advice = !enough ? 'unknown' : demand - offer > GAP ? 'up' : offer - demand > GAP ? 'down' : 'same';
            return { ...r, demand, supply: offer, advice };
        }),
    };
}

/** cells: [{ id, sold }] -> [{ id, quantity }] adding up to total. */
export function plan(cells, total) {
    const n = Math.max(0, Math.floor(Number(total) || 0));
    const list = (cells || []).filter(c => c && c.id !== undefined);
    if (!n || !list.length) return list.map(c => ({ id: c.id, quantity: 0 }));
    // Half a piece added to each: a colour / size never sold is not dropped
    const weights = list.map(c => Math.max(0, Number(c.sold) || 0) + 0.5);
    const sum = weights.reduce((t, w) => t + w, 0);
    const exact = weights.map(w => (w / sum) * n);
    const out = exact.map(Math.floor);
    let left = n - out.reduce((t, q) => t + q, 0);
    // Largest remainders first, then the best sellers
    const order = exact.map((e, i) => ({ i, rest: e - Math.floor(e), w: weights[i] }))
        .sort((a, b) => b.rest - a.rest || b.w - a.w);
    for (let k = 0; left > 0; k = (k + 1) % order.length, left--) out[order[k].i]++;
    return list.map((c, i) => ({ id: c.id, quantity: out[i] }));
}
`,S=`{
  "colors": [
    { "code": "black", "sku": "BLK", "hex": "#111111", "en": "Black", "fr": "Noir", "ar": "أسود" },
    { "code": "white", "sku": "WHT", "hex": "#f5f5f5", "en": "White", "fr": "Blanc", "ar": "أبيض" },
    { "code": "grey", "sku": "GRY", "hex": "#8a8a8a", "en": "Grey", "fr": "Gris", "ar": "رمادي" },
    { "code": "navy", "sku": "NVY", "hex": "#1f2a52", "en": "Navy", "fr": "Bleu marine", "ar": "كحلي" },
    { "code": "blue", "sku": "BLU", "hex": "#2563eb", "en": "Blue", "fr": "Bleu", "ar": "أزرق" },
    { "code": "skyblue", "sku": "SKY", "hex": "#7dd3fc", "en": "Sky blue", "fr": "Bleu ciel", "ar": "أزرق سماوي" },
    { "code": "red", "sku": "RED", "hex": "#dc2626", "en": "Red", "fr": "Rouge", "ar": "أحمر" },
    { "code": "burgundy", "sku": "BRG", "hex": "#7f1d1d", "en": "Burgundy", "fr": "Bordeaux", "ar": "عنابي" },
    { "code": "pink", "sku": "PNK", "hex": "#f472b6", "en": "Pink", "fr": "Rose", "ar": "وردي" },
    { "code": "green", "sku": "GRN", "hex": "#16a34a", "en": "Green", "fr": "Vert", "ar": "أخضر" },
    { "code": "khaki", "sku": "KHK", "hex": "#8b8456", "en": "Khaki", "fr": "Kaki", "ar": "كاكي" },
    { "code": "yellow", "sku": "YLW", "hex": "#facc15", "en": "Yellow", "fr": "Jaune", "ar": "أصفر" },
    { "code": "orange", "sku": "ORG", "hex": "#f97316", "en": "Orange", "fr": "Orange", "ar": "برتقالي" },
    { "code": "purple", "sku": "PRP", "hex": "#7c3aed", "en": "Purple", "fr": "Violet", "ar": "بنفسجي" },
    { "code": "brown", "sku": "BRN", "hex": "#7c4a24", "en": "Brown", "fr": "Marron", "ar": "بني" },
    { "code": "camel", "sku": "CML", "hex": "#c19a6b", "en": "Camel", "fr": "Camel", "ar": "جملي" },
    { "code": "beige", "sku": "BEG", "hex": "#e7d8b9", "en": "Beige", "fr": "Beige", "ar": "بيج" },
    { "code": "cream", "sku": "CRM", "hex": "#fff8e7", "en": "Cream", "fr": "Crème", "ar": "كريمي" },
    { "code": "gold", "sku": "GLD", "hex": "#d4af37", "en": "Gold", "fr": "Doré", "ar": "ذهبي" },
    { "code": "silver", "sku": "SLV", "hex": "#c0c0c0", "en": "Silver", "fr": "Argenté", "ar": "فضي" },
    { "code": "multicolor", "sku": "MLT", "hex": "linear-gradient(135deg,#ef4444,#f59e0b,#22c55e,#3b82f6)", "en": "Multicolour", "fr": "Multicolore", "ar": "متعدد الألوان" }
  ],
  "sizeSets": [
    { "code": "letters", "en": "Letters (XS–XXXL)", "fr": "Lettres (XS–XXXL)", "ar": "حروف (XS–XXXL)", "sizes": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] },
    { "code": "eu", "en": "European 36–54", "fr": "Européennes 36–54", "ar": "أوروبية 36–54", "sizes": ["36", "38", "40", "42", "44", "46", "48", "50", "52", "54"] },
    { "code": "jeans", "en": "Jeans 28–40", "fr": "Jeans 28–40", "ar": "جينز 28–40", "sizes": ["28", "30", "32", "34", "36", "38", "40"] },
    { "code": "shoes", "en": "Shoes 36–46", "fr": "Chaussures 36–46", "ar": "أحذية 36–46", "sizes": ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"] },
    { "code": "kids", "en": "Children (age)", "fr": "Enfants (âge)", "ar": "أطفال (حسب العمر)", "sizes": ["2Y", "4Y", "6Y", "8Y", "10Y", "12Y", "14Y", "16Y"] },
    { "code": "baby", "en": "Baby (months)", "fr": "Bébé (mois)", "ar": "رضّع (بالأشهر)", "sizes": ["0M", "3M", "6M", "9M", "12M", "18M", "24M"] },
    { "code": "onesize", "en": "One size", "fr": "Taille unique", "ar": "مقاس واحد", "sizes": ["TU"] }
  ],
  "sizeLabels": {
    "TU": { "en": "One size", "fr": "Taille unique", "ar": "مقاس واحد" }
  },
  "genders": [
    { "code": "men", "en": "Men", "fr": "Homme", "ar": "رجال" },
    { "code": "women", "en": "Women", "fr": "Femme", "ar": "نساء" },
    { "code": "unisex", "en": "Unisex", "fr": "Mixte", "ar": "للجنسين" },
    { "code": "boys", "en": "Boys", "fr": "Garçon", "ar": "أولاد" },
    { "code": "girls", "en": "Girls", "fr": "Fille", "ar": "بنات" },
    { "code": "baby", "en": "Baby", "fr": "Bébé", "ar": "رضّع" }
  ],
  "seasons": [
    { "code": "summer", "en": "Summer", "fr": "Été", "ar": "صيف" },
    { "code": "winter", "en": "Winter", "fr": "Hiver", "ar": "شتاء" },
    { "code": "midseason", "en": "Spring / Autumn", "fr": "Mi-saison", "ar": "ربيع / خريف" },
    { "code": "eid", "en": "Eid", "fr": "Aïd", "ar": "العيد" },
    { "code": "back_to_school", "en": "Back to school", "fr": "Rentrée scolaire", "ar": "الدخول المدرسي" },
    { "code": "ramadan", "en": "Ramadan", "fr": "Ramadan", "ar": "رمضان" },
    { "code": "wedding", "en": "Weddings", "fr": "Mariages", "ar": "الأعراس" },
    { "code": "all_year", "en": "All year", "fr": "Toute l'année", "ar": "طوال السنة" }
  ],
  "categories": [
    { "code": "tshirts", "en": "T-shirts", "fr": "T-shirts", "ar": "تيشيرتات", "color": "#3b82f6", "sizeSet": "letters" },
    { "code": "shirts", "en": "Shirts", "fr": "Chemises", "ar": "قمجات", "color": "#6366f1", "sizeSet": "letters" },
    { "code": "polos", "en": "Polos", "fr": "Polos", "ar": "بولو", "color": "#0ea5e9", "sizeSet": "letters" },
    { "code": "trousers", "en": "Trousers", "fr": "Pantalons", "ar": "سراويل", "color": "#0891b2", "sizeSet": "eu" },
    { "code": "jeans", "en": "Jeans", "fr": "Jeans", "ar": "دجين", "color": "#1d4ed8", "sizeSet": "jeans" },
    { "code": "shorts", "en": "Shorts", "fr": "Shorts", "ar": "شورتات", "color": "#14b8a6", "sizeSet": "letters" },
    { "code": "jackets", "en": "Jackets", "fr": "Vestes & blousons", "ar": "جاكيتات", "color": "#f59e0b", "sizeSet": "letters" },
    { "code": "coats", "en": "Coats", "fr": "Manteaux", "ar": "معاطف", "color": "#b45309", "sizeSet": "letters" },
    { "code": "hoodies", "en": "Hoodies & sweatshirts", "fr": "Sweats & hoodies", "ar": "سويتات وهوديات", "color": "#8b5cf6", "sizeSet": "letters" },
    { "code": "tracksuits", "en": "Tracksuits", "fr": "Survêtements", "ar": "بدلات رياضية", "color": "#22c55e", "sizeSet": "letters" },
    { "code": "dresses", "en": "Dresses", "fr": "Robes", "ar": "فساتين", "color": "#ec4899", "sizeSet": "eu" },
    { "code": "skirts", "en": "Skirts", "fr": "Jupes", "ar": "تنورات", "color": "#db2777", "sizeSet": "eu" },
    { "code": "traditional", "en": "Traditional wear", "fr": "Tenues traditionnelles", "ar": "اللباس التقليدي", "color": "#a16207", "sizeSet": "letters" },
    { "code": "abayas", "en": "Abayas & djellabas", "fr": "Abayas & djellabas", "ar": "عبايات وجلابات", "color": "#78350f", "sizeSet": "letters" },
    { "code": "underwear", "en": "Underwear & socks", "fr": "Sous-vêtements & chaussettes", "ar": "ملابس داخلية وتقاشر", "color": "#64748b", "sizeSet": "letters" },
    { "code": "pyjamas", "en": "Pyjamas", "fr": "Pyjamas", "ar": "بيجامات", "color": "#a78bfa", "sizeSet": "letters" },
    { "code": "kids", "en": "Children's clothing", "fr": "Vêtements enfants", "ar": "ملابس الأطفال", "color": "#f472b6", "sizeSet": "kids" },
    { "code": "baby", "en": "Baby clothing", "fr": "Vêtements bébé", "ar": "ملابس الرضّع", "color": "#fda4af", "sizeSet": "baby" },
    { "code": "shoes", "en": "Shoes", "fr": "Chaussures", "ar": "أحذية", "color": "#ef4444", "sizeSet": "shoes" },
    { "code": "bags", "en": "Bags", "fr": "Sacs", "ar": "حقائب", "color": "#10b981", "sizeSet": "onesize" },
    { "code": "belts", "en": "Belts", "fr": "Ceintures", "ar": "أحزمة", "color": "#92400e", "sizeSet": "onesize" },
    { "code": "caps", "en": "Caps & hats", "fr": "Casquettes & chapeaux", "ar": "كاسكيطات وقبعات", "color": "#0d9488", "sizeSet": "onesize" },
    { "code": "scarves", "en": "Scarves & hijabs", "fr": "Écharpes & foulards", "ar": "شاشات وخمارات", "color": "#c026d3", "sizeSet": "onesize" },
    { "code": "accessories", "en": "Accessories", "fr": "Accessoires", "ar": "إكسسوارات", "color": "#6b7280", "sizeSet": "onesize" }
  ],
  "defaultCategories": ["tshirts", "shirts", "trousers", "jeans", "jackets", "dresses", "kids", "shoes", "bags", "accessories"],
  "brands": [
    "Nike", "Adidas", "Puma", "New Balance", "Reebok", "Under Armour", "Skechers", "Converse", "Vans", "Fila", "Kappa", "Lotto",
    "Zara", "Pull&Bear", "Bershka", "Stradivarius", "Massimo Dutti", "Mango", "H&M", "Celio", "Jules", "Kiabi",
    "LC Waikiki", "DeFacto", "Koton", "Mavi", "Colin's",
    "Lacoste", "Tommy Hilfiger", "Calvin Klein", "Ralph Lauren", "Hugo Boss", "Guess", "Levi's", "Diesel", "The North Face", "Timberland"
  ]
}
`,b=`# communes.json

The 1541 communes of Algeria's 58 wilayas, \`{ "<wilaya number>": [[latin name, Arabic name], ...] }\`,
sorted by Latin name. Official administrative names (Ministry of the Interior), taken from the
compilation published at https://github.com/othmanus/algeria-cities (json/algeria_cities.json),
reduced to the two names. Facts of public administration; kept unchanged.
`,y=`{"1":[["Adrar","أدرار"],["Akabli","اقبلي"],["Aoulef","أولف"],["Bouda","بودة"],["Fenoughil","فنوغيل"],["In Zghmir","إن زغمير"],["Ouled Ahmed Timmi","أولاد أحمد تيمي"],["Reggane","رقان"],["Sali","سالي"],["Sebaa","السبع"],["Tamantit","تامنطيط"],["Tamest","تامست"],["Timekten","تيمقتن"],["Tit","تيت"],["Tsabit","تسابيت"],["Zaouiet Kounta","زاوية كنتة"]],"2":[["Abou El Hassane","أبو الحسن"],["Ain Merane","عين مران"],["Benairia","بنايرية"],["Beni  Bouattab","بني بوعتاب"],["Beni Haoua","بني حواء"],["Beni Rached","بني راشد"],["Boukadir","بوقادير"],["Bouzeghaia","بوزغاية"],["Breira","بريرة"],["Chettia","الشطية"],["Chlef","الشلف"],["Dahra","الظهرة"],["El Hadjadj","الحجاج"],["El Karimia","الكريمية"],["El Marsa","المرسى"],["Harchoun","حرشون"],["Herenfa","الهرانفة"],["Labiod Medjadja","الأبيض مجاجة"],["Moussadek","مصدق"],["Oued Fodda","وادي الفضة"],["Oued Goussine","وادي قوسين"],["Oued Sly","وادي سلي"],["Ouled Abbes","أولاد عباس"],["Ouled Ben Abdelkader","أولاد بن عبد القادر"],["Ouled Fares","أولاد فارس"],["Oum Drou","أم الدروع"],["Sendjas","سنجاس"],["Sidi Abderrahmane","سيدي عبد الرحمن"],["Sidi Akkacha","سيدي عكاشة"],["Sobha","الصبحة"],["Tadjena","تاجنة"],["Talassa","تلعصة"],["Taougrit","تاوقريت"],["Tenes","تنس"],["Zeboudja","الزبوجة"]],"3":[["Aflou","أفلو"],["Ain Madhi","عين ماضي"],["Ain Sidi Ali","عين سيدي علي"],["Benacer Benchohra","بن ناصر بن شهرة"],["Brida","بريدة"],["El Assafia","العسافية"],["El Beidha","البيضاء"],["El Ghicha","الغيشة"],["El Haouaita","الحويطة"],["Gueltat Sidi Saad","قلتة سيدي سعد"],["Hadj Mechri","الحاج مشري"],["Hassi Delaa","حاسي الدلاعة"],["Hassi R'mel","حاسي الرمل"],["Kheneg","الخنق"],["Ksar El Hirane","قصر الحيران"],["Laghouat","الأغواط"],["Oued M'zi","وادي مزي"],["Oued Morra","وادي مرة"],["Sebgag","سبقاق"],["Sidi Bouzid","سيدي بوزيد"],["Sidi Makhlouf","سيدي مخلوف"],["Tadjemout","تاجموت"],["Tadjrouna","تاجرونة"],["Taouiala","تاويالة"]],"4":[["Ain Babouche","عين ببوش"],["Ain Beida","عين البيضاء"],["Ain Diss","عين الديس"],["Ain Fekroun","عين فكرون"],["Ain Kercha","عين كرشة"],["Ain M'lila","عين مليلة"],["Ain Zitoun","عين الزيتون"],["Behir Chergui","بحير الشرقي"],["Berriche","بريش"],["Bir Chouhada","بئر الشهداء"],["Dhalaa","الضلعة"],["El Amiria","العامرية"],["El Belala","البلالة"],["El Djazia","الجازية"],["El Fedjoudj Boughrara Sa","الفجوج بوغرارة سعودي"],["El Harmilia","الحرملية"],["Fkirina","فكيرينة"],["Hanchir Toumghani","هنشير تومغني"],["Ksar Sbahi","قصر الصباحي"],["Meskiana","مسكيانة"],["Oued Nini","وادي نيني"],["Ouled Gacem","أولاد قاسم"],["Ouled Hamla","أولاد حملة"],["Ouled Zouai","أولاد زواي"],["Oum El Bouaghi","أم البواقي"],["Rahia","الرحية"],["Sigus","سيقوس"],["Souk Naamane","سوق نعمان"],["Zorg","الزرق"]],"5":[["Ain Djasser","عين جاسر"],["Ain Touta","عين التوتة"],["Ain Yagout","عين ياقوت"],["Arris","أريس"],["Azil Abedelkader","عزيل عبد القادر"],["Barika","بريكة"],["Batna","باتنة"],["Beni Foudhala El Hakania","بني فضالة الحقانية"],["Bitam","بيطام"],["Boulhilat","بولهيلات"],["Boumagueur","بومقر"],["Boumia","بومية"],["Bouzina","بوزينة"],["Chemora","الشمرة"],["Chir","شير"],["Djerma","جرمة"],["Djezzar","الجزار"],["El Hassi","الحاسي"],["El Madher","المعذر"],["Fesdis","فسديس"],["Foum Toub","فم الطوب"],["Ghassira","غسيرة"],["Gosbat","القصبات"],["Guigba","القيقبة"],["Hidoussa","حيدوسة"],["Ichemoul","إشمول"],["Inoughissen","إينوغيسن"],["Kimmel","كيمل"],["Ksar Bellezma","قصر بلزمة"],["Larbaa","لارباع"],["Lazrou","لازرو"],["Lemcene","لمسان"],["M Doukal","إمدوكل"],["Maafa","معافة"],["Menaa","منعة"],["Merouana","مروانة"],["N Gaous","نقاوس"],["Oued Chaaba","وادي الشعبة"],["Oued El Ma","وادي الماء"],["Oued Taga","وادي الطاقة"],["Ouled Ammar","أولاد عمار"],["Ouled Aouf","أولاد عوف"],["Ouled Fadel","أولاد فاضل"],["Ouled Sellem","أولاد سلام"],["Ouled Si Slimane","أولاد سي سليمان"],["Ouyoun El Assafir","عيون العصافير"],["Rahbat","الرحبات"],["Ras El Aioun","رأس العيون"],["Sefiane","سفيان"],["Seggana","سقانة"],["Seriana","سريانة"],["T Kout","تكوت"],["Talkhamt","تالخمت"],["Taxlent","تاكسلانت"],["Tazoult","تازولت"],["Teniet El Abed","ثنية العابد"],["Tighanimine","تيغانمين"],["Tigharghar","تغرغار"],["Tilatou","تيلاطو"],["Timgad","تيمقاد"],["Zanet El Beida","زانة البيضاء"]],"6":[["Adekar","أدكار"],["Ait R'zine","أيت رزين"],["Ait-Smail","أيت إسماعيل"],["Akbou","أقبو"],["Akfadou","أكفادو"],["Amalou","أمالو"],["Amizour","أميزور"],["Aokas","أوقاس"],["Barbacha","برباشة"],["Bejaia","بجاية"],["Beni Djellil","بني جليل"],["Beni K'sila","بني كسيلة"],["Beni-Mallikeche","بني مليكش"],["Benimaouche","بني معوش"],["Boudjellil","بو جليل"],["Bouhamza","بوحمزة"],["Boukhelifa","بوخليفة"],["Chellata","شلاطة"],["Chemini","شميني"],["Darguina","درقينة"],["Dra El Caid","ذراع القايد"],["El Kseur","القصر"],["Fenaia Il Maten","فناية الماثن"],["Feraoun","فرعون"],["Ighil-Ali","إغيل علي"],["Ighram","اغرم"],["Kendira","كنديرة"],["Kherrata","خراطة"],["Leflaye","الفلاي"],["M'cisna","مسيسنة"],["Melbou","مالبو"],["Oued Ghir","وادي غير"],["Ouzellaguen","أوزلاقن"],["Seddouk","صدوق"],["Sidi Ayad","سيدي عياد"],["Sidi-Aich","سيدي عيش"],["Smaoun","سمعون"],["Souk El Tenine","سوق لإثنين"],["Souk Oufella","سوق اوفلا"],["Tala Hamza","تالة حمزة"],["Tamokra","تامقرة"],["Tamridjet","تامريجت"],["Taourit Ighil","تاوريرت إغيل"],["Taskriout","تاسكريوت"],["Tazmalt","تازمالت"],["Tibane","طيبان"],["Tichy","تيشي"],["Tifra","تيفرة"],["Timezrit","تيمزريت"],["Tinebdar","تينبدار"],["Tizi-N'berber","تيزي نبربر"],["Toudja","توجة"]],"7":[["Ain Naga","عين الناقة"],["Ain Zaatout","عين زعطوط"],["Biskra","بسكرة"],["Bordj Ben Azzouz","برج بن عزوز"],["Bouchakroun","بوشقرون"],["Branis","برانيس"],["Chetma","شتمة"],["Djemorah","جمورة"],["El Feidh","الفيض"],["El Ghrous","الغروس"],["El Hadjab","الحاجب"],["El Haouch","الحوش"],["El Kantara","القنطرة"],["El Outaya","الوطاية"],["Foughala","فوغالة"],["Khenguet Sidi Nadji","خنقة سيدي ناجي"],["Lichana","ليشانة"],["Lioua","ليوة"],["M'chouneche","مشونش"],["M'lili","مليلي"],["Mekhadma","مخادمة"],["Meziraa","المزيرعة"],["Oumache","أوماش"],["Ourlal","أورلال"],["Sidi Okba","سيدي عقبة"],["Tolga","طولقة"],["Zeribet El Oued","زريبة الوادي"]],"8":[["Abadla","العبادلة"],["Bechar","بشار"],["Beni-Ounif","بني ونيف"],["Boukais","بوكايس"],["Erg-Ferradj","عرق فراج"],["Kenadsa","القنادسة"],["Lahmar","لحمر"],["Machraa-Houari-Boumediene","مشرع هواري بومدين"],["Meridja","المريجة"],["Mogheul","موغل"],["Tabelbala","تبلبالة"],["Taghit","تاغيت"]],"9":[["Ain Romana","عين الرمانة"],["Beni Mered","بني مراد"],["Beni-Tamou","بني تامو"],["Benkhelil","بن خليل"],["Blida","البليدة"],["Bouarfa","بوعرفة"],["Boufarik","بوفاريك"],["Bougara","بوقرة"],["Bouinan","بوعينان"],["Chebli","الشبلي"],["Chiffa","الشفة"],["Chrea","الشريعة"],["Djebabra","جبابرة"],["El-Affroun","العفرون"],["Guerrouaou","قرواو"],["Hammam Elouane","حمام ملوان"],["Larbaa","الأربعاء"],["Meftah","مفتاح"],["Mouzaia","موزاية"],["Oued  Djer","وادي جر"],["Oued El Alleug","وادي العلايق"],["Ouled Slama","اولاد سلامة"],["Ouled Yaich","أولاد يعيش"],["Souhane","صوحان"],["Soumaa","الصومعة"]],"10":[["Aghbalou","أغبالو"],["Ahl El Ksar","أهل القصر"],["Ain El Hadjar","عين الحجر"],["Ain Laloui","عين العلوي"],["Ain Turk","عين الترك"],["Ain-Bessem","عين بسام"],["Ait Laaziz","أيت لعزيز"],["Aomar","أعمر"],["Ath Mansour","آث  منصور"],["Bechloul","بشلول"],["Bir Ghbalou","بئر غبالو"],["Bordj Okhriss","برج أوخريص"],["Bouderbala","بودربالة"],["Bouira","البويرة"],["Boukram","بوكرم"],["Chorfa","شرفة"],["Dechmia","الدشمية"],["Dirah","ديرة"],["Djebahia","جباحية"],["El Adjiba","العجيبة"],["El Asnam","الأسنام"],["El Hachimia","الهاشمية"],["El Khabouzia","الخبوزية"],["El-Hakimia","الحاكمية"],["El-Mokrani","المقراني"],["Guerrouma","قرومة"],["Hadjera Zerga","الحجرة الزرقاء"],["Haizer","حيزر"],["Hanif","حنيف"],["Kadiria","قادرية"],["Lakhdaria","الأخضرية"],["M Chedallah","أمشدالة"],["Maala","معلة"],["Maamora","المعمورة"],["Mezdour","مزدور"],["Oued El Berdi","وادي البردي"],["Ouled Rached","أولاد راشد"],["Raouraoua","روراوة"],["Ridane","ريدان"],["Saharidj","سحاريج"],["Souk El Khemis","سوق الخميس"],["Sour El Ghozlane","سور الغزلان"],["Taghzout","تاغزوت"],["Taguedite","تاقديت"],["Z'barbar (El Isseri )","زبربر"]],"11":[["Abelsa","ابلسة"],["Ain Amguel","عين امقل"],["Idles","أدلس"],["Tamanrasset","تمنراست"],["Tazrouk","تاظروك"]],"12":[["Ain Zerga","عين الزرقاء"],["Bedjene","بجن"],["Bekkaria","بكارية"],["Bir Dheheb","بئر الذهب"],["Bir Mokkadem","بئر مقدم"],["Bir-El-Ater","بئر العاتر"],["Boukhadra","بوخضرة"],["Boulhaf Dyr","بولحاف الدير"],["Cheria","الشريعة"],["El Kouif","الكويف"],["El Malabiod","الماء الابيض"],["El Meridj","المريج"],["El Mezeraa","المزرعة"],["El Ogla","العقلة"],["El Ogla El Malha","العقلة المالحة"],["El-Aouinet","العوينات"],["El-Houidjbet","الحويجبات"],["Ferkane","فركان"],["Guorriguer","قريقر"],["Hammamet","الحمامات"],["Morsott","مرسط"],["Negrine","نقرين"],["Ouenza","الونزة"],["Oum Ali","أم علي"],["Saf Saf El Ouesra","صفصاف الوسرى"],["Stah Guentis","سطح قنطيس"],["Tebessa","تبسة"],["Telidjen","ثليجان"]],"13":[["Ain Fetah","عين فتاح"],["Ain Fezza","عين فزة"],["Ain Ghoraba","عين غرابة"],["Ain Kebira","عين الكبيرة"],["Ain Nehala","عين النحالة"],["Ain Tellout","عين تالوت"],["Ain Youcef","عين يوسف"],["Amieur","عمير"],["Azail","العزايل"],["Bab El Assa","باب العسة"],["Beni Bahdel","بني بهدل"],["Beni Boussaid","بني بوسعيد"],["Beni Khellad","بني خلاد"],["Beni Mester","بني مستر"],["Beni Ouarsous","بني وارسوس"],["Beni Smiel","بني صميل"],["Beni Snous","بني سنوس"],["Bensekrane","بن سكران"],["Bouhlou","بوحلو"],["Bouihi","البويهي"],["Chetouane","شتوان"],["Dar Yaghmoracen","دار يغمراسن"],["Djebala","جبالة"],["El Aricha","العريشة"],["El Fehoul","الفحول"],["El Gor","القور"],["Fellaoucene","فلاوسن"],["Ghazaouet","الغزوات"],["Hammam Boughrara","حمام بوغرارة"],["Hennaya","الحناية"],["Honnaine","هنين"],["M'sirda Fouaga","مسيردة الفواقة"],["Maghnia","مغنية"],["Mansourah","منصورة"],["Marsa Ben M'hidi","مرسى بن مهيدي"],["Nedroma","ندرومة"],["Oued Lakhdar","وادي الخضر"],["Ouled Mimoun","أولاد ميمون"],["Ouled Riyah","أولاد رياح"],["Remchi","الرمشي"],["Sabra","صبرة"],["Sebbaa Chioukh","سبعة شيوخ"],["Sebdou","سبدو"],["Sidi Abdelli","سيدي العبدلي"],["Sidi Djillali","سيدي الجيلالي"],["Sidi Medjahed","سيدي مجاهد"],["Souahlia","السواحلية"],["Souani","السواني"],["Souk Tleta","سوق الثلاثاء"],["Terny Beni Hediel","تيرني بني هديل"],["Tianet","تيانت"],["Tlemcen","تلمسان"],["Zenata","زناتة"]],"14":[["Ain Bouchekif","عين بوشقيف"],["Ain Deheb","عين الذهب"],["Ain Dzarit","عين دزاريت"],["Ain El Hadid","عين الحديد"],["Ain Kermes","عين كرمس"],["Bougara","بوقرة"],["Chehaima","شحيمة"],["Dahmouni","دحموني"],["Djebilet Rosfa","جبيلات الرصفاء"],["Djillali Ben Amar","جيلالي بن عمار"],["Faidja","الفايجة"],["Frenda","فرندة"],["Guertoufa","قرطوفة"],["Hamadia","حمادية"],["Ksar Chellala","قصر الشلالة"],["Madna","مادنة"],["Mahdia","مهدية"],["Mechraa Safa","مشرع الصفا"],["Medrissa","مدريسة"],["Medroussa","مدروسة"],["Meghila","مغيلة"],["Mellakou","ملاكو"],["Nadorah","الناظورة"],["Naima","النعيمة"],["Oued Lilli","وادي ليلي"],["Rahouia","الرحوية"],["Rechaiga","الرشايقة"],["Sebaine","السبعين"],["Sebt","السبت"],["Serghine","سرغين"],["Si Abdelghani","سي عبد الغني"],["Sidi Abderrahmane","سيدي عبد الرحمن"],["Sidi Ali Mellal","سيدي علي ملال"],["Sidi Bakhti","سيدي بختي"],["Sidi Hosni","سيدي حسني"],["Sougueur","السوقر"],["Tagdempt","تاقدمت"],["Takhemaret","تخمرت"],["Tiaret","تيارت"],["Tidda","تيدة"],["Tousnina","توسنينة"],["Zmalet El Emir Abdelkade","زمالة  الأمير عبد القادر"]],"15":[["Abi-Youcef","أبي يوسف"],["Aghribs","أغريب"],["Agouni-Gueghrane","أقني قغران"],["Ain-El-Hammam","عين الحمام"],["Ain-Zaouia","عين الزاوية"],["Ait Aggouacha","أيت عقـواشة"],["Ait Bouaddou","أيت بــوادو"],["Ait Boumahdi","أيت بومهدي"],["Ait Khellili","أيت خليلي"],["Ait Yahia Moussa","أيت يحي موسى"],["Ait-Aissa-Mimoun","أيت عيسى ميمون"],["Ait-Chafaa","أيت شافع"],["Ait-Mahmoud","أيت محمود"],["Ait-Oumalou","أيت  أومالو"],["Ait-Toudert","أيت تودرت"],["Ait-Yahia","أيت يحيى"],["Akbil","اقبيل"],["Akerrou","أقرو"],["Assi-Youcef","أسي يوسف"],["Azazga","عزازقة"],["Azeffoun","أزفون"],["Beni Zmenzer","بنــــي زمنزار"],["Beni-Aissi","بني عيسي"],["Beni-Douala","بني دوالة"],["Beni-Yenni","بني يني"],["Beni-Zikki","بني زيكــي"],["Boghni","بوغني"],["Boudjima","بوجيمة"],["Bounouh","بونوح"],["Bouzeguene","بوزقــن"],["Draa-Ben-Khedda","ذراع بن خدة"],["Draa-El-Mizan","ذراع الميزان"],["Freha","فريحة"],["Frikat","فريقات"],["Iboudrarene","إبودرارن"],["Idjeur","إيجــار"],["Iferhounene","إفــرحــونان"],["Ifigha","إيفيغاء"],["Iflissen","إفليـــسن"],["Illilten","إيلـيــلتـن"],["Illoula Oumalou","إيلولة أومـــالو"],["Imsouhal","إمســوحال"],["Irdjen","إيرجـــن"],["Larbaa Nath Irathen","الأربعــاء ناث إيراثن"],["M'kira","مكيرة"],["Maatkas","معـــاتقة"],["Makouda","ماكودة"],["Mechtras","مشطراس"],["Mekla","مقــلع"],["Mizrana","ميزرانـــة"],["Ouacif","واسيف"],["Ouadhias","واضية"],["Ouaguenoun","واقنون"],["Sidi Namane","سيدي نعمان"],["Souama","صوامـــع"],["Souk-El-Tenine","سوق الإثنين"],["Tadmait","تادمايت"],["Tigzirt","تيقـزيرت"],["Timizart","تيمـيزار"],["Tirmitine","تيرمتين"],["Tizi N'tleta","تيزي نثلاثة"],["Tizi-Gheniff","تيزي غنيف"],["Tizi-Ouzou","تيزي وزو"],["Tizi-Rached","تيزي راشد"],["Yakourene","إعــكورن"],["Yatafene","يطــافن"],["Zekri","زكري"]],"16":[["Ain Benian","عين بنيان"],["Ain Taya","عين طاية"],["Alger Centre","الجزائر الوسطى"],["Bab El Oued","باب الوادي"],["Bab Ezzouar","باب الزوار"],["Baba Hassen","بابا حسن"],["Bachedjerah","باش جراح"],["Baraki","براقي"],["Ben Aknoun","ابن عكنون"],["Beni Messous","بني مسوس"],["Bir Mourad Rais","بئر مراد رايس"],["Bir Touta","بئر توتة"],["Birkhadem","بئر خادم"],["Bologhine Ibnou Ziri","بولوغين بن زيري"],["Bordj El Bahri","برج البحري"],["Bordj El Kiffan","برج الكيفان"],["Bourouba","بوروبة"],["Bouzareah","بوزريعة"],["Casbah","القصبة"],["Cheraga","الشراقة"],["Dar El Beida","الدار البيضاء"],["Dely Ibrahim","دالي ابراهيم"],["Djasr Kasentina","جسر قسنطينة"],["Douira","الدويرة"],["Draria","الدرارية"],["El Achour","العاشور"],["El Biar","الابيار"],["El Harrach","الحراش"],["El Madania","المدنية"],["El Magharia","المغارية"],["El Marsa","المرسى"],["El Mouradia","المرادية"],["Hammamet","الحمامات"],["Herraoua","هراوة"],["Hussein Dey","حسين داي"],["Hydra","حيدرة"],["Khraissia","الخرايسية"],["Kouba","القبة"],["Les Eucalyptus","الكاليتوس"],["Maalma","المعالمة"],["Mohamed Belouzdad","محمد بلوزداد"],["Mohammadia","المحمدية"],["Oued Koriche","وادي قريش"],["Oued Smar","وادي السمار"],["Ouled Chebel","اولاد شبل"],["Ouled Fayet","اولاد فايت"],["Rahmania","الرحمانية"],["Rais Hamidou","الرايس حميدو"],["Reghaia","رغاية"],["Rouiba","الرويبة"],["Sehaoula","السحاولة"],["Sidi M'hamed","سيدي امحمد"],["Sidi Moussa","سيدي موسى"],["Souidania","سويدانية"],["Staoueli","سطاوالي"],["Tessala El Merdja","تسالة المرجة"],["Zeralda","زرالدة"]],"17":[["Ain Chouhada","عين الشهداء"],["Ain El Ibel","عين الإبل"],["Ain Fekka","عين فقه"],["Ain Maabed","عين معبد"],["Ain Oussera","عين وسارة"],["Amourah","عمورة"],["Benhar","بنهار"],["Benyagoub","بن يعقوب"],["Birine","بيرين"],["Bouira Lahdab","بويرة الأحداب"],["Charef","الشارف"],["Dar Chioukh","دار الشيوخ"],["Deldoul","دلدول"],["Djelfa","الجلفة"],["Douis","دويس"],["El Guedid","القديد"],["El Idrissia","الادريسية"],["El Khemis","الخميس"],["Faidh El Botma","فيض البطمة"],["Guernini","قرنيني"],["Guettara","قطارة"],["Had Sahary","حد الصحاري"],["Hassi Bahbah","حاسي بحبح"],["Hassi El Euch","حاسي العش"],["Hassi Fedoul","حاسي فدول"],["M'liliha","مليليحة"],["Messaad","مسعد"],["Moudjebara","مجبارة"],["Oum Laadham","أم العظام"],["Sed Rahal","سد الرحال"],["Selmana","سلمانة"],["Sidi Baizid","سيدي بايزيد"],["Sidi Laadjel","سيدي لعجال"],["Taadmit","تعظميت"],["Zaafrane","زعفران"],["Zaccar","زكار"]],"18":[["Bordj T'har","برج الطهر"],["Boudria Beniyadjis","بودريعة بني  ياجيس"],["Bouraoui Belhadef","بوراوي بلهادف"],["Boussif Ouled Askeur","بوسيف أولاد عسكر"],["Chahna","الشحنة"],["Chekfa","الشقفة"],["Djemaa Beni Habibi","الجمعة بني حبيبي"],["Djimla","جيملة"],["El Ancer","العنصر"],["El Aouana","العوانة"],["El Kennar Nouchfi","القنار نشفي"],["El Milia","الميلية"],["Emir Abdelkader","الامير عبد القادر"],["Erraguene Souissi","أراقن سويسي"],["Ghebala","غبالة"],["Jijel","جيجل"],["Kaous","قاوس"],["Khiri Oued Adjoul","خيري واد عجول"],["Oudjana","وجانة"],["Ouled Rabah","أولاد رابح"],["Ouled Yahia Khadrouch","أولاد يحيى خدروش"],["Selma Benziada","سلمى بن زيادة"],["Settara","السطارة"],["Sidi Abdelaziz","سيدي عبد العزيز"],["Sidi Marouf","سيدي معروف"],["Taher","الطاهير"],["Texenna","تاكسنة"],["Ziama Mansouriah","زيامة منصورية"]],"19":[["Ain Abessa","عين عباسة"],["Ain Arnat","عين أرنات"],["Ain Azel","عين أزال"],["Ain El Kebira","عين الكبيرة"],["Ain Lahdjar","عين الحجر"],["Ain Oulmene","عين ولمان"],["Ain-Legradj","عين لقراج"],["Ain-Roua","عين الروى"],["Ain-Sebt","عين السبت"],["Ait Naoual Mezada","أيت نوال مزادة"],["Ait-Tizi","ايت تيزي"],["Amoucha","عموشة"],["Babor","بابور"],["Bazer-Sakra","بازر سكرة"],["Beidha Bordj","بيضاء برج"],["Bellaa","بلاعة"],["Beni Chebana","بني شبانة"],["Beni Fouda","بني فودة"],["Beni Ourtilane","بني ورتيلان"],["Beni Oussine","بني وسين"],["Beni-Aziz","بني عزيز"],["Beni-Mouhli","بني موحلي"],["Bir Haddada","بئر حدادة"],["Bir-El-Arch","بئر العرش"],["Bouandas","بوعنداس"],["Bougaa","بوقاعة"],["Bousselam","بوسلام"],["Boutaleb","بوطالب"],["Dehamcha","الدهامشة"],["Djemila","جميلة"],["Draa-Kebila","ذراع قبيلة"],["El Eulma","العلمة"],["El Ouricia","أوريسيا"],["El-Ouldja","الولجة"],["Guellal","قلال"],["Guelta Zerka","قلتة زرقاء"],["Guenzet","قنزات"],["Guidjel","قجال"],["Hamam Soukhna","حمام السخنة"],["Hamma","الحامة"],["Hammam Guergour","حمام قرقور"],["Harbil","حربيل"],["Kasr El Abtal","قصر الابطال"],["Maaouia","معاوية"],["Maouaklane","ماوكلان"],["Mezloug","مزلوق"],["Oued El Bared","واد البارد"],["Ouled Addouane","أولاد عدوان"],["Ouled Sabor","أولاد صابر"],["Ouled Si Ahmed","أولاد سي أحمد"],["Ouled Tebben","أولاد تبان"],["Rosfa","الرصفة"],["Salah Bey","صالح باي"],["Serdj-El-Ghoul","سرج الغول"],["Setif","سطيف"],["Tachouda","تاشودة"],["Tala-Ifacene","تالة إيفاسن"],["Taya","الطاية"],["Tella","التلة"],["Tizi N'bechar","تيزي نبشار"]],"20":[["Ain El Hadjar","عين الحجر"],["Ain Sekhouna","عين السخونة"],["Ain Soltane","عين السلطان"],["Doui Thabet","دوي ثابت"],["El Hassasna","الحساسنة"],["Hounet","هونت"],["Maamora","المعمورة"],["Moulay Larbi","مولاي العربي"],["Ouled Brahim","أولاد إبراهيم"],["Ouled Khaled","أولاد خالد"],["Saida","سعيدة"],["Sidi Ahmed","سيدي احمد"],["Sidi Amar","سيدي عمر"],["Sidi Boubekeur","سيدي بوبكر"],["Tircine","تيرسين"],["Youb","يوب"]],"21":[["Ain Bouziane","عين بوزيان"],["Ain Charchar","عين شرشار"],["Ain Kechra","عين قشرة"],["Ain Zouit","عين زويت"],["Azzaba","عزابة"],["Bekkouche Lakhdar","بكوش لخضر"],["Ben Azzouz","بن عزوز"],["Beni Bechir","بني بشير"],["Beni Oulbane","بني ولبان"],["Beni Zid","بني زيد"],["Bin El Ouiden","بين الويدان"],["Bouchetata","بوشطاطة"],["Cheraia","الشرايع"],["Collo","القل"],["Djendel Saadi Mohamed","جندل سعدي محمد"],["El Arrouch","الحروش"],["El Ghedir","الغدير"],["El Hadaiek","الحدائق"],["El Marsa","المرسى"],["Emjez Edchich","مجاز الدشيش"],["Es Sebt","السبت"],["Filfila","فلفلة"],["Hammadi Krouma","حمادي كرومة"],["Kanoua","قنواع"],["Kerkara","الكركرة"],["Khenag Maoune","خناق مايو"],["Oued Zhour","وادي الزهور"],["Ouldja Boulbalout","الولجة بولبلوط"],["Ouled Attia","أولاد عطية"],["Ouled Habbaba","أولاد حبابة"],["Oum Toub","أم الطوب"],["Ramdane Djamel","رمضان جمال"],["Salah Bouchaour","صالح بو الشعور"],["Sidi Mezghiche","سيدي مزغيش"],["Skikda","سكيكدة"],["Tamalous","تمالوس"],["Zerdezas","زردازة"],["Zitouna","الزيتونة"]],"22":[["Ain El Berd","عين البرد"],["Ain Kada","عين قادة"],["Ain Thrid","عين الثريد"],["Ain Tindamine","عين تندمين"],["Ain- Adden","عين أدن"],["Amarnas","العمارنة"],["Bedrabine El Mokrani","بضرابين المقراني"],["Belarbi","بلعربي"],["Ben Badis","بن باديس"],["Benachiba Chelia","بن عشيبة شلية"],["Bir El Hammam","بئر الحمام"],["Boudjebaa El Bordj","بوجبهة البرج"],["Boukhanefis","بوخنفيس"],["Chetouane Belaila","شيطوان البلايلة"],["Dhaya","الضاية"],["El Hacaiba","الحصيبة"],["Hassi Dahou","حاسي دحو"],["Hassi Zahana","حاسي زهانة"],["Lamtar","لمطار"],["M'cid","مسيد"],["Makedra","مكدرة"],["Marhoum","مرحوم"],["Merine","مرين"],["Mezaourou","مزاورو"],["Mostefa  Ben Brahim","مصطفى بن ابراهيم"],["Moulay Slissen","مولاي سليسن"],["Oued Sebaa","وادي السبع"],["Oued Sefioun","وادي سفيون"],["Oued Taourira","وادي تاوريرة"],["Ras El Ma","راس الماء"],["Redjem Demouche","رجم دموش"],["Sehala Thaoura","السهالة الثورة"],["Sfisef","سفيزف"],["Sidi Ali Benyoub","سيدي علي بن يوب"],["Sidi Ali Boussidi","سيدي علي بوسيدي"],["Sidi Bel-Abbes","سيدي بلعباس"],["Sidi Brahim","سيدي ابراهيم"],["Sidi Chaib","سيدي شعيب"],["Sidi Dahou Zairs","سيدي دحو الزاير"],["Sidi Hamadouche","سيدي حمادوش"],["Sidi Khaled","سيدي خالد"],["Sidi Lahcene","سيدي لحسن"],["Sidi Yacoub","سيدي يعقوب"],["Tabia","طابية"],["Taoudmout","تاودموت"],["Tefessour","تفسور"],["Teghalimet","تغاليمت"],["Telagh","تلاغ"],["Tenira","تنيرة"],["Tessala","تسالة"],["Tilmouni","تلموني"],["Zerouala","زروالة"]],"23":[["Ain El Berda","عين الباردة"],["Annaba","عنابة"],["Berrahal","برحال"],["Chetaibi","شطايبي"],["Cheurfa","الشرفة"],["El Bouni","البوني"],["El Eulma","العلمة"],["El Hadjar","الحجار"],["Oued El Aneb","واد العنب"],["Seraidi","سرايدي"],["Sidi Amar","سيدي عمار"],["Treat","التريعات"]],"24":[["Ain Ben Beida","عين بن بيضاء"],["Ain Larbi","عين العربي"],["Ain Makhlouf","عين مخلوف"],["Ain Regada","عين رقادة"],["Ain Sandel","عين صندل"],["Belkheir","بلخير"],["Bendjarah","بن جراح"],["Beni Mezline","بني مزلين"],["Bordj Sabath","برج صباط"],["Bou Hachana","بوحشانة"],["Bou Hamdane","بوحمدان"],["Bouati Mahmoud","بوعاتي محمود"],["Bouchegouf","بوشقوف"],["Boumahra Ahmed","بومهرة أحمد"],["Dahouara","الدهوارة"],["Djeballah Khemissi","جبالة الخميسي"],["El Fedjoudj","الفجوج"],["Guelaat Bou Sbaa","قلعة بوصبع"],["Guelma","قالمة"],["Hammam Debagh","حمام دباغ"],["Hammam N'bail","حمام النبايل"],["Heliopolis","هيليوبوليس"],["Houari Boumedienne","هواري بومدين"],["Khezaras","لخزارة"],["Medjez Amar","مجاز عمار"],["Medjez Sfa","مجاز الصفاء"],["Nechmaya","نشماية"],["Oued Cheham","وادي الشحم"],["Oued Ferragha","وادي فراغة"],["Oued Zenati","وادي الزناتي"],["Ras El Agba","رأس العقبة"],["Roknia","الركنية"],["Sellaoua Announa","سلاوة عنونة"],["Tamlouka","تاملوكة"]],"25":[["Ain Abid","عين عبيد"],["Ain Smara","عين السمارة"],["Ben Badis","أبن باديس الهرية"],["Beni Hamidane","بني حميدان"],["Constantine","قسنطينة"],["Didouche Mourad","ديدوش مراد"],["El Khroub","الخروب"],["Hamma Bouziane","حامة بوزيان"],["Ibn Ziad","ابن زياد"],["Messaoud Boudjeriou","بوجريو مسعود"],["Ouled Rahmoun","أولاد رحمون"],["Zighoud Youcef","زيغود يوسف"]],"26":[["Ain Boucif","عين بوسيف"],["Ain Ouksir","عين اقصير"],["Aissaouia","العيساوية"],["Aziz","عزيز"],["Baata","بعطة"],["Ben Chicao","بن شكاو"],["Beni Slimane","بني سليمان"],["Berrouaghia","البرواقية"],["Bir Ben Laabed","بئر بن عابد"],["Boghar","بوغار"],["Bouaiche","بوعيش"],["Bouaichoune","بوعيشون"],["Bouchrahil","بوشراحيل"],["Boughzoul","بوغزول"],["Bouskene","بوسكن"],["Chabounia","الشهبونية"],["Chelalet El Adhaoura","شلالة العذاورة"],["Cheniguel","شنيقل"],["Derrag","دراق"],["Djouab","جواب"],["Draa Esmar","ذراع السمار"],["El Azizia","العزيزية"],["El Guelbelkebir","القلب الكبير"],["El Hamdania","الحمدانية"],["El Haoudane","الحوضان"],["El Omaria","العمارية"],["El Ouinet","العوينات"],["Hannacha","حناشة"],["Kef Lakhdar","الكاف الاخضر"],["Khams Djouamaa","خمس جوامع"],["Ksar El Boukhari","قصر البخاري"],["M'fatha","مفاتحة"],["Maghraoua","مغراوة"],["Medea","المدية"],["Medjebar","مجبر"],["Mezerana","مزغنة"],["Mihoub","ميهوب"],["Ouamri","عوامري"],["Oued Harbil","وادي حربيل"],["Ouled Antar","أولاد عنتر"],["Ouled Bouachra","أولاد بوعشرة"],["Ouled Brahim","أولاد إبراهيم"],["Ouled Deid","أولاد دايد"],["Ouled Emaaraf","أولاد امعرف"],["Ouled Hellal","أولاد هلال"],["Oum El Djellil","أم الجليل"],["Ouzera","وزرة"],["Rebaia","الربعية"],["Saneg","السانق"],["Sedraya","سدراية"],["Seghouane","سغوان"],["Si Mahdjoub","سي المحجوب"],["Sidi Demed","سيدي دامد"],["Sidi Naamane","سيدي نعمان"],["Sidi Rabie","سيدي الربيع"],["Sidi Zahar","سيدي زهار"],["Sidi Ziane","سيدي زيان"],["Souagui","السواقي"],["Tablat","تابلاط"],["Tafraout","تفراوت"],["Tamesguida","تمسقيدة"],["Tizi Mahdi","تيزي مهدي"],["Tletat Ed Douair","ثلاث دوائر"],["Zoubiria","الزبيرية"]],"27":[["Achaacha","عشعاشة"],["Ain-Boudinar","عين بودينار"],["Ain-Nouissy","عين نويسي"],["Ain-Sidi Cherif","عين سيدي الشريف"],["Ain-Tedles","عين تادلس"],["Benabdelmalek Ramdane","بن عبد المالك رمضان"],["Bouguirat","بوقيراط"],["Fornaka","فرناقة"],["Hadjadj","حجاج"],["Hassi Mameche","حاسي ماماش"],["Hassiane","الحسيان (بني ياحي"],["Khadra","خضرة"],["Kheir-Eddine","خير الدين"],["Mansourah","منصورة"],["Mazagran","مزغران"],["Mesra","ماسرة"],["Mostaganem","مستغانم"],["Nekmaria","نكمارية"],["Oued El Kheir","وادي الخير"],["Ouled Boughalem","أولاد بوغالم"],["Ouled-Maalah","أولاد مع الله"],["Safsaf","صفصاف"],["Sayada","صيادة"],["Sidi Ali","سيدي علي"],["Sidi Belaattar","سيدي بلعطار"],["Sidi-Lakhdar","سيدي لخضر"],["Sirat","سيرات"],["Souaflia","السوافلية"],["Sour","سور"],["Stidia","ستيدية"],["Tazgait","تزقايت"],["Touahria","الطواهرية"]],"28":[["Ain El Hadjel","عين الحجل"],["Ain El Melh","عين الملح"],["Ain Fares","عين فارس"],["Ain Khadra","عين الخضراء"],["Ain Rich","عين الريش"],["Belaiba","بلعايبة"],["Ben Srour","بن سرور"],["Beni Ilmane","بني يلمان"],["Benzouh","بن زوه"],["Berhoum","برهوم"],["Bir Foda","بئر فضة"],["Bou Saada","بوسعادة"],["Bouti Sayeh","بوطي السايح"],["Chellal","شلال"],["Dehahna","دهاهنة"],["Djebel Messaad","جبل مساعد"],["El Hamel","الهامل"],["El Houamed","الحوامد"],["Hammam Dalaa","حمام الضلعة"],["Khettouti Sed-El-Jir","خطوطي سد الجير"],["Khoubana","خبانة"],["M'cif","مسيف"],["M'sila","المسيلة"],["M'tarfa","المطارفة"],["Maadid","المعاضيد"],["Maarif","معاريف"],["Magra","مقرة"],["Medjedel","امجدل"],["Menaa","مناعة"],["Mohamed Boudiaf","محمد بوضياف"],["Ouanougha","ونوغة"],["Ouled Addi Guebala","أولاد عدي لقبالة"],["Ouled Derradj","أولاد دراج"],["Ouled Madhi","أولاد ماضي"],["Ouled Mansour","أولاد منصور"],["Ouled Sidi Brahim","أولاد سيدي ابراهيم"],["Ouled Slimane","أولاد سليمان"],["Oulteme","ولتام"],["Sidi Aissa","سيدي عيسى"],["Sidi Ameur","سيدي عامر"],["Sidi Hadjeres","سيدي هجرس"],["Sidi M'hamed","سيدي امحمد"],["Slim","سليم"],["Souamaa","السوامع"],["Tamsa","تامسة"],["Tarmount","تارمونت"],["Zarzour","زرزور"]],"29":[["Ain Fares","عين فارس"],["Ain Fekan","عين فكان"],["Ain Ferah","عين فراح"],["Ain Frass","عين أفرص"],["Alaimia","العلايمية"],["Aouf","عوف"],["Benian","بنيان"],["Bou Henni","بوهني"],["Bouhanifia","بوحنيفية"],["Chorfa","الشرفاء"],["El Bordj","البرج"],["El Gaada","القعدة"],["El Ghomri","الغمري"],["El Gueitena","القطنة"],["El Hachem","الحشم"],["El Keurt","القرط"],["El Mamounia","المأمونية"],["El Menaouer","المنور"],["Ferraguig","فراقيق"],["Froha","فروحة"],["Gharrous","غروس"],["Ghriss","غريس"],["Guerdjoum","قرجوم"],["Hacine","حسين"],["Khalouia","خلوية"],["Makhda","ماقضة"],["Maoussa","ماوسة"],["Mascara","معسكر"],["Matemore","المطمور"],["Mocta-Douz","مقطع الدوز"],["Mohammadia","المحمدية"],["Nesmot","نسمط"],["Oggaz","عقاز"],["Oued El Abtal","وادي الأبطال"],["Oued Taria","وادي التاغية"],["Ras El Ain Amirouche","رأس عين عميروش"],["Sedjerara","سجرارة"],["Sehailia","السهايلية"],["Sidi Abdeldjebar","سيدي عبد الجبار"],["Sidi Abdelmoumene","سيدي عبد المومن"],["Sidi Boussaid","سيدي بوسعيد"],["Sidi Kada","سيدي قادة"],["Sig","سيق"],["Tighennif","تيغنيف"],["Tizi","تيزي"],["Zahana","زهانة"],["Zelamta","زلامطة"]],"30":[["Ain Beida","عين البيضاء"],["El Borma","البرمة"],["Hassi Ben Abdellah","حاسي بن عبد الله"],["Hassi Messaoud","حاسي مسعود"],["N'goussa","انقوسة"],["Ouargla","ورقلة"],["Rouissat","الرويسات"],["Sidi Khouiled","سيدي خويلد"]],"31":[["Ain Biya","عين البية"],["Ain Kerma","عين الكرمة"],["Ain Turk","عين الترك"],["Arzew","أرزيو"],["Ben Freha","بن فريحة"],["Bethioua","بطيوة"],["Bir El Djir","بئر الجير"],["Boufatis","بوفاتيس"],["Bousfer","بوسفر"],["Boutlelis","بوتليليس"],["El Ancor","العنصر"],["El Braya","البراية"],["El Kerma","الكرمة"],["Es Senia","السانية"],["Gdyel","قديل"],["Hassi Ben Okba","حاسي بن عقبة"],["Hassi Bounif","حاسي بونيف"],["Hassi Mefsoukh","حاسي مفسوخ"],["Marsat El Hadjadj","مرسى الحجاج"],["Mers El Kebir","المرسى الكبير"],["Messerghin","مسرغين"],["Oran","وهران"],["Oued Tlelat","وادي تليلات"],["Sidi Ben Yebka","سيدي بن يبقى"],["Sidi Chami","سيدي الشحمي"],["Tafraoui","طفراوي"]],"32":[["Ain El Orak","عين العراك"],["Arbaouat","اربوات"],["Boualem","بوعلام"],["Bougtoub","بوقطب"],["Boussemghoun","بوسمغون"],["Brezina","بريزينة"],["Cheguig","الشقيق"],["Chellala","شلالة"],["El Bayadh","البيض"],["El Bnoud","البنود"],["El Kheiter","الخيثر"],["El Mehara","المحرة"],["Ghassoul","الغاسول"],["Kef El Ahmar","الكاف الأحمر"],["Krakda","كراكدة"],["Labiodh Sidi Cheikh","الأبيض سيدي الشيخ"],["Rogassa","رقاصة"],["Sidi Ameur","سيدي عامر"],["Sidi Slimane","سيدي سليمان"],["Sidi Tiffour","سيدي طيفور"],["Stitten","ستيتن"],["Tousmouline","توسمولين"]],"33":[["Bordj Omar Driss","برج عمر إدريس"],["Debdeb","دبداب"],["Illizi","إيليزي"],["In Amenas","إن أمناس"]],"34":[["Ain Taghrout","عين تاغروت"],["Ain Tesra","عين تسرة"],["B. B. Arreridj","برج بوعريرج"],["Belimour","بليمور"],["Ben Daoud","بن داود"],["Bir Kasdali","بئر قاصد علي"],["Bordj Ghedir","برج الغدير"],["Bordj Zemmoura","برج زمورة"],["Colla","القلة"],["Djaafra","جعافرة"],["El Achir","الياشير"],["El Annasseur","العناصر"],["El Euch","العش"],["El M'hir","المهير"],["El Main","الماين"],["Elhammadia","الحمادية"],["Ghailasa","غيلاسة"],["Haraza","حرازة"],["Hasnaoua","حسناوة"],["Khelil","خليل"],["Ksour","القصور"],["Mansoura","المنصورة"],["Medjana","مجانة"],["Ouled Brahem","أولاد أبراهم"],["Ouled Dahmane","أولاد دحمان"],["Ouled Sidi-Brahim","أولاد سيدي ابراهيم"],["Rabta","الرابطة"],["Ras El Oued","رأس الوادي"],["Sidi-Embarek","سيدي أمبارك"],["Taglait","تقلعيت"],["Tassamert","تسامرت"],["Tefreg","تفرق"],["Teniet En Nasr","ثنية النصر"],["Tixter","تيكستار"]],"35":[["Afir","أعفير"],["Ammal","عمال"],["Baghlia","بغلية"],["Ben Choud","بن شود"],["Beni Amrane","بني عمران"],["Bordj Menaiel","برج منايل"],["Boudouaou","بودواو"],["Boudouaou El Bahri","بودواو البحري"],["Boumerdes","بومرداس"],["Bouzegza Keddara","بوزقزة قدارة"],["Chabet El Ameur","شعبة العامر"],["Corso","قورصو"],["Dellys","دلس"],["Djinet","جنات"],["El Kharrouba","الخروبة"],["Hammedi","حمادي"],["Isser","يسر"],["Khemis El Khechna","خميس الخشنة"],["Larbatache","الاربعطاش"],["Leghata","لقاطة"],["Naciria","الناصرية"],["Ouled Aissa","أولاد عيسى"],["Ouled Hedadj","أولاد هداج"],["Ouled Moussa","أولاد موسى"],["Si Mustapha","سي مصطفى"],["Sidi Daoud","سيدي داود"],["Souk El Had","سوق الحد"],["Taourga","تاورقة"],["Thenia","الثنية"],["Tidjelabine","تيجلابين"],["Timezrit","تيمزريت"],["Zemmouri","زموري"]],"36":[["Ain El Assel","عين العسل"],["Ain Kerma","عين الكرمة"],["Asfour","عصفور"],["Ben M Hidi","بن مهيدي"],["Berrihane","بريحان"],["Besbes","البسباس"],["Bougous","بوقوس"],["Bouhadjar","بوحجار"],["Bouteldja","بوثلجة"],["Chebaita Mokhtar","شبيطة مختار"],["Chefia","الشافية"],["Chihani","شحاني"],["Drean","الذرعـان"],["Echatt","الشط"],["El Aioun","العيون"],["El Kala","القالة"],["El Tarf","الطارف"],["Hammam Beni Salah","حمام بني صالح"],["Lac Des Oiseaux","بحيرة الطيور"],["Oued Zitoun","وادي الزيتون"],["Raml Souk","رمل السوق"],["Souarekh","السوارخ"],["Zerizer","زريزر"],["Zitouna","الزيتونة"]],"37":[["Oum El Assel","أم العسل"],["Tindouf","تندوف"]],"38":[["Ammari","عماري"],["Beni Chaib","بني شعيب"],["Beni Lahcene","بني لحسن"],["Bordj Bounaama","برج بونعامة"],["Bordj El Emir Abdelkader","برج الأمير عبد القادر"],["Boucaid","بوقائد"],["Khemisti","خميستي"],["Larbaa","الأربعاء"],["Lardjem","لرجام"],["Layoune","العيون"],["Lazharia","الأزهرية"],["Maacem","المعاصم"],["Melaab","الملعب"],["Ouled Bessam","أولاد بسام"],["Sidi Abed","سيدي عابد"],["Sidi Boutouchent","سيدي بوتوشنت"],["Sidi Lantri","سيدي العنتري"],["Sidi Slimane","سيدي سليمان"],["Tamellahet","تملاحت"],["Theniet El Had","ثنية الاحد"],["Tissemsilt","تيسمسيلت"],["Youssoufia","اليوسفية"]],"39":[["Bayadha","البياضة"],["Ben Guecha","بن  قشة"],["Debila","الدبيلة"],["Douar El Maa","دوار الماء"],["El Ogla","العقلة"],["El-Oued","الوادي"],["Guemar","قمار"],["Hamraia","الحمراية"],["Hassani Abdelkrim","حساني عبد الكريم"],["Hassi Khalifa","حاسي خليفة"],["Kouinine","كوينين"],["Magrane","المقرن"],["Mih Ouansa","اميه وانسة"],["Nakhla","النخلة"],["Oued El Alenda","وادي العلندة"],["Ourmes","ورماس"],["Reguiba","الرقيبة"],["Robbah","الرباح"],["Sidi Aoun","سيدي عون"],["Taghzout","تغزوت"],["Taleb Larbi","الطالب العربي"],["Trifaoui","الطريفاوي"]],"40":[["Ain Touila","عين الطويلة"],["Babar","بابار"],["Baghai","بغاي"],["Bouhmama","بوحمامة"],["Chechar","ششار"],["Chelia","شلية"],["Djellal","جلال"],["El Hamma","الحامة"],["El Mahmal","المحمل"],["El Oueldja","الولجة"],["Ensigha","انسيغة"],["Kais","قايس"],["Khenchela","خنشلة"],["Khirane","خيران"],["M'sara","مصارة"],["M'toussa","متوسة"],["Ouled Rechache","أولاد رشاش"],["Remila","الرميلة"],["Tamza","طامزة"],["Taouzianat","تاوزيانت"],["Yabous","يابوس"]],"41":[["Ain Soltane","عين سلطان"],["Ain Zana","عين الزانة"],["Bir Bouhouche","بئر بوحوش"],["Drea","الدريعة"],["Haddada","الحدادة"],["Hanencha","الحنانشة"],["Khedara","الخضارة"],["Khemissa","خميسة"],["M'daourouche","مداوروش"],["Machroha","المشروحة"],["Merahna","المراهنة"],["Oued Kebrit","وادي الكبريت"],["Ouillen","ويلان"],["Ouled Driss","أولاد إدريس"],["Ouled Moumen","أولاد مومن"],["Oum El Adhaim","أم العظايم"],["Ragouba","الراقوبة"],["Safel El Ouiden","سافل الويدان"],["Sedrata","سدراتة"],["Sidi Fredj","سيدي فرج"],["Souk Ahras","سوق أهراس"],["Taoura","تاورة"],["Terraguelt","ترقالت"],["Tiffech","تيفاش"],["Zaarouria","الزعرورية"],["Zouabi","الزوابي"]],"42":[["Aghbal","أغبال"],["Ahmer El Ain","أحمر العين"],["Ain Tagourait","عين تاقورايت"],["Attatba","الحطاطبة"],["Beni Mileuk","بني ميلك"],["Bou Haroun","بوهارون"],["Bou Ismail","بواسماعيل"],["Bourkika","بورقيقة"],["Chaiba","الشعيبة"],["Cherchell","شرشال"],["Damous","الداموس"],["Douaouda","دواودة"],["Fouka","فوكة"],["Gouraya","قوراية"],["Hadjout","حجوط"],["Hadjret Ennous","حجرة النص"],["Khemisti","خميستي"],["Kolea","القليعة"],["Larhat","الأرهاط"],["Menaceur","مناصر"],["Merad","مراد"],["Messelmoun","مسلمون"],["Nador","الناظور"],["Sidi Ghiles","سيدي غيلاس"],["Sidi Rached","سيدي راشد"],["Sidi Semiane","سيدي سميان"],["Sidi-Amar","سيدي عامر"],["Tipaza","تيبازة"]],"43":[["Ahmed Rachedi","أحمد راشدي"],["Ain Beida Harriche","عين البيضاء أحريش"],["Ain Mellouk","عين الملوك"],["Ain Tine","عين التين"],["Amira Arres","اعميرة اراس"],["Benyahia Abderrahmane","بن يحي عبد الرحمن"],["Bouhatem","بوحاتم"],["Chelghoum Laid","شلغوم العيد"],["Chigara","الشيقارة"],["Derrahi Bousselah","دراحي بوصلاح"],["El Ayadi Barbes","العياضي برباس"],["El Mechira","مشيرة"],["Ferdjioua","فرجيوة"],["Grarem Gouga","القرارم قوقة"],["Hamala","حمالة"],["Mila","ميلة"],["Minar Zarza","مينار زارزة"],["Oued Athmenia","وادي العثمانية"],["Oued Endja","وادي النجاء"],["Oued Seguen","وادي سقان"],["Ouled Khalouf","أولاد اخلوف"],["Rouached","الرواشد"],["Sidi Khelifa","سيدي خليفة"],["Sidi Merouane","سيدي مروان"],["Tadjenanet","تاجنانت"],["Tassadane Haddada","تسدان حدادة"],["Tassala Lematai","تسالة لمطاعي"],["Teleghma","التلاغمة"],["Terrai Bainen","ترعي باينان"],["Tiberguent","تيبرقنت"],["Yahia Beniguecha","يحي بني قشة"],["Zeghaia","زغاية"]],"44":[["Ain-Benian","عين البنيان"],["Ain-Bouyahia","عين بويحيى"],["Ain-Defla","عين الدفلى"],["Ain-Lechiakh","عين الاشياخ"],["Ain-Soltane","عين السلطان"],["Ain-Torki","عين التركي"],["Arib","عريب"],["Bathia","بطحية"],["Belaas","بلعاص"],["Ben Allal","بن علال"],["Bir-Ould-Khelifa","بئر ولد خليفة"],["Birbouche","بربوش"],["Bordj-Emir-Khaled","برج الأمير خالد"],["Boumedfaa","بومدفع"],["Bourached","بوراشد"],["Djelida","جليدة"],["Djemaa Ouled Cheikh","جمعة أولاد الشيخ"],["Djendel","جندل"],["El-Abadia","العبادية"],["El-Amra","العامرة"],["El-Attaf","العطاف"],["El-Maine","الماين"],["Hammam-Righa","حمام ريغة"],["Hassania","الحسانية"],["Hoceinia","الحسينية"],["Khemis-Miliana","خميس مليانة"],["Mekhatria","المخاطرية"],["Miliana","مليانة"],["Oued Chorfa","وادي الشرفاء"],["Oued Djemaa","واد الجمعة"],["Rouina","الروينة"],["Sidi-Lakhdar","سيدي الأخضر"],["Tacheta Zegagha","تاشتة زقاغة"],["Tarik-Ibn-Ziad","طارق بن زياد"],["Tiberkanine","تبركانين"],["Zeddine","زدين"]],"45":[["Ain Ben Khelil","عين بن خليل"],["Ain Sefra","عين الصفراء"],["Asla","عسلة"],["Djenienne Bourezg","جنين بورزق"],["El Biodh","البيوض"],["Kasdir","القصدير"],["Makmen Ben Amar","مكمن بن عمار"],["Mecheria","المشرية"],["Moghrar","مغرار"],["Naama","النعامة"],["Sfissifa","سفيسيفة"],["Tiout","تيوت"]],"46":[["Aghlal","أغلال"],["Ain El Arbaa","عين الأربعاء"],["Ain Kihal","عين الكيحل"],["Ain Temouchent","عين تموشنت"],["Ain Tolba","عين الطلبة"],["Aoubellil","عقب الليل"],["Beni Saf","بني صاف"],["Bouzedjar","بوزجار"],["Chaabat El Ham","شعبة اللحم"],["Chentouf","شنتوف"],["El Amria","العامرية"],["El Maleh","المالح"],["El Messaid","المساعيد"],["Emir Abdelkader","الأمير عبد القادر"],["Hammam Bou Hadjar","حمام بوحجر"],["Hassasna","الحساسنة"],["Hassi El Ghella","حاسي الغلة"],["Oued Berkeche","وادي برقش"],["Oued Sebbah","وادي الصباح"],["Ouled Boudjemaa","أولاد بوجمعة"],["Ouled Kihal","أولاد الكيحل"],["Oulhaca El Gheraba","ولهاصة الغرابة"],["Sidi Ben Adda","سيدي بن عدة"],["Sidi Boumediene","سيدي بومدين"],["Sidi Ouriache","سيدي ورياش"],["Sidi Safi","سيدي صافي"],["Tamzoura","تامزورة"],["Terga","تارقة"]],"47":[["Berriane","بريان"],["Bounoura","بونورة"],["Dhayet Bendhahoua","ضاية بن ضحوة"],["El Atteuf","العطف"],["El Guerrara","القرارة"],["Ghardaia","غرداية"],["Mansoura","المنصورة"],["Metlili","متليلي"],["Sebseb","سبسب"],["Zelfana","زلفانة"]],"48":[["Ain Rahma","عين الرحمة"],["Ain-Tarek","عين طارق"],["Ammi Moussa","عمي موسى"],["Belaassel Bouzagza","بلعسل بوزقزة"],["Bendaoud","بن داود"],["Beni Dergoun","بني درقن"],["Beni Zentis","بني زنطيس"],["Dar Ben Abdelah","دار بن عبد الله"],["Djidiouia","جديوية"],["El H'madna","الحمادنة"],["El Hassi","الحاسي"],["El Ouldja","الولجة"],["El-Guettar","القطار"],["El-Matmar","المطمر"],["Had Echkalla","حد الشكالة"],["Hamri","حمري"],["Kalaa","القلعة"],["Lahlef","لحلاف"],["Mazouna","مازونة"],["Mediouna","مديونة"],["Mendes","منداس"],["Merdja Sidi Abed","مرجة سيدي عابد"],["Ouarizane","واريزان"],["Oued El Djemaa","وادي الجمعة"],["Oued Essalem","وادي السلام"],["Oued-Rhiou","وادي رهيو"],["Ouled Aiche","أولاد يعيش"],["Ouled Sidi Mihoub","أولاد سيدي الميهوب"],["Ramka","الرمكة"],["Relizane","غليزان"],["Sidi Khettab","سيدي  خطاب"],["Sidi Lazreg","سيدي لزرق"],["Sidi M'hamed Benali","سيدي أمحمد بن علي"],["Sidi M'hamed Benaouda","سيدي امحمد بن عودة"],["Sidi Saada","سيدي سعادة"],["Souk El Had","سوق الحد"],["Yellel","يلل"],["Zemmoura","زمورة"]],"49":[["Aougrout","أوقروت"],["Charouine","شروين"],["Deldoul","دلدول"],["Ksar Kaddour","قصر قدور"],["Metarfa","المطارفة"],["Ouled Aissa","أولاد عيسى"],["Ouled Said","أولاد السعيد"],["Talmine","طالمين"],["Timimoun","تيميمون"],["Tinerkouk","تنركوك"]],"50":[["Bordj Badji Mokhtar","برج باجي مختار"],["Timiaouine","تيمياوين"]],"51":[["Besbes","بسباس"],["Chaiba","الشعيبة"],["Doucen","الدوسن"],["Ouled Djellal","أولاد جلال"],["Ras El Miad","رأس الميعاد"],["Sidi Khaled","سيدي  خالد"]],"52":[["Beni-Abbes","بني عباس"],["Beni-Ikhlef","بن يخلف"],["El Ouata","الواتة"],["Igli","إقلي"],["Kerzaz","كرزاز"],["Ksabi","القصابي"],["Ouled-Khodeir","أولاد خضير"],["Tamtert","تامترت"],["Timoudi","تيمودي"]],"53":[["Ain Salah","عين صالح"],["Foggaret Ezzoua","فقارة الزوى"],["Inghar","إينغر"]],"54":[["Ain Guezzam","عين قزام"],["Tin Zouatine","تين زواتين"]],"55":[["Benaceur","بن ناصر"],["Blidet Amor","بلدة اعمر"],["El Alia","العالية"],["El-Hadjira","الحجيرة"],["M'naguer","المنقر"],["Megarine","المقارين"],["Nezla","النزلة"],["Sidi Slimane","سيدي سليمان"],["Taibet","الطيبات"],["Tebesbest","تبسبست"],["Temacine","تماسين"],["Touggourt","تقرت"],["Zaouia El Abidia","الزاوية العابدية"]],"56":[["Bordj El Haouass","برج الحواس"],["Djanet","جانت"]],"57":[["Djamaa","جامعة"],["El-M'ghaier","المغير"],["M'rara","المرارة"],["Oum Touyour","أم الطيور"],["Sidi Amrane","سيدي عمران"],["Sidi Khelil","سيدي خليل"],["Still","سطيل"],["Tenedla","تندلة"]],"58":[["El Meniaa","المنيعة"],["Hassi Fehal","حاسي الفحل"],["Hassi Gara","حاسي القارة"]]}`,g=`/**
 * Roles and what each may do. Shared by the window (menus, buttons) and the
 * main process (electron/services/ipcGuard.js), so a hidden button is also a
 * refused call.
 */

// Available roles
export const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    CASHIER: 'cashier',
};

// Permission definitions
export const PERMISSIONS = {
    // Dashboard
    DASHBOARD_VIEW: 'dashboard.view',

    // POS
    POS_VIEW: 'pos.view',
    POS_VOID_SALE: 'pos.void_sale',
    POS_APPLY_DISCOUNT: 'pos.apply_discount',

    // Products
    PRODUCTS_VIEW: 'products.view',
    PRODUCTS_CREATE: 'products.create',
    PRODUCTS_EDIT: 'products.edit',
    PRODUCTS_DELETE: 'products.delete',

    // Inventory
    INVENTORY_VIEW: 'inventory.view',
    INVENTORY_ADJUST: 'inventory.adjust',

    // Customers
    CUSTOMERS_VIEW: 'customers.view',
    CUSTOMERS_CREATE: 'customers.create',
    CUSTOMERS_EDIT: 'customers.edit',
    CUSTOMERS_DELETE: 'customers.delete',
    // Allowing a customer to buy on kridi (and the limit) is the manager's decision
    CUSTOMERS_CREDIT: 'customers.credit',

    // Gift Cards
    GIFT_CARDS_VIEW: 'gift_cards.view',
    GIFT_CARDS_CREATE: 'gift_cards.create',
    GIFT_CARDS_RELOAD: 'gift_cards.reload',

    // Bundles
    BUNDLES_VIEW: 'bundles.view',
    BUNDLES_MANAGE: 'bundles.manage',

    // Promotions
    PROMOTIONS_VIEW: 'promotions.view',
    PROMOTIONS_MANAGE: 'promotions.manage',

    // Employees
    EMPLOYEES_VIEW: 'employees.view',
    EMPLOYEES_MANAGE: 'employees.manage',

    // Reports
    REPORTS_VIEW: 'reports.view',

    // Settings
    SETTINGS_VIEW: 'settings.view',
};

// Role-Permission mapping
export const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: [
        // All permissions
        ...Object.values(PERMISSIONS),
    ],

    [ROLES.MANAGER]: [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.POS_VIEW,
        PERMISSIONS.POS_VOID_SALE,
        PERMISSIONS.POS_APPLY_DISCOUNT,
        PERMISSIONS.PRODUCTS_VIEW,
        PERMISSIONS.PRODUCTS_CREATE,
        PERMISSIONS.PRODUCTS_EDIT,
        PERMISSIONS.INVENTORY_VIEW,
        PERMISSIONS.INVENTORY_ADJUST,
        PERMISSIONS.CUSTOMERS_VIEW,
        PERMISSIONS.CUSTOMERS_CREATE,
        PERMISSIONS.CUSTOMERS_EDIT,
        PERMISSIONS.CUSTOMERS_DELETE,
        PERMISSIONS.CUSTOMERS_CREDIT,
        PERMISSIONS.GIFT_CARDS_VIEW,
        PERMISSIONS.GIFT_CARDS_CREATE,
        PERMISSIONS.GIFT_CARDS_RELOAD,
        PERMISSIONS.BUNDLES_VIEW,
        PERMISSIONS.BUNDLES_MANAGE,
        PERMISSIONS.PROMOTIONS_VIEW,
        PERMISSIONS.PROMOTIONS_MANAGE,
        PERMISSIONS.REPORTS_VIEW,
    ],

    [ROLES.CASHIER]: [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.POS_VIEW,
        PERMISSIONS.PRODUCTS_VIEW,
        PERMISSIONS.INVENTORY_VIEW,
        PERMISSIONS.CUSTOMERS_VIEW,
        PERMISSIONS.CUSTOMERS_CREATE,
        PERMISSIONS.CUSTOMERS_EDIT,
        PERMISSIONS.GIFT_CARDS_VIEW,
    ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role, permission) {
    if (!role || !permission) return false;
    const rolePerms = ROLE_PERMISSIONS[role.toLowerCase()];
    if (!rolePerms) return false;
    return rolePerms.includes(permission);
}

/**
 * Get all permissions for a role
 */
export function getPermissionsForRole(role) {
    if (!role) return [];
    return ROLE_PERMISSIONS[role.toLowerCase()] || [];
}
`,w=`/**
 * What the sales screen offers, chosen by the owner (Settings › Sales
 * screen), saved in settings.pos_controls. The same rules hide the buttons in
 * the window and refuse the sale in the main process.
 *   discountCashier / discountManager  price lowered by hand on the ticket
 *   cashierMaxDiscount                  how far a cashier with the discount
 *                                       may go alone (%); above it a manager
 *                                       types their PIN. 100 = no limit.
 *   payCard / payTransfer / payCredit   payment methods offered
 * The owner (administrator) always has the discount, managers have no limit.
 * The discount is on: the button shows and the cashier uses it alone. Off:
 * the button is hidden and the main process refuses it.
 */
export const DEFAULT_POS_CONTROLS = {
    discountCashier: true,
    discountManager: true,
    cashierMaxDiscount: 100,
    payCard: true,
    payTransfer: true,
    payCredit: true,
};

export function resolvePosControls(saved) {
    const value = saved && typeof saved === 'object' ? saved : {};
    const out = {};
    for (const key of Object.keys(DEFAULT_POS_CONTROLS)) {
        if (typeof DEFAULT_POS_CONTROLS[key] === 'number') {
            const n = Number(value[key]);
            out[key] = value[key] === undefined || value[key] === null || value[key] === '' || !Number.isFinite(n)
                ? DEFAULT_POS_CONTROLS[key] : Math.min(100, Math.max(0, n));
        } else {
            out[key] = value[key] === undefined ? DEFAULT_POS_CONTROLS[key] : value[key] === true;
        }
    }
    return out;
}

/** May this role lower a price by hand? */
export function canDiscount(controls, role) {
    const c = resolvePosControls(controls);
    const r = String(role || '').toLowerCase();
    if (r === 'admin') return true;
    if (r === 'manager') return c.discountManager;
    return c.discountCashier;
}

const METHOD_KEYS = { card: 'payCard', transfer: 'payTransfer', credit: 'payCredit' };

/** Is this payment method offered? (cash and gift cards always are) */
export function methodAllowed(controls, method) {
    const key = METHOD_KEYS[method];
    return key ? resolvePosControls(controls)[key] : true;
}
`,v=`{
  "reseller": "",
  "supportPhone": "",
  "supportEmail": "",
  "supportWebsite": "",
  "updateUrl": "",
  "licensePublicKey": "",
  "githubClientId": "Ov23liQp12mnCqLWaXeY",
  "cloudflareClientId": "d5fbdf86179dd5b6d27fb408333257f3",
  "cloudflareScopes": [
    "d1.write",
    "workers-scripts.edit",
    "workers-scripts.metadata_read",
    "account-settings.read",
    "offline_access"
  ],
  "cloudflareRedirectPorts": [
    47651,
    47652,
    47653
  ],
  "domainProviders": []
}
`,N=`// Promotions applied at checkout. Pure functions so they can be tested.
// Shared by the sales screen (src/lib/promotions.js) and the main process,
// which checks the discount of each sale with the same rules.
//
// A promotion (promotions table) has: type ('percentage' | 'fixed' |
// 'threshold' | 'bogo'), value, min_purchase, max_discount, applies_to
// ('all' | 'category' | 'product'), applies_to_ids (JSON array), coupon_code,
// auto_apply, is_active, start_date, end_date, max_uses, current_uses.
//
// Only the best single promotion is applied (no stacking), which is how
// Algerian shops usually run "soldes": one offer per ticket.

const round = (n) => Math.round((Number(n) || 0) * 100) / 100;

export function parseIds(value) {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function toTime(value) {
    if (!value) return null;
    const text = String(value);
    // Dates picked in the form ("2025-06-01") cover the whole day
    const d = /^\\d{4}-\\d{2}-\\d{2}$/.test(text) ? new Date(\`\${text}T00:00:00\`) : new Date(text);
    return Number.isNaN(d.getTime()) ? null : d.getTime();
}

/** Is the promotion usable now (active, in its dates, uses left)? */
export function isPromotionLive(promo, now = Date.now()) {
    if (!promo || !promo.is_active) return false;
    const start = toTime(promo.start_date);
    let end = toTime(promo.end_date);
    if (end !== null && /^\\d{4}-\\d{2}-\\d{2}$/.test(String(promo.end_date))) end += 24 * 3600 * 1000 - 1;
    if (start !== null && now < start) return false;
    if (end !== null && now > end) return false;
    if (promo.max_uses && (promo.current_uses || 0) >= promo.max_uses) return false;
    return true;
}

/** Cart lines the promotion applies to. */
export function eligibleLines(promo, items) {
    const scope = promo.applies_to || 'all';
    if (scope === 'all') return items;
    const ids = new Set(parseIds(promo.applies_to_ids));
    if (scope === 'category') return items.filter(i => i.category_id && ids.has(i.category_id));
    if (scope === 'product') return items.filter(i => ids.has(i.product_id));
    return items;
}

const lineTotal = (item) => (Number(item.unit_price) || 0) * (Number(item.quantity) || 0);

/** Discount (DA) a promotion gives on these cart lines; 0 when it does not apply. */
export function promotionDiscount(promo, items) {
    const lines = eligibleLines(promo, items);
    const base = lines.reduce((sum, i) => sum + lineTotal(i), 0);
    if (base <= 0) return 0;
    const cartTotal = items.reduce((sum, i) => sum + lineTotal(i), 0);
    if ((Number(promo.min_purchase) || 0) > cartTotal) return 0;

    const value = Number(promo.value) || 0;
    let discount = 0;
    switch (promo.type) {
        case 'percentage':
        case 'threshold':
            discount = base * value / 100;
            break;
        case 'fixed':
            discount = Math.min(value, base);
            break;
        case 'bogo': {
            // Every second piece (the cheaper ones) free, or value% off if set
            const units = [];
            for (const i of lines) for (let k = 0; k < (Number(i.quantity) || 0); k++) units.push(Number(i.unit_price) || 0);
            units.sort((a, b) => a - b);
            const free = units.slice(0, Math.floor(units.length / 2)).reduce((a, b) => a + b, 0);
            discount = free * ((value > 0 && value < 100) ? value / 100 : 1);
            break;
        }
        default:
            discount = 0;
    }
    if (promo.max_discount) discount = Math.min(discount, Number(promo.max_discount));
    return round(Math.max(0, Math.min(discount, base)));
}

/**
 * Best promotion for the cart: among live auto-apply promotions, plus the one
 * matching the coupon code typed by the cashier.
 * @returns {{ promotion, amount } | null}
 */
export function bestPromotion(promotions, items, { coupon = '', now = Date.now() } = {}) {
    const code = String(coupon || '').trim().toLowerCase();
    let best = null;
    for (const promo of promotions || []) {
        if (!isPromotionLive(promo, now)) continue;
        const matchesCoupon = code && promo.coupon_code && promo.coupon_code.trim().toLowerCase() === code;
        if (!promo.auto_apply && !matchesCoupon) continue;
        if (promo.coupon_code && !matchesCoupon && !promo.auto_apply) continue;
        const amount = promotionDiscount(promo, items);
        if (amount > 0 && (!best || amount > best.amount)) best = { promotion: promo, amount };
    }
    return best;
}

/** "YYYY-MM-DD" of a local date, n days later. */
export function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    const pad = (v) => String(v).padStart(2, '0');
    return \`\${d.getFullYear()}-\${pad(d.getMonth() + 1)}-\${pad(d.getDate())}\`;
}

// Quick starts in the promotion form. Each only fills the form: the shop
// still types the percentage and can change everything before saving.
export const PROMOTION_PRESETS = ['season', 'category', 'product'];

/**
 * Form fields for a quick start:
 * - season: soldes on the whole shop, a percentage, from today for 30 days
 * - category: a percentage on some categories, from today
 * - product: a percentage on some articles, from today
 */
export function promotionPreset(kind, today = new Date()) {
    const start = addDays(today, 0);
    switch (kind) {
        case 'season':
            return { type: 'percentage', applies_to: 'all', applies_to_ids: [], start_date: start, end_date: addDays(today, 30), auto_apply: true, is_active: true };
        case 'category':
            return { type: 'percentage', applies_to: 'category', applies_to_ids: [], start_date: start, end_date: '', auto_apply: true, is_active: true };
        case 'product':
            return { type: 'percentage', applies_to: 'product', applies_to_ids: [], start_date: start, end_date: '', auto_apply: true, is_active: true };
        default:
            return {};
    }
}

/**
 * Price on the shelf label during a sale: the best live automatic
 * percentage / fixed promotion for one piece of this article (no minimum
 * purchase), or null when the article is not on sale. Coupons, packs (BOGO)
 * and thresholds are left to the till.
 */
export function labelSalePrice(promotions, { productId, categoryId = null, price }, now = Date.now()) {
    const unit = Number(price) || 0;
    if (unit <= 0) return null;
    const line = [{ product_id: productId, category_id: categoryId, quantity: 1, unit_price: unit }];
    let best = 0;
    for (const promo of promotions || []) {
        if (!promo.auto_apply || !isPromotionLive(promo, now)) continue;
        if (!['percentage', 'fixed'].includes(promo.type) || (Number(promo.min_purchase) || 0) > 0) continue;
        best = Math.max(best, promotionDiscount(promo, line));
    }
    return best > 0 ? round(unit - best) : null;
}
`,O=`/**
 * What a piece of a sale line was really paid: its share of the ticket after
 * the line's own discount and the ticket's discount (and with the TVA when
 * it was added on top). A return or an exchange gives back this, never more
 * than the customer paid. The returns screen and the main process use the
 * same rule.
 */
export function paidPerPiece(sale, line) {
    const quantity = Number(line?.quantity) || 0;
    if (quantity <= 0) return 0;
    const lineTotal = line.total === null || line.total === undefined
        ? quantity * (Number(line.unit_price) || 0) - (Number(line.discount) || 0)
        : Number(line.total) || 0;
    const subtotal = Number(sale?.subtotal) || 0;
    if (subtotal <= 0) return Math.max(0, lineTotal / quantity);
    const paidForGoods = (Number(sale.total) || 0) - (Number(sale.service_charge) || 0);
    return Math.max(0, (lineTotal / quantity) * (paidForGoods / subtotal));
}

export const roundMoney = (n) => Math.round((Number(n) || 0) * 100) / 100;

/** The most \`quantity\` pieces of this line can give back. */
export function lineRefund(sale, line, quantity) {
    return roundMoney(paidPerPiece(sale, line) * (Number(quantity) || 0));
}
`,L=`/**
 * The QR code printed on each ticket: "T" + the ticket number
 * (T202610100001). Scanned on the sales screen or in the sales history, it
 * opens that sale for a return or an exchange. The letter keeps it apart from
 * article codes (EAN/UPC are digits only); it is the same letter on AZERTY
 * and QWERTY scanners.
 */
export const TICKET_PREFIX = 'T';

export function ticketCode(receiptNumber) {
    return receiptNumber ? \`\${TICKET_PREFIX}\${receiptNumber}\` : '';
}

/** The ticket number of a scanned ticket QR, or null for anything else. */
export function parseTicketCode(code) {
    const m = /^\\s*T(\\d{12,})\\s*$/i.exec(String(code || ''));
    return m ? m[1] : null;
}
`,R=`/**
 * The owner's shops link, a Cloudflare Worker on the owner's own account
 * (made by Afus Boutique in the main shop; the owner never sees it).
 *
 *   GET    /health                 is the link up? (public)
 *   POST   /owner/codes            {"shopName"}: a one-time pairing code     } main
 *   PUT    /owner/catalog          the main shop's catalogue (JSON text)     } shop
 *   GET    /owner/shops            the shops linked                          } only
 *   DELETE /owner/shops/<id>       a shop unlinked                           }
 *   POST   /join                   {"code","shopName"} -> the new shop's key (public, limited)
 *   GET    /catalog                the catalogue (a linked shop, with its key)
 *
 * Security
 *   HTTPS only (workers.dev). The main shop: Authorization: Bearer <OWNER_KEY>.
 *   A linked shop: Authorization: Bearer <its key> + X-Afus-Shop: <its id>.
 *   Only hashes of keys and codes are kept; compared in constant time.
 *   A pairing code: 8 digits, one use, 15 minutes. Wrong codes: at most
 *   JOIN_FAIL_MAX in a quarter of an hour for the whole link, then joining
 *   waits (an 8-digit code cannot be guessed in a few tries).
 *
 * Bindings: DB (D1, schema.sql), OWNER_KEY (secret), GROUP_NAME (the owner's
 * name for the shops).
 */
const CODE_MINUTES = 15;
const MAX_LIVE_CODES = 5;
const JOIN_FAIL_MAX = 10;
const SLOT_MS = 15 * 60 * 1000;
const PART = 400000; // characters of catalogue per D1 row
const MAX_CATALOG = 40 * 1000 * 1000;
const NAME_MAX = 80;

const enc = new TextEncoder();
const hex = (buf) => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
const sha256 = async (text) => hex(await crypto.subtle.digest('SHA-256', enc.encode(String(text))));
const randomHex = (n) => hex(crypto.getRandomValues(new Uint8Array(n)));

function same(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

const HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Strict-Transport-Security': 'max-age=31536000', 'X-Content-Type-Options': 'nosniff' };
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: HEADERS });
const bearer = (request) => (request.headers.get('Authorization') || '').replace(/^Bearer\\s+/i, '');
const nameOf = (v) => String(v || '').replace(/[\\u0000-\\u001f<>]/g, '').trim().slice(0, NAME_MAX);

async function bodyJson(request, max = 4096) {
    const text = await request.text();
    if (text.length > max) return null;
    try { const v = JSON.parse(text); return v && typeof v === 'object' ? v : null; } catch { return null; }
}

async function isOwner(request, env) {
    const key = bearer(request);
    return !!key && !!env.OWNER_KEY && same(await sha256(key), await sha256(env.OWNER_KEY));
}

async function linkedShop(request, env) {
    const id = request.headers.get('X-Afus-Shop') || '';
    const key = bearer(request);
    if (!/^[a-f0-9]{32}$/.test(id) || !key) return null;
    const row = await env.DB.prepare('SELECT id, name, token_hash FROM shops WHERE id = ? AND removed = 0').bind(id).first();
    if (!row || !same(row.token_hash, await sha256(key))) return null;
    return row;
}

async function readCatalog(env) {
    const meta = await env.DB.prepare("SELECT value FROM meta WHERE key = 'catalog'").first();
    if (!meta) return null;
    const info = JSON.parse(meta.value);
    const rows = (await env.DB.prepare('SELECT data FROM catalog_parts WHERE part < ? ORDER BY part').bind(info.parts).all()).results || [];
    if (rows.length !== info.parts) return null;
    return { ...info, text: rows.map(r => r.data).join('') };
}

async function join(request, env, now) {
    const slot = Math.floor(now / SLOT_MS);
    const fails = await env.DB.prepare('SELECT count FROM join_failures WHERE slot = ?').bind(slot).first();
    if (fails && fails.count >= JOIN_FAIL_MAX) return json(429, { error: 'too_many_tries' });
    const body = await bodyJson(request);
    const code = String(body?.code || '').replace(/\\D/g, '');
    const shopName = nameOf(body?.shopName);
    const hash = /^\\d{8}$/.test(code) ? await sha256(code) : '';
    const row = hash && await env.DB.prepare('SELECT code_hash, shop_name, expires_at FROM pair_codes WHERE code_hash = ?').bind(hash).first();
    if (!row || row.expires_at < now) {
        await env.DB.prepare('INSERT INTO join_failures (slot, count) VALUES (?, 1) ON CONFLICT(slot) DO UPDATE SET count = count + 1').bind(slot).run();
        return json(403, { error: 'bad_code' });
    }
    const id = randomHex(16);
    const token = randomHex(32);
    const at = new Date(now).toISOString();
    await env.DB.batch([
        env.DB.prepare('DELETE FROM pair_codes WHERE code_hash = ?').bind(hash),
        env.DB.prepare('INSERT INTO shops (id, name, token_hash, joined_at, last_seen) VALUES (?, ?, ?, ?, ?)').bind(id, shopName || row.shop_name, await sha256(token), at, at),
    ]);
    return json(200, { shopId: id, token, shopName: shopName || row.shop_name, groupName: env.GROUP_NAME || '' });
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname.replace(/\\/+$/, '') || '/';
        const method = request.method;
        const now = Date.now();
        try {
            if (path === '/health' && method === 'GET') return json(200, { ok: true, app: 'afus-shops', version: 1 });
            if (path === '/join' && method === 'POST') return await join(request, env, now);

            if (path === '/catalog' && method === 'GET') {
                const shop = await linkedShop(request, env);
                if (!shop && !(await isOwner(request, env))) return json(401, { error: 'unauthorized' });
                if (shop) await env.DB.prepare('UPDATE shops SET last_seen = ? WHERE id = ?').bind(new Date(now).toISOString(), shop.id).run();
                const cat = await readCatalog(env);
                if (!cat) return json(404, { error: 'no_catalog' });
                return new Response(cat.text, { status: 200, headers: { ...HEADERS, 'X-Afus-Catalog-At': cat.at, 'X-Afus-Catalog-Hash': cat.hash } });
            }

            if (!path.startsWith('/owner/')) return json(404, { error: 'not_found' });
            if (!(await isOwner(request, env))) return json(401, { error: 'unauthorized' });

            if (path === '/owner/codes' && method === 'POST') {
                const body = await bodyJson(request);
                const shopName = nameOf(body?.shopName);
                if (!shopName) return json(400, { error: 'name_required' });
                await env.DB.prepare('DELETE FROM pair_codes WHERE expires_at < ?').bind(now).run();
                const live = await env.DB.prepare('SELECT COUNT(*) AS n FROM pair_codes').first();
                if ((live?.n || 0) >= MAX_LIVE_CODES) return json(429, { error: 'too_many_codes' });
                const digits = crypto.getRandomValues(new Uint32Array(1))[0] % 100000000;
                const code = String(digits).padStart(8, '0');
                const expiresAt = now + CODE_MINUTES * 60 * 1000;
                await env.DB.prepare('INSERT OR REPLACE INTO pair_codes (code_hash, shop_name, expires_at, created_at) VALUES (?, ?, ?, ?)')
                    .bind(await sha256(code), shopName, expiresAt, new Date(now).toISOString()).run();
                return json(200, { code, expiresAt: new Date(expiresAt).toISOString() });
            }
            if (path === '/owner/catalog' && method === 'PUT') {
                const text = await request.text();
                if (!text || text.length > MAX_CATALOG) return json(413, { error: 'too_large' });
                try { const v = JSON.parse(text); if (!v || v.version !== 1 || !Array.isArray(v.products)) throw new Error('shape'); } catch { return json(400, { error: 'bad_catalog' }); }
                const parts = [];
                for (let i = 0; i < text.length; i += PART) parts.push(text.slice(i, i + PART));
                const info = { parts: parts.length, at: new Date(now).toISOString(), hash: await sha256(text) };
                await env.DB.batch([
                    env.DB.prepare('DELETE FROM catalog_parts'),
                    ...parts.map((data, part) => env.DB.prepare('INSERT INTO catalog_parts (part, data) VALUES (?, ?)').bind(part, data)),
                    env.DB.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES ('catalog', ?)").bind(JSON.stringify(info)),
                ]);
                return json(200, { at: info.at, hash: info.hash });
            }
            if (path === '/owner/shops' && method === 'GET') {
                const rows = (await env.DB.prepare('SELECT id, name, joined_at, last_seen FROM shops WHERE removed = 0 ORDER BY joined_at').all()).results || [];
                return json(200, { shops: rows.map(r => ({ id: r.id, name: r.name, joinedAt: r.joined_at, lastSeen: r.last_seen })) });
            }
            const m = /^\\/owner\\/shops\\/([a-f0-9]{32})$/.exec(path);
            if (m && method === 'DELETE') {
                await env.DB.prepare('UPDATE shops SET removed = 1 WHERE id = ?').bind(m[1]).run();
                return json(200, { removed: true });
            }
            return json(404, { error: 'not_found' });
        } catch {
            return json(500, { error: 'server' });
        }
    },
};
`,I=`-- The owner's shops link (Cloudflare D1, on the owner's own account).
-- Made by Afus Boutique in the main shop; nothing here is a sale or a customer.
CREATE TABLE IF NOT EXISTS shops (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    joined_at TEXT NOT NULL,
    last_seen TEXT,
    removed INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS pair_codes (
    code_hash TEXT PRIMARY KEY,
    shop_name TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS catalog_parts (
    part INTEGER PRIMARY KEY,
    data TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS join_failures (
    slot INTEGER PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0
);
`,k=`Copyright 2009 The Cairo Project Authors (https://github.com/Gue3bara/Cairo)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
`,D=`/*
 * The shop website's script (published as assets/store.js, the only script
 * of the website: Content-Security-Policy script-src 'self').
 *
 *   - the cart, kept in this browser only (localStorage), never sent
 *     anywhere until the customer confirms the order on checkout.html
 *   - colour / size choice on an article page (what is available)
 *   - search, filters and sort of the lists of articles
 *   - cart and checkout pages, from search.json (the public catalogue:
 *     names, prices and availability the pages already show)
 *
 * Every shop text is put in the page with textContent, never as HTML.
 * Without this script the pages still show every article, and each article
 * page keeps its direct order form.
 */
(function () {
    'use strict';
    var base = location.pathname.replace(/[^/]*$/, '');
    var KEY = 'afus-cart-v1:' + base;
    var MAX_LINES = 30;
    var MAX_QTY = 20;
    var catalog = null;

    function readCart() {
        try {
            var list = JSON.parse(localStorage.getItem(KEY) || '[]');
            return Array.isArray(list) ? list.filter(function (l) { return l && typeof l.id === 'string'; }).slice(0, MAX_LINES) : [];
        } catch { return []; }
    }
    function writeCart(list) {
        try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_LINES))); } catch { /* private window: the cart lasts this page only */ }
        // Another cart is another order: a new order key
        try { sessionStorage.removeItem(ORDER_KEY); } catch { /* nothing kept */ }
        badges(list);
    }
    function count(list) { return list.reduce(function (n, l) { return n + (l.qty || 0); }, 0); }
    function badges(list) {
        var n = count(list || readCart());
        document.querySelectorAll('[data-cart-count]').forEach(function (el) {
            el.textContent = n > 99 ? '99+' : String(n);
            el.hidden = n === 0;
        });
    }
    function sameLine(a, b) { return a.id === b.id && (a.color || '') === (b.color || '') && (a.size || '') === (b.size || ''); }
    /** Adds to the cart (same article, colour and size: one line); 'capped' when 20 was reached. */
    function addLine(line) {
        var list = readCart();
        var found = list.filter(function (l) { return sameLine(l, line); })[0];
        var capped = false;
        if (found) { capped = found.qty + line.qty > MAX_QTY; found.qty = Math.min(MAX_QTY, found.qty + line.qty); }
        else if (list.length < MAX_LINES) list.push(line);
        else return false;
        writeCart(list);
        return capped ? 'capped' : true;
    }

    function loadCatalog() {
        if (catalog) return Promise.resolve(catalog);
        return fetch(base + 'search.json', { credentials: 'same-origin', cache: 'no-cache' })
            .then(function (r) { if (!r.ok) throw new Error('catalog'); return r.json(); })
            .then(function (data) { catalog = data; return data; });
    }

    /* The communes of each wilaya (assets/communes.json): the commune field becomes a list */
    var communes = null;
    function loadCommunes() {
        if (!communes) {
            communes = fetch(base + 'assets/communes.json', { credentials: 'same-origin' })
                .then(function (r) { if (!r.ok) throw new Error('communes'); return r.json(); })
                .catch(function () { return null; });
        }
        return communes;
    }
    /**
     * For each wilaya + commune pair of the form: once the list is there, the
     * typed field is swapped for a list of the chosen wilaya's communes (in the
     * page's language); without the list the typed field stays.
     */
    function communeLists(form, texts) {
        var ar = document.documentElement.lang === 'ar';
        [['wilaya', 'commune'], ['office_wilaya', 'office_commune']].forEach(function (pair) {
            var w = form.elements[pair[0]];
            var input = form.elements[pair[1]];
            if (!w || !input || input.tagName !== 'INPUT') return;
            loadCommunes().then(function (data) {
                if (!data) return;
                var select = document.createElement('select');
                select.required = true;
                select.disabled = input.disabled;
                select.setAttribute('data-commune-list', '');
                function fill() {
                    var list = data[String(parseInt(w.value, 10) || '')] || [];
                    var keep = select.value;
                    select.innerHTML = '';
                    var first = document.createElement('option');
                    first.value = '';
                    first.textContent = texts[list.length ? 'chooseCommune' : 'chooseWilayaFirst'] || '';
                    select.appendChild(first);
                    list.forEach(function (c) {
                        var o = document.createElement('option');
                        o.value = ar ? c[1] : c[0];
                        o.textContent = ar ? c[1] : c[0];
                        select.appendChild(o);
                    });
                    if (keep && list.some(function (c) { return (ar ? c[1] : c[0]) === keep; })) select.value = keep;
                }
                fill();
                // The typed text (when there was one) is kept if it is in the list
                if (input.value) select.value = input.value;
                input.removeAttribute('name');
                input.hidden = true;
                select.name = pair[1];
                input.parentNode.insertBefore(select, input.nextSibling);
                w.addEventListener('change', fill);
                // The block of a delivery not chosen turns its fields off: the list follows
                new MutationObserver(function () { select.disabled = input.disabled; }).observe(input, { attributes: true, attributeFilter: ['disabled'] });
            });
        });
    }

    /* Money as the pages write it ("1 234 567 د.ج") */
    function money(amount, fmt) {
        var value = Math.round((Number(amount) || 0) * 100) / 100;
        var whole = Math.floor(value);
        var cents = Math.round((value - whole) * 100);
        var digits = String(whole).replace(/\\B(?=(\\d{3})+(?!\\d))/g, fmt.group);
        return fmt.prefix + digits + (cents ? fmt.decimal + String(cents).padStart(2, '0') : '') + fmt.suffix;
    }
    function el(tag, cls, text) {
        var node = document.createElement(tag);
        if (cls) node.className = cls;
        if (text !== undefined && text !== null) node.textContent = text;
        return node;
    }
    function priced(fmt, amount) {
        var b = el('bdi', '', money(amount, fmt));
        b.dir = 'ltr';
        return b;
    }

    /* The shop's ads / visit tools (assets/track.js, when turned on): what was seen or ordered, no person */
    function track(event, data) {
        if (window.afusTrack) { window.afusTrack(event, data); return; }
        (window.afusTrackQueue = window.afusTrackQueue || []).push([event, data]);
    }

    /*
     * What an order costs, under its form: the goods, the coupon, the delivery
     * (the shop's price for the wilaya and the way chosen; the API works it
     * out again), the total. getLines() -> [{ id, cat, price, qty }].
     */
    function setupTotals(form, getLines) {
        var box = form.querySelector('[data-osum]');
        var texts = window.AFUS_TEXTS || {};
        var prices = {};
        try { prices = JSON.parse(form.getAttribute('data-delivery') || '{}') || {}; } catch { prices = {}; }
        var coupon = null;
        var fmt = null;
        function wilaya() { var w = form.elements.wilaya; return w ? parseInt(w.value, 10) || 0 : 0; }
        function way() { var d = form.elements.delivery; return (d && d.value) || 'home'; }
        function has(v) { return v !== null && v !== undefined; }
        function fee(goods) {
            var code = wilaya();
            if (!code) return undefined;
            var w = (prices.wilayas || []).filter(function (x) { return x.code === code; })[0];
            if (w && w.off) return false;
            var p = w && has(w[way()]) ? w[way()] : prices[way()];
            if (!has(p)) return null;
            return has(prices.freeOver) && goods >= prices.freeOver ? 0 : p;
        }
        function discount(lines) {
            if (!coupon) return 0;
            var all = lines.reduce(function (n, l) { return n + l.price * l.qty; }, 0);
            if (coupon.minPurchase && all < coupon.minPurchase) return 0;
            var base = lines.filter(function (l) {
                return coupon.appliesTo === 'all' || (coupon.appliesTo === 'product' && coupon.ids.indexOf(l.id) !== -1) || (coupon.appliesTo === 'category' && coupon.ids.indexOf(l.cat) !== -1);
            }).reduce(function (n, l) { return n + l.price * l.qty; }, 0);
            var d = coupon.type === 'percentage' ? base * coupon.value / 100 : Math.min(coupon.value, base);
            return Math.round(Math.max(0, d) * 100) / 100;
        }
        function put(sel, amount) {
            var e = box.querySelector(sel);
            if (!e) return;
            e.textContent = '';
            e.appendChild(priced(fmt, amount));
        }
        var last = { goods: 0, fee: null, discount: 0, total: 0 };
        function update() {
            if (!box || !fmt) return last;
            var lines = getLines();
            var goods = lines.reduce(function (n, l) { return n + l.price * l.qty; }, 0);
            var d = discount(lines);
            var f = fee(goods);
            put('[data-sum-goods]', goods);
            var row = box.querySelector('[data-sum-coupon-row]');
            if (row) row.hidden = !d;
            if (d) put('[data-sum-coupon]', -d);
            var de = box.querySelector('[data-sum-delivery]');
            if (f === undefined) de.textContent = texts.deliveryChoose || '';
            else if (f === null) de.textContent = texts.deliveryByPhone || '';
            else if (f === false) de.textContent = texts.notDelivered || '';
            else if (f === 0) de.textContent = texts.deliveryFree || '';
            else { de.textContent = ''; de.appendChild(priced(fmt, f)); }
            var total = goods - d + (typeof f === 'number' ? f : 0);
            put('[data-sum-total]', total);
            last = { goods: goods, fee: f, discount: d, total: total };
            return last;
        }
        loadCatalog().then(function (data) { fmt = data.money; update(); }).catch(function () { /* no figures: the shop gives them on the phone */ });
        form.addEventListener('change', update);
        form.addEventListener('input', function (e) { if (e.target.name === 'qty') update(); });

        // A coupon: checked by the shop's API (a few tries only), checked again when the order arrives
        var cbox = form.querySelector('[data-coupon]');
        var api = document.body.getAttribute('data-api');
        if (cbox && api) {
            var input = cbox.querySelector('input[name="coupon_try"]');
            var hidden = cbox.querySelector('input[name="coupon"]');
            var msg = cbox.querySelector('[data-coupon-msg]');
            var apply = function () {
                var code = String(input.value || '').trim();
                if (!code) { coupon = null; hidden.value = ''; msg.textContent = ''; update(); return; }
                fetch(api + '/api/coupon?code=' + encodeURIComponent(code), { credentials: 'omit' })
                    .then(function (r) { return r.json(); })
                    .then(function (j) {
                        coupon = j && j.ok ? { type: j.type, value: Number(j.value) || 0, appliesTo: j.appliesTo || 'all', ids: j.ids || [], minPurchase: Number(j.minPurchase) || 0 } : null;
                        hidden.value = coupon ? j.code : '';
                        msg.textContent = coupon ? (texts.couponOk || '') + (j.name ? ' — ' + j.name : '') : texts.couponBad || '';
                        msg.className = 'coupon-msg ' + (coupon ? 'is-ok' : 'is-bad');
                        update();
                    })
                    .catch(function () { msg.textContent = texts.couponDown || ''; msg.className = 'coupon-msg is-bad'; });
            };
            cbox.querySelector('[data-coupon-apply]').addEventListener('click', apply);
            input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); apply(); } });
        }
        return { update: update, last: function () { return last; } };
    }

    /* ---------- Article page: choose colour and size, add to cart ---------- */
    function setupAddForm(form) {
        var variants = [];
        try { variants = JSON.parse(form.getAttribute('data-variants') || '[]'); } catch { variants = []; }
        var hasColors = form.getAttribute('data-has-colors') === '1';
        var hasSizes = form.getAttribute('data-has-sizes') === '1';
        var msg = form.querySelector('[data-form-msg]');
        var submitter = 'add';
        function chosen(name) { var c = form.querySelector('input[name="' + name + '"]:checked'); return c ? c.value : ''; }
        function available(color, size) {
            return variants.some(function (v) { return v[2] && (!color || v[0] === color) && (!size || v[1] === size); });
        }
        var few = document.querySelector('[data-few]');
        var fewProduct = few ? !few.hidden : false;
        function refresh() {
            var color = chosen('color');
            var size = chosen('size');
            // "Few left": for the colour and size chosen (else the whole article)
            if (few) {
                var v = variants.filter(function (x) { return (x[0] || '') === color && (x[1] || '') === size; })[0];
                few.hidden = v ? !(v[2] && v[4]) : !fewProduct;
            }
            form.querySelectorAll('input[name="size"]').forEach(function (input) {
                var ok = available(color, input.value);
                input.disabled = !ok;
                input.parentNode.classList.toggle('is-off', !ok);
                if (!ok && input.checked) input.checked = false;
            });
            form.querySelectorAll('input[name="color"]').forEach(function (input) {
                var ok = available(input.value, size);
                input.parentNode.classList.toggle('is-off', !ok && !input.disabled);
            });
        }
        function say(text, good, link) {
            if (!msg) return;
            msg.textContent = text;
            msg.className = 'form-msg ' + (good ? 'is-ok' : 'is-bad');
            if (link) {
                var a = el('a', '', link.label);
                a.href = link.href;
                msg.appendChild(a);
            }
        }
        form.addEventListener('change', function (e) {
            // A colour or a size chosen: an old "choose first" message goes
            if ((e.target.name === 'color' || e.target.name === 'size') && msg && msg.classList.contains('is-bad')) { msg.textContent = ''; msg.className = 'form-msg'; }
            if (e.target.name === 'color') {
                // A new colour: the sizes of that colour become choosable again
                form.querySelectorAll('input[name="size"]').forEach(function (input) { input.disabled = false; });
            }
            refresh();
        });
        form.querySelectorAll('button[name="action"]').forEach(function (b) {
            b.addEventListener('click', function () { submitter = b.value; });
        });
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var texts = (window.AFUS_TEXTS || {});
            var action = (e.submitter && e.submitter.value) || submitter;
            var color = chosen('color');
            var size = chosen('size');
            if ((hasColors && !color) || (hasSizes && !size)) { say(texts.chooseFirst || '', false); return; }
            if (variants.length && !available(color, size)) { say(texts.notThisOne || '', false); return; }
            var qtyInput = form.querySelector('input[name="qty"]');
            var asked = parseInt(qtyInput && qtyInput.value, 10);
            if (!(asked >= 1 && asked <= MAX_QTY)) {
                if (qtyInput) qtyInput.value = String(Math.min(MAX_QTY, Math.max(1, asked || 1)));
                say(texts.maxQty || '', false);
                return;
            }
            var added = addLine({ id: form.getAttribute('data-id'), color: color, size: size, qty: asked });
            if (!added) return;
            track('add_to_cart', { id: form.getAttribute('data-id'), quantity: asked });
            if (action === 'buy') { location.href = base + 'checkout.html'; return; }
            say(added === 'capped' ? texts.maxQty || '' : texts.added || '', added !== 'capped', { label: texts.viewCart || '', href: base + 'cart.html' });
        });
        // The choice, for the order form under it: { ok, color, size, qty, price } or { ok: false, msg }
        form.afusChoice = function () {
            var texts = window.AFUS_TEXTS || {};
            var color = chosen('color');
            var size = chosen('size');
            if ((hasColors && !color) || (hasSizes && !size)) return { ok: false, msg: texts.chooseFirst || '' };
            if (variants.length && !available(color, size)) return { ok: false, msg: texts.notThisOne || '' };
            var qtyInput = form.querySelector('input[name="qty"]');
            var asked = parseInt(qtyInput && qtyInput.value, 10);
            if (!(asked >= 1 && asked <= MAX_QTY)) return { ok: false, msg: texts.maxQty || '' };
            var v = variants.filter(function (x) { return (x[0] || '') === color && (x[1] || '') === size; })[0];
            return { ok: true, color: color, size: size, qty: asked, price: v && v[3] !== null && v[3] !== undefined ? v[3] : null };
        };
        form.afusSay = say;
        // Quantity: - and + around the number (the number can still be typed)
        form.querySelectorAll('[data-step]').forEach(function (b) {
            b.addEventListener('click', function () {
                var input = form.querySelector('input[name="qty"]');
                var now = parseInt(input.value, 10) || 1;
                input.value = String(Math.min(MAX_QTY, Math.max(1, now + Number(b.getAttribute('data-step')))));
            });
        });
        setupBuyBar(form);
        refresh();
    }

    /* Phones: once "Order now" is scrolled away, a bar at the bottom keeps the price and the button */
    function setupBuyBar(form) {
        var bar = document.querySelector('[data-buy-bar]');
        var order = document.querySelector('[data-quick-order]');
        var buy = order || form.querySelector('[data-add]');
        if (!bar || !buy) return;
        // Only once the button is above the screen (the buyer read on), never before it.
        // Read on scroll, once per frame (a fast flick can jump over the button)
        var pending = false;
        function place() {
            pending = false;
            var show = buy.getBoundingClientRect().bottom < 0;
            if (bar.hidden === !show) return;
            bar.hidden = !show;
            document.body.classList.toggle('buybar-on', show);
        }
        window.addEventListener('scroll', function () {
            if (!pending) { pending = true; requestAnimationFrame(place); }
        }, { passive: true });
        place();
        bar.querySelector('[data-buy-now]').addEventListener('click', function () {
            // The order form: back to it, the first field ready; no form: Add to cart
            if (order) {
                form.scrollIntoView({ block: 'start', behavior: 'smooth' });
                var first = order.querySelector('input:not([type=hidden]):not([tabindex="-1"])');
                if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 400);
                return;
            }
            buy.scrollIntoView({ block: 'center', behavior: 'smooth' });
            if (form.requestSubmit) form.requestSubmit(buy); else buy.click();
        });
    }

    /* Article photos: swiped on phones (dots follow), chosen from the thumbnails */
    function setupGallery(root) {
        var track = root.querySelector('[data-track]');
        if (!track) return;
        var slides = track.children;
        var dots = root.querySelectorAll('.g-dots span');
        var thumbs = root.querySelectorAll('[data-go]');
        function current() {
            var w = track.clientWidth || 1;
            return Math.min(slides.length - 1, Math.round(Math.abs(track.scrollLeft) / w));
        }
        function mark(i) {
            dots.forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
            thumbs.forEach(function (t, k) { t.classList.toggle('is-on', k === i); });
        }
        var pending = false;
        track.addEventListener('scroll', function () {
            if (pending) return;
            pending = true;
            requestAnimationFrame(function () { pending = false; mark(current()); });
        }, { passive: true });
        thumbs.forEach(function (t) {
            t.addEventListener('click', function () {
                var i = Number(t.getAttribute('data-go')) || 0;
                if (slides[i]) track.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: 'smooth' });
                mark(i);
            });
        });
        mark(0);
    }

    /* ---------- Lists: search, filters, sort ---------- */
    function fold(text) {
        return String(text || '').toLowerCase()
            .replace(/[ً-ْـ]/g, '')
            .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
            .normalize('NFD').replace(/[̀-ͯ]/g, '');
    }
    function setupListing(root) {
        var form = root.querySelector('[data-filters]');
        var grid = root.querySelector('.grid');
        if (!form || !grid) return;
        var cards = Array.prototype.slice.call(grid.querySelectorAll('.card'));
        var counter = form.querySelector('[data-count]');
        var word = counter ? counter.textContent.replace(/^\\s*\\d+\\s*/, '') : '';
        var none = root.querySelector('[data-no-results]');
        var out = form.querySelector('[data-price-out]');
        var search = form.querySelector('[data-search-input]');
        var query = new URLSearchParams(location.search).get('q');
        if (search && query) search.value = query.slice(0, 80);
        cards.forEach(function (c) { c.setAttribute('data-fold', fold(c.getAttribute('data-search'))); });

        function values(name) {
            return Array.prototype.slice.call(form.querySelectorAll('input[name="' + name + '"]:checked')).map(function (i) { return i.value; });
        }
        function apply() {
            var words = search ? fold(search.value).split(/\\s+/).filter(Boolean) : [];
            var sizes = values('size');
            var colors = values('color');
            var maxInput = form.querySelector('input[name="max"]');
            var max = maxInput ? Number(maxInput.value) : Infinity;
            var onlyIn = !!form.querySelector('input[name="available"]:checked');
            var onlySale = !!form.querySelector('input[name="sale"]:checked');
            if (out && maxInput) out.textContent = maxInput.value;
            var shown = 0;
            cards.forEach(function (c) {
                var text = c.getAttribute('data-fold');
                var cs = (c.getAttribute('data-sizes') || '').split('|');
                var cc = (c.getAttribute('data-colors') || '').split('|');
                var ok = words.every(function (w) { return text.indexOf(w) !== -1; })
                    && (!sizes.length || sizes.some(function (s) { return cs.indexOf(s) !== -1; }))
                    && (!colors.length || colors.some(function (s) { return cc.indexOf(s) !== -1; }))
                    && Number(c.getAttribute('data-price')) <= max
                    && (!onlyIn || c.getAttribute('data-available') === '1')
                    && (!onlySale || c.getAttribute('data-sale') === '1');
                c.hidden = !ok;
                if (ok) shown++;
            });
            var sortBy = (form.querySelector('select[name="sort"]') || {}).value || 'new';
            var num = function (c, k) { return Number(c.getAttribute(k)) || 0; };
            var sorted = cards.slice().sort(function (a, b) {
                if (sortBy === 'price-up') return num(a, 'data-price') - num(b, 'data-price');
                if (sortBy === 'price-down') return num(b, 'data-price') - num(a, 'data-price');
                if (sortBy === 'name') return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
                if (sortBy === 'best') return num(a, 'data-best') - num(b, 'data-best');
                return String(b.getAttribute('data-new')).localeCompare(String(a.getAttribute('data-new')));
            });
            sorted.forEach(function (c) { grid.appendChild(c); });
            if (counter) counter.textContent = shown + ' ' + word;
            if (none) none.hidden = shown !== 0;
            grid.hidden = shown === 0;
        }
        form.addEventListener('input', apply);
        form.addEventListener('change', apply);
        form.addEventListener('submit', function (e) { e.preventDefault(); apply(); });
        form.addEventListener('reset', function () { setTimeout(function () { if (search) search.value = ''; apply(); }, 0); });
        apply();
    }

    /* ---------- Cart and checkout ---------- */
    function linesOf(data) {
        var byId = {};
        data.products.forEach(function (p) { byId[p.id] = p; });
        var kept = [];
        var lines = readCart().map(function (l) {
            var p = byId[l.id];
            if (!p || !p.available) return null;
            var price = p.price;
            if (p.variants.length) {
                var v = p.variants.filter(function (x) { return (x[0] || '') === (l.color || '') && (x[1] || '') === (l.size || ''); })[0];
                if (!v || !v[2]) return null;
                if (v[3] !== null && v[3] !== undefined) price = v[3];
            }
            kept.push(l);
            return { line: l, product: p, price: price };
        }).filter(Boolean);
        // Articles sold out or removed by the shop leave the cart
        if (kept.length !== readCart().length) writeCart(kept);
        return lines;
    }
    function lineNode(item, data, tools, onChange) {
        var row = el('div', 'cart-line');
        row.setAttribute('data-id', item.line.id);
        row.setAttribute('data-color', item.line.color || '');
        row.setAttribute('data-size', item.line.size || '');
        var img = el('img');
        img.src = item.product.image;
        img.alt = '';
        img.loading = 'lazy';
        var info = el('div');
        var name = el('a', 'line-name', item.product.name);
        name.href = item.product.url;
        info.appendChild(name);
        var opts = [item.line.color, item.line.size].filter(Boolean).join(' · ');
        info.appendChild(el('span', 'line-opts', opts + (tools ? '' : (opts ? ' · ' : '') + '× ' + item.line.qty)));
        if (tools) {
            var box = el('div', 'line-tools');
            var minus = el('button', '', '−');
            var plus = el('button', '', '+');
            var remove = el('button', 'line-remove', data.texts.remove);
            [minus, plus, remove].forEach(function (b) { b.type = 'button'; });
            minus.setAttribute('aria-label', '-1');
            plus.setAttribute('aria-label', '+1');
            // 1 to 20 pieces a line; "remove" takes the line out
            minus.disabled = item.line.qty <= 1;
            plus.disabled = item.line.qty >= MAX_QTY;
            minus.addEventListener('click', function () { onChange(item.line, Math.max(1, item.line.qty - 1)); });
            plus.addEventListener('click', function () { onChange(item.line, Math.min(MAX_QTY, item.line.qty + 1)); });
            remove.addEventListener('click', function () { onChange(item.line, 0); });
            box.appendChild(minus);
            box.appendChild(el('span', 'line-qty', String(item.line.qty)));
            box.appendChild(plus);
            box.appendChild(remove);
            info.appendChild(box);
        }
        var price = el('span', 'line-price');
        price.appendChild(priced(data.money, item.price * item.line.qty));
        row.appendChild(img);
        row.appendChild(info);
        row.appendChild(price);
        return row;
    }
    function total(lines) { return lines.reduce(function (s, i) { return s + i.price * i.line.qty; }, 0); }
    function setQty(line, qty) {
        var list = readCart();
        list.forEach(function (l) { if (sameLine(l, line)) l.qty = qty; });
        writeCart(list.filter(function (l) { return l.qty > 0; }));
    }
    function fillSum(root, data, lines) {
        root.querySelectorAll('[data-cart-sum]').forEach(function (s) {
            s.textContent = '';
            s.appendChild(priced(data.money, total(lines)));
        });
    }

    function setupCart(root) {
        function draw() {
            loadCatalog().then(function (data) {
                var lines = linesOf(data);
                var box = root.querySelector('[data-cart-lines]');
                box.textContent = '';
                lines.forEach(function (item) { box.appendChild(lineNode(item, data, true, function (l, q) { setQty(l, q); draw(); })); });
                root.querySelector('[data-cart-empty]').hidden = lines.length > 0;
                root.querySelector('[data-cart-total]').hidden = lines.length === 0;
                fillSum(root, data, lines);
            }).catch(function () { /* catalogue not reachable: the page stays as it is */ });
        }
        draw();
    }

    /* Same rules as the shop's API (worker.mjs) */
    function algerianPhone(text) {
        var d = String(text || '').replace(/[\\s.-]/g, '');
        if (/[^\\d+]/.test(d)) return '';
        d = d.replace(/^(\\+|00)213/, '0');
        return /^0[5-7]\\d{8}$/.test(d) || /^0[1-49]\\d{7}$/.test(d) ? d : '';
    }
    var CHECKS = {
        customer_name: ['errFullName', function (v) { return v.length >= 3; }],
        first_name: ['errName', function (v) { return v.length >= 2; }],
        last_name: ['errName', function (v) { return v.length >= 2; }],
        phone: ['errPhone', function (v) { return !!algerianPhone(v); }],
        wilaya: ['errWilaya', function (v) { return !!v; }],
        commune: ['errCommune', function (v) { return v.length >= 2; }],
        address: ['errAddress', function (v) { return v.length >= 3; }],
        courier_company: ['errCourier', function (v) { return !!v; }],
        office_wilaya: ['errWilaya', function (v) { return !!v; }],
        office_commune: ['errCommune', function (v) { return v.length >= 2; }],
        courier_office: ['errOffice', function (v) { return v.length >= 2; }],
    };

    /**
     * The checks of an order form (the checkout, the form on an article's page):
     * each field says what is wrong next to it; the fields of the delivery not
     * chosen are off (not checked, not sent).
     */
    function orderChecks(form, texts) {
        var msg = form.querySelector('[data-form-msg]');
        var tried = false;
        // Home delivery: the address; courier office: what the form asks for it
        function delivery() { var d = form.elements.delivery; return (d && d.value) || 'home'; }
        var live = !(form.querySelector('[data-confirm]') || {}).disabled;
        function showDelivery() {
            if (!live) return;
            var chosen = delivery();
            form.querySelectorAll('[data-when]').forEach(function (block) {
                var on = block.getAttribute('data-when') === chosen;
                block.hidden = !on;
                block.querySelectorAll('input, select, textarea').forEach(function (f) { f.disabled = !on; });
            });
        }
        function check(name) {
            var f = form.elements[name];
            if (!f || !CHECKS[name]) return true;
            // A field of the delivery not chosen: nothing to say about it
            var ok = f.disabled || CHECKS[name][1](String(f.value || '').trim());
            var box = form.querySelector('[data-field="' + name + '"]');
            var err = form.querySelector('[data-err-for="' + name + '"]');
            if (box) box.classList.toggle('is-bad', !ok);
            if (err) { err.textContent = ok ? '' : texts[CHECKS[name][0]] || ''; err.hidden = ok; }
            f.setAttribute('aria-invalid', ok ? 'false' : 'true');
            return ok;
        }
        function checkAll() {
            var first = null;
            Object.keys(CHECKS).forEach(function (name) { if (!check(name) && !first) first = form.elements[name]; });
            return first;
        }
        // After a first try: the message under the button goes once all is right
        function recheck() { if (!checkAll() && msg) msg.hidden = true; }
        form.addEventListener('change', function (e) {
            if (e.target.name === 'delivery') showDelivery();
            // The office is usually in the customer's wilaya
            if (e.target.name === 'wilaya' && form.elements.office_wilaya && !form.elements.office_wilaya.value) {
                form.elements.office_wilaya.value = e.target.value;
                // Its commune list follows
                form.elements.office_wilaya.dispatchEvent(new Event('change'));
            }
            if (tried) recheck(); else if (e.target.name) check(e.target.name);
        });
        form.addEventListener('input', function (e) { if (tried && e.target.name) { check(e.target.name); recheck(); } });
        showDelivery();
        communeLists(form, texts);
        /** On sending: the first wrong field (and the message under the button), or null. */
        function verify() {
            tried = true;
            var first = checkAll();
            if (msg) { msg.textContent = first ? texts.errForm || '' : ''; msg.hidden = !first; }
            return first;
        }
        return { verify: verify, delivery: delivery };
    }

    function setupCheckout(root) {
        var form = root.querySelector('[data-checkout-form]');
        if (!form) return;
        var texts = window.AFUS_TEXTS || {};
        var sending = false;
        var checks = orderChecks(form, texts);
        var current = [];
        var totals = setupTotals(form, function () { return current; });

        // One key per order (kept until the thanks page): sent twice, it is still one order
        var keyField = form.querySelector('[data-order-key]');
        if (keyField) keyField.value = orderKey();

        var ready = false;
        loadCatalog().then(function (data) {
            var lines = linesOf(data);
            var box = root.querySelector('[data-summary-lines]');
            box.textContent = '';
            lines.forEach(function (item) { box.appendChild(lineNode(item, data, false)); });
            fillSum(root, data, lines);
            current = lines.map(function (i) { return { id: i.product.id, cat: i.product.cat || '', price: i.price, qty: i.line.qty }; });
            totals.update();
            if (lines.length) track('begin_checkout', { value: total(lines), quantity: lines.reduce(function (n, i) { return n + i.line.qty; }, 0) });
            root.classList.toggle('is-empty', lines.length === 0);
            if (!lines.length) {
                box.appendChild(el('p', 'empty', data.texts.cartEmpty));
                return;
            }
            form.querySelector('[data-items]').value = JSON.stringify(lines.map(function (i) {
                return { product_id: i.product.id, product_name: i.product.name, color: i.line.color || '', size: i.line.size || '', quantity: i.line.qty, unit_price: i.price };
            }));
            form.querySelector('[data-first-id]').value = lines[0].product.id;
            form.querySelector('[data-first-name]').value = lines[0].product.name + (lines.length > 1 ? ' +' + (lines.length - 1) : '');
            ready = true;
        }).catch(function () { root.classList.add('is-empty'); });

        form.addEventListener('submit', function (e) {
            var first = checks.verify();
            if (sending || !ready || first) {
                e.preventDefault();
                if (first) first.focus();
                return;
            }
            sending = true;
            remember(totals.update().total, current.length === 1 ? current[0].id : '', '', current.reduce(function (n, l) { return n + l.qty; }, 0));
            var button = form.querySelector('[data-confirm]');
            // Sent once (a second press would send a second order)
            if (button) setTimeout(function () { button.disabled = true; }, 0);
        });
    }

    /*
     * The order form on an article's page: the colour, size and quantity chosen
     * above go with it (one line); "Order on WhatsApp" writes the same in the chat.
     */
    function setupQuickOrder(form) {
        var texts = window.AFUS_TEXTS || {};
        var add = document.querySelector('[data-add-form]');
        var checks = orderChecks(form, texts);
        var sending = false;
        var keyField = form.querySelector('[data-order-key]');
        if (keyField) keyField.value = orderKey();
        function choice() { return add && add.afusChoice ? add.afusChoice() : { ok: true, color: '', size: '', qty: 1, price: null }; }
        function value(name) { var f = form.elements[name]; return f && !f.disabled ? String(f.value || '').trim() : ''; }
        // The price the customer pays: the cart's (search.json: the sale applied to each colour and size)
        var pid = form.elements.product_id.value;
        var listed = null;
        loadCatalog().then(function (data) { listed = data.products.filter(function (p) { return p.id === pid; })[0] || null; totals.update(); }).catch(function () { /* the page's price */ });
        function unitPrice(c) {
            if (listed && listed.variants.length) {
                var v = listed.variants.filter(function (x) { return (x[0] || '') === (c.color || '') && (x[1] || '') === (c.size || ''); })[0];
                if (v && v[3] !== null && v[3] !== undefined) return v[3];
            }
            return listed ? listed.price : Number(form.getAttribute('data-price')) || 0;
        }
        var totals = setupTotals(form, function () {
            var c = choice();
            return [{ id: pid, cat: form.getAttribute('data-cat') || '', price: unitPrice(c), qty: c.ok ? c.qty : (c.qty || 1) }];
        });
        if (add) add.addEventListener('change', function () { totals.update(); });
        if (add) add.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-step]')) setTimeout(totals.update, 0); });
        track('view_item', { id: pid, name: form.elements.product_name.value, value: Number(form.getAttribute('data-price')) || 0, quantity: 1 });

        form.addEventListener('submit', function (e) {
            var c = choice();
            if (!c.ok) {
                e.preventDefault();
                if (add && add.afusSay) add.afusSay(c.msg, false);
                if (add) add.scrollIntoView({ block: 'center', behavior: 'smooth' });
                return;
            }
            var first = checks.verify();
            if (sending || first) {
                e.preventDefault();
                if (first) first.focus();
                return;
            }
            var price = unitPrice(c);
            var sum = totals.update();
            remember(sum.total, pid, form.elements.product_name.value, c.qty);
            track('begin_checkout', { id: pid, name: form.elements.product_name.value, value: sum.total, quantity: c.qty });
            form.querySelector('[data-items]').value = JSON.stringify([{
                product_id: form.elements.product_id.value, product_name: form.elements.product_name.value,
                color: c.color || '', size: c.size || '', quantity: c.qty, unit_price: Number.isFinite(price) ? price : null,
            }]);
            sending = true;
            var button = form.querySelector('[data-confirm]');
            if (button) setTimeout(function () { button.disabled = true; }, 0);
        });

        // WhatsApp: the article, the choice and what is already filled in, in the message
        var wa = form.querySelector('[data-wa]');
        if (wa) wa.addEventListener('click', function () {
            var c = choice();
            var lines = [(texts.orderText || '') + ' ' + form.elements.product_name.value];
            if (c.color) lines.push((texts.waColor || '') + ': ' + c.color);
            if (c.size) lines.push((texts.waSize || '') + ': ' + c.size);
            if (c.qty) lines.push((texts.waQty || '') + ': ' + c.qty);
            [['customer_name', 'fullName'], ['phone', 'yourPhone'], ['wilaya', 'wilaya'], ['commune', 'commune'], ['address', 'addressField']].forEach(function (f) {
                var v = value(f[0]);
                if (v) lines.push((texts[f[1]] || f[1]) + ': ' + v);
            });
            var d = checks.delivery();
            lines.push((texts.waDelivery || '') + ': ' + (texts[d === 'office' ? 'deliveryOffice' : 'deliveryHome'] || d));
            wa.href = 'https://wa.me/' + wa.getAttribute('data-wa') + '?text=' + encodeURIComponent(lines.join('\\n'));
        });
    }

    /* The order's value, kept until the thanks page (the ads tools are told the order went through) */
    var LAST = 'afus-last-order-v1';
    function remember(value, id, name, qty) {
        try { sessionStorage.setItem(LAST, JSON.stringify({ value: value, id: id, name: name, quantity: qty })); } catch { /* private window */ }
    }
    function purchased() {
        var x = null;
        try { x = JSON.parse(sessionStorage.getItem(LAST) || 'null'); sessionStorage.removeItem(LAST); } catch { x = null; }
        if (x) track('purchase', x);
    }

    /* How many times the page was seen: its name only, to the shop's own API (no person, no cookie) */
    function countView() {
        var api = document.body.getAttribute('data-api');
        var page = document.body.getAttribute('data-page');
        if (!api || !page || !navigator.sendBeacon) return;
        try { navigator.sendBeacon(api + '/api/view', page); } catch { /* not counted */ }
    }

    /* The order key of the checkout (idempotency): random, the same until the order is through */
    var ORDER_KEY = 'afus-order-key-v1:' + base;
    function randomKey() {
        if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
        var bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);
        return Array.prototype.map.call(bytes, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    }
    function orderKey() {
        var key = null;
        try { key = sessionStorage.getItem(ORDER_KEY); } catch { key = null; }
        if (!key || !/^[A-Za-z0-9-]{16,64}$/.test(key)) {
            key = randomKey();
            try { sessionStorage.setItem(ORDER_KEY, key); } catch { /* private window: one key for this page */ }
        }
        return key;
    }

    /* After the order: the cart is empty again (only when the cart was sent), a new key next time */
    function afterOrder() {
        if (!document.body.classList.contains('page-thanks')) return;
        purchased();
        if (new URLSearchParams(location.search).get('cart') === '1') writeCart([]);
        try { sessionStorage.removeItem(ORDER_KEY); } catch { /* nothing kept */ }
    }

    function start() {
        try { window.AFUS_TEXTS = JSON.parse(document.body.getAttribute('data-texts') || '{}'); } catch { window.AFUS_TEXTS = {}; }
        afterOrder();
        badges();
        countView();
        document.querySelectorAll('[data-add-form]').forEach(setupAddForm);
        document.querySelectorAll('[data-gallery]').forEach(setupGallery);
        document.querySelectorAll('[data-quick-order]').forEach(setupQuickOrder);
        document.querySelectorAll('[data-listing]').forEach(setupListing);
        document.querySelectorAll('[data-cart-page]').forEach(setupCart);
        document.querySelectorAll('[data-checkout]').forEach(setupCheckout);
        // Another tab changed the cart
        window.addEventListener('storage', function (e) { if (e.key === KEY) badges(); });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
`,M=`/*
 * The ads and visit tools the shop turned on (Website screen › Settings ›
 * Ads & analytics): Meta (Facebook / Instagram) Pixel, TikTok Pixel, Snap
 * Pixel, Google Analytics 4. Only on the shop's published website, only the
 * ones with an id; their own scripts from their own addresses (allowed one by
 * one by the page's Content-Security-Policy). Nothing about the customer is
 * sent by the shop's own pages: the events say what was seen or ordered
 * (article, price, quantity), never a name, phone or address.
 *
 * window.afusTrack(event, data) — events: view_item, add_to_cart,
 * begin_checkout, purchase (data: { id, name, value, currency, quantity }).
 */
(function () {
    'use strict';
    var ids = {};
    try { ids = JSON.parse(document.body.getAttribute('data-track') || '{}') || {}; } catch { ids = {}; }
    var currency = document.body.getAttribute('data-currency') || 'DZD';
    function load(src) { var s = document.createElement('script'); s.async = true; s.src = src; document.head.appendChild(s); }

    // Meta Pixel (its documented loader, without inline code)
    if (/^\\d{10,20}$/.test(ids.facebook || '')) {
        var f = window.fbq = function () { f.callMethod ? f.callMethod.apply(f, arguments) : f.queue.push(arguments); };
        if (!window._fbq) window._fbq = f;
        f.push = f; f.loaded = true; f.version = '2.0'; f.queue = [];
        load('https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', ids.facebook);
        window.fbq('track', 'PageView');
    }
    // TikTok Pixel
    if (/^[A-Z0-9]{15,30}$/.test(ids.tiktok || '')) {
        var ttq = window.ttq = window.ttq || [];
        ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'];
        ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
        for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
        load('https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=' + encodeURIComponent(ids.tiktok) + '&lib=ttq');
        ttq.page();
    }
    // Snap Pixel
    if (/^[0-9a-f-]{36}$/.test(ids.snapchat || '')) {
        var a = window.snaptr = function () { a.handleRequest ? a.handleRequest.apply(a, arguments) : a.queue.push(arguments); };
        a.queue = [];
        load('https://sc-static.net/scevent.min.js');
        window.snaptr('init', ids.snapchat, {});
        window.snaptr('track', 'PAGE_VIEW');
    }
    // Google Analytics 4
    if (/^G-[A-Z0-9]{6,14}$/.test(ids.google || '')) {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        load('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ids.google));
        window.gtag('js', new Date());
        window.gtag('config', ids.google, { anonymize_ip: true });
    }

    var META = { view_item: 'ViewContent', add_to_cart: 'AddToCart', begin_checkout: 'InitiateCheckout', purchase: 'Purchase' };
    var TIKTOK = { view_item: 'ViewContent', add_to_cart: 'AddToCart', begin_checkout: 'InitiateCheckout', purchase: 'CompletePayment' };
    var SNAP = { view_item: 'VIEW_CONTENT', add_to_cart: 'ADD_CART', begin_checkout: 'START_CHECKOUT', purchase: 'PURCHASE' };
    window.afusTrack = function (event, data) {
        var d = data || {};
        var value = Number(d.value) || 0;
        try {
            if (window.fbq && META[event]) window.fbq('track', META[event], { content_ids: d.id ? [d.id] : [], content_name: d.name || '', content_type: 'product', value: value, currency: currency });
            if (window.ttq && TIKTOK[event]) window.ttq.track(TIKTOK[event], { content_id: d.id || '', content_name: d.name || '', content_type: 'product', quantity: d.quantity || 1, value: value, currency: currency });
            if (window.snaptr && SNAP[event]) window.snaptr('track', SNAP[event], { item_ids: d.id ? [d.id] : [], price: value, currency: currency, number_items: d.quantity || 1 });
            if (window.gtag) window.gtag('event', event, { currency: currency, value: value, items: d.id ? [{ item_id: d.id, item_name: d.name || '', quantity: d.quantity || 1, price: value }] : [] });
        } catch { /* a tool that failed never stops the page */ }
    };
    // Events said before this file was read (the page's own script is first)
    var early = window.afusTrackQueue || [];
    window.afusTrackQueue = { push: function (x) { window.afusTrack(x[0], x[1]); } };
    for (var k = 0; k < early.length; k++) window.afusTrack(early[k][0], early[k][1]);
}());
`,C=`# Built-in website photos

Shown on a shop's website only until the shop adds its own pictures (hero picture,
article photos). All from Unsplash, under the Unsplash License
(https://unsplash.com/license): free for commercial use, no attribution required.
Resized to WebP by images.unsplash.com.

| File | Unsplash photo |
|---|---|
| hero-store.webp | https://unsplash.com/photos/P3pI6xzovu0 |
| hero-boutique.webp | https://unsplash.com/photos/qnKhZJPKFD8 |
| hero-rack.webp | https://unsplash.com/photos/dlxLGIy-2VU |
| women.webp | https://unsplash.com/photos/nimElTcTNyY |
| women-2.webp | https://unsplash.com/photos/BteCp6aq4GI |
| men.webp | https://unsplash.com/photos/hNoSCxPWYII |
| shirts.webp | https://unsplash.com/photos/tvG4WvjgsEY |
| kids.webp | https://unsplash.com/photos/n9R0MN3XGvY |
| kids-2.webp | https://unsplash.com/photos/kPXq-jxhMkk |
| shoes.webp | https://unsplash.com/photos/a-QH9MAAVNI |
| bags.webp | https://unsplash.com/photos/oCXVxwTFwqE |
| folded.webp | https://unsplash.com/photos/tWOz2_EK5EQ |
| jackets.webp | https://unsplash.com/photos/zw_oaDbfzyE |
| sale.webp | https://unsplash.com/photos/uaWMyAIpF2g |

Theme photos (one set per theme: its own hero and lookbook pictures), same licence,
from images.unsplash.com:

| File | Unsplash image |
|---|---|
| look-coats.webp | https://images.unsplash.com/photo-1445205170230-053b83016050 |
| look-suit.webp | https://images.unsplash.com/photo-1594938298603-c8148c4dae35 |
| look-suit-dark.webp | https://images.unsplash.com/photo-1507679799987-c73779587ccf |
| look-street.webp | https://images.unsplash.com/photo-1503341504253-dff4815485f1 |
| look-sneakers.webp | https://images.unsplash.com/photo-1552346154-21d32810aba3 |
| look-sneakers-2.webp | https://images.unsplash.com/photo-1556906781-9a412961c28c |
| look-runner.webp | https://images.unsplash.com/photo-1595341888016-a392ef81b7de |
| look-sport.webp | https://images.unsplash.com/photo-1517836357463-d25dfeac3438 |
| look-fitness.webp | https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b |
| look-kid.webp | https://images.unsplash.com/photo-1471286174890-9c112ffca5b4 |
| look-kids.webp | https://images.unsplash.com/photo-1503944583220-79d8926ad5e2 |
| look-girl.webp | https://images.unsplash.com/photo-1518831959646-742c3a14ebf7 |
| look-baby.webp | https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8 |
| look-knit.webp | https://images.unsplash.com/photo-1556905055-8f358a7a47b2 |
| look-neutral.webp | https://images.unsplash.com/photo-1558769132-cb1aea458c5e |
| look-coat-street.webp | https://images.unsplash.com/photo-1485968579580-b6d095142e6e |
| look-scarf.webp | https://images.unsplash.com/photo-1539109136881-3be0616acf4b |
| look-shopping.webp | https://images.unsplash.com/photo-1483985988355-763728e1935b |
| look-flatlay.webp | https://images.unsplash.com/photo-1525507119028-ed4c629a60a3 |
| look-denim.webp | https://images.unsplash.com/photo-1542272604-787c3835535d |
| look-tee.webp | https://images.unsplash.com/photo-1581655353564-df123a1eb820 |
| look-rack-color.webp | https://images.unsplash.com/photo-1532453288672-3a27e9be9efd |
| look-classic-flat.webp | https://images.unsplash.com/photo-1490114538077-0a7f8cb49891 |
`,B=`-- The shop's website database (Cloudflare D1, on the shop's own account).
-- No article is kept here: the articles stay in Afus Boutique (SQLite) and
-- are published as pages. A waiting room for the customers' orders: each
-- one stays until Afus Boutique saved it in the shop's SQLite and said so
-- (ack), then it is deleted. Also what was last published.
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL DEFAULT '',
    size TEXT NOT NULL DEFAULT '',
    color TEXT NOT NULL DEFAULT '',
    quantity INTEGER NOT NULL DEFAULT 1,
    customer_name TEXT NOT NULL,
    first_name TEXT NOT NULL DEFAULT '',
    last_name TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL,
    wilaya TEXT NOT NULL DEFAULT '',
    commune TEXT NOT NULL DEFAULT '',
    address TEXT NOT NULL DEFAULT '',
    delivery TEXT NOT NULL DEFAULT '',
    courier_company TEXT NOT NULL DEFAULT '',
    office_wilaya TEXT NOT NULL DEFAULT '',
    office_commune TEXT NOT NULL DEFAULT '',
    courier_office TEXT NOT NULL DEFAULT '',
    items TEXT NOT NULL DEFAULT '[]',
    note TEXT NOT NULL DEFAULT '',
    ip_hash TEXT NOT NULL DEFAULT '',
    order_key TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new',
    delivery_fee REAL,
    coupon_code TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS orders_created ON orders (created_at);
CREATE INDEX IF NOT EXISTS orders_ip ON orders (ip_hash, created_at);
-- The checkout's order keys (idempotency), kept 30 days after the order
CREATE TABLE IF NOT EXISTS order_keys (
    order_key TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    created_at TEXT NOT NULL
);
-- Counts for the limits (orders, wrong keys) per place (hashed), kept one day
CREATE TABLE IF NOT EXISTS hits (
    kind TEXT NOT NULL,
    who TEXT NOT NULL,
    created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS hits_who ON hits (kind, who, created_at);
CREATE TABLE IF NOT EXISTS site_meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
-- How many times each page was seen, per day (no person, no address), kept 14 days
CREATE TABLE IF NOT EXISTS views (
    day TEXT NOT NULL,
    page TEXT NOT NULL,
    views INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (day, page)
);
`,U=`/**
 * The shop's website API, a Cloudflare Worker on the shop's own account
 * (made and updated by Afus Boutique; the shop never sees it).
 *
 *   GET  /api/health             is the website's API up? (public)
 *   POST /api/orders             a customer's order (the checkout page's
 *                                form, or JSON); public, from the website
 *   GET  /api/orders?limit=      the orders waiting, oldest first   } Afus
 *   POST /api/orders/ack         {"ids": [...]}: kept by Afus, removed  } Boutique
 *                                from here                               } only
 *
 * D1 is a waiting room, not the shop's database: an order stays here only
 * until Afus Boutique has saved it in the shop's SQLite and acknowledged it
 * (ack), then it is deleted. If Afus is closed, orders simply wait.
 *
 * Security
 *   HTTPS only (workers.dev); Strict-Transport-Security.
 *   Afus Boutique's endpoints: Authorization: Bearer <shop key> AND
 *   X-Afus-Store: <store id> (this shop's own Worker, never another's);
 *   the key is compared in constant time; repeated wrong keys are refused
 *   for a while. The website (public) holds no key at all.
 *   Orders: checked field by field; from the shop's own website only (Origin);
 *   5 per 10 minutes from one place; a hidden field stops robots.
 *   Idempotency: the checkout sends an order key (random, per order); the
 *   same key again (double press, retry, back button) gives the same order,
 *   never a second one, also after the order left for Afus (keys kept 30 days).
 *
 * Bindings (set by Afus Boutique when it uploads this file):
 *   DB         this shop's D1 database (schema.sql)
 *   SHOP_KEY   secret, known only to Afus Boutique on the shop's computer
 *   STORE_ID   this shop's id (Afus sends it back on every call)
 *   SITE_URL   the website's address (where customers come back to)
 *   SITE_URLS  every address of the same website (JSON list: the free address
 *              and the shop's own domain once connected); optional
 *   SHOP_NAME  the shop's name
 *
 * No article, price or stock is kept here: the articles are the shop's, in
 * Afus Boutique, which checks every request against them.
 */
const LIMITS = {
    product_id: 80, product_name: 160, size: 40, color: 40, customer_name: 80, first_name: 40, last_name: 40, phone: 20, wilaya: 60, commune: 60, address: 200, note: 500,
    courier_company: 60, office_wilaya: 60, office_commune: 60, courier_office: 120,
};
const ITEM_LIMITS = { product_id: 80, product_name: 160, size: 40, color: 40 };
const MAX_ITEMS = 30;
const MAX_QTY = 20;
// home: to the customer's address; office: picked up at a courier company's office
// (pickup: at the shop, sent by websites made before the courier offices)
const DELIVERY = ['home', 'office', 'pickup'];
const WILAYA = /^(0?[1-9]|[1-5]\\d) - \\S/;
const MAX_BODY = 64 * 1024; // a full cart, form-encoded (Arabic names take 9 bytes a letter)
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

const AUTH_FAIL_MAX = 10;
// Page views counted per place (hashed) and coupon codes tried per place: both limited
const VIEW_MAX = 300;
const COUPON_MAX = 20;
const PAGE_ID = /^[A-Za-z0-9_-]{1,100}$/;
const PHONE_KEY = /^0\\d{8,9}$/;
const HASH = /^[a-f0-9]{64}$/;
const ACK_MAX = 200;
const KEY_DAYS = 30;
const ORDER_KEY = /^[A-Za-z0-9-]{16,64}$/;
const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const SECURITY = {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'X-Frame-Options': 'DENY',
};

function siteOrigin(env) {
    try { return new URL(env.SITE_URL).origin; } catch { return ''; }
}

/** Every address of the shop's website (https only): its free address, its own domain. */
function siteUrls(env) {
    let list = [];
    try { list = JSON.parse(env.SITE_URLS || '[]'); } catch { list = []; }
    return [env.SITE_URL, ...(Array.isArray(list) ? list : [])].filter(u => {
        // https only (plain http for a local test server only, never a real address)
        try { const x = new URL(u); return typeof u === 'string' && (x.protocol === 'https:' || ['127.0.0.1', 'localhost'].includes(x.hostname)); } catch { return false; }
    });
}
const originOf = (u) => { try { return new URL(u).origin; } catch { return ''; } };

/**
 * The address the customer is on (from the browser's Origin, else its
 * Referer), when it is one of the shop's: the answer and the way back use
 * it. Anything else: the website's main address.
 */
function siteFor(env, request) {
    const from = request.headers.get('Origin') || originOf(request.headers.get('Referer') || '');
    return siteUrls(env).find(u => from && originOf(u) === from) || env.SITE_URL;
}

function json(env, status, body, extra = {}) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': siteOrigin(env) || 'null', Vary: 'Origin', ...SECURITY, ...extra },
    });
}

/** Back to the website (its own address only: never an address taken from the request). */
function backTo(env, page) {
    let url;
    try { url = new URL(page, env.SITE_URL).toString(); } catch { return json(env, 400, { ok: false }); }
    return new Response(null, { status: 303, headers: { Location: url, ...SECURITY } });
}

/** Same length and content, without stopping at the first difference. */
function sameText(a, b) {
    const x = String(a || '');
    const y = String(b || '');
    let diff = x.length ^ y.length;
    for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x.charCodeAt(i) || 0) ^ (y.charCodeAt(i) || 0);
    return diff === 0 && x.length > 0;
}

async function sha256(text) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}

const clean = (value, max) => String(value ?? '').replace(/[\\u0000-\\u001f\\u007f]/g, ' ').trim().slice(0, max);

/** "16 - Alger" -> 16 (one of the 58 wilayas), else 0. */
function wilayaCode(text) {
    if (!WILAYA.test(text)) return 0;
    const n = parseInt(text, 10);
    return n >= 1 && n <= 58 ? n : 0;
}

// The 1541 communes per wilaya ({ "16": [[latin, arabic], ...] }), written in by Afus
// when it sends the Worker (electron/shared/communes.json); empty: not checked
const COMMUNES = /*@COMMUNES@*/{};
const plain = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^\\p{L}\\p{N}]+/gu, '');
const inList = (list, name) => (list || []).some(([latin, arabic]) => plain(latin) === name || plain(arabic) === name);
/**
 * The commune belongs to the wilaya. A name of the list of another wilaya
 * only is refused; another text (typed where the list did not load) is kept:
 * the shop calls the customer to confirm anyway.
 */
function communeOk(wilaya, commune) {
    if (!COMMUNES[String(wilaya)]) return true;
    const name = plain(commune);
    if (inList(COMMUNES[String(wilaya)], name)) return true;
    return !Object.keys(COMMUNES).some(w => w !== String(wilaya) && inList(COMMUNES[w], name));
}

/** An Algerian number: mobile 05/06/07 + 8 digits, or fixed 0 + 8 digits; +213 / 00213 accepted. */
function algerianPhone(text) {
    let d = String(text || '').replace(/[\\s.-]/g, '');
    if (/[^\\d+]/.test(d)) return '';
    d = d.replace(/^(\\+|00)213/, '0');
    return /^0[5-7]\\d{8}$/.test(d) || /^0[1-49]\\d{7}$/.test(d) ? d : '';
}

/** The cart's lines (JSON text or list), checked; null when there is none, false when wrong. */
function readItems(value) {
    if (value === undefined || value === null || value === '' || value === '[]') return null;
    let list;
    try { list = typeof value === 'string' ? JSON.parse(value) : value; } catch { return false; }
    if (!Array.isArray(list) || !list.length || list.length > MAX_ITEMS) return false;
    const items = [];
    for (const raw of list) {
        if (!raw || typeof raw !== 'object') return false;
        const item = {};
        for (const [key, max] of Object.entries(ITEM_LIMITS)) item[key] = clean(raw[key], max);
        if (!item.product_id) return false;
        item.quantity = Math.min(MAX_QTY, Math.max(1, parseInt(raw.quantity, 10) || 1));
        const price = Number(raw.unit_price);
        item.unit_price = raw.unit_price !== null && raw.unit_price !== '' && Number.isFinite(price) && price >= 0 && price < 1e9 ? Math.round(price * 100) / 100 : null;
        items.push(item);
    }
    return items;
}

/** The order request, checked; { order } or { error }. */
function readOrder(fields) {
    if (clean(fields.website, 100)) return { error: 'spam' }; // a field people never see
    const order = {};
    for (const [key, max] of Object.entries(LIMITS)) order[key] = clean(fields[key], max);
    order.quantity = Math.min(MAX_QTY, Math.max(1, parseInt(fields.quantity, 10) || 1));
    const items = readItems(fields.items);
    if (items === false) return { error: 'items' };
    order.items = items || [];
    if (items) {
        // The first line names the order in lists; the quantity is the whole cart's
        order.product_id = order.product_id || items[0].product_id;
        order.product_name = order.product_name || items[0].product_name;
        order.quantity = items.reduce((n, i) => n + i.quantity, 0);
    }
    order.delivery = DELIVERY.includes(fields.delivery) ? fields.delivery : '';
    if (!order.product_id) return { error: 'product' };
    // The form on an article's page: the full name in one field, an Algerian
    // phone, wilaya and commune, home (with the address) or a courier office
    // (which one is settled when the shop calls to confirm)
    if (fields.source === 'product') {
        if (order.customer_name.length < 3) return { error: 'name' };
        const words = order.customer_name.split(/\\s+/);
        order.first_name = words[0].slice(0, LIMITS.first_name);
        order.last_name = words.slice(1).join(' ').slice(0, LIMITS.last_name);
        if (!wilayaCode(order.wilaya) || order.commune.length < 2 || !communeOk(wilayaCode(order.wilaya), order.commune)) return { error: 'place' };
        if (!['home', 'office'].includes(order.delivery)) return { error: 'delivery' };
        if (order.delivery === 'home' && order.address.length < 3) return { error: 'address' };
        if (order.delivery === 'office') { order.office_wilaya = order.wilaya; order.office_commune = order.office_commune || order.commune; order.courier_office = ''; }
        if (order.delivery !== 'home') order.address = '';
        if (order.delivery !== 'office') { order.courier_company = ''; order.office_wilaya = ''; order.office_commune = ''; order.courier_office = ''; }
        const phone = algerianPhone(order.phone);
        if (!phone) return { error: 'phone' };
        order.phone = phone;
        order.source = 'product';
        return { order };
    }
    // The checkout: first and last name, an Algerian phone, wilaya and commune,
    // and what the chosen delivery needs (older forms send one name)
    const checkout = !!(order.first_name || order.last_name);
    if (checkout) {
        if (order.first_name.length < 2 || order.last_name.length < 2) return { error: 'name' };
        order.customer_name = \`\${order.first_name} \${order.last_name}\`.slice(0, LIMITS.customer_name);
        if (!wilayaCode(order.wilaya) || order.commune.length < 2 || !communeOk(wilayaCode(order.wilaya), order.commune)) return { error: 'place' };
        if (order.delivery === 'home' && order.address.length < 3) return { error: 'address' };
        if (order.delivery === 'office' && (order.courier_company.length < 2 || !wilayaCode(order.office_wilaya) || order.office_commune.length < 2 || order.courier_office.length < 2)) return { error: 'office' };
        if (order.delivery === 'office' && !communeOk(wilayaCode(order.office_wilaya), order.office_commune)) return { error: 'office' };
        if (!['home', 'office'].includes(order.delivery)) return { error: 'delivery' };
    } else if (order.customer_name.length < 2) return { error: 'name' };
    if (order.delivery !== 'office') { order.courier_company = ''; order.office_wilaya = ''; order.office_commune = ''; order.courier_office = ''; }
    const phone = algerianPhone(order.phone);
    if (!phone) return { error: 'phone' };
    order.phone = phone;
    return { order };
}

async function createOrder(request, env) {
    const length = Number(request.headers.get('Content-Length') || 0);
    if (length > MAX_BODY) return json(env, 413, { ok: false, error: 'too_large' });
    const type = request.headers.get('Content-Type') || '';
    const isForm = type.includes('application/x-www-form-urlencoded') || type.includes('multipart/form-data');
    let fields;
    try {
        const text = await request.text();
        if (text.length > MAX_BODY) return json(env, 413, { ok: false, error: 'too_large' });
        fields = isForm ? Object.fromEntries(new URLSearchParams(text)) : JSON.parse(text || '{}');
    } catch {
        return isForm ? backTo(env, 'order-error.html') : json(env, 400, { ok: false, error: 'bad_request' });
    }
    const { order, error } = readOrder(fields || {});
    if (error) return isForm ? backTo(env, 'order-error.html') : json(env, 400, { ok: false, error });
    // The shop's own rules (sent by Afus Boutique): numbers it does not take orders from,
    // its delivery prices (worked out here, never taken from the page), its coupons
    const config = await readConfig(env);
    if (config.blocked.includes(order.phone)) return isForm ? backTo(env, 'order-error.html') : json(env, 403, { ok: false, error: 'blocked' });
    const goods = order.items.reduce((s, i) => s + (i.unit_price || 0) * i.quantity, 0);
    order.delivery_fee = deliveryFee(config.delivery, wilayaCode(order.wilaya), order.delivery, goods);
    if (order.delivery_fee === false) return isForm ? backTo(env, 'order-error.html') : json(env, 400, { ok: false, error: 'not_delivered' });
    const coupon = await findCoupon(env, config, clean(fields.coupon, 30));
    order.coupon_code = coupon ? coupon.code : '';
    // Back to the thanks page; "cart=1" empties the cart (only an order of the cart does)
    const done = (id, status) => (isForm ? backTo(env, order.items.length && order.source !== 'product' ? 'thanks.html?cart=1' : 'thanks.html') : json(env, status, { ok: true, id, duplicate: status === 200 }));

    // The same order sent again (double press, retry): the same answer, no second order
    const key = ORDER_KEY.test(String(fields.order_key || '')) ? String(fields.order_key) : null;
    if (key) {
        const seen = await env.DB.prepare('SELECT order_id FROM order_keys WHERE order_key = ?').bind(key).first();
        if (seen) return done(seen.order_id, 200);
    }
    const ipHash = await whoIs(request, env);
    if (await overLimit(env, 'order', ipHash, RATE_MAX, RATE_WINDOW_MS)) return isForm ? backTo(env, 'order-error.html') : json(env, 429, { ok: false, error: 'too_many' });

    const id = crypto.randomUUID();
    const at = new Date().toISOString();
    // An order request only: nothing is sold and no stock moves here (Afus Boutique decides).
    // Key, order and rate count are written together (one D1 batch: all or nothing)
    const writes = [
        env.DB.prepare(\`INSERT INTO orders (id, created_at, product_id, product_name, size, color, quantity, customer_name, first_name, last_name, phone, wilaya, commune, address, delivery,
                          courier_company, office_wilaya, office_commune, courier_office, items, note, ip_hash, order_key, delivery_fee, coupon_code)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\`)
            .bind(id, at, order.product_id, order.product_name, order.size, order.color, order.quantity,
                order.customer_name, order.first_name, order.last_name, order.phone, order.wilaya, order.commune, order.address, order.delivery,
                order.courier_company, order.office_wilaya, order.office_commune, order.courier_office, JSON.stringify(order.items), order.note, ipHash, key || '', order.delivery_fee, order.coupon_code),
        env.DB.prepare('INSERT INTO hits (kind, who, created_at) VALUES (?, ?, ?)').bind('order', ipHash, at),
    ];
    if (key) writes.unshift(env.DB.prepare('INSERT INTO order_keys (order_key, order_id, created_at) VALUES (?, ?, ?)').bind(key, id, at));
    try {
        await env.DB.batch(writes);
    } catch (e) {
        // Two presses at the same moment: the other one made the order
        const seen = key ? await env.DB.prepare('SELECT order_id FROM order_keys WHERE order_key = ?').bind(key).first() : null;
        if (seen) return done(seen.order_id, 200);
        throw e;
    }
    return done(id, 201);
}

/** One place (an IP address), never kept as such: a hash with the shop's key. */
async function whoIs(request, env) {
    const ip = request.headers.get('CF-Connecting-IP') || '';
    return (await sha256(\`\${ip}|\${env.SHOP_KEY}\`)).slice(0, 32);
}

async function overLimit(env, kind, who, max, windowMs) {
    const since = new Date(Date.now() - windowMs).toISOString();
    const row = await env.DB.prepare('SELECT COUNT(*) AS n FROM hits WHERE kind = ? AND who = ? AND created_at > ?').bind(kind, who, since).first();
    return (row?.n || 0) >= max;
}

/**
 * Afus Boutique of this shop only: the shop key (constant time) and this
 * Worker's own store id. Wrong keys are counted: too many from one place
 * and even the right key is refused there for a while.
 * -> null when allowed, else the Response to send.
 */
async function afusOnly(request, env) {
    const who = await whoIs(request, env);
    if (await overLimit(env, 'auth_fail', who, AUTH_FAIL_MAX, RATE_WINDOW_MS)) return json(env, 429, { ok: false, error: 'too_many' }, { 'Access-Control-Allow-Origin': 'null' });
    const auth = request.headers.get('Authorization') || '';
    const keyOk = !!env.SHOP_KEY && sameText(auth.replace(/^Bearer\\s+/i, ''), env.SHOP_KEY);
    const storeOk = !!env.STORE_ID && sameText(request.headers.get('X-Afus-Store') || '', env.STORE_ID);
    if (keyOk && storeOk) return null;
    await env.DB.prepare('INSERT INTO hits (kind, who, created_at) VALUES (?, ?, ?)').bind('auth_fail', who, new Date().toISOString()).run();
    return json(env, keyOk ? 403 : 401, { ok: false }, { 'Access-Control-Allow-Origin': 'null' });
}

/** The orders waiting for Afus Boutique, oldest first. */
async function listOrders(request, env, url) {
    const refused = await afusOnly(request, env);
    if (refused) return refused;
    const since = /^\\d{4}-\\d{2}-\\d{2}T[\\d:.]+Z$/.test(url.searchParams.get('since') || '') ? url.searchParams.get('since') : '1970-01-01T00:00:00.000Z';
    const limit = Math.min(ACK_MAX, Math.max(1, parseInt(url.searchParams.get('limit'), 10) || 100));
    const { results } = await env.DB.prepare(\`SELECT id, created_at, product_id, product_name, size, color, quantity, customer_name, first_name, last_name, phone, wilaya, commune, address, delivery,
                                              courier_company, office_wilaya, office_commune, courier_office, items, note, status, delivery_fee, coupon_code
                                              FROM orders WHERE created_at > ? ORDER BY created_at, id LIMIT ?\`).bind(since, limit).all();
    const waiting = await env.DB.prepare('SELECT COUNT(*) AS n FROM orders').first();
    return json(env, 200, { ok: true, store: env.STORE_ID, orders: results || [], waiting: waiting?.n || 0 }, { 'Access-Control-Allow-Origin': 'null' });
}

/**
 * Afus Boutique saved these orders in the shop's SQLite: they leave the
 * waiting room. Unknown ids are ignored (already gone: a repeated ack is fine).
 */
async function ackOrders(request, env) {
    const refused = await afusOnly(request, env);
    if (refused) return refused;
    if (!(request.headers.get('Content-Type') || '').includes('application/json')) return json(env, 415, { ok: false, error: 'json_only' }, { 'Access-Control-Allow-Origin': 'null' });
    let body;
    try {
        const text = await request.text();
        if (text.length > 16 * 1024) return json(env, 413, { ok: false, error: 'too_large' }, { 'Access-Control-Allow-Origin': 'null' });
        body = JSON.parse(text);
    } catch {
        return json(env, 400, { ok: false, error: 'bad_request' }, { 'Access-Control-Allow-Origin': 'null' });
    }
    const ids = Array.isArray(body?.ids) ? body.ids : null;
    if (!ids || ids.length > ACK_MAX || !ids.every(id => typeof id === 'string' && ID.test(id))) return json(env, 400, { ok: false, error: 'ids' }, { 'Access-Control-Allow-Origin': 'null' });
    let removed = 0;
    if (ids.length) {
        const r = await env.DB.prepare(\`DELETE FROM orders WHERE id IN (\${ids.map(() => '?').join(',')})\`).bind(...ids).run();
        removed = r?.meta?.changes ?? 0;
    }
    // Old order keys and counts are not needed any more
    const old = new Date(Date.now() - KEY_DAYS * 86400000).toISOString();
    await env.DB.batch([
        env.DB.prepare('DELETE FROM order_keys WHERE created_at < ?').bind(old),
        env.DB.prepare('DELETE FROM hits WHERE created_at < ?').bind(new Date(Date.now() - 86400000).toISOString()),
    ]);
    const waiting = await env.DB.prepare('SELECT COUNT(*) AS n FROM orders').first();
    return json(env, 200, { ok: true, store: env.STORE_ID, removed, waiting: waiting?.n || 0 }, { 'Access-Control-Allow-Origin': 'null' });
}

/* ---------- The shop's rules, sent by Afus Boutique ---------- */

const EMPTY_CONFIG = { blocked: [], coupons: [], delivery: { home: null, office: null, freeOver: null, wilayas: [] } };
const price = (v) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 100000 ? Math.round(v) : null);

/** What Afus Boutique last sent (checked again: a value of the wrong kind is dropped). */
function cleanConfig(c) {
    const x = c && typeof c === 'object' ? c : {};
    const blocked = (Array.isArray(x.blocked) ? x.blocked : []).filter(p => typeof p === 'string' && PHONE_KEY.test(p)).slice(0, 5000);
    const coupons = (Array.isArray(x.coupons) ? x.coupons : []).filter(k => k && HASH.test(k.hash) && ['percentage', 'fixed'].includes(k.type) && typeof k.value === 'number' && k.value > 0).slice(0, 300)
        .map(k => ({
            hash: k.hash, type: k.type, value: k.value, appliesTo: ['all', 'category', 'product'].includes(k.appliesTo) ? k.appliesTo : 'all',
            ids: (Array.isArray(k.ids) ? k.ids : []).filter(i => typeof i === 'string' && i.length <= 80).slice(0, 500),
            minPurchase: price(k.minPurchase) || 0, endsAt: typeof k.endsAt === 'string' && k.endsAt.length <= 40 ? k.endsAt : null, name: typeof k.name === 'string' ? k.name.slice(0, 80) : '',
        }));
    const d = x.delivery && typeof x.delivery === 'object' ? x.delivery : {};
    const wilayas = (Array.isArray(d.wilayas) ? d.wilayas : []).filter(w => Number.isInteger(w?.code) && w.code >= 1 && w.code <= 58).slice(0, 58)
        .map(w => ({ code: w.code, home: price(w.home), office: price(w.office), off: w.off === true }));
    return { blocked, coupons, delivery: { home: price(d.home), office: price(d.office), freeOver: price(d.freeOver), wilayas } };
}

async function readConfig(env) {
    const row = await env.DB.prepare("SELECT value FROM site_meta WHERE key = 'config'").first().catch(() => null);
    if (!row) return EMPTY_CONFIG;
    try { return cleanConfig(JSON.parse(row.value)); } catch { return EMPTY_CONFIG; }
}

/** The price of delivery (a number), null when the shop gives it on the phone, false when not delivered there. */
function deliveryFee(d, code, kind, goods) {
    if (!['home', 'office'].includes(kind)) return null;
    const w = d.wilayas.find(x => x.code === code);
    if (w?.off) return false;
    const p = w && w[kind] !== null ? w[kind] : d[kind];
    if (p === null) return null;
    return d.freeOver !== null && goods >= d.freeOver ? 0 : p;
}

/** A coupon of the shop (its code is only ever compared by its hash with the shop's key). */
async function findCoupon(env, config, code) {
    const typed = String(code || '').trim().toUpperCase();
    if (!typed || !config.coupons.length) return null;
    const hash = await sha256(\`\${typed}|\${env.SHOP_KEY}\`);
    const k = config.coupons.find(c => c.hash === hash);
    if (!k || (k.endsAt && k.endsAt < new Date().toISOString().slice(0, 10))) return null;
    return { ...k, code: typed };
}

async function setConfig(request, env) {
    const refused = await afusOnly(request, env);
    if (refused) return refused;
    if (!(request.headers.get('Content-Type') || '').includes('application/json')) return json(env, 415, { ok: false, error: 'json_only' }, { 'Access-Control-Allow-Origin': 'null' });
    let body;
    try {
        const text = await request.text();
        if (text.length > 256 * 1024) return json(env, 413, { ok: false, error: 'too_large' }, { 'Access-Control-Allow-Origin': 'null' });
        body = JSON.parse(text);
    } catch {
        return json(env, 400, { ok: false, error: 'bad_request' }, { 'Access-Control-Allow-Origin': 'null' });
    }
    const config = cleanConfig(body);
    await env.DB.prepare("INSERT INTO site_meta (key, value) VALUES ('config', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(JSON.stringify(config)).run();
    return json(env, 200, { ok: true, store: env.STORE_ID, blocked: config.blocked.length, coupons: config.coupons.length }, { 'Access-Control-Allow-Origin': 'null' });
}

/** A coupon typed on the website: what it gives, or no (a few tries per place only). */
async function checkCoupon(request, env, url) {
    const cors = { 'Access-Control-Allow-Origin': siteOrigin(env) || 'null' };
    const who = await whoIs(request, env);
    if (await overLimit(env, 'coupon', who, COUPON_MAX, RATE_WINDOW_MS)) return json(env, 429, { ok: false, error: 'too_many' }, cors);
    await env.DB.prepare('INSERT INTO hits (kind, who, created_at) VALUES (?, ?, ?)').bind('coupon', who, new Date().toISOString()).run();
    const k = await findCoupon(env, await readConfig(env), url.searchParams.get('code'));
    if (!k) return json(env, 200, { ok: false }, cors);
    return json(env, 200, { ok: true, code: k.code, name: k.name, type: k.type, value: k.value, appliesTo: k.appliesTo, ids: k.ids, minPurchase: k.minPurchase }, cors);
}

/* ---------- How many times each page was seen (a count per day, no person) ---------- */

const algiersDay = () => new Date(Date.now() + 3600000).toISOString().slice(0, 10);

async function addView(request, env) {
    const cors = { 'Access-Control-Allow-Origin': siteOrigin(env) || 'null' };
    const text = (await request.text()).slice(0, 120).trim();
    if (!PAGE_ID.test(text)) return json(env, 400, { ok: false }, cors);
    const who = await whoIs(request, env);
    if (await overLimit(env, 'view', who, VIEW_MAX, RATE_WINDOW_MS)) return json(env, 429, { ok: false }, cors);
    await env.DB.batch([
        env.DB.prepare('INSERT INTO hits (kind, who, created_at) VALUES (?, ?, ?)').bind('view', who, new Date().toISOString()),
        env.DB.prepare('INSERT INTO views (day, page, views) VALUES (?, ?, 1) ON CONFLICT(day, page) DO UPDATE SET views = views + 1').bind(algiersDay(), text),
    ]);
    return json(env, 200, { ok: true }, cors);
}

/** The counts of the last days, for Afus Boutique (older ones leave). */
async function listViews(request, env) {
    const refused = await afusOnly(request, env);
    if (refused) return refused;
    const old = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10);
    await env.DB.prepare('DELETE FROM views WHERE day < ?').bind(old).run();
    const { results } = await env.DB.prepare('SELECT day, page, views FROM views ORDER BY day, page LIMIT 5000').all();
    return json(env, 200, { ok: true, store: env.STORE_ID, views: results || [] }, { 'Access-Control-Allow-Origin': 'null' });
}

async function health(env) {
    const row = await env.DB.prepare("SELECT value FROM site_meta WHERE key = 'published_at'").first().catch(() => null);
    return json(env, 200, { ok: true, shop: env.SHOP_NAME || '', publishedAt: row?.value || null });
}

export default {
    async fetch(request, envIn) {
        const url = new URL(request.url);
        // The answers and the way back follow the address the customer came from (one of the shop's)
        const env = envIn.SITE_URL ? { ...envIn, SITE_URL: siteFor(envIn, request) } : envIn;
        try {
            // HTTPS only (an http:// call is not answered with data)
            if (url.protocol !== 'https:') return json(env, 403, { ok: false, error: 'https' });
            if (request.method === 'OPTIONS') {
                return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': siteOrigin(env) || 'null', 'Access-Control-Allow-Methods': 'GET, POST', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600', ...SECURITY } });
            }
            if (url.pathname === '/api/health' && request.method === 'GET') return await health(env);
            if (url.pathname === '/api/orders' && request.method === 'POST') {
                // From the shop's own website only (a browser always says where the form was)
                const origin = request.headers.get('Origin');
                const known = siteUrls(envIn).map(originOf);
                if (origin && known.length && !known.includes(origin)) return json(env, 403, { ok: false, error: 'origin' });
                return await createOrder(request, env);
            }
            if (url.pathname === '/api/orders' && request.method === 'GET') return await listOrders(request, env, url);
            if (url.pathname === '/api/orders/ack' && request.method === 'POST') return await ackOrders(request, env);
            if (url.pathname === '/api/config' && request.method === 'POST') return await setConfig(request, env);
            if (url.pathname === '/api/views' && request.method === 'GET') return await listViews(request, env);
            if (url.pathname === '/api/coupon' && request.method === 'GET') return await checkCoupon(request, env, url);
            if (url.pathname === '/api/view' && request.method === 'POST') {
                const origin = request.headers.get('Origin');
                const known = siteUrls(envIn).map(originOf);
                if (origin && known.length && !known.includes(origin)) return json(env, 403, { ok: false, error: 'origin' });
                return await addView(request, env);
            }
            if (url.pathname === '/' && request.method === 'GET' && env.SITE_URL) return backTo(env, './');
            return json(env, 404, { ok: false });
        } catch {
            return json(env, 500, { ok: false });
        }
    },
};
`,F=""+new URL("cairo-arabic-CJWMIGCx.woff2",import.meta.url).href,X=""+new URL("cairo-latin-PfPtmrPZ.woff2",import.meta.url).href,x=""+new URL("bags-QANr5Ni5.webp",import.meta.url).href,q=""+new URL("folded-DZ0gdHaJ.webp",import.meta.url).href,P=""+new URL("hero-boutique-0ni5bP4m.webp",import.meta.url).href,j=""+new URL("hero-rack-BW4KTk6_.webp",import.meta.url).href,z=""+new URL("hero-store-DMIUSSSM.webp",import.meta.url).href,H=""+new URL("jackets-rmJV4o7t.webp",import.meta.url).href,K=""+new URL("kids-2-NxtHzPg6.webp",import.meta.url).href,Y=""+new URL("kids-C9IQjcuI.webp",import.meta.url).href,G=""+new URL("look-baby-BT48GOQ9.webp",import.meta.url).href,W=""+new URL("look-classic-flat-DYBpm7Se.webp",import.meta.url).href,V=""+new URL("look-coat-street-CkPbE-pC.webp",import.meta.url).href,Z=""+new URL("look-coats-BFbU_qZk.webp",import.meta.url).href,Q=""+new URL("look-denim-B6JMZ-mS.webp",import.meta.url).href,J=""+new URL("look-fitness-ixq9jKiH.webp",import.meta.url).href,$=""+new URL("look-flatlay-tphzsU8V.webp",import.meta.url).href,ee=""+new URL("look-girl-BNZFXSdX.webp",import.meta.url).href,ne=""+new URL("look-kid-Cd3tNxUP.webp",import.meta.url).href,te=""+new URL("look-kids-DtTlKA03.webp",import.meta.url).href,ae=""+new URL("look-knit-4A6bSo2z.webp",import.meta.url).href,re=""+new URL("look-neutral-CuqAXEYr.webp",import.meta.url).href,oe=""+new URL("look-rack-color-BdvPFN-B.webp",import.meta.url).href,ie=""+new URL("look-runner-4B9t6c6E.webp",import.meta.url).href,se=""+new URL("look-scarf-DZ9Nacy9.webp",import.meta.url).href,le=""+new URL("look-shopping-8BKMoh5z.webp",import.meta.url).href,de=""+new URL("look-sneakers-2-C5NT6nu_.webp",import.meta.url).href,ue=""+new URL("look-sneakers-COlQ7Wp6.webp",import.meta.url).href,ce=""+new URL("look-sport-BbIBRHSf.webp",import.meta.url).href,he=""+new URL("look-street-BL5iyqnG.webp",import.meta.url).href,Ee=""+new URL("look-suit-dark-TGNMVY7g.webp",import.meta.url).href,me=""+new URL("look-suit-BiwCU-OD.webp",import.meta.url).href,pe=""+new URL("look-tee-D2JttLPf.webp",import.meta.url).href,fe=""+new URL("men-pxEvqpMA.webp",import.meta.url).href,Te=""+new URL("sale-DxNqA1TA.webp",import.meta.url).href,_e=""+new URL("shirts-0awjtLtN.webp",import.meta.url).href,Ae=""+new URL("shoes-13Y2h7MX.webp",import.meta.url).href,Se=""+new URL("women-2-B_O1KSvW.webp",import.meta.url).href,be=""+new URL("women-B4JW9yfb.webp",import.meta.url).href,ye="/app",ge=Object.assign({"../electron/database/ecommerce_schema.sql":f,"../electron/database/schema.sql":T,"../electron/shared/brand.json":_,"../electron/shared/buyingPlan.mjs":A,"../electron/shared/clothing.json":S,"../electron/shared/communes.SOURCE.md":b,"../electron/shared/communes.json":y,"../electron/shared/permissions.mjs":g,"../electron/shared/posControls.mjs":w,"../electron/shared/profile.json":v,"../electron/shared/promotions.mjs":N,"../electron/shared/refund.mjs":O,"../electron/shared/ticketCode.mjs":L,"../electron/shops/worker/link.mjs":R,"../electron/shops/worker/schema.sql":I,"../electron/website/storefront/assets/fonts/OFL.txt":k,"../electron/website/storefront/assets/store.js":D,"../electron/website/storefront/assets/track.js":M,"../electron/website/storefront/photos/CREDITS.md":C,"../electron/website/worker/schema.sql":B,"../electron/website/worker/worker.mjs":U}),we=Object.assign({"../electron/website/storefront/assets/fonts/cairo-arabic.woff2":F,"../electron/website/storefront/assets/fonts/cairo-latin.woff2":X,"../electron/website/storefront/photos/bags.webp":x,"../electron/website/storefront/photos/folded.webp":q,"../electron/website/storefront/photos/hero-boutique.webp":P,"../electron/website/storefront/photos/hero-rack.webp":j,"../electron/website/storefront/photos/hero-store.webp":z,"../electron/website/storefront/photos/jackets.webp":H,"../electron/website/storefront/photos/kids-2.webp":K,"../electron/website/storefront/photos/kids.webp":Y,"../electron/website/storefront/photos/look-baby.webp":G,"../electron/website/storefront/photos/look-classic-flat.webp":W,"../electron/website/storefront/photos/look-coat-street.webp":V,"../electron/website/storefront/photos/look-coats.webp":Z,"../electron/website/storefront/photos/look-denim.webp":Q,"../electron/website/storefront/photos/look-fitness.webp":J,"../electron/website/storefront/photos/look-flatlay.webp":$,"../electron/website/storefront/photos/look-girl.webp":ee,"../electron/website/storefront/photos/look-kid.webp":ne,"../electron/website/storefront/photos/look-kids.webp":te,"../electron/website/storefront/photos/look-knit.webp":ae,"../electron/website/storefront/photos/look-neutral.webp":re,"../electron/website/storefront/photos/look-rack-color.webp":oe,"../electron/website/storefront/photos/look-runner.webp":ie,"../electron/website/storefront/photos/look-scarf.webp":se,"../electron/website/storefront/photos/look-shopping.webp":le,"../electron/website/storefront/photos/look-sneakers-2.webp":de,"../electron/website/storefront/photos/look-sneakers.webp":ue,"../electron/website/storefront/photos/look-sport.webp":ce,"../electron/website/storefront/photos/look-street.webp":he,"../electron/website/storefront/photos/look-suit-dark.webp":Ee,"../electron/website/storefront/photos/look-suit.webp":me,"../electron/website/storefront/photos/look-tee.webp":pe,"../electron/website/storefront/photos/men.webp":fe,"../electron/website/storefront/photos/sale.webp":Te,"../electron/website/storefront/photos/shirts.webp":_e,"../electron/website/storefront/photos/shoes.webp":Ae,"../electron/website/storefront/photos/women-2.webp":Se,"../electron/website/storefront/photos/women.webp":be}),c=n=>`${ye}/${n.replace(/^(\.\.\/)+/,"")}`;async function ve(n=()=>{}){for(const[r,e]of Object.entries(ge))u(c(r),e);const a=Object.entries(we);let l=0;await Promise.all(a.map(async([r,e])=>{try{const t=await fetch(e);t.ok&&u(c(r),new Uint8Array(await t.arrayBuffer()))}catch{}n(++l/a.length)}))}const h=new URLSearchParams(location.search).get("lang"),s=["ar","fr","en"].includes(h)?h:"ar";window.__AFUS_WEB_DEMO__={orderUrl:s==="ar"?"../boutique/#order":"../fr/boutique/#order"};document.documentElement.lang=s;document.documentElement.dir=s==="ar"?"rtl":"ltr";const o=document.getElementById("demo-loading-bar");await ve(n=>{o&&(o.style.width=`${Math.round(10+n*50)}%`)});await i(()=>import("./main-DbBC--MV.js").then(n=>n.m),__vite__mapDeps([0,1,2,3,4,5,6,7,8]),import.meta.url);await m;await i(()=>import("./preload-CK_3ruek.js").then(n=>n.p),__vite__mapDeps([9,1,2,3]),import.meta.url);o&&(o.style.width="70%");await window.electronAPI.demo.enter({lang:s});o&&(o.style.width="95%");const{watchImages:Ne}=await i(async()=>{const{watchImages:n}=await import("./images-DlII4rWv.js");return{watchImages:n}},__vite__mapDeps([10,5,1,4,2,3,6]),import.meta.url);Ne();await i(()=>import("./main-Bwu2N1yX.js"),__vite__mapDeps([11,1,6,8,7,12]),import.meta.url);await i(()=>import("./tour-Hk6wAuLq.js"),[],import.meta.url);document.getElementById("demo-loading")?.remove();
