import React, { useState, useEffect } from "react";
import { Input, Button, AutoComplete, Loading, Modal } from "@teamfabric/copilot-ui";

// components
import ButtonBack from "../../../atoms/button_back";
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import * as Helpers from "../../../../utils/helpers/scripts"
import * as ProductsApiUtil from '../../../../utils/api/products-api-utils';
import SwitchOutlet from "../../../atoms/switch_outlet";
import CustomTableAtionMenuItem from "../../../organism/table/table_helpers/tableActionMenu";
import ProductsDiscountsTable from "../../../organism/table/products/discount";
import { useHistory } from "react-router";



function DiscountProduct() {

  const [paginationLimit, setPaginationLimit] = useState(10);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedSearchValue, setSelectedSearchValue] = useState("");
  const [discountInputValue, setDiscountInputValue] = useState("");
  const [selectedProductSku, setSelectedProductSku] = useState(null);
  const [productsSearchResult, setProductsSearchResult] = useState([]);
  const [productsSearchLoading, setProductsSearchLoading] = useState(false);
  const [productsPopUpShow, setProductsPopUpShow] = useState(false);
  const [discountedRows, setDiscountedRows] = useState([]);
  const [selectedDiscountedProducts, setSelectedDiscountedProducts] = useState([]);
  const [showEditSpecialPriceModal, setShowEditSpecialPriceModal] = useState(false);
  const [editSpecialPriceObj, setEditSpecialPriceObj] = useState(null);
  const [editSpecialPrice, setEditSpecialPrice] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const history = useHistory()

  let mounted = true;


  useEffect(() => {
    fetchProductsData();
    return () => {
      mounted = false;
    }

  }, []);


  const fetchProductsData = async (pageLimit = 10, pageNumber = 1) => {

    document.getElementById('app-loader-container').style.display = "block";
    const productsViewResponse = await ProductsApiUtil.viewProducts(pageLimit, pageNumber);
    console.log('productsViewResponse:', productsViewResponse);
    if (productsViewResponse.hasError) {
      console.log('Cant fetch products -> ', productsViewResponse.errorMessage);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      if (mounted) {     //imp if unmounted
        const productsData = productsViewResponse.products.data || productsViewResponse.products;
        /*----------------------setting menu option-----------------------------*/
        for (let i = 0; i < productsData.length; i++) {
          let item = productsData[i];
          item.menu = (
            <CustomTableAtionMenuItem
              tableItem={item}
              tableItemId={item.id}
              tableItemMenuType="products-discounts-listing"
              handleTableMenuItemClick={handleTableMenuItemClick}
            />
          );
        }
        /*--------------------------setting menu option-------------------------*/
        setData(productsData);
        setPaginationData(productsViewResponse.products.page);
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }
  }


  const onSaveProductsData = async () => {
    if (selectedDiscountedProducts.length === 0) {
      showAlertUi(true, 'No Product Selected');
      return;
    }
    const productsDataToSave = selectedDiscountedProducts.map(product => {
      return {
        product_id: product.id,
        discounted_price: product.prices.discount_price,
      }
    })
    document.getElementById('app-loader-container').style.display = "block";
    let productPutData = {};
    productPutData.products = productsDataToSave;
    const updateProductResponse = await ProductsApiUtil.updateProduct(productPutData);
    if (updateProductResponse.hasError) {
      console.log('Cant Add User Role -> ', updateProductResponse.errorMessage);
      setButtonDisabled(false);
      document.getElementById('app-loader-container').style.display = "none";
      showAlertUi(true, updateProductResponse.errorMessage);
    }
    else {
      document.getElementById('app-loader-container').style.display = "none";
      setTimeout(() => {
        history.push({
          pathname: '/products',
        });
      }, 500);
    }
  }


  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchProductsData(paginationLimit, currentPg);
  }

  const handleChange = (e) => {
    let inputValue = e.target.value;
    setSelectedSearchValue(inputValue);
    if (inputValue.length === 0) {
      setProductsSearchResult([]);
    }
    if (inputValue.length > 1) {
      setProductsPopUpShow(true);
      fetchSearchProducts(inputValue);
    }
  };

  const handleSelect = (item) => {
    let selectedProductSku = item.sku;
    selectedProductSku = selectedProductSku.toString();

    setSelectedSearchValue(item.name);           //passes product name
    setSelectedProductSku(selectedProductSku);   //passes productSku
    setProductsPopUpShow(false);
    setProductsSearchResult([]);

    setData([{ ...item }]);                       //imp
    setCurrentPage(1);
    setPaginationData({ totalElements: 1 });      //imp

  };


  const fetchSearchProducts = async (searchValue) => {
    let pageLimit = Helpers.productsSearchPageLimit;
    let pageNumber = Helpers.productsSearchPageNumber;
    setProductsSearchLoading(true);

    const productsSearchResponse = await ProductsApiUtil.searchProducts(
      pageLimit,
      pageNumber,
      searchValue
    );
    console.log('productsSearchResponse:', productsSearchResponse);
    if (productsSearchResponse.hasError) {
      console.log('Cant Search Products -> ', productsSearchResponse.errorMessage);
      setProductsSearchLoading(false);
      //setProductsSearchResult([]);  //imp but later
      //showAlertUi(true, productsSearchResponse.errorMessage);  //imp but comment now
    }
    else {
      let filteredSearchedData = productsSearchResponse.products.data;
      /*----------------------setting menu option-----------------------------*/
      for (let i = 0; i < filteredSearchedData.length; i++) {
        let item = filteredSearchedData[i];
        item.menu = (
          <CustomTableAtionMenuItem
            tableItem={item}
            tableItemId={item.id}
            tableItemMenuType="products-discounts-listing"
            handleTableMenuItemClick={handleTableMenuItemClick}
          />
        );
      }
      /*--------------------------setting menu option-------------------------*/
      setProductsSearchResult(filteredSearchedData);
      setProductsSearchLoading(false);
      //setPaginationData(productsSearchResponse.products.page);
    }

  }


  const handleSetSelectedDiscountedProducts = (productsDiscountedObj) => {
    const productExist = selectedDiscountedProducts.find(item => productsDiscountedObj.id === item.id);
    if (productExist) {      // if item found
      const filterProducts = selectedDiscountedProducts.filter(item => productsDiscountedObj.id !== item.id);
      setSelectedDiscountedProducts(filterProducts);
    }
    else {       //if item not found
      setSelectedDiscountedProducts([...selectedDiscountedProducts, productsDiscountedObj]);
    }
  };


  const handleDiscountInputChange = (e) => {
    if(e.target.value <= 100) {
      setDiscountInputValue(e.target.value);
    }
  };


  const handleSelectedRows = (type, checked, selectedRow, allRowsData) => {
    if (type === 'all-select') {
      if (checked) {
        const newData = [...allRowsData];
        setSelectedDiscountedProducts(newData);  //imp need here
      } else {
        setSelectedDiscountedProducts([]);
      }
    }
    if (type === 'single-select') {
      handleSetSelectedDiscountedProducts(selectedRow);  //imp to call here 
    }
  };



  const onApplyDiscount = (e) => {
    e.preventDefault();
    let discountedValue = discountInputValue;

    if (!discountedValue) {
      showAlertUi(true, 'No Product Selected');
      return;
    }

    console.log(selectedDiscountedProducts);

    if (selectedDiscountedProducts.length === 0) {
      showAlertUi(true, 'No Product Selected');
      return;
    }
    else {
      let newData = [...data];
      let newDataSelected = [...selectedDiscountedProducts];   //imp new one

      selectedDiscountedProducts.forEach((item, indx) => {

        const index = newData.findIndex(obj => item.id === obj.id);
        if (index > -1) {      //if item found

          let itemPricesObj = { ...item.prices };

          if (itemPricesObj.hasOwnProperty('discount_price')) {
            item.prices.discount_price = (itemPricesObj.sale_price - ((parseFloat(itemPricesObj.sale_price) * discountedValue) / 100));
            newData.splice(index, 1, {
              ...item,
            });
            newDataSelected.splice(index, 1, {
              ...item,
            });

          }

        }

      }); /*--end of foreach--*/


      setData(newData);
      //message.success("Discount applied", 3);
      console.log("newData-selected-for-discounts", newDataSelected);
      setSelectedDiscountedProducts(newDataSelected);  //imp but no need here
      console.log("save-values-new", newData); //correct

    }

  };


  const handleTableMenuItemClick = (productId, product, itemLabel) => {
    if (itemLabel === "Edit") {
      setShowEditSpecialPriceModal(true);
      setEditSpecialPriceObj({ ...product });  //imp
      setEditSpecialPrice(product.prices.discount_price);  //imp
    }
  };


  const renderEditProductSpecialPriceModalContent = (selectedEditProduct) => {
    return (
      <>
        <h2 style={{ marginBottom: "3rem" }}>
          {`Edit Special Price For " ${selectedEditProduct.name}" `}
        </h2>
        <Input
          className="primary"
          inputProps={{
            disabled: false,
            value: editSpecialPrice,
            onChange: (e) => handleEditProductSpecialPriceChange(e, selectedEditProduct),
            type: "number",
          }}
          label="Special Price"
        />
      </>

    );
  };


  const handleEditProductSpecialPriceChange = (e, selectedEditProduct) => {
    setEditSpecialPrice(e.target.value);
  };


  const handleSaveEditProductSpecialPrice = (e, selectedEditProduct) => {
    let newData = [...data];
    newData.forEach((item, index) => {
      if (item.id === editSpecialPriceObj.id) {
        item.prices.discount_price = editSpecialPrice;
        setSelectedDiscountedProducts([item]);
      }
    }); //end of for loop
    setData(newData);
    setShowEditSpecialPriceModal(false);

  }


  const handleClosEditProductModal = () => {
    setShowEditSpecialPriceModal(false);
  };


  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  }


  //console.log("selectedDiscountedProducts", selectedDiscountedProducts);







  return (
    <div className="page products-discount">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack text="Back to Products" link="/products" />
      </div>

      <div className="page__body">
        <section className="page__header">
          <h1 className="heading heading--primary">Product Discount</h1>

          <CustomButtonWithIcon size="small" isPrimary={true} text="Save" onClick={onSaveProductsData} />
        </section>

        <section className="page__content">
          <form className="form form-content-margin">
            <div className="form__row">
              <div className="form__input">
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

              <div className="form__input form__input--btn">
                <div className="discount_input">
                  <Input
                    className="number"
                    inputProps={{
                      min: 0,
                      type: "number",
                      onChange: handleDiscountInputChange,
                      name: "discountInput",
                      value: discountInputValue,
                    }}
                    label="Discount Percentage"
                    width="100%"
                  />

                  <Button
                    isPrimary={false}
                    onClick={onApplyDiscount}
                    size="small"
                    text="Apply"
                  />
                </div>

              </div>
            </div>
          </form>


          {/*------------------------edit column-value--modal---------------------------*/}
          {showEditSpecialPriceModal &&
            <Modal

              //headerText={`Edit Ordered Quantity For ${editProduct.product_name}`}
              headerButtons={[]}
              height="150px"
              onBackdropClick={handleClosEditProductModal}
              onClose={handleClosEditProductModal}
              padding="20px 40px 20px 40px"
              render={() => renderEditProductSpecialPriceModalContent(editSpecialPriceObj)}
              className="edit-product-ordered-qty-modal"
              showCloseButton
              size="small"
              width="200px"
              footerButtons={[
                {
                  //disabled: true,
                  isPrimary: true,
                  onClick: () => handleSaveEditProductSpecialPrice(editSpecialPriceObj),
                  text: 'Apply'
                },
                {
                  isPrimary: false,
                  onClick: handleClosEditProductModal,
                  text: 'Cancel'
                }
              ]}

            />}

          {/*--------------------------edit column-value--modal---------------------------*/}

          <div className="page__table">
            <ProductsDiscountsTable
              tableData={data}
              paginationData={paginationData}
              tableDataLoading={loading}
              onClickPageChanger={handlePageChange}
              tableType="products-discounts-listing"
              currentPageIndex={currentPage}
              onSelectedTableRows={handleSelectedRows}
            />
          </div>

        </section>
      </div>
    </div>
  );
}

export default DiscountProduct;
