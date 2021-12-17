const { CO_PILOT_TOKEN } = process.env;
const CO_PILOT_TOKEN_VALUE = CO_PILOT_TOKEN || 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZjAzZjhmYjM5MTNjMDAwODAwNGUzZSIsInJvbGVzIjpbIkFkbWluIl0sInBlcm1pc3Npb25zIjpbIndyaXRlOmNvbGxlY3Rpb24iLCJ3cml0ZTpyb2xlIiwicmVhZDpyb2xlIiwicmVhZDphdHRyaWJ1dGUtZ3JvdXAiLCJ3cml0ZTpza3VzZXQiLCJ3cml0ZTphdHRyaWJ1dGUtZ3JvdXAiLCJ3cml0ZTp1c2VyIiwid3JpdGU6YXR0cmlidXRlIiwicmVhZDpwZXJtaXNzaW9uIiwicmVhZDpza3VzZXQiLCJyZWFkOmF0dHJpYnV0ZSIsInJlYWQ6Y29sbGVjdGlvbiIsInJlYWQ6dXNlciJdLCJhY2NvdW50IjoiNWYzMjhiZjBiN2MxNTcwMDA3MTIzM2I5IiwiYWNjb3VudElkIjo4NzM5MzkyMjk0LCJ1c2VyVHlwZSI6eyJraW5kIjoiUkVHSVNURVJFRCJ9LCJpYXQiOjE2MjY3MTYxMTZ9.UlqpND2c1F-74LPba5QIeUplvIWZ6Q_ncy3v2JmdV949ITnG07r5F1b1pEFCxxwxqBMy-EvxsV323vz1VNZHTw';

const constants = {
  API_CALL_TYPE: {
    POST: 'post',
    GET: 'get',
    PUT: 'put',
    DELETE: 'delete',
    PATCH: 'patch',
  },
  USER_DETAILS_KEY: 'user-copilot',
  USER_AUTH_KEY: 'auth',
  USER_BRAND_ID_KEY: 'brand_id',
  USER_STORE_ID_KEY: 'store_id',
  USER_BRAND_KEY: 'brand_info',
  SELL_CURRENT_INVOICE_KEY: 'current_invoice',
  SELL_INVOICE_QUEUE_KEY: 'invoice_queue',
  X_API_KEY: "X-API-KEY",
  STOCK_DATE_RANGE: "stock_date_range",
  CO_PILOT_LIFE_TIME_TOKEN: CO_PILOT_TOKEN_VALUE,
  APP_ROUTES_BASE_URL: '/pos',


  SETUP: {
    USERS_TAB_KEY: 'users',
    OUTLETS_TAB_KEY: 'outlets',
    RECEIPTS_TAB_KEY: 'receipts-templates',
    ROLES_TAB_KEY: 'user-roles',
    BRANDS_TAB_KEY: 'brands',
    CONFIGURATIONS_TAB_KEY: 'configurations',
  },
  
  STOCK_CONTROL: {
    PURCHASE_ORDER: 'purchase-orders',
    STOCK_REQUEST: 'stock-request',
    STOCK_ADJUSTMENTS: 'stock-adjustments',
    RETURN_STOCK: 'returned-stock',
    FORCE_CLOSED: 'Force Closed',
    RECEIVED: 'Received',
    OPEN: 'Open',
    GONE_FOR_APPROVAL: 'Gone for Approval',
    REJECTED: 'Rejected'
  },

  REGISTER_SALES_HISTORY: {
    CONTINUE_TAB_KEY: 'continue-sales',
    RETURNS_TAB_KEY: 'returned-sales',
    COMPLETED_TAB_KEY: 'completed-sales',
    DEAD_TAB_KEY: 'dead-sales',
    ALL_TAB_KEY: 'all-sales',

    INVOICE_STATUSES: {
      COMPLETED : {
        KEY: '0',
        VALUE: 'completed',
      },
      RETURNED_COMPLETED : {
        KEY: '2',
        VALUE: 'Return, completed',
      },
      PARKED : {
        KEY_PARKED: '1',
        KEY_DEAD: '0',
        VALUE: 'Parked',
      },
      DEAD : {
        KEY_PARKED: '1',
        KEY_DEAD: '1',
        VALUE: 'Dead',
      },

    }
  },
  
  ALL_MODULE_NAMES: {
    CATEGORIES: "categories",
    COURIERS: "couriers",
    TAXES: "taxes",
    SUPPLIERS: "suppliers",
    PRODUCTS: "products",
    CUSTOMERS: "customers",
    REGISTER: "register",
    REPORTS: "reports",
    SETUP: "setup",
    STOCK: "stock-control",
    ECOMMERCE: "ecommerce",
    ACTIONS_HISTORY: "actions-history",

    SUB_LEVEL_MODULES: {
      STORES: 'outlets',
      TEMPLATES: 'receipts-templates',
      BRANDS: 'brands',
      USERS: 'users',
      USER_ROLES: 'user-roles',
      ATTRIBUTES: 'attributes',
      ATTRIBUTES_VALUES: 'attribute-values',
      SELL: 'sell',
      SALE_HISTORY: 'sales-history',
      PURCHASE_ORDERS: 'purchase-orders',
      TRANSFERS: 'stock-request',
      STOCK_ADJUSTMENTS: 'stock-adjustments',
      STOCK_RETURNS: 'returned-stock',
      PO_GOOD_RECEIVE_NOTES: 'grn-view',
      CONFIGURATIONS: 'configurations',
      SINGLE_INVOICE_VIEW: 'invoice',
      ORDERS: 'orders',

    }

  },

  SUPER_ADMIN: {
    PURCHASE_ORDER: 'purchase-orders',
    STOCK_REQUEST: 'stock-request',
  },
  
  FILE_TYPES: {
    IMAGES_FILE_TYPES: ["image/x-png","image/gif","image/jpeg", "image/jpg", "image/png", "image/svg", "image/svg+xml"]
  },
  DECIMAL_POINTS: [
    {
      id: 1,
      name: 1,
    },
    {
      id: 2,
      name: 2,
    },
    {
     id: 3,
     name: 3,
   },
   {
     id: 4,
     name: 4,
   },
   {
     id: 5,
     name: 5,
   },
  ]
};

export default constants;

export var ROOT_SYNC_SCOPE = false;