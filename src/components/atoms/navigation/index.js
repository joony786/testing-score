import React, { useState, useEffect } from "react";
import { Navigation, IconButton } from "@teamfabric/copilot-ui";
import { Link } from "react-router-dom";
import { 
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
  saveDataIntoLocalStorage, 
} from "../../../utils/local-storage/local-store-utils";
import Permissions from '../../../utils/constants/user-permissions';
import * as PermissionsHelpers from "../../../utils/helpers/check-user-permission";
import Constants from "../../../utils/constants/constants";
import { useHistory, useLocation } from "react-router-dom";

function SideNav() {
  const [show, setShow] = useState(false);
  const [activeMenuItemId, setActiveMenuItemId] = useState("");
  const {pathname} =  useLocation();

  const handleNavigationCloseButtonClick = () => {
    let element = document.querySelector(".nav_container");
    element.classList.remove("show");
  };

  console.log('here');

  useEffect(() => {
    setActiveNestedTabs();

  }, [pathname]);  //imp to render on page tabs click

  /////////////new ver///////////// 
  let userRouteScopes = [];
  const appRouteReadScopes = {
    categories: Permissions.USER_PERMISSIONS.READ.CATEGORIES,
    couriers: Permissions.USER_PERMISSIONS.READ.COURIERS,
    taxes: Permissions.USER_PERMISSIONS.READ.TAXES,
    suppliers: Permissions.USER_PERMISSIONS.READ.SUPPLIERS,
    products: Permissions.USER_PERMISSIONS.READ.PRODUCTS,
    customers: Permissions.USER_PERMISSIONS.READ.CUSTOMERS,
    register: Permissions.USER_PERMISSIONS.READ.INVOICES,
    register_write: Permissions.USER_PERMISSIONS.WRITE.INVOICES,
    register_update: Permissions.USER_PERMISSIONS.UPDATE.INVOICES,
    reports: "reports",
    stores: Permissions.USER_PERMISSIONS.READ.STORES,
    brands: Permissions.USER_PERMISSIONS.READ.BRANDS,
    templates: Permissions.USER_PERMISSIONS.READ.TEMPLATES,
    users: Permissions.USER_PERMISSIONS.READ.USERS,
    user_roles: Permissions.USER_PERMISSIONS.READ.USER_ROLES,
    stock_adjustments: Permissions.USER_PERMISSIONS.READ.STOCK_ADJUSTMENTS,
    stock_purchase_orders: Permissions.USER_PERMISSIONS.READ.PURCHASE_ORDERS,
    stock_requests: Permissions.USER_PERMISSIONS.READ.TRANSFERS,
    stock_returns: Permissions.USER_PERMISSIONS.READ.STOCK_RETURNS,
    ecommerce: "ecommerce",
  };


  //let adminUser = false;
  let storeEcommerce = false;


  let readFromLocalStorage = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
  readFromLocalStorage = readFromLocalStorage.data && readFromLocalStorage.data;

  let authenticateDashboard = false;

  //console.log("cache", readFromLocalStorage);


  if (readFromLocalStorage) {
    //userRouteScopes = readFromLocalStorage.scopes || [];
    userRouteScopes = [];
    //console.log(checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication);
    if (
      checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
    ) {
      authenticateDashboard = true;

      /*if (
        readFromLocalStorage.auth.store_ecommerce &&
        readFromLocalStorage.auth.store_ecommerce === "true"
      ) {
        storeEcommerce = true;
      }*/

    } else {
      authenticateDashboard = false;
    }
  }



  const stockScopeFilter = (localUserInfo) => {
    if (!localUserInfo) {
      return;
    }
    if (
      localUserInfo.user_role == "cashier" ||
      localUserInfo.user_role == "shop_manager"
    ) {
      return false;
    } else {
      return true;
    }
  };


  /*---------------------------new vwersion-------------------------------------*/
  const setActiveNestedTabs = () => {
    let routePathName = window.location.pathname.split("/");

    if (routePathName[2] === Constants.ALL_MODULE_NAMES.STOCK) {

      if (routePathName[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.TRANSFERS) {
        setActiveMenuItemId(14);
      }
      if (routePathName[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.STOCK_ADJUSTMENTS) {
        setActiveMenuItemId(15);
      }
    }
    else if (routePathName[2] === Constants.ALL_MODULE_NAMES.SETUP) {

      if (routePathName[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.STORES) {
        setActiveMenuItemId(27);
      }
      if (routePathName[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.USERS) {
        setActiveMenuItemId(28);
      }
      if (routePathName[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.BRANDS) {
        setActiveMenuItemId(31);
      }
      if (routePathName[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.USER_ROLES) {
        setActiveMenuItemId(30);
      }
      if (routePathName[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.TEMPLATES) {
        setActiveMenuItemId(29);
      }
      // if (routePathName[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.CONFIGURATIONS) {
      //   setActiveMenuItemId(32);
      // }
    }

  }


  /*---------------------------new vwersion-------------------------------------*/

  const menuItemClick = (event, label, id) => {
    //console.log("label", label);   //gives complete data
    setActiveMenuItemId(label ? label.id : "");
  };


  const menuItemActiveStatus = (id) => {
    //console.log("current-id", id); 
    return id === activeMenuItemId ? true : false;
  };
  const handleNewSale = () => {
    saveDataIntoLocalStorage(Constants.SELL_CURRENT_INVOICE_KEY, null);

  }

  let allNavigationLinksArr = [];
  let navLinkNode = {};
  let nodeChildArr = [];


  if (readFromLocalStorage && authenticateDashboard) {
    navLinkNode = {
      id: 1,
      label: <Link to={(readFromLocalStorage && authenticateDashboard) ? "/dashboard" : "/outlets"}>Dashboard</Link>,
      active: menuItemActiveStatus(1),
      
    }
    allNavigationLinksArr.push(navLinkNode);
  }
  if (readFromLocalStorage && authenticateDashboard) {

    if (PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.categories)) {
      navLinkNode = {
        id: 2,
        label: <Link to="/categories">Categories</Link>,
        active: menuItemActiveStatus(2),
        //url: "/",
      }

      allNavigationLinksArr.push(navLinkNode);

    }
    if (PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.suppliers)) {
      navLinkNode = {
        id: 4,
        label: <Link to="/suppliers">Suppliers</Link>,
        active: menuItemActiveStatus(4),
      }

      allNavigationLinksArr.push(navLinkNode); 

    }
    if (PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.taxes)) {
      navLinkNode = {
        id: 5,
        label: <Link to="/taxes">Taxes</Link>,
        active: menuItemActiveStatus(5),
        
      }
      allNavigationLinksArr.push(navLinkNode);

    }
    if (PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.products)) {
      navLinkNode = {
        id: 25,
        label: "Products",
        children: [
          {
            id: 26,
            label: <Link to="/products">Products View</Link>,
            active: menuItemActiveStatus(26),
          },
          {
            id: 35,
            label: <Link to="/products/bundles">Bundles</Link>,
            active: menuItemActiveStatus(35),
          },
        ],
      }
      allNavigationLinksArr.push(navLinkNode);

    }
    if (PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.customers)) {
      navLinkNode = {
        id: 7,
        label: <Link to="/customers">Customers</Link>,
        active: menuItemActiveStatus(7),
      }
      allNavigationLinksArr.push(navLinkNode);

    }
    //if (PermissionsHelpers.checkUserModuleReadPermission(appRouteReadScopes.couriers)) {
      /*navLinkNode = {
        id: 8,
        label: <Link to="/couriers">Couriers</Link>,
        active: menuItemActiveStatus(8),
      }
      allNavigationLinksArr.push(navLinkNode); */

    //}

    /*--------------------------------------------------------------------------*/
    nodeChildArr = [];
    if (PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.register_write) ||
      PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.register_update)) {
      nodeChildArr.push({
        id: 10,
        label: <Link to="/register/sell" onClick={handleNewSale}>Sell</Link>,
        active: menuItemActiveStatus(10),
      });
    }
    if (PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.register)) {
      nodeChildArr.push({
        id: 11,
        label: <Link to="/register/sales-history">Sales History</Link>,
        active: menuItemActiveStatus(11),
      });
    }

    if (nodeChildArr.length > 0) { //finally inserting register node
      navLinkNode = {
        id: 9,
        label: "Register",
        children: nodeChildArr,
      }
      allNavigationLinksArr.push(navLinkNode);
    }

    /*--------------------------------------------------------------------------*/
    nodeChildArr = [];
    /*if (PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.stock_purchase_orders)) {
      nodeChildArr.push({
        id: 13,
        label: <Link to="/stock-control/purchase-orders">Purchase Orders</Link>,
        active: menuItemActiveStatus(13),
      });
    }*/
    if (PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.stock_requests)) {
      nodeChildArr.push({
        id: 14,
        label: <Link to="/stock-control/stock-request">Stock Request</Link>,
        active: menuItemActiveStatus(14),
      });
    }
    if (PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.stock_adjustments)) {
      nodeChildArr.push({
        id: 15,
        label: <Link to="/stock-control/stock-adjustments">Stock Cycling</Link>,
        active: menuItemActiveStatus(15),
      });
    }
    /*if (PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.stock_returns)) {
      nodeChildArr.push({
        id: 16,
        label: <Link to="/stock-control/returned-stock">Returned Stock</Link>,
        active: menuItemActiveStatus(16),
      });
    }*/

    if(nodeChildArr.length > 0) { //finally inserting setup node
      navLinkNode = {
        id: 12,
        label: "Stock Control",
        children: nodeChildArr,
      }
      allNavigationLinksArr.push(navLinkNode);
    }
    
    /*--------------------------------------------------------------------------*/
    //if ((userRouteScopes.includes(appRouteScopes.ecommerce) || adminUser) && storeEcommerce)  {
      navLinkNode = {
        id: 17,
        label: "Ecommerce",
        children: [
          {
            id: 18,
            label: <Link to="/ecommerce/orders">Orders</Link>,
            active: menuItemActiveStatus(18),
          },
          /*{
            id: 19,
            label: <Link to="/ecommerce/inventory-sync">Inventory Sync</Link>,
            active: menuItemActiveStatus(19),
          },*/
        ],

      }
      allNavigationLinksArr.push(navLinkNode);

    //}
    //if (!userRouteScopes.includes(appRouteScopes.reports) || adminUser) {
      navLinkNode = {
        id: 20,
        label: "Reports",
        children: [
          {
            id: 21,
            label: <Link to="/reports/sales-summary">Sales Summary</Link>,
            active: menuItemActiveStatus(21),
          },
          {
            id: 22,
            label: <Link to="/reports/inventory-dump">Inventory Dump</Link>,
            active: menuItemActiveStatus(22),
          },
          // {
          //   id: 23,
          //   label: <Link to="/reports/product-history">Product History</Link>,
          //   active: menuItemActiveStatus(23),
          // },
          // {
          //   id: 24,
          //   label: <Link to="/reports/omni-sales-summary">Omni Sales Summary</Link>,
          //   active: menuItemActiveStatus(24),
          // },
          {
            id: 25,
            label: <Link to="/reports/category-wise">Category Wise</Link>,
            active: menuItemActiveStatus(25),
          },
        ],

      }
      allNavigationLinksArr.push(navLinkNode); 

    //}
    /*-----------------------------------------------*/
    nodeChildArr = [];
    if (PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.stores)) {
      nodeChildArr.push({
        id: 27,
        label: <Link to="/setup/outlets">Outlets</Link>,
        active: menuItemActiveStatus(27),
      });
    }
    if (PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.users)) {
      nodeChildArr.push({
        id: 28,
        label: <Link to="/setup/users">Users</Link>,
        active: menuItemActiveStatus(28),
      });
    }
    if (PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.templates)) {
      nodeChildArr.push({
        id: 29,
        label: <Link to="/setup/receipts-templates">Receipt Templates</Link>,
        active: menuItemActiveStatus(29),
      });
    }
    if (PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.user_roles)) {
      nodeChildArr.push({
        id: 30,
        label: <Link to="/setup/user-roles">User Roles</Link>,
        active: menuItemActiveStatus(30),
      });
    }
    if (PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.brands)) {
      nodeChildArr.push({
        id: 31,
        label: <Link to="/setup/brands">Brands</Link>,
        active: menuItemActiveStatus(31),
      });
    }
  
    // nodeChildArr.push({
    //   id: 32,
    //   label: <Link to="/setup/configurations">Configurations</Link>,
    //   active: menuItemActiveStatus(32),
    // });
    

    if(nodeChildArr.length > 0) { //finally inserting setup node
      navLinkNode = {
        id: 26,
        label: "Setup",
        children: nodeChildArr,
      }
      allNavigationLinksArr.push(navLinkNode);
    }
    navLinkNode = {
      id: 33,
      label: <Link to="/super-admin">Administrator</Link>,
      active: menuItemActiveStatus(33),
    }
    allNavigationLinksArr.push(navLinkNode);
    //if (!userRouteScopes.includes(appRouteScopes.actionsHistory) || adminUser) {
      navLinkNode = {
        id: 34,
        label: <Link to="/actions-history">Action History</Link>,
        active: menuItemActiveStatus(34),
        
      }
      allNavigationLinksArr.push(navLinkNode);
    //}

    

  }

 



  return (
    <div className="nav_container">
      {/* <IconButton
        icon="Close"
        isRounded
        onClick={handleNavigationCloseButtonClick}
        className="nav_close"
      /> */}

      <Navigation
        className="secondary side_nav"
        links={allNavigationLinksArr}
        onClick={menuItemClick}
        orientation="vertical"
      />
    </div>
  );
}

export default SideNav;