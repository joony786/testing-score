
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Icon } from "@teamfabric/copilot-ui";
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
} from "../../../utils/local-storage/local-store-utils";
import Constants from "../../../utils/constants/constants";

function MobileNavCustom() {
  const history = useHistory();
  const [activeMenuItemId, setActiveMenuItemId] = useState("");

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

  const handleParentItemLinkClick = (e, activeNavName) => {
    e.preventDefault();
    setExpandableParents({
      [activeNavName]: !expandableParents[activeNavName],
    });
  };

  const handleChildItemLinkClick = (e, activeNavName, forwardLink) => {
    e.preventDefault();
    setExpandableParents({ [activeNavName]: false });
    history.push({
      pathname: forwardLink,
    });
  };

  const menuItemClick = (e, id, forwardLink) => {
    e.preventDefault();
    //console.log("label", label);   //gives complete data
    setActiveMenuItemId(id);
    history.push({
      pathname: forwardLink,
    });
  };

  const menuItemActiveStatus = (id) => {
    //console.log("current-id", id);
    return id === activeMenuItemId ? "active" : "";
  };

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

  console.log(activeMenuItemId);
  const authDashboardLinks = [
    {
      id: 1,
      name: " Dashboard",
      to: "",
      route: "/dashboard",
      hasChild: false,
    },
    {
      id: 2,
      name: "Categories",
      to: "",
      route: "/categories",
      hasChild: false,
    },
    {
      id: 3,
      name: "Suppliers",
      to: "",
      route: "/suppliers",
      hasChild: false,
    },
    {
      id: 4,
      name: "Products",
      to: "",
      hasChild: true,
      ulClassName: expandableParentNodeskeys.PRODUCTS,
      parentClassName: expandableParents.PRODUCTS,
      nested: [
        {
          route: `/products`,
          id: 26,
          title: "Product View",
        },
        {
          route: `/products/bundles`,
          id: 26,
          title: "Bundles",
        },
      ],
    },
    {
      id: 7,
      to: "",
      route: "/customers",
      name: " Customers",
      hasChild: false,
    },
    {
      id: 8,
      to: "Courier",
      route: "/couriers",
      hasChild: false,
    },
    {
      id: 9,
      name: "Register",
      to: "",
      hasChild: true,
      parentClassName:expandableParents.REGISTER,
      ulClassName: expandableParentNodeskeys.REGISTER,
      nested: [
        {
          route: `"/register/sell`,
          id: 16,
          title: "Sell",
        },
        {
          route: "/register/sales-history",
          id: 11,
          title: "Sales History",
        },
      ],
    },
    {
      id: 12,
      name: " Stock Control",
      to: "",
      hasChild: true,
      parentClassName:expandableParents.STOCK,
      ulClassName: expandableParentNodeskeys.STOCK,
      nested: [
        {
          route: "/stock-control/purchase-orders",
          id: 13,
          title: "Purchase Orders",
        },
        {
          route: "/stock-control/stock-request",
          id: 14,
          title: "Stock Request",
        },
      ],
    },
    {
      id: 17,
      name: " Ecommerce",
      to: "",
      hasChild: true,
      parentClassName:expandableParents.ECOMMERCE,
      ulClassName: expandableParentNodeskeys.ECOMMERCE,
      nested: [
        {
          route: "/orders",
          id: 18,
          title: "Orders",
        },
        {
          route: "/ecommerce/inventory-sync",
          id: 19,
          title: "Inventory Sync",
        },
      ],
    },
    {
      id: 20,
      name: " Reports",
      to: "",
      hasChild: true,
      parentClassName:expandableParents.REPORTS,
      ulClassName: expandableParentNodeskeys.REPORTS,
      nested: [
        {
          route: "/reports/sales-summary",
          id: 21,
          title: "Sales Summary",
        },
        {
          route: "/reports/inventory-dump",
          id: 22,
          title: "Inventory SyncInventory Dump",
        },
        {
          route: "/reports/product-history",
          id: 23,
          title: "Product History",
        },
        {
          route: "/reports/omni-sales-summary",
          id: 24,
          title: "Omni Sales Summary",
        },
        {
          route: "/reports/category-wise",
          id: 25,
          title: "Category Wise",
        },
      ],
    },
    {
      id: 26,
      name: "  Setup",
      to: "",
      hasChild: true,
      parentClassName:expandableParents.SETUP,
      ulClassName: expandableParentNodeskeys.SETUP,
      nested: [
        {
          route: "/setup/outlets",
          id: 27,
          title: "Outlets",
        },
        {
          route: "/setup/users",
          id: 28,
          title: "Users",
        },
        {
          route: "/setup/receipts-templates",
          id: 29,
          title: "Receipt Templates",
        },
        {
          route: "/setup/user-roles",
          id: 30,
          title: "User Roles",
        },
        {
          route: "/setup/brands",
          id: 31,
          title: "Brands",
        },
        {
          route: "/setup/configurations",
          id: 32,
          title: "Configurations",
        },
      ],
    },
    {
      id: 34,
      to: "",
      route: "/actions-history",
      name: "Action History",
      hasChild: false,
    },
  ];

  return (
    <>
      {authenticatedDashboard && (
        <div className="mobile_nav_custom">
          <ul>
            {authDashboardLinks.map((item,index) => {
              return (
              item.hasChild ? (
                <li key={index}>
                  <Link to={item.to} id={item.id}>
                    <span
                      onClick={(e) =>
                        handleParentItemLinkClick(e, item.ulClassName)
                      }
                    >
                      {item.name}
                    </span>
                  </Link>
                  <ul
                    className={item.parentClassName ? "sub_menu show" : "sub_menu"}
                  >
                    {item.nested.map((elem) => {
                      return (
                        <li
                          onClick={(e) =>
                            handleChildItemLinkClick(
                              e,
                              item.ulClassName,
                              elem.route
                            )
                          }
                        >
                          <Link to={item.to} id={elem.id}>
                            {elem.title}
                          </Link>
                          <Icon iconName="RightArrow" size={16} />
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ) : (
                <li key={index}>
                  <Link
                    to={item.to}
                    className={menuItemActiveStatus(item.id)}
                    id={item.id}
                    onClick={(e) => menuItemClick(e, item.id, item.route)}
                  >
                    {item.name}
                  </Link>
                </li>
              )
             )} 
             )}
          </ul>
        </div>
      )}
    </>
  );
}

export default MobileNavCustom;
