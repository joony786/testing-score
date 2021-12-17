import React, { useState, useEffect } from "react";
import { AutoComplete, Loading } from "@teamfabric/copilot-ui";

// components
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";
import ProductsLookupTable from "../../../organism/table/products/lookup";
import Constants from "../../../../utils/constants/constants";
import ButtonBack from "../../../atoms/button_back";
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import * as Helpers from "../../../../utils/helpers/scripts";
import * as ProductsApiUtil from '../../../../utils/api/products-api-utils';
import SwitchOutlet from "../../../atoms/switch_outlet";



function SearchProduct() {

  const [selectedSearchValue, setSelectedSearchValue] = useState("")
  const [selectedProductSku, setSelectedProductSku] = useState(null);
  const [productsSearchResult, setProductsSearchResult] = useState([]);
  const [productVariantsData, setProductVariantsData] = useState([]);
  const [productAttributesData, setProductAttributesData] = useState([]);
  const [productLookupData, setProductLookupData] = useState([]);
  const [productsSearchLoading, setProductsSearchLoading] = useState(false);
  const [productsPopUpShow, setProductsPopUpShow] = useState(false);
  const [variantsTableCheck, setVariantsTableCheck] = useState(false);
  const [lookUpTableCheck, setlookUpTableCheck] = useState(false);
  const [currentStoreId, setCurrentStoreId] = useState("");



  useEffect( () => {

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
        setCurrentStoreId(readFromLocalStorage?.store_id);
      } else {
        setCurrentStoreId("");
      }
    }

  }, []);  /* imp passing props to re-render */


  const handleChange = (e) => {
    //console.log(e.target.value);
    let inputValue = e.target.value;
    setSelectedSearchValue(inputValue);
    if (inputValue.length === 0) {
      setProductsSearchResult([]);
      setSelectedSearchValue("");
    }
    if (inputValue.length > 1) {
      setProductsPopUpShow(true);
      fetchSearchProducts(inputValue);
    }
  };

  const handleSelect = (item) => {
    //console.log(item);
    //console.log(e.target.value); 
    //let value = e.target.value;
    //let selectedVal = value.split('/');
    let selectedProductSku = item.name; //imp  prev item.sku
    selectedProductSku = selectedProductSku.toString();

    setSelectedSearchValue(item.name);           //passes product name
    setSelectedProductSku(selectedProductSku);   //passes productSku
    setProductsPopUpShow(false);
    setProductsSearchResult([]);

    /*----------------*/
    fetchProductsVariants(selectedProductSku);
    /*----------------*/
  };


  const fetchSearchProducts = async (searchValue) => {
    let pageLimit = Helpers.productsSearchPageLimit;
    let pageNumber = Helpers.productsSearchPageNumber;
    setProductsSearchLoading(true);

    //document.getElementById('app-loader-container').style.display = "block";
    const productsSearchResponse = await ProductsApiUtil.searchProducts(
      pageLimit,
      pageNumber,
      searchValue
    );
    console.log('productsSearchResponse:', productsSearchResponse);
    if (productsSearchResponse.hasError) {
      console.log('Cant Search Products -> ', productsSearchResponse.errorMessage);
      //document.getElementById('app-loader-container').style.display = "none";
      setProductsSearchLoading(false);
      //setProductsSearchResult([]);  //imp but later
      //showAlertUi(true, productsSearchResponse.errorMessage);  //imp but comment now
    }
    else {
      let filteredSearchedData = productsSearchResponse.products.data;
      setProductsSearchResult(filteredSearchedData);
      setProductsSearchLoading(false);
      //setPaginationData(productsSearchResponse.products.page);
      //document.getElementById('app-loader-container').style.display = "none";
    }

  }


  const handleFetchProduct = () => {
    if (!selectedSearchValue) {
      //showAlertUi(true);
      Helpers.showWarningAppAlertUiContent(true, "please select product");
    } else {
      fetchProductsVariants(selectedProductSku || selectedSearchValue);
    }
  };


  const fetchProductsVariants = async (productSku) => {
    let pageLimit = Helpers.genericSearchPageLimit;
    let pageNumber = Helpers.genericSearchPageNumber;

    document.getElementById('app-loader-container').style.display = "block";
    const productsSearchResponse = await ProductsApiUtil.searchProducts(
      pageLimit,
      pageNumber,
      productSku
    );
    console.log('productsSearchResponse:', productsSearchResponse);
    if (productsSearchResponse.hasError) {
      console.log('Cant Search Products -> ', productsSearchResponse.errorMessage);
      //setLoading(false);
      setSelectedSearchValue("");
      setSelectedProductSku(null);
      setProductsSearchResult([]);
      setProductVariantsData([]);
      setProductAttributesData([]);
      document.getElementById('app-loader-container').style.display = "none";
      showAlertUi(true, productsSearchResponse.errorMessage);
    }
    else {
      let productSearchedData = productsSearchResponse.products.data[0];
      let productVariantsData = [...productSearchedData.variants];
      if (productVariantsData.length === 0) {
        setSelectedSearchValue("");
        setSelectedProductSku(null);
        setProductsSearchResult([]);
        document.getElementById('app-loader-container').style.display = "none";
        Helpers.showWarningAppAlertUiContent(true, "No Variants Found");
        return;
      }
      /*----------------------setting variants and attributes-----------------------------*/
      for (let i = 0; i < productVariantsData.length; i++) {
        let item = productVariantsData[i];
        item.parent_product_name = productSearchedData.name;  //parent sku
      }
      setProductVariantsData(productVariantsData);
      setProductAttributesData(productSearchedData.attributes || []);
      setVariantsTableCheck(true);
      setlookUpTableCheck(false);
      setSelectedSearchValue("");
      setSelectedProductSku(null);
      setProductsSearchResult([]);
      /*--------------------------setting variants and attributes-------------------------*/
      //setPaginationData(productsSearchResponse.products.page);
      //setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }

  }

  const handleFetchProductLookupData = (rowItem) => {
    console.log(rowItem);
    fetchProductsLookUpData(rowItem.sku);

  };


  const fetchProductsLookUpData = async (productSku) => {

    document.getElementById('app-loader-container').style.display = "block";
    const productsLookUpResponse = await ProductsApiUtil.productsLookUp(productSku);
    console.log('productsLookUpResponse:', productsLookUpResponse);
    if (productsLookUpResponse.hasError) {
      console.log('Cant fetch product Lookup Data -> ', productsLookUpResponse.errorMessage);
      document.getElementById('app-loader-container').style.display = "none";
      Helpers.showWarningAppAlertUiContent(true, "No product Lookup Data Found");
    }
    else {
      setProductLookupData(productsLookUpResponse.stores);
      setlookUpTableCheck(true);
      document.getElementById('app-loader-container').style.display = "none";
    }
  }



  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  }



  return (
    <div className="page products-lookup">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack text="Back to Products" link="/products" />
      </div>

      <div class="page__body">
        <section className="page__header">
          <h1 className="heading heading--primary">Product Lookup</h1>

          <CustomButtonWithIcon
            size="small"
            isPrimary={true}
            text="Fetch Product"
            onClick={() => handleFetchProduct()}
          />
        </section>

        <section className="page__content products-lookup-page-content-margin">
          <form className="form">
            <fieldset className="form__fieldset">
              <div className="form__row">
                <AutoComplete
                  inputProps={{
                    icon: "Search",
                    className: "search-autocomplete",
                    isFloatedLabel: false,
                    boxed: false,
                    inputProps: {
                      placeholder: "Select Product",
                      onChange: (e) => handleChange(e),
                      value: selectedSearchValue,
                      //boxed: true,
                      //onKeyDown: SelectProductOnEnter,   //no need now
                      onFocus: (event) => {
                        console.log(event);
                        setProductsPopUpShow(
                          productsSearchResult.length > 0 ? true : false
                        );
                      },
                    },
                  }}
                  autoCompleteProps={{
                    data: {},
                    isLoading: false,
                    show: productsPopUpShow,
                    toggleSearchAll: true,
                    className: "search-autocomplete-popup",
                    onSearchAll: (event) => console.log(event),
                    onSelect: (data) => console.log(data, "data..."),
                    onClearSearch: (event, iconState) => {
                      console.log(event, iconState, "event");
                      setProductsPopUpShow(false);
                      setSelectedSearchValue("");
                      setProductsSearchResult([]);
                    },
                    onEscPress: () => setProductsPopUpShow(false),
                    onBodyClick: () => setProductsPopUpShow(false),
                  }}
                  children={
                    <div>
                      <Loading
                        strokeColor="#0033B3"
                        strokeWidth={5}
                        size={20}
                        show={productsSearchLoading}
                      />
                      <ul>
                        {productsSearchResult &&
                          productsSearchResult.map((item) => (
                            <li
                              key={item.id}
                              value={item.sku}
                              onClick={(e) => handleSelect(item)}
                              className="products-search-list-item"
                            >
                              {item.name}
                            </li>
                          ))}
                      </ul>
                    </div>
                  }
                />
              </div>
            </fieldset>
          </form>

          {variantsTableCheck && (
            <>
              <h3 className="heading heading--secondary products-lookup-secondary">Product Variants</h3>
              <div className="page__table">
                <ProductsLookupTable
                  tableData={productVariantsData}
                  //tableDataLoading={loading}
                  //onClickPageChanger={searchedData ? handleSearchedDataPageChange : handlePageChange}
                  tableType="variants_table"
                  //currentPageIndex={searchedData ? currentPageSearched : currentPage}
                  onClickFetchProductLookupData={handleFetchProductLookupData}
                  activeStore={currentStoreId}
                />
              </div>
              <h3 className="heading heading--secondary products-lookup-secondary">Product Attributes</h3>
              <div className="page__table">
                <ProductsLookupTable
                  tableData={productAttributesData}
                  tableType="attributes_table"
                  activeStore={currentStoreId}
                />
              </div>
            </>
          )}

          {variantsTableCheck && lookUpTableCheck && (
            <>
              <h3 className="heading heading--secondary products-lookup-secondary">Product Lookup Data</h3>
              <div className="page__table">
                <ProductsLookupTable
                  tableData={productLookupData}
                  //tableDataLoading={loading}
                  //onClickPageChanger={searchedData ? handleSearchedDataPageChange : handlePageChange}
                  tableType="lookup-stores_table"
                  //currentPageIndex={searchedData ? currentPageSearched : currentPage}
                  onClickFetchProductLookupData={handleFetchProductLookupData}
                  activeStore={currentStoreId}
                />
              </div>
            </>
          )}

        </section>
      </div>
    </div>
  );
}

export default SearchProduct;
