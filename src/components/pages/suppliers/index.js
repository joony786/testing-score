import React, { useState, useEffect } from "react";
import "./style.scss";
import { Link } from "react-router-dom";

// components
import ButtonSearch from "../../atoms/button_search";
import CustomButtonWithIcon from "../../atoms/button_with_icon";
import CustomSearch from "../../atoms/search";
import SwitchOutlet from "../../atoms/switch_outlet";
import PageTitle from "../../organism/header";
import CustomTableView from "../../organism/table/tableView";
import CustomTableAtionMenuItem from "../../organism/table/table_helpers/tableActionMenu";
import * as SuppliersApiUtil from "../../../utils/api/suppliers-api-utils";
import * as Helpers from "../../../utils/helpers/scripts";
import { useHistory } from "react-router-dom";
import * as PermissionsHelpers from "../../../utils/helpers/check-user-permission";
import Permissions from "../../../utils/constants/user-permissions";

function Suppliers() {
  const [paginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [searchedData, setSearchedData] = useState(null);
  const [currentPageSearched, setCurrentPageSearched] = useState(1);
  const [inputSearchValue, setInputSearchValue] = useState("");

  const moduleEditCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.UPDATE.SUPPLIERS
  );
  const moduleDeleteCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.DELETE.SUPPLIERS
  );
  const moduleAddCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.WRITE.SUPPLIERS
  );

  const history = useHistory();
  let mounted = true;

  const handleSearchInputChange = async (value) => {
    setInputSearchValue(value);
    if (value === "") {
      // if empty value
      setSearchedData(null);
      setLoading(true);
      fetchSuppliersData(paginationLimit, currentPage);
    }
  };

  const onSearch = async (inputValue) => {
    let searchValue = inputValue;
    if (searchValue === "") {
      // if empty value
      setSearchedData(null);
      setLoading(true);
      fetchSuppliersData(paginationLimit, currentPage);
      return;
    }

    setSearchedData(searchValue);
    setLoading(true);
    setCurrentPageSearched(1); //imp
    fetchSearchSuppliers(paginationLimit, 1, searchValue);
  };

  const fetchSearchSuppliers = async (
    pageLimit = 10,
    pageNumber = 1,
    searchValue
  ) => {
    const suppliersSearchResponse = await SuppliersApiUtil.searchSuppliers(
      pageLimit,
      pageNumber,
      searchValue
    );
    console.log("suppliersSearchResponse:", suppliersSearchResponse);
    if (suppliersSearchResponse.hasError) {
      console.log(
        "Cant Search Suppliers -> ",
        suppliersSearchResponse.errorMessage
      );
      setLoading(false);
      setData([]);
      showAlertUi(true, suppliersSearchResponse.errorMessage);
    } else {
      if (mounted) {
        //imp if unmounted
        const suppliersSearchData = suppliersSearchResponse.suppliers.data;
        /*----------------------setting menu option-----------------------------*/
        if (moduleEditCheck || moduleDeleteCheck) {
          for (let i = 0; i < suppliersSearchData.length; i++) {
            let item = suppliersSearchData[i];
            item.menu = (
              <CustomTableAtionMenuItem
                tableItem={item}
                tableItemId={item.id}
                tableItemMenuType="suppliers"
                handleTableMenuItemClick={handleTableMenuItemClick}
                moduleEditCheck={moduleEditCheck}
                moduleDeleteCheck={moduleDeleteCheck}
              />
            );
          }
        }
        /*--------------------------setting menu option-------------------------*/
        setData(suppliersSearchData);
        setPaginationData(suppliersSearchResponse.suppliers.page);
        setLoading(false);
      }
    }
  };

  const fetchSuppliersData = async (pageLimit = 10, pageNumber = 1) => {
    document.getElementById("app-loader-container").style.display = "block";
    const suppliersViewResponse = await SuppliersApiUtil.viewSuppliers(
      pageLimit,
      pageNumber
    );
    console.log("SuppliersViewResponse:", suppliersViewResponse);
    if (suppliersViewResponse.hasError) {
      console.log(
        "Cant fetch suppliers -> ",
        suppliersViewResponse.errorMessage
      );
      setLoading(false);
      setData([]);
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, suppliersViewResponse.errorMessage); //imp
    } else {
      if (mounted) {
        //imp if unmounted
        const suppliersData =
          suppliersViewResponse.suppliers.data ||
          suppliersViewResponse.suppliers;
        /*----------------------setting menu option-----------------------------*/
        if (moduleEditCheck || moduleDeleteCheck) {
          for (let i = 0; i < suppliersData.length; i++) {
            let item = suppliersData[i];
            item.menu = (
              <CustomTableAtionMenuItem
                tableItem={item}
                tableItemId={item.id}
                tableItemMenuType="suppliers"
                handleTableMenuItemClick={handleTableMenuItemClick}
                moduleEditCheck={moduleEditCheck}
                moduleDeleteCheck={moduleDeleteCheck}
              />
            );
          }
        }
        /*--------------------------setting menu option-------------------------*/
        setData(suppliersData);
        setPaginationData(suppliersViewResponse.suppliers.page || {});
        setLoading(false);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  useEffect(() => {
    fetchSuppliersData();
    return () => {
      mounted = false;
    };
  }, []);

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchSuppliersData(paginationLimit, currentPg);
  }

  function handleSearchedDataPageChange(currentPg) {
    setCurrentPageSearched(currentPg);
    setLoading(true);
    fetchSearchSuppliers(paginationLimit, currentPg, searchedData);
  }

  const handleTableMenuItemClick = (supplierId, supplier, itemLabel) => {
    if (itemLabel === "Edit") {
      return history.push({
        pathname: `/suppliers/${supplierId}/edit`,
      });
    } else if (itemLabel === "Delete") {
      history.push({
        pathname: `/suppliers/${supplierId}/delete`,
      });
    }
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  return (
    <section className="page suppliers">
      <div className="page__top">
        <SwitchOutlet />
      </div>

      <PageTitle title="Suppliers" />

      <div className="page__buttons">
        <Link
          to="/suppliers/add"
          className={!moduleAddCheck && "button-disabled"}
        >
          <CustomButtonWithIcon
            text="Add Supplier"
            iconName="Add"
            isLoading={loading}
            disabled={!moduleAddCheck}
          />
        </Link>
      </div>

      <div className="page__search">
        <CustomSearch
          onChange={handleSearchInputChange}
          handleEnterSearch={() => onSearch(inputSearchValue)}
          onClearSearch={onSearch}
          placeholder="Search by Supplier Number"
        />
        <ButtonSearch
          text="Search"
          clickHandler={() => onSearch(inputSearchValue)}
        />
      </div>

      {/* Table */}
      <div className="page__table">
        <CustomTableView
          tableData={data}
          paginationData={paginationData}
          tableDataLoading={loading}
          onClickPageChanger={
            searchedData ? handleSearchedDataPageChange : handlePageChange
          }
          currentPageIndex={searchedData ? currentPageSearched : currentPage}
          tableType="suppliers"
        />
      </div>
      {/* Table */}
    </section>
  );
}

export default Suppliers;
