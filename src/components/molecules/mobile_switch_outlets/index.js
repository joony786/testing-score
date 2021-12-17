import React, { useState, useEffect } from "react";
//import ButtonBack from "../../atoms/button_back";
//import SwitchDropdown from "../../atoms/switch_dropdown";
//import SwitchOutlet from "../../atoms/switch_outlet";
import { Link } from "react-router-dom";
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
} from "../../../utils/local-storage/local-store-utils";
import Constants from "../../../utils/constants/constants";
import ActionsCustomFlyout from "../../atoms/actionsMenuFlyout";
import { useHistory, useLocation } from "react-router-dom";



function MobileOutlets() {
  const {pathname} =  useLocation();
  const history = useHistory();
  const [userAuthentication, setUserAuthentication] = useState(false);
  const [showInnerHeading, setShowInnerHeading] = useState("");
  const [heading, setHeading] = useState("Switch Outlets");
  const [linkUrl, setLinkUrl] = useState("/pos/outlets");



  useEffect(() => {
    let pathRouteName = window.location.pathname.split("/");

    let readFromLocalStorage = getDataFromLocalStorage(
      Constants.USER_DETAILS_KEY
    );
    readFromLocalStorage = readFromLocalStorage.data && readFromLocalStorage.data;
    if (readFromLocalStorage) {
      if (
        checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
      ) {

        //console.log("inside");
         if(pathRouteName[2] !== "brands") {
          setShowInnerHeading(readFromLocalStorage?.store_name);
          setUserAuthentication(true);
         }

      }
      else {
        setUserAuthentication(false);
      }
       
    }
    else {
      setUserAuthentication(false);
    }

  }, [pathname]);


  const onMobileNavLinkItemClick = (e, forwardLink) => {
    console.log(forwardLink);
    e.preventDefault();
    //window.open(`${forwardLink}`, "_self");  //imp prev version
    history.push({
      pathname: forwardLink,
    });
  }


  let actionMenuOptions = [];
  /*if (window.location.pathname.split("/")[2] !== "outlets") {
    actionMenuOptions.push({
      label: (
        <Link to="" className="switch_selection_mobile_content_button"
        onClick={(e) => onMobileNavLinkItemClick(e, "/outlets")}
        >
          Outlets
        </Link>
      )
    });
  }*/

  actionMenuOptions.push({
    label: (
      <Link to="" className="switch_selection_mobile_content_button" 
      onClick={(e) => onMobileNavLinkItemClick(e, "/brands")}
      >
        Brands
      </Link>
    )
  });

  //console.log("render", userAuthentication);


  return (
    <>
      {userAuthentication &&
        <div className="mobile_outlets">
          <div className="mobile_outlets_custom_content">
            <h3 className="heading heading--secondary">{showInnerHeading ? showInnerHeading : "N/A"}</h3>
            {/*<Link to="" className="mobile_outlets_custom_content__button" onClick={(e) => onMobileNavLinkItemClick(e, linkUrl)}>
              {heading}
            </Link>*/}

            <ActionsCustomFlyout
              propId={"switch-actions-menu-mobile"}
              menuItems={actionMenuOptions}
              text="Switch"
              //menuItemClick={handleTableMenuItemClick}
            />

          </div>
        </div>}
    </>
  );
}

export default MobileOutlets;
