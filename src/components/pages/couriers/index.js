import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// components
import ButtonSearch from "../../atoms/button_search";
import CustomButtonWithIcon from "../../atoms/button_with_icon";
import CustomSearch from "../../atoms/search";
import SwitchOutlet from "../../atoms/switch_outlet";
import PageTitle from "../../organism/header";
import CustomTableView from "../../organism/table/tableView";
import CustomTableAtionMenuItem from "../../organism/table/table_helpers/tableActionMenu";
import * as CouriersApiUtil from '../../../utils/api/couriers-api-utils';
import * as Helpers from "../../../utils/helpers/scripts";
import { useHistory } from "react-router-dom";



function Couriers() {
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


  const handleSearchInputChange = async (value) => {
    setInputSearchValue(value);
  }

  const onSearch = async (inputValue) => {
    //let searchValue = inputSearchValue;     //imp prev ver
    let searchValue = inputValue;
    if (searchValue === "") {    // if empty value
      setSearchedData(null);
      setLoading(true);
      fetchCouriersData(paginationLimit, currentPage);
      return;
    }

    setSearchedData(searchValue);
    setLoading(true);
    setCurrentPageSearched(1);    //imp
    fetchSearchCouriers(paginationLimit, 1, searchValue);
  }



  const fetchSearchCouriers = async (pageLimit = 10, pageNumber = 1, searchValue) => {
    const couriersSearchResponse = await CouriersApiUtil.searchCouriers(
      pageLimit,
      pageNumber,
      searchValue
    );
    console.log('couriersSearchResponse:', couriersSearchResponse);
    if (couriersSearchResponse.hasError) {
      console.log('Cant Search Couriers -> ', couriersSearchResponse.errorMessage);
      setLoading(false);
      setData([]);  //imp
      showAlertUi(true, couriersSearchResponse.errorMessage);  //imp
    }
    else {
      if (mounted) {     //imp if unmounted
        const couriersSearchData = couriersSearchResponse.courier.data;
        /*----------------------setting menu option-----------------------------*/
        for (let i = 0; i < couriersSearchData.length; i++) {
          let item = couriersSearchData[i];
          item.menu = <CustomTableAtionMenuItem tableItem={item}
          tableItemId={item.courier_id} tableItemMenuType="couriers"
          handleTableMenuItemClick={handleTableMenuItemClick} />
        }
        /*--------------------------setting menu option-------------------------*/
        setData(couriersSearchData);
        setPaginationData(couriersSearchResponse.courier.page);
        setLoading(false);
      }
    }

  }



  const fetchCouriersData = async (pageLimit = 10, pageNumber = 1) => {
    document.getElementById('app-loader-container').style.display = "block";
    const couriersViewResponse = await CouriersApiUtil.viewCouriers(
      pageLimit,
      pageNumber
    );
    console.log("couriersViewResponse:", couriersViewResponse);

    if (couriersViewResponse.hasError) {
      console.log("Cant fetch couriers -> ", couriersViewResponse.errorMessage);
      setLoading(false);
      setData([]);  //imp
      document.getElementById('app-loader-container').style.display = "none";
      //showAlertUi(true, couriersViewResponse.errorMessage);  //imp

    } else {
      if (mounted) {     //imp if unmounted
        const couriersData = couriersViewResponse.courier.data || couriersViewResponse.courier;
        /*----------------------setting menu option-----------------------------*/
        for (let i = 0; i < couriersData.length; i++) {
          let item = couriersData[i];
          item.menu = <CustomTableAtionMenuItem tableItem={item}
          tableItemId={item.courier_id} tableItemMenuType="couriers"
          handleTableMenuItemClick={handleTableMenuItemClick} />
        }
        /*--------------------------setting menu option-------------------------*/
        setData(couriersData);
        setPaginationData(couriersViewResponse.courier.page || {});
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }
  };




  useEffect(() => {
    fetchCouriersData();
    return () => {
      mounted = false;
    }
  }, []);


  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchCouriersData(paginationLimit, currentPg);
  }


  function handleSearchedDataPageChange(currentPg) {
    setCurrentPageSearched(currentPg);
    setLoading(true);
    fetchSearchCouriers(paginationLimit, currentPg, searchedData);
  }



  const handleTableMenuItemClick = (courierId, courier, itemLabel) => {
    if (itemLabel === "Edit") {
      return (
        history.push({
          pathname: `/couriers/${courierId}/edit`,
        })
      )
    }
    else if (itemLabel === "Delete") {
      history.push({
        pathname: `/couriers/${courierId}/delete`,
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

      <PageTitle title="Couriers" />

      <div className="page__buttons">
        <Link to="/couriers/add-courier">
          <CustomButtonWithIcon
            text="Add Courier"
            iconName="Add"
            isLoading={loading}
          />
        </Link>
      </div>

      <div className="page__search">
        <CustomSearch onChange={handleSearchInputChange} onClearSearch={onSearch} />
        <ButtonSearch text="Search" clickHandler={() => onSearch(inputSearchValue)} />
      </div>

      <div className="page__table">
        <CustomTableView
          tableData={data}
          paginationData={paginationData}
          tableDataLoading={loading}
          onClickPageChanger={searchedData ? handleSearchedDataPageChange : handlePageChange}
          tableType="couriers"
          currentPageIndex={searchedData ? currentPageSearched : currentPage}
        />
      </div>
    </section>
  );
}

export default Couriers;
