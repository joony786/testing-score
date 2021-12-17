import React, { useEffect, useRef, Suspense, lazy } from 'react';
import {
  Route,
  Switch,
  Redirect,
  useLocation,
} from 'react-router-dom';
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
  checkUserAuthBrandFromLocalStorage,
  checkUserAuthOutletFromLocalStorage,
  checkAuthTokenExpiration,
  clearLocalUserData,
} from '../../../utils/local-storage/local-store-utils';
import Constants from '../../../utils/constants/constants';
import * as CheckPermissions from '../../../utils/helpers/check-user-permission';
import * as Helpers from '../../../utils/helpers/scripts';
const PosAuthentication = lazy (()=> import('../../pages/pos'));
const Roles = lazy (()=> import( '../../pages/setup/roles'));
const AddRoles = lazy(()=> import( '../../pages/setup/roles/rolesAdd'));
const EditRoles = lazy(()=> import( '../../pages/setup/roles/rolesEdit'));
const DeleteRole = lazy(()=> import( '../../pages/setup/roles/deleteRole'));
const AddBrand = lazy(()=> import( '../../pages/setup/brands/addBrand'));
const EditBrand = lazy(()=> import( '../../pages/setup/brands/editBrand'));
const DeleteBrand = lazy(()=> import( '../../pages/setup/brands/deleteBrand'));
const AddStockRequest = lazy(()=> import( '../../pages/stock_control/stock_request/add_stock_request'));
const AddStockAdjustment = lazy(()=> import( '../../pages/stock_control/stock_adjustment/add_stock_adjustment'));
const AddReturnStock = lazy(()=> import( '../../pages/stock_control/return_stock/add_return_stock'));
const ReceivePurchaseOrder = lazy(()=> import( '../../pages/stock_control/receive_purchase_order/receive'));
const ViewReturnStock = lazy(()=> import( '../../pages/stock_control/return_stock/view_return_stock'));
const ViewStockRequest = lazy(()=> import( '../../pages/stock_control/stock_request/view_stock_request'));
const ReceiveStockRequest = lazy(()=> import( '../../pages/stock_control/stock_request/receive_stock_request'));
const ViewGRN = lazy(()=> import( '../../pages/stock_control/receive_purchase_order/view_grn'));
const ViewStockAdjustment = lazy(()=> import( '../../pages/stock_control/stock_adjustment/view_stock_adjustment'));
const BulkUploadPurchaseOrder = lazy(()=> import( '../../pages/stock_control/order_stock/bulkUpload'));
const CreditHistoryDetail = lazy(()=> import( '../../pages/customers/credit_history_detail'));
const EditParentCategory = lazy(()=> import( '../../pages/categories/editParentCategory'));
const ViewStockRequestSuperAdmin = lazy(()=> import( '../../pages/super_admin/sr_super_admin/view_sr_super_admin'));
const Outlets = lazy (()=> import('../../pages/outlets'));
const MLSLogin = lazy(() => import('../../pages/mls_login'));

// components
const Dashboard = lazy(() => import(/* webpackPrefetch: true */ '../../pages/dashboard'));
const Categories = lazy(() => import('../../pages/categories'));
const AddCategory = lazy(() => import('../../pages/categories/add_category'));
const EditCategory = lazy(() => import('../../pages/categories/editCategory'));
const DeleteCategory = lazy(() =>
  import('../../pages/categories/deleteCategory')
);
const Suppliers = lazy(() => import('../../pages/suppliers'));
const AddSupplier = lazy(() => import('../../pages/suppliers/add_supplier'));
const EditSupplier = lazy(() => import('../../pages/suppliers/editSupplier'));
const DeleteSupplier = lazy(() =>
  import('../../pages/suppliers/deleteSupplier')
);
const Taxes = lazy(() => import('../../pages/taxes'));
const AddTax = lazy(() => import('../../pages/taxes/add_tax'));
const EditTax = lazy(() => import('../../pages/taxes/editTax'));
const DeleteTax = lazy(() => import('../../pages/taxes/deleteTax'));
const Products = lazy(() => import('../../pages/products'));
const ActionsHistory = lazy(() => import('../../pages/actions_history'));
const ProductBundles = lazy(() => import('../../pages/products/bundles'));
const AddProduct = lazy(() => import('../../pages/products/add_product'));
const BulkUpload = lazy(() => import('../../pages/products/bulk_upload'));
const LookUpProduct = lazy(() => import('../../pages/products/lookup_product'));
const DiscountProduct = lazy(() => import('../../pages/products/discount'));
const BundlesProduct = lazy(() => import('../../pages/products/bundles'));
const Customers = lazy(() => import('../../pages/customers'));
const AddCustomer = lazy(() => import('../../pages/customers/add_customer'));
const DeleteCustomer = lazy(() =>
  import('../../pages/customers/deleteCustomer')
);
const Couriers = lazy(() => import('../../pages/couriers'));
const AddCourier = lazy(() => import('../../pages/couriers/add_courier'));
const EditCourier = lazy(() => import('../../pages/couriers/editCourier'));
const DeleteCourier = lazy(() => import('../../pages/couriers/deleteCourier'));
const SalesHistory = lazy(() => import('../../pages/register/sales_history'));
const Sell = lazy(() => import('../../pages/register/sell'));
const NewSell = lazy(() => import('../../pages/register/new-sell'));

const StockControl = lazy(() => import('../../pages/stock_control'));
const OrderStock = lazy(() => import('../../pages/stock_control/order_stock'));
const Orders = lazy(() => import('../../pages/ecommerce/orders'));
const InventorySync = lazy(() =>
  import('../../pages/ecommerce/inventory_sync')
);
const Setup = lazy(() => import('../../pages/setup'));
const NewOutlet = lazy(() => import('../../pages/setup/outlets/outletAdd'));
const NewUser = lazy(() => import('../../pages/setup/users/userAdd'));
const EditUser = lazy(() => import('../../pages/setup/users/userEditUi'));
const NewTemplate = lazy(() => import('../../pages/setup/receipts/receiptAdd'));
const CategoryWise = lazy(() => import('../../pages/reports/category_wise'));
const InventoryDump = lazy(() => import('../../pages/reports/inventory_dump'));
const OmniSalesSummary = lazy(() =>
  import('../../pages/reports/omni_sales_summary')
);
const ProductHistory = lazy(() =>
  import('../../pages/reports/product_history')
);
const SalesSummary = lazy(() => import('../../pages/reports/sales_summary'));
const ViewOrder = lazy(() => import('../../pages/ecommerce/orders/view'));
const CustomerProfile = lazy(() => import('../../pages/customers/profile'));
const CustomerPayBalance = lazy(() =>
  import('../../pages/customers/pay_balance')
);
const CustomerHistory = lazy(() =>
  import('../../pages/customers/credit_history')
);
const Brands = lazy(() => import('../../pages/brands'));
const SuperAdmin = lazy(() => import('../../pages/super_admin'));
const EditOutlet = lazy(() => import('../../pages/setup/outlets/outletEditUi'));
const DeleteOutlet = lazy(() =>
  import('../../pages/setup/outlets/deleteOutlet')
);
const EditTemplate = lazy(() =>
  import('../../pages/setup/receipts/receiptEditUi')
);
const DeleteTemplate = lazy(() =>
  import('../../pages/setup/receipts/receiptDelete')
);
const EditProduct = lazy(() => import('../../pages/products/edit_product'));

function Main(props) {
  const mainContainer = useRef(null);
  const location = useLocation();
  const renderWithLayout = (Component, props, attrs = {}) => {
    return (
      attrs?.isOutletLayout ? <Outlets /> : <Component {...props} {...attrs} />
    )
  };

  const RenderWithUnAuthLayout = (Component, componentName = '', isAuth) => {
    let readFromLocalStorage = getDataFromLocalStorage(
      Constants?.USER_DETAILS_KEY
    );
    let authExpirationTokenDate;
    let brandOnBoarding = false;
    let outletOnBoarding = false;

    readFromLocalStorage =
      readFromLocalStorage.data && readFromLocalStorage.data;

    let authenticateDashboard = false;

    if (readFromLocalStorage) {
      if (
        checkUserAuthFromLocalStorage(Constants?.USER_DETAILS_KEY)
          .authentication
      ) {
        authenticateDashboard = true;
        authExpirationTokenDate = readFromLocalStorage?.expire_at;
      } else if (
        checkUserAuthBrandFromLocalStorage(Constants?.USER_DETAILS_KEY)
          .authentication
      ) {
        authenticateDashboard = false;
        authExpirationTokenDate = readFromLocalStorage?.expire_at;
        brandOnBoarding = true;
      } else if (
        checkUserAuthOutletFromLocalStorage(Constants?.USER_DETAILS_KEY)
          .authentication
      ) {
        authenticateDashboard = false;
        authExpirationTokenDate = readFromLocalStorage?.expire_at;
        outletOnBoarding = true;
      } else {
        authenticateDashboard = false;
        authExpirationTokenDate = readFromLocalStorage?.expire_at;
      }
    } else {
      //cache not exists
      return <Redirect to='/login' />;
    }

    if (readFromLocalStorage && authExpirationTokenDate) {
      //if expire token exists
      if (checkAuthTokenExpiration(authExpirationTokenDate)) {
        //("Logging Out Redirecting....", 5);
        clearLocalUserData();
        return <Redirect to='/login' />;
      }
    }

    return readFromLocalStorage == null ? (
      <Redirect to='/login' />
    ) : authenticateDashboard ? (
      <Redirect to='/dashboard' />
    ) : brandOnBoarding ? (
      <AddBrand isAuth={isAuth} />
    ) : outletOnBoarding ? (
      <NewOutlet isAuth={isAuth} />
    ) : (
      <Redirect to='/brands' />
    );
  };

  const RenderWithLayoutOutlet = (Component, componentName = '') => {
    let readFromLocalStorage = getDataFromLocalStorage(
      Constants?.USER_DETAILS_KEY
    );
    let authExpirationTokenDate;

    readFromLocalStorage =
      readFromLocalStorage.data && readFromLocalStorage.data;

    let authenticateDashboard = false;

    if (readFromLocalStorage) {
      if (
        checkUserAuthFromLocalStorage(Constants?.USER_DETAILS_KEY)
          .authentication
      ) {
        authenticateDashboard = true;
        authExpirationTokenDate = readFromLocalStorage.expire_at;
      } else {
        authenticateDashboard = false;
        authExpirationTokenDate = readFromLocalStorage.expire_at;
      }
    }

    if (checkAuthTokenExpiration(authExpirationTokenDate)) {
      //("Logging Out Redirecting....", 5);
      clearLocalUserData();
      return <Redirect to='/login' />;
    }

    return readFromLocalStorage == null ? (
      <Redirect to='/login' />
    ) : authenticateDashboard ? (
      <Component />
    ) : (
      <Component />
    );
  };

  const PrivateRoute = ({ component: Component, ...rest }) => {
    //console.log(rest.path.split('/'));
    let readFromLocalStorage = getDataFromLocalStorage(
      Constants?.USER_DETAILS_KEY
    );
    let authExpirationTokenDate;
    let routePathName = rest.path.split('/')[1]; //imp to split path
    if (routePathName === 'stock-control') {
      routePathName = 'stock_control';
    } //imp new one

    //let userRouteScopes = [];

    readFromLocalStorage =
      readFromLocalStorage?.data;

    let authenticateDashboard = false;

    if (readFromLocalStorage) {
      //userRouteScopes = readFromLocalStorage.scopes || [];

      if (
        checkUserAuthFromLocalStorage(Constants?.USER_DETAILS_KEY)
          .authentication
      ) {
        authenticateDashboard = true;
        authExpirationTokenDate = readFromLocalStorage.expire_at;
      } else {
        authenticateDashboard = false;
        authExpirationTokenDate = readFromLocalStorage.expire_at;
      }
    } else {
      return <Redirect to='/login' />;
    }

    if (authExpirationTokenDate) {
      if (checkAuthTokenExpiration(authExpirationTokenDate)) {
        //("Logging Out Redirecting....", 3);
        clearLocalUserData();
        return <Redirect to='/login' />;
      } else {
        let authenticatedRoute =
          CheckPermissions.checkUserModuleRoutePermission();
        if (!authenticatedRoute) {
          //console.log("inside");
          //showAlertUi(true, "You are not authorized to view this page");
          return <Redirect to='/dashboard' />;
        }
      }
    }

    return (
      <Route
        {...rest}
        render={(props) =>
          readFromLocalStorage ? (
            authenticateDashboard ? (
              renderWithLayout(Component, { ...props })
            ) : (
              <Redirect to='/brands' />
            )
          ) : (
            <Redirect to='/login' />
          )
        }
      />
    );
  };

  /*const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };*/
  useEffect(() => {
    if (mainContainer?.current) {
      mainContainer.current.scrollTop = 0;
    }
  }, [location.pathname]);

// const ref = useRef(null)
// useEffect(()=>{

// },[])

  return (
    <main className='main' ref={mainContainer}>
      <Suspense fallback="...">
        <Switch>
          <Route exact path='/login' component={MLSLogin} />
          <Route exact path='/authentication' component={PosAuthentication} />
          <PrivateRoute exact path='/dashboard' component={Dashboard} />
          {/* <Route exact path='/dashboard'render={()=>RenderWithLayoutOutlet(Dashboard,'dashboard')} /> */}
          <Route
            exact
            path='/'
            render={() => <Redirect to='/dashboard' />}
          ></Route>
          <PrivateRoute exact path='/categories' component={Categories} />
          <PrivateRoute
            exact
            path='/categories/:cat_id/edit'
            component={(props) => <EditCategory {...props} />}
          />
          <PrivateRoute
            exact
            path='/categories/:cat_id/parent/:parentId/edit'
            component={(props) => <EditParentCategory {...props} />}
          />
          <PrivateRoute
            exact
            path='/categories/:cat_id/delete'
            component={(props) => <DeleteCategory {...props} />}
          />
          <PrivateRoute exact path='/categories/add' component={AddCategory} />
          <PrivateRoute exact path='/suppliers' component={Suppliers} />
          <PrivateRoute
            exact
            path='/suppliers/:supplier_id/edit'
            component={(props) => <EditSupplier {...props} />}
          />
          <PrivateRoute
            exact
            path='/suppliers/:supplier_id/delete'
            component={(props) => <DeleteSupplier {...props} />}
          />
          <PrivateRoute exact path='/suppliers/add' component={AddSupplier} />
          <PrivateRoute exact path='/taxes' component={Taxes} />
          <PrivateRoute
            exact
            path='/taxes/:tax_id/edit'
            component={(props) => <EditTax {...props} />}
          />
          <PrivateRoute
            exact
            path='/taxes/:tax_id/delete'
            component={(props) => <DeleteTax {...props} />}
          />
          <PrivateRoute exact path='/taxes/add' component={AddTax} />
          {/*<Route
          exact
          path="/outlets"
          render={() => RenderWithLayoutOutlet(Outlets, "outlets")}
        />*/}
          <Route
            exact
            path='/brands'
            render={() => RenderWithLayoutOutlet(Brands, 'brands')}
          />
          <PrivateRoute exact path='/products' component={Products} />
          <PrivateRoute
            exact
            path='/actions-history'
            component={ActionsHistory}
          />
          <PrivateRoute exact path='/products/add' component={AddProduct} />
          <PrivateRoute
            exact
            path='/products/:product_id/edit'
            component={EditProduct}
          />
          <PrivateRoute
            exact
            path='/products/bulk_upload'
            component={BulkUpload}
          />
          <PrivateRoute
            exact
            path='/products/lookup'
            component={LookUpProduct}
          />
          <PrivateRoute
            exact
            path='/products/discount'
            component={DiscountProduct}
          />
          <PrivateRoute
            exact
            path='/products/bundles'
            component={BundlesProduct}
          />
          <PrivateRoute exact path='/customers' component={Customers} />
          <PrivateRoute
            exact
            path='/customers/:customer_id/edit'
            component={(props) => (
              <AddCustomer {...props} isCustomerEditMode={true} />
            )}
          />
          <PrivateRoute
            exact
            path='/customers/:customer_id/view'
            component={(props) => <CustomerProfile {...props} />}
          />
          <PrivateRoute
            exact
            path='/customers/:customer_id/pay-account-balance'
            component={(props) => <CustomerPayBalance {...props} />}
          />
          <PrivateRoute
            exact
            path='/customers/:customer_id/delete'
            component={(props) => <DeleteCustomer {...props} />}
          />
          <PrivateRoute
            exact
            path='/customers/add'
            component={(props) => <AddCustomer {...props} />}
          />
          <PrivateRoute exact path='/couriers' component={Couriers} />
          <Route
            exact
            path='/couriers/:courier_id/edit'
            component={(props) => <EditCourier {...props} />}
          />
          <PrivateRoute
            exact
            path='/couriers/:courier_id/delete'
            component={(props) => <DeleteCourier {...props} />}
          />
          <PrivateRoute
            exact
            path='/couriers/add-courier'
            component={AddCourier}
          />
          <PrivateRoute
            exact
            path='/customers/:customer_id/credit-history'
            component={(props) => <CustomerHistory {...props} />}
          />
          <PrivateRoute exact path='/register/sell' component={NewSell} />
          <PrivateRoute
            exact
            path='/register/sales-history'
            component={SalesHistory}
          />
          <PrivateRoute
            exact
            path='/register/invoice/:invoice_id/view'
            component={CreditHistoryDetail}
          />
          <Route path='/stock_control' component={StockControl} />
          <PrivateRoute
            exact
            path='/stock-control/purchase-orders'
            component={() => <StockControl activeKey={'purchase-orders'} />}
          />
          <PrivateRoute
            exact
            path='/purchase-orders/:po_id/:grn_id/receive'
            component={() => (
              <ReceivePurchaseOrder activeKey={'purchase-orders'} />
            )}
          />
          <PrivateRoute
            exact
            path='/stock-control/purchase-orders/bulk-upload'
            component={() => (
              <BulkUploadPurchaseOrder activeKey={'purchase-orders'} />
            )}
          />
          <PrivateRoute
            exact
            path='/stock-control/purchase-orders/:id/grn-view'
            component={() => <ViewGRN activeKey={'purchase-orders'} />}
          />
          <PrivateRoute
            exact
            path='/stock-control/stock-request'
            component={() => <StockControl activeKey={'stock-request'} />}
          />
          <PrivateRoute
            exact
            path='/stock-control/stock-adjustments'
            component={() => <StockControl activeKey={'stock-adjustments'} />}
          />
          <PrivateRoute
            exact
            path='/stock-control/returned-stock'
            component={() => <StockControl activeKey={'returned-stock'} />}
          />
          <PrivateRoute
            exact
            path='/stock-control/purchase-orders/add'
            component={OrderStock}
          />
          <PrivateRoute
            exact
            path='/stock-control/stock-request/add'
            component={AddStockRequest}
          />
          <PrivateRoute
            exact
            path='/stock-control/stock-adjustments/add'
            component={AddStockAdjustment}
          />
          <PrivateRoute
            exact
            path='/stock-control/returned-stock/add'
            component={AddReturnStock}
          />
          <PrivateRoute
            exact
            path='/stock-control/returned-stock/:returnId/view'
            component={(props) => <ViewReturnStock {...props} />}
          />
          <PrivateRoute
            exact
            path='/stock-control/stock-request/:requestId/view'
            component={(props) => <ViewStockRequest {...props} />}
          />
          <PrivateRoute
            exact
            path='/stock-control/stock-request/:requestId/receive'
            component={(props) => <ReceiveStockRequest {...props} />}
          />
          <PrivateRoute
            exact
            path='/stock-control/stock-adjustments/:adjustmentId/view'
            component={(props) => <ViewStockAdjustment {...props} />}
          />
          <PrivateRoute exact path='/ecommerce/orders' component={Orders} />
          <Route path='/ecommerce/orders/:orderId/view' component={ViewOrder} />
          <Route path='/inventory_sync' component={InventorySync} />
          <PrivateRoute
            exact
            path='/setup/users'
            component={() => <Setup activeKey={'users'} />}
          />
          <PrivateRoute
            exact
            path='/setup/outlets'
            component={() => <Setup activeKey={'outlets'} />}
          />
          <PrivateRoute
            exact
            path='/setup/receipts-templates'
            component={() => <Setup activeKey={'receipts-templates'} />}
          />
          <PrivateRoute
            exact
            path='/setup/user-roles'
            component={() => <Setup activeKey={'user-roles'} />}
          />
          <PrivateRoute
            exact
            path='/setup/brands'
            component={() => <Setup activeKey={'brands'} />}
          />
          <PrivateRoute
            exact
            path='/setup/configurations'
            component={() => <Setup activeKey='configurations' />}
          />
          <PrivateRoute exact path='/setup/outlets/add' component={NewOutlet} />
          <Route
            exact
            path='/unAuth/outlets/add'
            render={() => RenderWithUnAuthLayout(NewOutlet, 'outlets', false)}
          />
          <PrivateRoute
            exact
            path='/setup/outlets/:outlet_id/edit'
            component={(props) => <EditOutlet {...props} />}
          />
          <PrivateRoute exact path='/setup/users/add' component={NewUser} />
          <PrivateRoute
            exact
            path='/setup/users/:user_id/edit'
            component={(props) => <EditUser {...props} />}
          />
          <PrivateRoute
            exact
            path='/setup/receipts-templates/add'
            component={NewTemplate}
          />
          <PrivateRoute
            exact
            path='/setup/receipts-templates/:template_id/edit'
            component={(props) => <EditTemplate {...props} />}
          />
          <PrivateRoute
            exact
            path='/setup/receipts-templates/:template_id/delete'
            component={(props) => <DeleteTemplate {...props} />}
          />
          <PrivateRoute
            exact
            path='/setup/user-roles/add'
            component={(props) => <AddRoles {...props} />}
          />
          <PrivateRoute
            exact
            path='/setup/user-roles/:role_id/edit'
            component={(props) => <EditRoles {...props} />}
          />
          <PrivateRoute
            exact
            path='/setup/user-roles/:role_id/delete'
            component={(props) => <DeleteRole {...props} />}
          />
          <PrivateRoute
            exact
            path='/setup/brands/add'
            component={(props) => <AddBrand {...props} />}
          />
          <Route
            exact
            path='/unAuth/brands/add'
            render={() => RenderWithUnAuthLayout(AddBrand, 'brands', false)}
          />
          <PrivateRoute
            exact
            path='/setup/brands/:brand_id/edit'
            component={(props) => <EditBrand {...props} />}
          />
          <PrivateRoute
            exact
            path='/setup/brands/:brand_id/delete'
            component={(props) => <DeleteBrand {...props} />}
          />
          <PrivateRoute exact path='/super-admin' component={SuperAdmin} />
          <Route path='/reports/category-wise' component={CategoryWise} />
          <PrivateRoute
            exact
            path='/reports/inventory-dump'
            component={InventoryDump}
          />
          <Route
            path='/reports/omni-sales-summary'
            component={OmniSalesSummary}
          />
          <Route path='/reports/product-history' component={ProductHistory} />
          <PrivateRoute
            exact
            path='/reports/sales-summary'
            component={SalesSummary}
          />
          <PrivateRoute
            exact
            path='/super-admin/:requestId/view'
            component={(props) => <ViewStockRequestSuperAdmin {...props} />}
          />
          <Route render={() => <Redirect to='/dashboard' />}></Route>
        </Switch>
      </Suspense>
    </main>
  );
}

export default Main;
