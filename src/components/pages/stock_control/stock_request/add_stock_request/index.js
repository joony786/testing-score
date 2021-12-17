import React, { useEffect, useState, useReducer } from "react";
import { Input, Switch, AutoComplete, Button, Snackbar, Icon } from "@teamfabric/copilot-ui";
import moment from 'moment';
import { useHistory } from "react-router";
// components
import "../../style.scss";
import ButtonBack from "../../../../atoms/button_back";
import CustomButtonWithIcon from "../../../../atoms/button_with_icon";
import ButtonUpload from "../../../../atoms/button_upload";
import StockNestedProductsTable from "../../../../organism/table/stock/stockNestedProductsTable";
import * as Helpers from "../../../../../utils/helpers/scripts";
import SwitchOutlet from "../../../../atoms/switch_outlet";
import * as StockApiUtil from "../../../../../utils/api/stock-api-utils";


function AddStockRequest() {

  const initialFormValues = {
    request_reference_name: `Stock Request Initiate - ${moment(new Date()).format("yyyy/MM/DD HH:mm:ss")}`,
  }
  const formReducer = (state, event) => {
    return { ...state, ...event };
  }

  const [formData, setFormData] = useReducer(formReducer, initialFormValues);
  const { request_reference_name } = formData;

  const [show, setShow] = useState(false);
  const [registereProductsData, setRegistereProductsData] = useState([]);
  const [productsSearchResult, setProductsSearchResult] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedSearchValue, setSelectedSearchValue] = useState("");
  const [productsTotalQuantity, setProductsTotalQuantity] = useState(0);
  const [productsTableData, setProductsTableData] = useState([]);
  const [productQty, setProductQty] = useState(1);
  const [showBulkUploadSwitch, setShowBulkUploadSwitch] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const history = useHistory();

  let mounted = true;
  let allProducts = [];
  let allSearchedProducts = [];

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ [name]: value });
  }

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mounted = false;
    }

  }, []);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const handleChange = e => {
    setSelectedSearchValue(e.target.value);
  }

  const SelectProductOnEnter = async (event) => {
    if (event.key === "Enter") {
      fetchProductsSKUData(selectedSearchValue);
    }
  };

  const fetchProductsSKUData = async (sku) => {
    document.getElementById('app-loader-container').style.display = "block";
    const productsDiscountsViewResponse = await StockApiUtil.getAllProducts(sku);
    if (productsDiscountsViewResponse.hasError) {
      document.getElementById('app-loader-container').style.display = "none";
      showAlertUi(true, productsDiscountsViewResponse.errorMessage);  //imp
    } else {
      if (mounted) {
        const products = productsDiscountsViewResponse.products.data;
        for (let i in products) {
          const productName = products[i].name;
          const productSKU = products[i].sku;
          products[i].searchName = productName + ' / ' + productSKU;
        }
        setRegistereProductsData(products);
        allProducts = products;
        handleSearch(selectedSearchValue);
      }
    }
  }

  const handleSearch = async (value) => {
    setSelectedSearchValue(value);
    let currValue = value;
    currValue = currValue.toLowerCase();
    if (currValue === "") {
      setProductsSearchResult([]);
    }
    else {
      const filteredData = allProducts.filter((entry) => {
        let productSku = entry.searchName.toLowerCase();
        return productSku.includes(currValue);
      });
      setProductsSearchResult(filteredData);
      await delay(1000).then(() => {
        allSearchedProducts = filteredData;
        document.getElementById('app-loader-container').style.display = "none";
      });
      if (allSearchedProducts.length > 0) setShow(true);
    }
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();
    let systemProductBody = {};
    let systemProducts = [];
    document.getElementById('app-loader-container').style.display = "block";
    if (productsTableData.length === 0) {
      document.getElementById('app-loader-container').style.display = "none";
      showAlertUi(true, "No Products Added");
      return;
    } else {
      productsTableData.forEach((item, index) => {
        systemProducts.push({
          quantity: item.qty,
          id: item.id,
          sku: item.sku
        });
      });
      systemProductBody = {
        products: systemProducts,
        title: request_reference_name,
        to_store_id: 1,
        is_wms: true
      };
      const stockRequestSystemResponse = await StockApiUtil.sendStockRequestSystem(systemProductBody);
      if (stockRequestSystemResponse.hasError) {
        document.getElementById('app-loader-container').style.display = "none";
        showAlertUi(true, stockRequestSystemResponse.errorMessage);  //imp
      } else {
        document.getElementById('app-loader-container').style.display = "none";
        setTimeout(() => {
          history.push({
            pathname: '/stock-control/stock-request',
            activeKey: 'stock-request'
          });
        }, 500);
      }
    }
  }

  const handleDownloadFile = async (event) => {
    event.preventDefault();
    let csv = "sku,quantity\n";
    csv += "SKU1,0\n";
    const fileName = new Date().toUTCString() + "-Request-Product-SKU";
    Helpers.createCSV(fileName, csv);
  };

  const handleSelect = (e) => {
    let selectedProductId = e.target.value;
    selectedProductId = selectedProductId.toString();
    setSelectedSearchValue(e.target.innerText.toString());               //searchName
    setSelectedProductId(selectedProductId);                 //passes productId
    setShow(false);                                          //imp new ver
  };

  const handleAddProduct = () => {
    handleAddProductData(selectedProductId);
    setSelectedSearchValue("");
    setProductsSearchResult([]);
    setSelectedProductId(null);
    setProductQty(1);                             //pro id   new ver
  };

  const handleAddProductData = (selectedProdId) => {
    if (!selectedProdId) {
      showAlertUi(true, "Please select a Product!");                        //imp new ver
      return;
    }
    let productExistsCheck = false;
    const index = registereProductsData.findIndex(
      item => selectedProdId === item.id);
    if (index > -1) {
      const selectedItem = JSON.parse(JSON.stringify(registereProductsData[index]));
      productsTableData.forEach((p) => {
        if (p.id === selectedItem.id) {
          productExistsCheck = true;
          let inputQtyValue = Helpers.var_check(productQty) ? productQty : 1;
          p.qty = (parseFloat(p.qty) + parseFloat(inputQtyValue));
        }
      }); //end of for loop

      if (productExistsCheck) {
        calculateProductsTotalQuantity([...productsTableData]);    //imp
        setProductsTableData([...productsTableData]);              //imp
      }
      if (!productExistsCheck) {
        let inputQtyValue = Helpers.var_check(productQty) ? productQty : 1;
        selectedItem.qty = parseFloat(inputQtyValue);
        productsTableData.push(selectedItem);  //new
        calculateProductsTotalQuantity(productsTableData);
      }
    } //end of top first if
  };

  const calculateProductsTotalQuantity = (data) => {
    let productsTotalQuantity = 0;
    const newData = [...data];
    newData.forEach(item => {
      productsTotalQuantity = productsTotalQuantity + parseFloat(item.qty || 0);
    });

    setProductsTotalQuantity(productsTotalQuantity);
  }

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  }

  const handleChangeProductsData = (productsData, productsTotalQuantity = 0) => {
    setProductsTableData(productsData);
    setProductsTotalQuantity(productsTotalQuantity);
  };

  const handleBulkOrderSwitch = (value) => {
    setShowBulkUploadSwitch(value);
  }

  const onBulkFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && fileExtention(file.name) === "csv") {
      setSelectedFile(event.target.files[0]);
      setIsFilePicked(true);
      event.target.value = "";
    } else {
      event.target.value = "";
      showAlertUi(true, 'Please select a CSV file');
    }
  };

  const handleInputQty = (e) => {
    setProductQty(e.target.value);
  };

  function fileExtention(filename) {
    const parts = filename.split('.');
    return parts[parts.length - 1];
  }

  const handleSelectedFileDelete = () => {
    setSelectedFile(null);
    setIsFilePicked(false);
  };

  const handleBulkFileUpload = async (event) => {
    event.preventDefault();
    let stockBulkRequestSystemBody = {};
    document.getElementById('app-loader-container').style.display = "block";
    if (selectedFile) {
      if (fileExtention(selectedFile.name) === 'csv') {
        stockBulkRequestSystemBody = {
          to_store_id: 1,
          title: request_reference_name,
          file: selectedFile
        };
        const stockRequestBulkSystemResponse = await StockApiUtil.sendStockRequestBulkSystem(stockBulkRequestSystemBody);
        if (stockRequestBulkSystemResponse.hasError) {
          document.getElementById('app-loader-container').style.display = "none";
          showAlertUi(true, stockRequestBulkSystemResponse.errorMessage);  //imp
        } else {
          document.getElementById('app-loader-container').style.display = "none";
          setTimeout(() => {
            history.push({
              pathname: '/stock-control/stock-request',
              activeKey: 'stock-request'
            });
          }, 500);
        }
      }
      else {
        document.getElementById('app-loader-container').style.display = "none";
        showAlertUi(true, 'Not a csv file');
      }
    } else {
      document.getElementById('app-loader-container').style.display = "none";
      showAlertUi(true, 'Please select a file');
    }
  }

  return (
    <div className="page">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack text="Back to Stock Control" link="/stock-control/stock-request" />
      </div>
      <div className="page__body">
        <section className="page__header">
          <h1 className="heading heading--primary">Stock Request Initiate</h1>
          {!showBulkUploadSwitch &&
            <CustomButtonWithIcon
              size="small"
              isPrimary={true}
              text="Save"
              onClick={onFormSubmit} />}
        </section>

        <section className="page__content stock-add-po">
          <form className="form">
            {!showBulkUploadSwitch &&
              <fieldset className="form__fieldset">
                <div className="fieldset_switch">
                  <h2 className="heading heading--secondary">Details</h2>
                </div>

                <div className="form__row">
                  <div className="form__input">
                    <Input
                      className="primary"
                      inputProps={{
                        disabled: false,
                        onChange: handleFormChange,
                        name: "request_reference_name",
                        value: request_reference_name,
                      }}
                      label="Name / Reference"
                    />
                  </div>
                </div>


              </fieldset>}

            <fieldset className="form__fieldset">
              <div className="fieldset_switch">
                <h2 className="heading heading--secondary">Bulk Order</h2>
                <Switch initialState={false} ontoggle={handleBulkOrderSwitch} />
              </div>

              {showBulkUploadSwitch &&
                <div className="form__row" style={{ marginBottom: "1rem" }}>
                  <div className="form__input">
                    <ButtonUpload text="Upload Products File"
                      uploadHandler={onBulkFileUpload} />
                  </div>

                  <div className="form__input">
                    <Button
                      size="small"
                      isPrimary={true}
                      text="Download sample File"
                      icon="Import"
                      onClick={handleDownloadFile}
                    />
                    <div className='info'>
                    <Icon iconName='Info' size={12} />
                    <p className='info__text'>
                    Products which are not in POS will be skipped and can't be shown in view
                    </p>
                    </div>
                  </div>
                  
                </div>}

              {showBulkUploadSwitch &&
                <>
                  {isFilePicked ? (
                    <div className="file-remove-div">
                      <p>Filename: {selectedFile.name}</p>
                      <span className="file-remove-btn">
                        <Icon
                          iconName="Delete"
                          size={20}
                          className="products-bulk-delete-btn"
                          onClick={handleSelectedFileDelete}
                        />
                      </span>
                    </div>
                  ) : (
                    <p>Select a file to show details</p>
                  )}
                </>
              }

              {showBulkUploadSwitch &&
                <div className="form__row" >
                  <div className="form__input">
                    <CustomButtonWithIcon
                      size="medium"
                      isPrimary={true}
                      text="Done"
                      onClick={handleBulkFileUpload}
                    />
                  </div>
                </div>}
            </fieldset>
          </form>
        </section>
      </div>


      {!showBulkUploadSwitch &&
        <div className="page__body stock-order-products-container">
          <section className="page__content stock-add-po">
            <fieldset className="form__fieldset">
              <div className="fieldset_switch order-products-title">
                <h2 className="heading heading--secondary">Order Products</h2>
                <label className="label-stock-count">
                  {productsTotalQuantity}
                </label>
              </div>

              <div className="form__row order-products">
                <AutoComplete
                  inputProps={{
                    icon: 'Search',
                    className: 'search-autocomplete',
                    isFloatedLabel: false,
                    boxed: true,
                    inputProps: {
                      placeholder: 'Search by SKU Number',
                      onChange: e => handleChange(e),
                      value: selectedSearchValue,
                      boxed: true,
                      onKeyDown: SelectProductOnEnter,
                    },
                  }}

                  autoCompleteProps={{
                    data: {},
                    isLoading: false,
                    show: show,
                    toggleSearchAll: true,
                    className: 'stock-autocomplete-popup',
                    onSearchAll: event => console.log(event),
                    onSelect: data => console.log(data, 'data...'),
                    onClearSearch: (event, iconState) => {
                      setShow(false)
                      setSelectedSearchValue("")
                    },
                    onEscPress: () => setShow(false),
                    onBodyClick: () => setShow(false),
                  }}

                  children={
                    <div>
                      <ul>
                        {productsSearchResult && productsSearchResult.map((item) => (
                          <li key={item.id}
                            value={item.id}
                            onClick={handleSelect}
                            className="products-search-list-item"
                          >
                            {item.searchName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  }

                />

                <div className="form__input">
                  <Input
                    className="primary"
                    isFloatedLabel={false}
                    inputProps={{
                      disabled: false,
                      value: productQty,
                      onChange: handleInputQty,
                      type: "text",
                    }}
                    maskOptions={{
                      regex: '[0-9]*'
                    }}
                    label="Quantity"
                  />
                </div>
                <CustomButtonWithIcon
                  text="Add"
                  iconName="Add"
                  isPrimary={true}
                  onClick={handleAddProduct}
                />
              </div>
            </fieldset>


            <div className="page__table">
              <StockNestedProductsTable
                tableData={[...productsTableData]}
                onChangeProductsData={handleChangeProductsData}
                tableType="addStockRequest"
              />
            </div>
          </section>
        </div>
      }
    </div>
  );
}

export default AddStockRequest;
