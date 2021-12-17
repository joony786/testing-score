//console.log("process.env", process.env);

const {
  REACT_APP_API_BASE_URL,
  REACT_APP_REPORTS_SERVICE_URL,
  REACT_APP_FABRIC_INTEGRATION_BASE_URL,
  REACT_APP_IMAGE_UPLOADS_URL,
  REACT_APP_ORDER_SERVICE_URL,
  REACT_APP_WMS_BASE_URL,
} = process.env;


const BASE_URL = REACT_APP_API_BASE_URL;
const FABRIC_BASE_URL = REACT_APP_FABRIC_INTEGRATION_BASE_URL;
const APP_IMAGE_UPLOADS_URL = REACT_APP_IMAGE_UPLOADS_URL;
const APP_ORDER_SERVICE_URL = REACT_APP_ORDER_SERVICE_URL;
const APP_REPORTS_SERVICE_URL = REACT_APP_REPORTS_SERVICE_URL;
const APP_WMS_BASE_URL = REACT_APP_WMS_BASE_URL;



const urls = {
  BASE_URL,
  APP_IMAGE_UPLOADS_URL,
  CHECK_FABRIC_BASE_URL: FABRIC_BASE_URL,
  CHECK_REPORTS_BASE_URL: APP_REPORTS_SERVICE_URL,
  TOKEN: {
    FABRIC_TOKEN: 'Fabric',
    FABRIC_ACCESS_TOKEN: 'Fabric Access Token',
  },
  ACTIONS_HISTORY: {
    VIEW: BASE_URL + '/api/Action_history'
  },
  AUTH: {
    LOGIN: BASE_URL + '/api/users/login',
    SIGNUP: BASE_URL + '/api/users/signup',
    CO_PILOT_LOGIN:  BASE_URL +  '/api/users/login'
  },
  TAX: {
    VIEW: BASE_URL + '/api/taxes',
    SEARCH: BASE_URL + '/api/taxes',
    VIEW_ALL: BASE_URL + '/api/taxes/viewAll',
    ADD_TAX: BASE_URL + '/api/taxes',
    DELETE_TAX: BASE_URL + '/api/taxes',
    EDIT_TAX: BASE_URL + '/api/taxes',
    GET_TAX: BASE_URL + '/api/taxes'
  },
  CATEGORIES: {
    VIEW: BASE_URL + '/api/categories',
    SEARCH: BASE_URL + '/api/categories',
    VIEW_ALL: BASE_URL + '/api/categories/viewAll',
    ADD_CATEGORY: BASE_URL + '/api/categories',
    EDIT_CATEGORY: BASE_URL + '/api/categories',
    DELETE_CATEGORY: BASE_URL + '/api/categories',
    GET_CATEGORY: BASE_URL + '/api/categories',
    // categories by id
    
  },
  SUPPLIERS: {
    VIEW: BASE_URL + '/api/suppliers',
    SEARCH: BASE_URL + '/api/suppliers',
    ADD_SUPPLIER: BASE_URL + '/api/suppliers',
    EDIT_SUPPLIER: BASE_URL + '/api/suppliers',
    DELETE_SUPPLIER: BASE_URL + '/api/suppliers',
    VIEW_ALL: BASE_URL + '/api/suppliers/viewAll',
    GET_SUPPLIER: BASE_URL + '/api/suppliers',
  },
  OULETS: {
    SELECT_OUTLET: BASE_URL + '/api/users/selectStore',
    VIEW_ALL: BASE_URL + '/api/stores/viewAll',
    VIEW_ALL_OUTLETS: BASE_URL + '/api/stores/viewAllOutlets',
  },
  COURIERS: {
    VIEW: BASE_URL + '/api/couriers/view',
    SEARCH: BASE_URL + '/api/couriers/search',
    VIEW_ALL: BASE_URL + '/api/couriers/viewAll',
    ADD_COURIER: BASE_URL + '/api/couriers/add',
    EDIT_COURIER: BASE_URL + '/api/couriers/edit',
    DELETE_COURIER: BASE_URL + '/api/couriers/delete',
    GET_COURIER: BASE_URL + '/api/couriers/get',
  },
  CUSTOMERS: {
    VIEW: BASE_URL + '/api/Customers',
    VIEW_SINGLE: BASE_URL + '/api/Customers',
    EDIT_CUSTOMER: BASE_URL + '/api/customers',
    ADD_CUSTOMER: BASE_URL + '/api/Customers',
    RECHARGE: BASE_URL + '/api/Customers/recharge',
    CREDIT_HISTORY: BASE_URL + '/api/customers/history',
    SEARCH: BASE_URL + '/api/Customers',
    DELETE: BASE_URL + '/api/customers',
    EXPORT: APP_REPORTS_SERVICE_URL + '/customer/download',
    GET_USER: BASE_URL + '/api/customers/get_user_id',
  },
  PRODUCTS: {
    VIEW: BASE_URL + '/api/products',
    SEARCH: BASE_URL + '/api/products',
    VIEW_VARIANTS: BASE_URL + '/api/products/viewVar',
    LOOKUP: BASE_URL + '/api/products/lookup',
    ADD_PRODUCT: BASE_URL + '/api/products/add',
    UPDATE_PRODUCT_DISCOUNT: BASE_URL + '/api/products/update_discount',
    EDIT_PRODUCT: BASE_URL + '/api/products/edit',
    DELETE_PRODUCT: BASE_URL + '/api/products/delete',
    GET_PRODUCT: BASE_URL + '/api/products/get',
    IMG_UPLOAD: APP_IMAGE_UPLOADS_URL,
    GET_REGISTERED_PRODUCTS: BASE_URL + '/api/products/getRegister',
    SAVE_DISCOUNTED: BASE_URL + '/api/promotions/setSpecial',
    BULK_UPLOAD: BASE_URL + '/api/products/bulk_import',
    GET_MOVEMENT_REPORT: BASE_URL + '/api/reports/productMovementReport',
    GET_FULL_REGISTERED_PRODUCTS: BASE_URL + '/api/products',
    EXPORT_PRODUCTS: BASE_URL + '/api/products/exportProducts',
    SYNC_PRODUCTS: FABRIC_BASE_URL + '/pim/products',
    SYNC_PRICES: FABRIC_BASE_URL + '/offer/price/sync',

  },
  REPORTS: {
    SALES_SUMMARY: APP_REPORTS_SERVICE_URL + '/sale/summary/view',
    DOWNLOAD_SALES_SUMMARY: APP_REPORTS_SERVICE_URL + '/sale/summary/download',
    CATEGORY_SALES_SUMMARY: BASE_URL + '/api/reports/categoryWiseReport',
    INVENTORY_DUMP: APP_REPORTS_SERVICE_URL + '/stock/view',
    EXPORT_INVENTORY_DUMP: APP_REPORTS_SERVICE_URL + '/stock/download',
    GET_STORE: BASE_URL + '/api/reports/get_store_id',
    IMPORT_SALES_SUMMARY: BASE_URL + '/api/reports/saleSummaryCsv',
    IMPORT_SALES_OMNI_SUMMARY: BASE_URL + '/api/reports/saleSummaryOmniCsv',
    // categories
    GET_CATEGORY_BY_ID: APP_REPORTS_SERVICE_URL + '/product/view',
    DOWNLOAD_CATEGORY: APP_REPORTS_SERVICE_URL + '/product/download'

  },
  SETUP: {
    VIEW_OUTLETS: BASE_URL + '/api/stores',
    VIEW_ALL: BASE_URL + '/api/stores/viewAll',
    VIEW_BRANDS_STORES: BASE_URL + '/api/company/stores/get_all_stores',
    VIEW_USERS: BASE_URL + '/api/users',
    VIEW_TEMPLATES: BASE_URL + '/api/templates',
    VIEW_USER_ROLES: BASE_URL + '/api/user_roles',
    VIEW_ALL_TEMPLATES: BASE_URL + '/api/templates',
    VIEW_BRANDS: BASE_URL + '/api/Brands',
    ADD_OUTLET: BASE_URL + '/api/stores',
    GET_OUTLET: BASE_URL + '/api/stores',
    EDIT_OUTLET: BASE_URL + '/api/stores',
    DELETE_OUTLET: BASE_URL + '/api/stores',
    ADD_USER: BASE_URL + '/api/users',
    GET_USER: BASE_URL + '/api/users/getUser',
    GET_USERNAME: BASE_URL + '/api/users/getUsername',
    EDIT_USER: BASE_URL + '/api/users',
    ADD_TEMPLATE: BASE_URL + '/api/templates',
    GET_TEMPLATE: BASE_URL + '/api/templates',
    EDIT_TEMPLATE: BASE_URL + '/api/templates',
    DELETE_TEMPLATE: BASE_URL + '/api/templates',
    ADD_USER_ROLE: BASE_URL + '/api/User_roles',
    EDIT_USER_ROLE: BASE_URL + '/api/user_roles',
    DELETE_USER_ROLE: BASE_URL + '/api/user_roles',
    ADD_BRAND: BASE_URL + '/api/brands',
    EDIT_BRAND: BASE_URL + '/api/brands',
    DELETE_BRAND: BASE_URL + '/api/brands',
    SELECT_BRAND: BASE_URL + '/api/users/select_brand',
    WEB_HOOKS: {
      ADD: BASE_URL + '/api/stores/addWebHook',
      GET: BASE_URL + '/api/stores/getWebHooks',
      DELETE: BASE_URL + '/api/stores/deleteWebHook',
    },
    OMNI: {
      ADD_OE_KEY: BASE_URL + '/api/omni_engine/addOeKey',
    },
    VALIDATE_ADDRESS: FABRIC_BASE_URL + "/taxjar/verify/address"
  },
  STOCK: {
    VIEW_PO: BASE_URL + '/api/stock_control/viewPo',
    PO_VIEW_GRN: BASE_URL + '/api/stock_control/viewGrn',
    TRANSFER_VIEW_GRN: BASE_URL + '/api/stock_control/inventoryTransferQuickView',
    VIEW_TRANSFER: BASE_URL + '/api/transfers/viewTransfer',
    VIEW_ADJUSTMENTS: BASE_URL + '/api/stock_adjustment',
    VIEW_RETURNED_STOCK: BASE_URL + '/api/stock_control/viewReturnStock',
    GET_STOCK_RETURNED: BASE_URL + '/api/stock_control/getReturnStock',
    GET_STOCK_RETURNED_DATA: BASE_URL + '/api/returns',
    RECEIVE_PO: BASE_URL + '/api/stock_control/receivePo',
    RECEIVE_COMPLETED_PO: BASE_URL + '/api/stock_control/viewPoDetails',
    ADD_RECEIVE_PO: BASE_URL + '/api/stock_control/insertGrn',
    ADD_PURCHASE_ORDER: BASE_URL + '/api/purchase_orders',
    VIEW_PURCHASE_ORDER: BASE_URL + '/api/purchase_orders',
    BULK_UPLOAD_PURCHASE_ORDER: BASE_URL + '/api/purchase_orders/bulk_import',
    CHANGE_GRN_STATUS: BASE_URL + '/api/Good_receive_notes',
    DOWNLOAD_PO_FORM: BASE_URL + '/api/omni_engine/productsku',
    ADD_ADJUSTMENT: BASE_URL + '/api/stock_adjustment',
    RETURN_STOCK: BASE_URL + '/api/returns',
    TRANSFER_OUT: BASE_URL + '/api/transfers/add',
    CLOSE_PURCHASE_ORDER: BASE_URL + '/api/stock_control/closePo',
    CLOSE_REQUEST_STATUS: BASE_URL + '/api/Transfers/',
    RECEIVED_REQUEST_STATUS: BASE_URL + '/api/Transfers/',
    RECEIVE_TRANSFER_IN: BASE_URL + '/api/transfers/getTransfer',
    EXPORT_INVENTORY_TRANSFERS: BASE_URL + '/api/transfers/tarnsfersCsv',
    EXPORT_PURCHASE_ORDERS: BASE_URL + '/api/stock_control/purchaseOrdersCsv',
    EXPORT_STOCK_ADJUSTMENTS: BASE_URL + '/api/stock_control/stockAdjustmentCsv',
    EXPORT_STOCK_RETURNED: BASE_URL + '/api/stock_control/returnedStockCsv',
    //WMS Integration 
    GET_PRODUCTS_WMS: FABRIC_BASE_URL + '/inventory', 
    SEND_STOCK_REQUEST_WMS: FABRIC_BASE_URL + '/wms/inventory',
    SEND_STOCK_ADJUSTMENT_WMS: FABRIC_BASE_URL + '/wms/inventory',
    GET_LATEST_INVENTORY: FABRIC_BASE_URL + '/wms/fetch/inventory/bulk',
    SEND_STOCK_REQUEST_BULK_FILE_WMS: FABRIC_BASE_URL + '/wms/inventory/bulk',
    //Stock Request
    GET_ALL_SYSTEM_PRODUCTS: BASE_URL + '/api/products',
    GET_ALL_STOCK_REQUEST: BASE_URL + '/api/transfers',
    SEND_STOCK_REQUEST_SYSTEM: BASE_URL + '/api/transfers',
    SEND_STOCK_REQUEST_BULK_FILE_SYSTEM: BASE_URL + '/api/transfers/bulk_import'
  },
  SALES: {
    VIEW_HISTORY: BASE_URL + '/api/register',
    GET_SALE_HISTORY: BASE_URL + '/api/register',
    REGISTER_INVOICE: BASE_URL + '/api/register',
    GET_STORE: BASE_URL + '/api/register/get_store_id',
    EXPORT_INVENTORY_DUMP: BASE_URL + '/api/register/parkedSaleReportCsv',
    GET_INVOICE_NUMBER: BASE_URL + '/api/register/getInvoiceNumber',
    REGISTER_INVOICE_MARK_DEAD: BASE_URL + '/api/register/markDead',
    SYNC_INVOICES: FABRIC_BASE_URL + '/oms/orders/sync',
    EXPORT_CSV: APP_REPORTS_SERVICE_URL + '/invoice/download',
  },
  DASHBOARD: {
    VIEW_DATA: BASE_URL + '/api/reports/dashboard',

  },
  ECOMMERCE: {
    GET_ALL_OMNI_SALES: BASE_URL + '/api/omni_engine/all',
    VIEW_OE_ORDER: BASE_URL + '/api/omni_engine/getOe',
    CONFIRM_OE_ORDER: BASE_URL + '/api/omni_engine/confirmOe',
    CANCEL_OE_ORDER: BASE_URL + '/api/omni_engine/cancelOe',
    GET_ALL_INVENTORY_SYNC: BASE_URL + '/api/omni_engine/GetAllInventorySync',
    GET_INVENTORY_DUMP: BASE_URL + '/api/omni_engine/inventoryDump',
    GET_OE_SALE_ORDERS: BASE_URL + '/api/omni_engine/fetchSaleOrders',
    GET_BULK_OMNI_INVOICES: BASE_URL + '/api/omni_engine/getInvoiceId',
    GET_BULK_OMNI_INNER_INVOICES: BASE_URL + '/api/omni_engine/getInnerIds',
    SEARCH_ALL_OMNI_SALES: BASE_URL + '/api/omni_engine/allSearch',
    GET_ALL_ORDERS: APP_ORDER_SERVICE_URL + '/orders',
    GET_ORDER_BY_ID: APP_ORDER_SERVICE_URL + '/orders',
    UPDATE_ORDER_STATUS:  APP_ORDER_SERVICE_URL + '/orders',
    WMS_SHIPPED_ORDER: APP_WMS_BASE_URL + '/markShipped',
    MANUAL_RETURNS: APP_ORDER_SERVICE_URL + '/manual-returns',
  },

  WEB_ORDERS: {
    GET_WEB_ORDER: FABRIC_BASE_URL + '/oms/view/order',
    WMS_GET_WEB_ORDER: APP_WMS_BASE_URL + '/view/order',
    RETURN_WEB_ORDER: APP_WMS_BASE_URL + '/return/order',
    SEARCH_CUSTOMERS: FABRIC_BASE_URL + '/oms/search/customer',
    CREATE_CUSTOMER: FABRIC_BASE_URL + '/oms/create/customer',
    CREATE_ADDRESS: FABRIC_BASE_URL + '/oms/create/address',
    GET_SHIPPING_METHODS: FABRIC_BASE_URL + '/oms/shipping',
    GET_PRODUCT_DISCOUNT: FABRIC_BASE_URL + '/offers/validate/promo',
    CREATE_WEB_ORDER: FABRIC_BASE_URL + '/oms/create/order',
    GET_PROMOTIONS: FABRIC_BASE_URL + '/offer/validate/promo',
    GET_COUPONS_DISCOUNT: FABRIC_BASE_URL + '/offer/validate/coupon',
    GET_SALE_OFFER: FABRIC_BASE_URL + '/offer/offer/price',
    MANUAL_RETURN_WEB_ORDER: APP_ORDER_SERVICE_URL + "/manual-returns",
  },

  SUPER_ADMIN : {
    GET_PO_SUPER_ADMIN: BASE_URL + '/view/po',
    GET_SR_SUPER_ADMIN: BASE_URL + '/api/transfers',
    APPROVE_REQUEST_STATUS: BASE_URL + '/api/Transfers/',
    GET_STOCK_REQUEST_BY_ID: BASE_URL + '/api/transfers',
  }
};

export default urls;