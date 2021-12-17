import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";

// components
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";
import Constants from "../../../../utils/constants/constants";
import ButtonSearch from "../../../atoms/button_search";
import CustomSearch from "../../../atoms/search";
import PageTitle from "../../../organism/header";
import ProductsTable from "../../../organism/table/products/productsTable";
import * as ProductsApiUtil from '../../../../utils/api/products-api-utils';
import * as Helpers from "../../../../utils/helpers/scripts";
//import { useHistory } from "react-router-dom";
import SwitchOutlet from "../../../atoms/switch_outlet";




function Bundles() {
  //const history = useHistory();
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchedData, setSearchedData] = useState(null);
  const [currentPageSearched, setCurrentPageSearched] = useState(1);
  const [inputSearchValue, setInputSearchValue] = useState("");


  let mounted = true;


  const handleSearchInputChange = async (value) => {
    setInputSearchValue(value);
  }


  const onSearch = async (value) => {
    let searchValue = value;
    if (searchValue === "") {
      setSearchedData(null);
      setLoading(true);
      fetchBundleProductsData();   // imp
      return;
    }

    setSearchedData(searchValue);
    setLoading(true);
    fetchSearchBundlesProducts(paginationLimit, 1, searchValue);
  }


  const fetchSearchBundlesProducts = async (pageLimit = 10, pageNumber = 1, searchValue) => {
    document.getElementById('app-loader-container').style.display = "block";
    const productsBundlesSearchResponse = await ProductsApiUtil.searchBundlesProducts(
      pageLimit,
      pageNumber,
      searchValue
    );
    console.log('productsBundlesSearchResponse:', productsBundlesSearchResponse);
    if (productsBundlesSearchResponse.hasError) {
      console.log('Cant Search Products -> ', productsBundlesSearchResponse.errorMessage);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
      showAlertUi(true, productsBundlesSearchResponse.errorMessage);
    }
    else {
      setData(productsBundlesSearchResponse.products.data);
      setPaginationData(productsBundlesSearchResponse.products.page);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }

  }



  const fetchBundleProductsData = async (pageLimit = 10, pageNumber = 1) => {

    document.getElementById('app-loader-container').style.display = "block";
    const productsBundlesViewResponse = await ProductsApiUtil.viewBundlesProducts(pageLimit, pageNumber);
    console.log('productsBundlesViewResponse:', productsBundlesViewResponse);

    if (productsBundlesViewResponse.hasError) {
      console.log('Cant fetch products -> ', productsBundlesViewResponse.errorMessage);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      if (mounted) {     //imp if unmounted
        const productsData = productsBundlesViewResponse.products.data || productsBundlesViewResponse.products;
        setData(productsData);
        setPaginationData(productsBundlesViewResponse.products.page);
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }
  }



  useEffect(() => {
    fetchBundleProductsData();
    return () => {
      mounted = false;
    }

  }, []);



  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchBundleProductsData(paginationLimit, currentPg);
  }


  function handleSearchedDataPageChange(currentPg) {
    setCurrentPageSearched(currentPg);
    setLoading(true);
    fetchSearchBundlesProducts(paginationLimit, currentPg, searchedData);
  }


  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  }





  return (
    <section className="page products">
      <div className="page__top">
        <SwitchOutlet />
      </div>

      <PageTitle title="Bundles" />

      <div className="page__buttons">
      </div>

      <div className="page__search">
        <CustomSearch
         onChange={handleSearchInputChange}
          onClearSearch={onSearch}
          handleEnterSearch={() => onSearch(inputSearchValue)}
        />
        <ButtonSearch text="Search" clickHandler={() => onSearch(inputSearchValue)} />
      </div>

      <div className="page__table">
      <ProductsTable
          tableData={data}
          paginationData={paginationData}
          tableDataLoading={loading}
          onClickPageChanger={searchedData ? handleSearchedDataPageChange : handlePageChange}
          tableType="products-bundles-listing"
          currentPageIndex={searchedData ? currentPageSearched : currentPage}
        />
      </div>
    </section>
  );
}

export default Bundles;
