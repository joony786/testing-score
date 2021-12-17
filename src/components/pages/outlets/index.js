import React, { useState, useEffect } from "react";
import "./style.scss";

// components
import PageTitle from "../../organism/header";
import {
  saveDataIntoLocalStorage,
  getDataFromLocalStorage,
  clearLocalUserData,
  checkUserAuthFromLocalStorage,
} from "../../../utils/local-storage/local-store-utils";
//import { useHistory } from "react-router-dom";
import SwitchOutlet from "../../atoms/switch_outlet";
import * as OutletsApiUtil from "../../../utils/api/oulets-api-utils";
import * as SetupApiUtil from "../../../utils/api/setup-api-utils";
import * as Helpers from "../../../utils/helpers/scripts"
import Constants from "../../../utils/constants/constants";


let loginCacheData = null;

function Outlets() {
  //const history = useHistory();
  const [storeInfo, setStoreInfo] = useState([]);
  //const [loginCacheData, setLoginCacheData] = useState({});
  const [activeOutlet, setActiveOutlet] = useState(null);
  const [loading, setLoading] = useState(true);

  let mounted = true;

  useEffect(() => {
    let readFromLocalStorage = getDataFromLocalStorage(
      Constants.USER_DETAILS_KEY
    );
    readFromLocalStorage = readFromLocalStorage.data
      ? readFromLocalStorage.data
      : null;

    loginCacheData = readFromLocalStorage;
    fetchAllOutletsData(readFromLocalStorage); //imp

    return () => {
      mounted = false;
    };
  }, []); 


  const fetchAllOutletsData = async (localStorageData) => {
    let pageLimit = Helpers.productsSearchPageLimit;
    let pageNumber = Helpers.productsSearchPageNumber;

    document.getElementById("app-loader-container").style.display = "block";
    const outletsViewResponse =
      await SetupApiUtil.viewOutlets(pageLimit, pageNumber);
    console.log("outletsViewResponse:", outletsViewResponse);

    if (outletsViewResponse.hasError) {
      console.log(
        "Cant fetch Outlets Data -> ",
        outletsViewResponse.errorMessage
      );
      setLoading(false);
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, outletsViewResponse.errorMessage);
    } else {
      if (mounted) {   //imp if unmounted
        if (localStorageData) {
          //setLoginCacheData(localStorageData);  //imp prev
          let storesList = outletsViewResponse && outletsViewResponse.stores.data;
          if (storesList.length === 1) {
            if (localStorageData.auth) {
              window.open("/pos/dashboard", "_self");
            }
            else {
              onSelectOutlet(storesList[0].store_random);
              return;  //imp
            }
          }
          else {
            if (
              checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY)
                .authentication
            ) {
              setStoreInfo(storesList);
              setActiveOutlet(localStorageData.auth.Current_store);
              setLoading(false);
              document.getElementById("app-loader-container").style.display = "none";
            } else {
              setStoreInfo(storesList);
              setActiveOutlet(null);
              setLoading(false);
              document.getElementById("app-loader-container").style.display = "none";
            }
          }

        }
      }
    }
  };


  const onSelectOutlet = async (selectedStoreRandom) => {
    //const selectedStoreId = e.target.dataset.storeid;
    const selectedStoreUniqRandom = selectedStoreRandom;
    /*var foundStoreObj = storeInfo.find((obj) => {
      return obj.id === selectedStoreId;
    });*/
    setLoading(true);

    if (selectedStoreUniqRandom) {
      document.getElementById("app-loader-container").style.display = "block";
      const userSelectOutletResponse = await OutletsApiUtil.selectOutlet(
        selectedStoreUniqRandom
      );
      console.log("userSelectOutletResponse:", userSelectOutletResponse);
      if (userSelectOutletResponse.hasError) {  //imp to cate haserror
        console.log(
          "Cant Select Outlet -> ",
          userSelectOutletResponse.errorMessage
        );
        setLoading(false);
        document.getElementById("app-loader-container").style.display = "none";
        showAlertUi(true, userSelectOutletResponse.errorMessage);
      } else {
        if (mounted) {  //imp if unmounted
          userSelectOutletResponse.user_info = loginCacheData.user_info;  //imp
          clearLocalUserData();
          saveDataIntoLocalStorage("user-copilot", userSelectOutletResponse);
          //setLoading(false);  //no need here
          document.getElementById("app-loader-container").style.display = "none";
          window.open("/pos/dashboard", "_self"); //imp to open nagivaton menu at first
        }
      }
    } else {
      console.log("store not found");
      setLoading(false);
    }
  };


  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };





  return (
    <div className="page select_store">
      <div className="page__top"> 
        <SwitchOutlet heading="Switch Brands" linkUrl="/brands" />
      </div>

      <PageTitle title="Select Outlets" />
      <section className="outlets">
        <ul className="outlet__select outlets-list-container">
          {storeInfo.map((item) => {
            return (
              <li
                key={item.id}
                className={`outlet__link${activeOutlet === item.id ? " outlet__active" : ""
                  }`}
                data-storeid={item.id}
                onClick={() => onSelectOutlet(item.store_random)}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
        {(storeInfo.length === 0 && !loading) &&
          <h3 className="heading heading--primary">You Don't Have Any Outlet To Select, Contact To Administration</h3>}
      </section>
    </div>
  );
}

export default Outlets;
