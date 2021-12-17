import React from "react";

import { Tab, TabItem, Icon } from "@teamfabric/copilot-ui";
import { Link, NavLink } from "react-router-dom";

function MobileNav(props) {
  const handletabChange = (index) => {
    console.log(index);
  };

  return (
    <Tab
      {...props}
      variant="horizontal"
      heading=""
      navClassName="tabitem-space"
      tabChangeHandler={handletabChange}
      className="mobile_nav"
    >
      <TabItem title="Dashboard" active>
        <NavLink to="/dashboard"></NavLink>
      </TabItem>
      <TabItem title="Categories">
        <NavLink to="/categories"></NavLink>
      </TabItem>
      <TabItem title="Suppliers"></TabItem>
      <TabItem title="Taxes"></TabItem>
      <TabItem title="Products">
        <ul className="sub_menu">
          <li className="sub_menu__item">
            Products View <Icon iconName="RightArrow" size={16} />
          </li>
          <li className="sub_menu__item">
            Bundles <Icon iconName="RightArrow" size={16} />
          </li>
        </ul>
      </TabItem>
      <TabItem title="Customer"></TabItem>
      <TabItem title="Couriers"></TabItem>
      <TabItem title="Register">
        <ul className="sub_menu">
          <li className="sub_menu__item">
            Sell <Icon iconName="RightArrow" size={16} />
          </li>
          <li className="sub_menu__item">
            Sales History <Icon iconName="RightArrow" size={16} />
          </li>
        </ul>
      </TabItem>
      <TabItem title="Stock Control"></TabItem>
      <TabItem title="Ecommerce">
        <ul className="sub_menu">
          <li className="sub_menu__item">
            Orders <Icon iconName="RightArrow" size={16} />
          </li>
          <li className="sub_menu__item">
            Inventory Sync <Icon iconName="RightArrow" size={16} />
          </li>
        </ul>
      </TabItem>
      <TabItem title="Reports">
        <ul className="sub_menu">
          <li className="sub_menu__item">
            Sales Summary <Icon iconName="RightArrow" size={16} />
          </li>
          <li className="sub_menu__item">
            Inventory Dump <Icon iconName="RightArrow" size={16} />
          </li>
          <li className="sub_menu__item">
            Product History <Icon iconName="RightArrow" size={16} />
          </li>
          <li className="sub_menu__item">
            Omni Sales Summary <Icon iconName="RightArrow" size={16} />
          </li>
          <li className="sub_menu__item">
            Category Wise <Icon iconName="RightArrow" size={16} />
          </li>
        </ul>
      </TabItem>
      <TabItem title="Setup"></TabItem>
    </Tab>
  );
}

export default MobileNav;
