import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// components
import ButtonSearch from "../../atoms/button_search";
import CustomButtonWithIcon from "../../atoms/button_with_icon";
import CustomSearch from "../../atoms/search";
import SwitchOutlet from "../../atoms/switch_outlet";
import PageTitle from "../../organism/header";
import TaxesTableView from "../../organism/table/taxes";
import CustomTableAtionMenuItem from "../../organism/table/table_helpers/tableActionMenu";
import * as TaxApiUtil from '../../../utils/api/tax-api-utils';
import * as Helpers from "../../../utils/helpers/scripts";
import { useHistory } from "react-router-dom";
import Permissions from "../../../utils/constants/user-permissions";
import * as PermissionsHelpers from "../../../utils/helpers/check-user-permission";



function Taxes() {

  const [paginationLimit,] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [searchedData, setSearchedData] = useState(null);
  const [currentPageSearched, setCurrentPageSearched] = useState(1);
  const [inputSearchValue, setInputSearchValue] = useState("");
  const history = useHistory();


  let mounted = true;

  //const moduleEditCheck = PermissionsHelpers.checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.UPDATE.TAXES);
  //const moduleDeleteCheck = PermissionsHelpers.checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.DELETE.TAXES);
  //const moduleAddCheck = PermissionsHelpers.checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.WRITE.TAXES);


  const handleSearchInputChange = async (value) => {
    setInputSearchValue(value);
    let searchValue = value;
    if (searchValue === "") {    // if empty value
      setSearchedData(null);
      setLoading(true);
      fetchTaxesData(paginationLimit, currentPage);
      return;
    }
  }

  const onSearch = async (inputValue) => {
    let searchValue = inputValue;
    if (searchValue === "") {    // if empty value
      setSearchedData(null);
      setLoading(true);
      fetchTaxesData(paginationLimit, currentPage);
      return;
    }
    setSearchedData(searchValue);
    setLoading(true);
    setCurrentPageSearched(1);    //imp
    fetchSearchTaxes(paginationLimit, 1, searchValue);
  }


  const fetchSearchTaxes = async (pageLimit = 10, pageNumber = 1, searchValue) => {
    const taxesSearchResponse = await TaxApiUtil.searchTaxes(
      pageLimit,
      pageNumber,
      searchValue
    );
    if (taxesSearchResponse.hasError) {
      setLoading(false);
      setData([]);  //imp
      showAlertUi(true, taxesSearchResponse.errorMessage);  //imp
    }
    else {
      if (mounted) {     //imp if unmounted
        const taxesSearchData = taxesSearchResponse.data.data;
        /*----------------------setting menu option-----------------------------*/
        /*if (moduleEditCheck || moduleDeleteCheck){
          for (let i = 0; i < taxesSearchData.length; i++) {
            let item = taxesSearchData[i];
            item.menu = <CustomTableAtionMenuItem tableItem={item}
              tableItemId={item.id} tableItemMenuType="taxes"
              handleTableMenuItemClick={handleTableMenuItemClick}
              moduleEditCheck={moduleEditCheck}
              moduleDeleteCheck={moduleDeleteCheck} />
          }
        }*/
        /*--------------------------setting menu option-------------------------*/
        setData(taxesSearchData);
        setPaginationData(taxesSearchResponse?.data?.page || {});
        setLoading(false);
      }
    }

  }



  const fetchTaxesData = async (pageLimit = 10, pageNumber = 1) => {
    document.getElementById('app-loader-container').style.display = "block";
    const taxesViewResponse = await TaxApiUtil.viewTaxes(pageLimit, pageNumber);
    if (taxesViewResponse.hasError) {
      setLoading(false);
      setData([]);  //imp
      document.getElementById('app-loader-container').style.display = "none";
      showAlertUi(true, taxesViewResponse.errorMessage);  //imp
    } else {
      if (mounted) {     //imp if unmounted
        const taxesData = taxesViewResponse.data.data;
        /*----------------------setting menu option-----------------------------*/
        /*if (moduleEditCheck || moduleDeleteCheck){
          for (let i = 0; i < taxesData.length; i++) {
            let item = taxesData[i];
            item.menu = <CustomTableAtionMenuItem tableItem={item}
              tableItemId={item.id} tableItemMenuType="taxes"
              handleTableMenuItemClick={handleTableMenuItemClick}
              moduleEditCheck={moduleEditCheck}
              moduleDeleteCheck={moduleDeleteCheck} />
          }
        }*/
        /*--------------------------setting menu option-------------------------*/
        setData(taxesData);
        setPaginationData(taxesViewResponse?.data?.page || {});
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }

  };

  useEffect(() => {
    fetchTaxesData();
    return () => {
      mounted = false;
    }
  }, []);


  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchTaxesData(paginationLimit, currentPg);
  }

  function handleSearchedDataPageChange(currentPg) {
    setCurrentPageSearched(currentPg);
    setLoading(true);
    fetchSearchTaxes(paginationLimit, currentPg, searchedData);
  }


  const handleTableMenuItemClick = (taxId, tax, itemLabel) => {
    if (itemLabel === "Edit") {
      return (
        history.push({
          pathname: `/taxes/${taxId}/edit`,
        })
      )
    }
    else if (itemLabel === "Delete") {
      history.push({
        pathname: `/taxes/${taxId}/delete`,
      });
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

      <PageTitle title="Taxes" />

      <div className="page__buttons">
        {/*<Link to='/taxes/add' className={!moduleAddCheck && "button-disabled"}>
          <CustomButtonWithIcon
            text="Add Tax"
            iconName="Add"
            isLoading={loading}
            disabled={!moduleAddCheck}
          />
        </Link>*/}
      </div>

      <div className="page__search">
        <CustomSearch
          onChange={handleSearchInputChange}
          handleEnterSearch={() => onSearch(inputSearchValue)}
          onClearSearch={onSearch}
        />
        <ButtonSearch text="Search" clickHandler={() => onSearch(inputSearchValue)} />
      </div>

      {/* Table */}
      <div className='page__table'>
        <TaxesTableView 
          pageLimit={paginationLimit}
          tableData={data}
          tableDataLoading={loading}
          onClickPageChanger={searchedData ? handleSearchedDataPageChange : handlePageChange}
          currentPageIndex={searchedData ? currentPageSearched : currentPage}
          paginationData={paginationData}
          tableType="taxes"
        />
      </div>
      {/* Table */}

    </section>
  );
}

export default Taxes;
