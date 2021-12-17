import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Icon } from "@teamfabric/copilot-ui";
import ButtonBack from "../../atoms/button_back";
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
} from "../../../utils/local-storage/local-store-utils";
import Permissions from '../../../utils/constants/user-permissions';
import * as PermissionsHelpers from "../../../utils/helpers/check-user-permission";
import Constants from "../../../utils/constants/constants";
import { useLocation } from "react-router-dom";

function MobileNavCustom() {
  const history = useHistory();
  const { pathname } = useLocation();
  const [activeMenuItemId, setActiveMenuItemId] = useState("");
  const [childLinkCheck, setChildLinkCheck] = useState(false);
  const[addClass,setAddClass] = useState(false)


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


  const getRouteId = (path) => {
    switch (path) {
      case "/dashboard": {
        return 1;
      }
      case "/categories": {
        return 2;
      }
      case "/suppliers": {
        return 4;
      }
      case "/taxes": {
        return 5;
      }
      case "/customers": {
        return 7;
      }
      case "/super-admin": {
        return 33;
      }
      case "/actions-history": {
        return 34;
      }
      default: {
        return;
      }
    }
  };




  useEffect(() => {
    //console.log("use-effect");
    /*---------------------------------------*/
    const routeID = getRouteId(pathname);
    setActiveMenuItemId(routeID);
    /*---------------------------------------*/
    let pathName = window.location.pathname;
    let pathNameArr = pathName.split("/");
    let childCheck = false;

    if (pathNameArr[2] === Constants.ALL_MODULE_NAMES.PRODUCTS) {
      setChildLinkCheck(true);
      childCheck = true;
    } else {
      for (const [key, value] of Object.entries(
        Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES
      )) {
        if (pathNameArr[3] === value ){
          setChildLinkCheck(true);
          childCheck = true;
        }
      }
    }
    if(pathNameArr[3]){
      setChildLinkCheck(true);
          childCheck = true;
    }

    if (!childCheck) {
      setChildLinkCheck(false); //imp to set here as false
    }
  }, [pathname]);

  const expandableParentsKeys = {
    PRODUCTS: false,
    REGISTER: false,
    SETUP: false,
    REPORTS: false,
    STOCK: false,
    ECOMMERCE: false,
  };

  const expandableParentNodeskeys = {
    PRODUCTS: "PRODUCTS",
    REGISTER: "REGISTER",
    SETUP: "SETUP",
    REPORTS: "REPORTS",
    STOCK: "STOCK",
    ECOMMERCE: "ECOMMERCE",
  };

  //const [showChildNav, setShowChildNav] = useState(false);
  const [expandableParents, setExpandableParents] = useState(
    expandableParentsKeys
  );

  let authenticatedDashboard = false;
  const hideOverflow = () =>  document.body.style.overflow = 'hidden';
  
  const showOverflow = () => document.body.style.overflow = 'auto';

  useEffect(() => {
    (expandableParents.STOCK || expandableParents.PRODUCTS || expandableParents.REGISTER || expandableParents.SETUP || expandableParents.ECOMMERCE || expandableParents.REPORTS) ? hideOverflow() : showOverflow()
    
  }, [expandableParents])


  const handleParentItemLinkClick = (e, activeNavName, id) => {
    e.preventDefault();
    setActiveMenuItemId(id);
    setExpandableParents({
      [activeNavName]: !expandableParents[activeNavName],
      
    });

 

  //   if(expandableParents[activeNavName] === true) {
  //     // setAddClass(true)  
  //         window.scroll(0,0)
  //     document.querySelector("body").style.overflow= 'hidden';
  //   }
  //   else {
  //     // setAddClass(false)
  //     document.querySelector("body").style.overflow= 'auto';
  //   }
  };
  // console.log(expandableParents,addClass);

  // // useEffect(() => {
  // //   if(activeMenuItemId === (9 || 12 || 17 || 20 || 26)){
  // //     console.log('inside useeffect');
  // //     window.scroll(0,0)
  // //     document.querySelector("body").style.overflow= 'hidden';
  // //   }
  // //   return () => {
  // //     document.querySelector("body").style.overflow = 'none'
  // //   }
  // // }, [activeMenuItemId])

  const handleChildItemLinkClick = (e, activeNavName, forwardLink, id) => {
    e.preventDefault();
    setActiveMenuItemId(id);
    setExpandableParents({ [activeNavName]: false });
    history.push({
      pathname: forwardLink,
    });
  };

  const menuItemClick = (e, id, forwardLink) => {
    e.preventDefault();
    //console.log("label", label);   //gives complete data
    /*-------------------------------------------*/
    Object.entries(expandableParents).forEach(([key, val]) => {
      setExpandableParents({
        [key]: false,
      });
    });

    /*-------------------------------------------*/
    setActiveMenuItemId(id);
    history.push({
      pathname: forwardLink,
    });
  };

  const menuItemActiveStatus = (id) => {
    //console.log("current-id", id);
    return id === activeMenuItemId && "active";
  };

  /*-------------------------------------------*/

  let readFromLocalStorage = getDataFromLocalStorage(
    Constants.USER_DETAILS_KEY
  );
  readFromLocalStorage = readFromLocalStorage.data
    ? readFromLocalStorage.data
    : null;
  if (readFromLocalStorage) {
    if (
      checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
    ) {
      authenticatedDashboard = true;
    }
  }

  const countCharacters =(str, find)=> (str.split(find)).length - 1;
  const goBack = () =>{
    const letter = '/'
   const totalOccupance = countCharacters(pathname,letter) 
    console.log(totalOccupance);
    if(totalOccupance > 2){
      window.history.go(-2)
    } else history.goBack();
  }

  //console.log(activeMenuItemId);
  console.log(pathname);

  return (
    <>
      {(authenticatedDashboard && childLinkCheck) && (
        //<ButtonBack classes={"button__back--mobile"} onClick={goBack} />
        <span onClick={goBack} className='backBtnCustom__back--mobile'>
          <Icon iconName="LeftArrow" size={16} />
          Back
        </span>

      )}
      {authenticatedDashboard && !childLinkCheck && (
        <div className="mobile_nav_custom">
          <ul>
            <li>
              <Link
                to="#"
                className={
                  activeMenuItemId ? menuItemActiveStatus(1) : "active"
                }
                id={1}
                onClick={(e) => menuItemClick(e, 1, "/dashboard")}
              >
                Dashboard
              </Link>
            </li>
            {PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.categories) &&
            <li>
              <Link
                to="#"
                className={menuItemActiveStatus(2)}
                id={2}
                onClick={(e) => menuItemClick(e, 2, "/categories")}
              >
                Categories
              </Link>
            </li>}
            {PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.suppliers) &&
            <li>
              <Link
                to="#"
                className={menuItemActiveStatus(4)}
                id={4}
                onClick={(e) => menuItemClick(e, 4, "/suppliers")}
              >
                Suppliers
              </Link>
            </li>}
            {PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.taxes) &&
            <li>
              <Link
                to="#"
                className={menuItemActiveStatus(5)}
                id={5}
                onClick={(e) => menuItemClick(e, 5, "/taxes")}
              >
                Taxes
              </Link>
            </li>}
            {PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.products) &&
            <li>
              <Link
                to="#"
                className={menuItemActiveStatus(25)}
                onClick={(e) =>
                  handleParentItemLinkClick(
                    e,
                    expandableParentNodeskeys.PRODUCTS,
                    25
                  )
                }
                id={25}
              >
                <span>Products</span>
              </Link>

              <ul
                className={
                  expandableParents.PRODUCTS ? "sub_menu show" : "sub_menu"
                }
              >
                <li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.PRODUCTS,
                      "/products",
                      25
                    )
                  }
                >
                  <Link to="#" id={26}>
                    Product View
                  </Link>
                  <Icon iconName="RightArrow" size={16} />
                </li>
                <li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.PRODUCTS,
                      "/products/bundles",
                      25
                    )
                  }
                >
                  <Link to="#" id={27}>
                    Bundles
                  </Link>
                  <Icon iconName="RightArrow" size={16} />
                </li>
              </ul>
            </li>}
            {PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.customers) &&
            <li>
              <Link
                to="#"
                className={menuItemActiveStatus(7)}
                onClick={(e) => menuItemClick(e, 7, "/customers")}
                id={7}
              >
                Customers
              </Link>
            </li>}
            {/*<li>
              <Link to="#" className={menuItemActiveStatus(8)}
                onClick={(e) => menuItemClick(e, 8, "/couriers")}
                id={8}>
                Couriers
              </Link>
            </li>*/}

            {(PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.register) ||
              (PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.register_write) ||
                PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.register_update))) &&
            <li>
            
              <Link
                to="#"
                className={menuItemActiveStatus(9)}
                id={9}
                onClick={(e) =>
                  handleParentItemLinkClick(
                    e,
                    expandableParentNodeskeys.REGISTER,
                    9
                  )
                }
              >
                <span>Register</span>
              </Link>

              <ul
                className={
                  expandableParents.REGISTER ? "sub_menu show" : "sub_menu"
                }
              >
                {(PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.register_write) ||
                  PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.register_update)) &&
                  
                <li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.REGISTER,
                      "/register/sell",
                      9
                    )
                  }
                >
                  <Link to="#" className={menuItemActiveStatus(10)} id={10}>
                    Sell
                  </Link>
                  <Icon iconName="RightArrow" size={16} />
                  </li>}

                {PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.register) &&
                <li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.REGISTER,
                      "/register/sales-history",
                      9
                    )
                  }
                >
                  <Link to="#" className={menuItemActiveStatus(11)} id={9}>
                    Sales History
                  </Link>
                  <Icon iconName="RightArrow" size={16} />
                
                </li>}
              </ul>
            </li>}

            {(PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.stock_requests) ||
              PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.stock_adjustments)) &&
            <li>
              <Link
                to="#"
                className={menuItemActiveStatus(12)}
                id={12}
                onClick={(e) =>
                  handleParentItemLinkClick(e, expandableParentNodeskeys.STOCK,12)
                }
              >
                <span>Stock Control</span>
              </Link>

              <ul
                className={
                  expandableParents.STOCK ? "sub_menu show" : "sub_menu"
                }
              >
                {/*<li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.STOCK,
                      "/stock-control/purchase-orders",
                      13,
                    )
                  }
                >
                  <Link to="#" className={menuItemActiveStatus(13)} id={13}>Purchase Orders</Link>
                  <Icon iconName="RightArrow" size={16} />
                </li>*/}
                {PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.stock_requests) &&
                <li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.STOCK,
                      "/stock-control/stock-request",
                      12
                    )
                  }
                >
                  <Link to="#" id={12}>
                    Stock Request
                  </Link>
                  <Icon iconName="RightArrow" size={16} />
                </li>}
                {PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.stock_adjustments) &&
                <li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.STOCK,
                      "/stock-control/stock-adjustments",
                      12
                    )
                  }
                >
                  <Link to="#" id={12}>
                    Stock Cycling
                  </Link>
                  <Icon iconName="RightArrow" size={16} />
                </li>}
                {/*<li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.STOCK,
                      "/stock-control/returned-stock",
                      16,
                    )
                  }
                >
                  <Link to="#" className={menuItemActiveStatus(16)} id={16}>Returned Stock</Link>
                  <Icon iconName="RightArrow" size={16} />
                </li>*/}
              </ul>
            </li>}
            <li>
              <Link
                to="#"
                className={menuItemActiveStatus(17)}
                id={17}
                onClick={(e) =>
                  handleParentItemLinkClick(
                    e,
                    expandableParentNodeskeys.ECOMMERCE,17
                  )
                }
              >
                <span>Ecommerce</span>
              </Link>

              <ul
                className={
                  expandableParents.ECOMMERCE ? "sub_menu show" : "sub_menu"
                }
              >
                <li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.ECOMMERCE,
                      "/ecommerce/orders",
                      17
                    )
                  }
                >
                  <Link to="#" id={18}>
                    Orders
                  </Link>
                  <Icon iconName="RightArrow" size={16} />
                </li>
                {/*<li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.ECOMMERCE,
                      "/ecommerce/inventory-sync",
                      17,
                    )
                  }
                >
                  <Link to="#" className={menuItemActiveStatus(19)} id={19}>Inventory Sync</Link>
                  <Icon iconName="RightArrow" size={16} />
                </li>*/}
              </ul>
            </li>
            <li>
              <Link to="#" className={menuItemActiveStatus(20)} id={20} onClick={(e) =>
                handleParentItemLinkClick(e, expandableParentNodeskeys.REPORTS,20)
              }>
                <span>
                  Reports
                </span>
              </Link>

              <ul
                className={
                  expandableParents.REPORTS ? "sub_menu show" : "sub_menu"
                }
              >
                <li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.REPORTS,
                      "/reports/sales-summary",
                      20,
                    )
                  }
                >
                  <Link to="#" id={21}>Sales Summary</Link>
                  <Icon iconName="RightArrow" size={16} />
                </li>
                <li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.REPORTS,
                      "/reports/inventory-dump",
                      20,
                    )
                  }
                >
                  <Link to="#" id={22}>Inventory Dump</Link>
                  <Icon iconName="RightArrow" size={16} />
                </li>
                {/* <li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.REPORTS,
                      "/reports/product-history",
                      23,
                    )
                  }
                >
                  <Link to="#" className={menuItemActiveStatus(23)} id={23}>Product History</Link>
                  <Icon iconName="RightArrow" size={16} />
                </li> */}
                {/* <li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.REPORTS,
                      "/reports/omni-sales-summary",
                      24,
                    )
                  }
                >
                  <Link to="#" className={menuItemActiveStatus(24)} id={24}>Omni Sales Summary</Link>
                  <Icon iconName="RightArrow" size={16} />
                </li> */}
                <li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.REPORTS,
                      "/reports/category-wise",
                      20,
                    )
                  }
                >
                  <Link to="#" id={25}>Category Wise</Link>
                  <Icon iconName="RightArrow" size={16} />
                </li>
              </ul>
            </li>

            {(PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.stores) ||
              PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.users) ||
              PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.templates) ||
              PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.user_roles) ||
              PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.brands)) &&
            <li>
              <Link
                to=""
                className={menuItemActiveStatus(26)}
                id={26}
                onClick={(e) =>
                  handleParentItemLinkClick(e, expandableParentNodeskeys.SETUP,26)
                }
              >
                <span>Setup</span>
              </Link>

              <ul
                className={
                  expandableParents.SETUP ? "sub_menu show" : "sub_menu"
                }
              >
                {PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.stores) &&
                  <li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.SETUP,
                      "/setup/outlets",
                      26
                    )
                  }
                >
                  <Link to="#" id={27}>
                    Outlets
                  </Link>
                  <Icon iconName="RightArrow" size={16} />
                </li>}
                {PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.users) &&
                <li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.SETUP,
                      "/setup/users",
                      26
                    )
                  }
                >
                  <Link to="#" id={28}>
                    Users
                  </Link>
                  <Icon iconName="RightArrow" size={16} />
                </li>}
                {PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.templates) &&
                <li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.SETUP,
                      "/setup/receipts-templates",
                      26
                    )
                  }
                >
                  <Link to="#" id={29}>
                    Receipt Templates
                  </Link>
                  <Icon iconName="RightArrow" size={16} />
                </li>}
                {PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.user_roles) &&
                <li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.SETUP,
                      "/setup/user-roles",
                      26
                    )
                  }
                >
                  <Link to="#" id={30}>
                    User Roles
                  </Link>
                  <Icon iconName="RightArrow" size={16} />
                </li>}
                {PermissionsHelpers.checkUserModuleRolePermission(appRouteReadScopes.brands) &&
                <li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.SETUP,
                      "/setup/brands",
                      26
                    )
                  }
                >
                  <Link to="#" id={31}>
                    Brands
                  </Link>
                  <Icon iconName="RightArrow" size={16} />
                </li>}
                {/*<li
                  onClick={(e) =>
                    handleChildItemLinkClick(
                      e,
                      expandableParentNodeskeys.SETUP,
                      "/setup/configurations",
                      26
                    )
                  }
                >
                  <Link to="#" id={32}>
                    Configurations
                  </Link>
                  <Icon iconName="RightArrow" size={16} />
                </li>*/}
              </ul>
            </li>}

            <li>
              <Link
                to="#"
                className={menuItemActiveStatus(33)}
                onClick={(e) => menuItemClick(e, 33, "/super-admin")}
                id={33}
              >
                Administrator
              </Link>
            </li>

            <li>
              <Link
                to="#"
                className={menuItemActiveStatus(34)}
                onClick={(e) => menuItemClick(e, 34, "/actions-history")}
                id={34}
              >
                Action History
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default MobileNavCustom;
