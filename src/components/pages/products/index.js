import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// components
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
} from "../../../utils/local-storage/local-store-utils";
import Constants from "../../../utils/constants/constants";
import ButtonSearch from "../../atoms/button_search";
import CustomSearch from "../../atoms/search";
import PageTitle from "../../organism/header";
import ProductsTable from "../../organism/table/products/productsTable";
import CustomButtonWithIcon from "../../atoms/button_with_icon";
//import ActionsCustomFlyout from "../../atoms/actionsMenuFlyout";
import * as ProductsApiUtil from "../../../utils/api/products-api-utils";
import * as Helpers from "../../../utils/helpers/scripts";
//import { useHistory } from "react-router-dom";
import SwitchOutlet from "../../atoms/switch_outlet";
import moment from "moment";
import { Modal } from "@teamfabric/copilot-ui";
import { Timepicker } from "@teamfabric/copilot-ui/dist/atoms";
import CustomCalendar from "../../atoms/CustomCalendar";

function Products() {
  //const history = useHistory();
  const currentDay = moment(new Date()).format("YYYY-MM-DD");
  const currentTime = moment().toDate().getTime()
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchedData, setSearchedData] = useState(null);
  const [currentPageSearched, setCurrentPageSearched] = useState(1);
  const [inputSearchValue, setInputSearchValue] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [calenderDate, setCalenderDate] = useState(() => currentDay);
  const [time, setTime] = useState('');

  let mounted = true;

  const handleSearchInputChange = async (value) => {
    setInputSearchValue(value);
    if (value === "") {
      setSearchedData(null);
      setLoading(true);
      fetchProductsData(); // imp
      return;
    }
  };

  const onSearch = async (value) => {
    let searchValue = value;
    if (searchValue === "") {
      setSearchedData(null);
      setLoading(true);
      fetchProductsData(); // imp
      return;
    }

    setSearchedData(searchValue);
    setLoading(true);
    fetchSearchProducts(paginationLimit, 1, searchValue);
  };

  const fetchSearchProducts = async (
    pageLimit = 10,
    pageNumber = 1,
    searchValue
  ) => {
    document.getElementById("app-loader-container").style.display = "block";
    const productsSearchResponse = await ProductsApiUtil.searchProductsMain(
      pageLimit,
      pageNumber,
      searchValue
    );
    console.log("productsSearchResponse:", productsSearchResponse);
    if (productsSearchResponse.hasError) {
      console.log(
        "Cant Search Products -> ",
        productsSearchResponse.errorMessage
      );
      setLoading(false);
      setData([]);
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, productsSearchResponse.errorMessage);
    } else {
      setData(productsSearchResponse.products.data);
      setPaginationData(productsSearchResponse.products.page);
      setLoading(false);
      document.getElementById("app-loader-container").style.display = "none";
    }
  };

  const fetchProductsData = async (pageLimit = 20, pageNumber = 1) => {
    document.getElementById("app-loader-container").style.display = "block";
    const productsViewResponse = await ProductsApiUtil.viewProducts(
      pageLimit,
      pageNumber
    );

    if (productsViewResponse.hasError) {
      setLoading(false);
      setData([]);
      document.getElementById("app-loader-container").style.display = "none";
    } else {
      if (mounted) {
        //imp if unmounted
        const productsData =
          productsViewResponse.products.data || productsViewResponse.products;
        setData(productsData);
        setPaginationData(productsViewResponse.products.page);
        setLoading(false);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  useEffect(() => {
    fetchProductsData();

    /*--------------set user local data-------------------------------*/
    let readFromLocalStorage = getDataFromLocalStorage(
      Constants.USER_DETAILS_KEY
    );
    readFromLocalStorage = readFromLocalStorage.data
    
      
    if (readFromLocalStorage) {
      if (
        checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
      ) {
        //getUserStoreData(readFromLocalStorage.auth.current_store);
      }
    }
    /*--------------set user local data-------------------------------*/

    return () => {
      mounted = false;
    };
  }, []);

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchProductsData(paginationLimit, currentPg);
  }

  function handleSearchedDataPageChange(currentPg) {
    setCurrentPageSearched(currentPg);
    setLoading(true);
    fetchSearchProducts(paginationLimit, currentPg, searchedData);
  }
  const resetData = () => {
    setButtonDisabled(false);
    setTime("");
    setCalenderDate(currentDay);
    setShowModal(false);
  };

  const syncProductsData = async () => {
    if (buttonDisabled === false) {
      setButtonDisabled(true);
    }
    let lastUpdated = calenderDate.toString() + time.toString();
    document.getElementById("app-loader-container").style.display = "block";
    const syncProductsResponse = await ProductsApiUtil.syncProducts(
      lastUpdated
    );
    console.log(syncProductsResponse);

    if (syncProductsResponse.hasError) {
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, syncProductsResponse.errorMessage);
      resetData();
    } else {
      if (mounted) {
        //imp if unmounted
        console.log("n");
        document.getElementById("app-loader-container").style.display = "none";
        Helpers.showWarningAppAlertUiContent(
          true,
          syncProductsResponse.message
        );
        resetData();
      }
    }
  };

  const syncPricesData = async () => {
    if (buttonDisabled === false) {
      setButtonDisabled(true);
    }

    let postPriceSyncData = {
      itemIds: [404, 403],
      priceListId: 100000,
    };
    document.getElementById("app-loader-container").style.display = "block";
    const syncPriceResponse = await ProductsApiUtil.syncPrices({});

    if (syncPriceResponse.hasError) {
      document.getElementById("app-loader-container").style.display = "none";
      setButtonDisabled(false);
      showAlertUi(true, syncPriceResponse.errorMessage);
    } else {
      if (mounted) {
        //imp if unmounted
        document.getElementById("app-loader-container").style.display = "none";
        Helpers.showWarningAppAlertUiContent(
          true,
          "request initiate successfully"
        );
        setButtonDisabled(false);
      }
    }
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  const handleTableMenuItemClick = (customerId, customer, itemLabel) => {
    if (itemLabel === "Edit") {
    }
  };

  let actionMenuOptions = [
    {
      label: (
        <Link className="flyout-action-menu-link" to="/products/bulk_upload">
          Upload Bulk{" "}
        </Link>
      ),
    },
    {
      label: (
        <Link className="flyout-action-menu-link" to="/products/lookup">
          LookUp{" "}
        </Link>
      ),
    },
    {
      label: (
        <Link className="flyout-action-menu-link" to="/products/discount">
          Discount{" "}
        </Link>
      ),
    },
  ];

  const closeModal = () => {
    setShowModal(false);
    resetData()
  };

  const handleDateSelect = (value) => {
    setCalenderDate(value);
  };
  const pickTime = (value) => {
    const t = moment(value).toISOString();
    const modifiedTieme = t.split("T");
    const finalTime = "T" + modifiedTieme[1];
    setTime(finalTime);
  };
  const renderModalData = () => {
    return (
      <div className="page__date_picker">
        <div className="picker">
          <CustomCalendar
            previousDate={calenderDate}
            text={"select Date"}
            onCalenderDateSelect={handleDateSelect}
          />
          <Timepicker
            // date={currentTime}
            date={null}
            label="Pick time"
            onChange={pickTime}
            width="188px"
          />
        </div>
      </div>
    );
  };

  const openModal = () => setShowModal(true);
  return (
    <section className="page products">
      <div className="page__top">
        <SwitchOutlet />
      </div>

      <PageTitle title="Products" />

      <div className="page__buttons">
        {/*<ActionsCustomFlyout
          propId={"products-actions-menu"}
          menuItems={actionMenuOptions}
          menuItemClick={handleTableMenuItemClick}
        />*/}

        <CustomButtonWithIcon
          text="Sync Products"
          iconName="Add"
          onClick={openModal}
          isLoading={loading}
          disabled={buttonDisabled}
        />

        <CustomButtonWithIcon
          text="Sync Prices"
          iconName="Add"
          onClick={syncPricesData}
          isLoading={loading}
          disabled={buttonDisabled}
        />
      </div>

      <div className="page__search">
        <CustomSearch
          onChange={handleSearchInputChange}
          handleEnterSearch={() => onSearch(inputSearchValue)}
          onClearSearch={onSearch}
        />
        <ButtonSearch
          text="Search"
          clickHandler={() => onSearch(inputSearchValue)}
        />
      </div>

      <div className="page__table">
        <ProductsTable
          tableData={data}
          paginationData={paginationData}
          tableDataLoading={loading}
          onClickPageChanger={
            searchedData ? handleSearchedDataPageChange : handlePageChange
          }
          tableType="products-listing"
          currentPageIndex={searchedData ? currentPageSearched : currentPage}
        />
      </div>

      {showModal && (
        <Modal
          headerButtons={[]}
          onBackdropClick={closeModal}
          onClose={closeModal}
          padding="20px 40px 20px 40px"
          render={renderModalData}
          // className="actions-history-view-data"
          showCloseButton
          // width="700px"
          // height="500px"
          footerButtons={[
            {
              isPrimary: false,
              onClick: closeModal,
              text: "Cancel",
            },
            {
              isPrimary: true,
              onClick: syncProductsData,
              text: "Sync products",
              disabled: !time,
            },
          ]}
        />
      )}
    </section>
  );
}

export default Products;
