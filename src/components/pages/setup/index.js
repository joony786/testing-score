import React, { useEffect, useState } from "react";
import { Tab, TabItem } from "@teamfabric/copilot-ui";
import { Link, useHistory } from "react-router-dom";

// components
import Outlets from "./outlets";
import Users from "./users";
import Receipts from "./receipts";
import Constants from "../../../utils/constants/constants";
import SwitchOutlet from "../../atoms/switch_outlet";
import ActionsCustomFlyout from "../../atoms/actionsMenuFlyout";
import PageTitle from "../../organism/header";
import Roles from "./roles";
import Brands from "./brands";
import SetupConfig from "./config";
import Permissions from "../../../utils/constants/user-permissions";
import * as PermissionsHelpers from "../../../utils/helpers/check-user-permission";
import ActionMenuForSubItems from "../../atoms/actionsMenuFlyout/actionMenuForSubItems";

function Setup(props) {
  const history = useHistory();
  const { activeKey = "" } = props;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [tabOptions, setTabOptions] = useState([]);

  const moduleUserAddCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.WRITE.USERS
  );
  const moduleUserRoleAddCheck =
    PermissionsHelpers.checkUserModuleRolePermission(
      Permissions.USER_PERMISSIONS.WRITE.USER_ROLES
    );
  const moduleBrandAddCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.WRITE.BRANDS
  );
  const moduleStoresAddCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.WRITE.STORES
  );

  const moduleTemplatesAddCheck =
    PermissionsHelpers.checkUserModuleRolePermission(
      Permissions.USER_PERMISSIONS.WRITE.TEMPLATES
    );

  const moduleUserReadCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.READ.USERS
  );
  const moduleUserRoleReadCheck =
    PermissionsHelpers.checkUserModuleRolePermission(
      Permissions.USER_PERMISSIONS.READ.USER_ROLES
    );
  const moduleBrandReadCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.READ.BRANDS
  );
  const moduleStoresReadCheck =
    PermissionsHelpers.checkUserModuleRolePermission(
      Permissions.USER_PERMISSIONS.READ.STORES
    );

  const moduleTemplatesReadCheck =
    PermissionsHelpers.checkUserModuleRolePermission(
      Permissions.USER_PERMISSIONS.READ.TEMPLATES
    );

  const handletabChange = (index) => {
    const key = tabOptions.at(index);
    history.push({
      pathname: `/setup/${key}`,
    });
  };
  
  const changeRoute = (label) => {
    switch (label) {
      case "New Outlet": {
        history.push("/setup/outlets/add");
        break;
      }
      case "New User": {
        history.push("/setup/users/add");
        break;
      }
      case "New Template": {
        history.push("/setup/receipts-templates/add");
        break;
      }
      case "New Role": {
        history.push("/setup/user-roles/add");
        break;
      }
      case "New Brand": {
        history.push("/setup/brands/add");
        break;
      }
      default:
        break;
    }
  };

  const handleTableMenuItemClick = (propId, propObj, itemLabel) => {
    console.log(itemLabel);
    changeRoute(itemLabel.props.children);
  };

  const actionMenuOptions = () => {
    const options = [];
    if (moduleStoresAddCheck) {
      options.push({
        label: (
          <Link
            className="flyout-action-menu-link"
            to={!moduleStoresAddCheck ? "#" : "/setup/outlets/add"}
          >
            New Outlet
          </Link>
        ),
      });
    }
    if (moduleUserAddCheck) {
      options.push({
        label: (
          <Link
            className="flyout-action-menu-link"
            to={!moduleUserAddCheck ? "#" : "/setup/users/add"}
          >
            New User
          </Link>
        ),
      });
    }
    if (moduleTemplatesAddCheck) {
      options.push({
        label: (
          <Link
            className="flyout-action-menu-link"
            to={
              !moduleTemplatesAddCheck ? "#" : "/setup/receipts-templates/add"
            }
          >
            New Template
          </Link>
        ),
      });
    }
    if (moduleUserRoleAddCheck) {
      options.push({
        label: (
          <Link
            className="flyout-action-menu-link"
            to={!moduleUserRoleAddCheck ? "#" : "/setup/user-roles/add"}
          >
            New Role
          </Link>
        ),
      });
    }
    if (moduleBrandAddCheck) {
      options.push({
        label: (
          <Link
            className="flyout-action-menu-link"
            to={!moduleBrandAddCheck ? "" : "/setup/brands/add"}
          >
            New Brand
          </Link>
        ),
      });
    }
    return options;
  };

  useEffect(() => {
    const options = [];
    if (moduleStoresReadCheck) {
      options.push(Constants.SETUP.OUTLETS_TAB_KEY);
    }
    if (moduleUserReadCheck) {
      options.push(Constants.SETUP.USERS_TAB_KEY);
    }
    if (moduleTemplatesReadCheck) {
      options.push(Constants.SETUP.RECEIPTS_TAB_KEY);
    }
    if (moduleUserRoleReadCheck) {
      options.push(Constants.SETUP.ROLES_TAB_KEY);
    }
    if (moduleBrandReadCheck) {
      options.push(Constants.SETUP.BRANDS_TAB_KEY);
    }
    setTabOptions(options);
  }, []);

  return (
    <section className="page">
      <div className="page__top">
        <SwitchOutlet />
      </div>

      <PageTitle title="Setup" />

      <div className="page__buttons">
        <ActionMenuForSubItems
          propId={"setup-actions-menu"}
          //propObj={tableItem}
          menuItems={actionMenuOptions()}
          menuItemClick={handleTableMenuItemClick}
        />
      </div>

      <div className="page__tabs">
        <Tab
          {...props}
          variant="horizontal"
          heading=""
          navClassName="tabitem-space"
          tabChangeHandler={handletabChange}
        >
          {moduleStoresReadCheck && (
            <TabItem
              key="outlets"
              title="Outlets"
              active={
                activeKey && activeKey === Constants.SETUP.OUTLETS_TAB_KEY
              }
            >
              <Outlets />
            </TabItem>
          )}
          {moduleUserReadCheck && (
            <TabItem
              title="Users"
              active={activeKey && activeKey === Constants.SETUP.USERS_TAB_KEY}
            >
              <Users />
            </TabItem>
          )}
          {moduleTemplatesReadCheck && (
            <TabItem
              title="Receipt Templates"
              active={
                activeKey && activeKey === Constants.SETUP.RECEIPTS_TAB_KEY
              }
            >
              <Receipts />
            </TabItem>
          )}
          {moduleUserRoleReadCheck && (
            <TabItem
              title="User Roles"
              active={activeKey && activeKey === Constants.SETUP.ROLES_TAB_KEY}
            >
              <Roles />
            </TabItem>
          )}
          {moduleBrandReadCheck && (
            <TabItem
              key="brands"
              title="Brands"
              active={activeKey && activeKey === Constants.SETUP.BRANDS_TAB_KEY}
            >
              <Brands />
            </TabItem>
          )}
          {/* <TabItem
            title="Configurations"
            active={
              activeKey && activeKey === Constants.SETUP.CONFIGURATIONS_TAB_KEY
            }
          >
            <SetupConfig />
          </TabItem> */}
        </Tab>
      </div>
    </section>
  );
}

export default Setup;
