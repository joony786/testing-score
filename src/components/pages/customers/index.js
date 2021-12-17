import React, { useState, useEffect } from "react";
import "./style.scss";
import { Link } from "react-router-dom";

// components
import ButtonSearch from "../../atoms/button_search";
import CustomButtonWithIcon from "../../atoms/button_with_icon";
import CustomSearch from "../../atoms/search";
import PageTitle from "../../organism/header";
import CustomTableView from "../../organism/table/tableView";
import CustomTableAtionMenuItem from "../../organism/table/table_helpers/tableActionMenu";
import * as CustomersApiUtil from '../../../utils/api/customer-api-utils';
import * as Helpers from "../../../utils/helpers/scripts";
import { useHistory } from "react-router-dom";
import SwitchOutlet from "../../atoms/switch_outlet";
import * as PermissionsHelpers from "../../../utils/helpers/check-user-permission";
import Permissions from "../../../utils/constants/user-permissions";



function Customers() {

  const [paginationLimit,] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [searchedData, setSearchedData] = useState(null);
  const [currentPageSearched, setCurrentPageSearched] = useState(1);
  const [inputSearchValue, setInputSearchValue] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const moduleEditCheck = PermissionsHelpers.checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.UPDATE.CUSTOMERS);
  const moduleAddCheck = PermissionsHelpers.checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.WRITE.CUSTOMERS);

  const history = useHistory();
  let mounted = true;


  const handleSearchInputChange = async (value) => {
    setInputSearchValue(value);
    if (value === "") {    // if empty value
      setSearchedData(null);
      setLoading(true);
      fetchCustomersData(paginationLimit, currentPage);
    }
  }


  const onSearch = async (inputValue) => {
    let searchValue = inputValue;
    if (searchValue === "") {    // if empty value
      setSearchedData(null);
      setLoading(true);
      fetchCustomersData(paginationLimit, currentPage);
      return;
    }

    setSearchedData(searchValue);
    setLoading(true);
    setCurrentPageSearched(1);    //imp
    fetchSearchCustomers(paginationLimit, 1, searchValue);
  }


  const fetchSearchCustomers = async (pageLimit = 10, pageNumber = 1, searchValue) => {
    const customersSearchResponse = await CustomersApiUtil.searchCustomers(
      pageLimit,
      pageNumber,
      searchValue
    );
    if (customersSearchResponse.hasError) {
      setLoading(false);
      setData([]);
      showAlertUi(true, customersSearchResponse.errorMessage);
    }
    else {
      if (mounted) {     //imp if unmounted
        const customersSearchData = customersSearchResponse.Customer.data;
        /*----------------------setting menu option-----------------------------*/
        if (moduleEditCheck) {
          // for (let i = 0; i < customersSearchData.length; i++) {
          customersSearchData.forEach((elem,index)=>{
            let item = customersSearchData[index];
            item.balance = parseFloat(item.balance).toFixed(2);
            item.menu = <CustomTableAtionMenuItem tableItem={item}
              tableItemId={item.id} tableItemMenuType="customers"
              handleTableMenuItemClick={handleTableMenuItemClick}
              moduleEditCheck={moduleEditCheck}
            />
          })
        // }
          }
        
        /*--------------------------setting menu option-------------------------*/
        setData(customersSearchData);
        setPaginationData(customersSearchResponse.Customer.page);
        setLoading(false);
      }
    }

  }



  const fetchCustomersData = async (pageLimit = 10, pageNumber = 1) => {
    document.getElementById('app-loader-container').style.display = "block";
    const customersViewResponse = await CustomersApiUtil.viewCustomers(
      pageLimit,
      pageNumber
    );
    if (customersViewResponse.hasError) {
      setLoading(false);
      setData([]);
      document.getElementById('app-loader-container').style.display = "none";
      showAlertUi(true, customersViewResponse.errorMessage);

    } else {
      if (mounted) {     //imp if unmounted
        const customersData = customersViewResponse.Customer.data || customersViewResponse.Customer;
        /*----------------------setting menu option-----------------------------*/
        if (moduleEditCheck) {
          console.log('inside first run');
          // for (let i = 0; i < customersData.length; i++) {
            customersData.forEach((elem,index)=>{
              let item = customersData[index];
              item.balance = parseFloat(item.balance).toFixed(2);
              item.menu = <CustomTableAtionMenuItem tableItem={item}
                tableItemId={item.id} tableItemMenuType="customers"
                handleTableMenuItemClick={handleTableMenuItemClick}
                moduleEditCheck={moduleEditCheck}
              />
            })  
          }
        // }
        /*--------------------------setting menu option-------------------------*/
        setData(customersViewResponse.Customer.data || customersViewResponse.Customer);
        setPaginationData(customersViewResponse.Customer.page || {});
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }
  }


  useEffect(() => {
    fetchCustomersData();
    return () => {
      mounted = false;
    }
  }, []);


  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchCustomersData(paginationLimit, currentPg);
  }


  function handleSearchedDataPageChange(currentPg) {
    setCurrentPageSearched(currentPg);
    setLoading(true);
    fetchSearchCustomers(paginationLimit, currentPg, searchedData);
  }


  const exportCustomersData = async () => {

    if (data.length > 0) {
      if (buttonDisabled === false) {
        setButtonDisabled(true);
      }
      const customersExportResponse = await CustomersApiUtil.exportCustomers();
      if (customersExportResponse.hasError) {
        setButtonDisabled(false);
        showAlertUi(true, customersExportResponse.errorMessage);
      } else {
        
        /*---------------csv download--------------------------------*/
        if (mounted) {     //imp if unmounted
          let a = document.createElement('a');
          a.href = (customersExportResponse && customersExportResponse.link) && customersExportResponse.link;
          a.download = "customers_" + new Date().toUTCString() + ".csv";
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove();  //afterwards we remove the element again
          /*---------------csv download--------------------------------*/
          if (mounted) {               //imp if not mounted then change state
            setButtonDisabled(false);
          }
        }
      }
    }
    else {
      showAlertUi(true, "No Customer Data Found");
    }
  
  }


  const handleTableMenuItemClick = (customerId, customer, itemLabel) => {
    if (itemLabel === "Edit") {
      return (
        history.push({
          pathname: `/customers/${customerId}/view`,
        })
      )
    }
  };


  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  }




  return (

    <section className="page">

      <div className="page__top">
        <SwitchOutlet />
      </div>

      <PageTitle title="Customers" />

      <div className="page__buttons">
        <Link to="/customers/add" className={!moduleAddCheck && "button-disabled"}>
          <CustomButtonWithIcon
            text="Add Customer"
            iconName="Add"
            isLoading={loading}
            disabled={!moduleAddCheck}
          />
        </Link>
        <CustomButtonWithIcon
          text="Export CSV"
          iconName="Add"
          onClick={exportCustomersData}
          isLoading={loading}
          disabled={buttonDisabled}
        />
      </div>


      <div className="page__search">
        <CustomSearch
          onChange={handleSearchInputChange}
          onClearSearch={onSearch}
          placeholder="Search by Customer Name"
          handleEnterSearch={() => onSearch(inputSearchValue)}
        />
        <ButtonSearch text="Search" clickHandler={() => onSearch(inputSearchValue)} />
      </div>

      <div className="page__table">
        <CustomTableView
          tableData={data}
          paginationData={paginationData}
          tableDataLoading={loading}
          onClickPageChanger={searchedData ? handleSearchedDataPageChange : handlePageChange}
          tableType="customers"
          currentPageIndex={searchedData ? currentPageSearched : currentPage}
        />
      </div>
    </section>
  );
}

export default Customers;
