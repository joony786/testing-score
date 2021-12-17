import React from "react";
import { Link } from "react-router-dom";
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
} from "../../../utils/local-storage/local-store-utils";
import Constants from "../../../utils/constants/constants";
import ActionsCustomFlyout from "../../atoms/actionsMenuFlyout";



function SwitchOutlet(props) {
  const {
    heading = "Switch Outlet",
    linkUrl = "/outlets",
  } = props;

  let showInnerHeading = null;
  let authenticatedDashboard = false;

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
      showInnerHeading = readFromLocalStorage?.store_name;
      authenticatedDashboard = true;
    }
    /*else {
      showInnerHeading = readFromLocalStorage.brand_info?.brand_name;
    }*/
  }


  let actionMenuOptions = [];
  /*if (window.location.pathname.split("/")[2] !== "outlets") {
    actionMenuOptions.push({
      label: (
        <Link to="/outlets" className="switch_outlet__button">
          Outlets
        </Link>
      )
    });
  }*/

  actionMenuOptions.push({
    label: (
      <Link to="/brands" className="switch_outlet__button">
        Brands
      </Link>
    )
  });



  return (
    <>
    {authenticatedDashboard &&
    <div className="switch_outlet">
      <h3 className="heading heading--secondary">{showInnerHeading ? showInnerHeading : "N/A"}</h3>

      {/*<Link to={linkUrl} className="switch_outlet__button">
        {heading}
      </Link>*/}

      <ActionsCustomFlyout
        propId={"switch-actions-menu"}
        menuItems={actionMenuOptions}
        text="Switch"
        //menuItemClick={handleTableMenuItemClick}
      />

    </div>}
    </>
  );
}

export default SwitchOutlet;
