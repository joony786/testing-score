import React, { useEffect, useState, useReducer } from "react";
import {
  Input,
  Switch,
  AutoComplete,
  Button,
  Snackbar,
  Icon,
} from "@teamfabric/copilot-ui";
import "../../style.scss";
// components
import ButtonBack from "../../../../atoms/button_back";
import CustomButtonWithIcon from "../../../../atoms/button_with_icon";
import ButtonUpload from "../../../../atoms/button_upload";
import StockNestedProductsTable from "../../../../organism/table/stock/stockNestedProductsTable";
import * as Helpers from "../../../../../utils/helpers/scripts";
import SwitchOutlet from "../../../../atoms/switch_outlet";
import * as StockApiUtil from "../../../../../utils/api/stock-api-utils";
import { useHistory } from "react-router";
import groupBy from 'lodash/groupBy'

const initialFormValues = {
  message: "",
};
const initialFormErrorsValues = {
  messageNameError: false,
};
const formReducer = (state, event) => {
  return { ...state, ...event };
};
const formErrorsReducer = (state, event) => {
  return { ...state, ...event };
};

function AddStockAdjustment() {
  const [formData, setFormData] = useReducer(formReducer, initialFormValues);
  const [formErrorsData, setFormErrorsData] = useReducer(
    formErrorsReducer,
    initialFormErrorsValues
  );
  const { message } = formData;
  const { messageNameError } = formErrorsData;
  const [show, setShow] = useState(false);
  const [registereProductsData, setRegistereProductsData] = useState([]);
  const [productsSearchResult, setProductsSearchResult] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedSearchValue, setSelectedSearchValue] = useState("");
  const [productsTotalQuantity, setProductsTotalQuantity] = useState(0);
  const [productsTableData, setProductsTableData] = useState([]);
  const [productQty, setProductQty] = useState(0);
  const [showBulkUploadSwitch, setShowBulkUploadSwitch] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [isFetchBtnSelected, setIsFetchBtnSelected] = useState(false);
  const history = useHistory();

  let mounted = true;

  let allProducts = [];
  let allSearchedProducts = [];
  let getInventoryBody = [];

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ [name]: value });
    let inputErrorKey = `${name}Error`;
    setFormErrorsData({
      [inputErrorKey]: false,
    });
  };

  useEffect(() => {
    return () => {
      mounted = false;
    };
  }, []);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  //product search
  const handleChange = (e) => {
    setSelectedSearchValue(e.target.value);
  };

  const SelectProductOnEnter = async (event) => {
    if (event.key === "Enter") {
      fetchProductsSKUData(selectedSearchValue);
    }
  };

  const fetchProductsSKUData = async (sku) => {
    document.getElementById("app-loader-container").style.display = "block";
    const productsDiscountsViewResponse = await StockApiUtil.getAllProducts(
      sku
    );
    if (productsDiscountsViewResponse.hasError) {
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, productsDiscountsViewResponse.errorMessage); //imp
    } else {
      if (mounted) {
        let products = productsDiscountsViewResponse.products.data;
        for (let i in products) {
          const productName = products[i].name;
          const productSKU = products[i].sku;
          products[i].searchName = productName + " / " + productSKU;
        }
        setRegistereProductsData(products);
        allProducts = products;
        handleSearch(selectedSearchValue);
      }
    }
  };

  const handleSearch = async (value) => {
    setSelectedSearchValue(value);
    let currValue = value;
    currValue = currValue.toLowerCase();
    if (currValue === "") {
      setProductsSearchResult([]);
    } else {
      const filteredData = allProducts.filter((entry) => {
        let productSku = entry.searchName.toLowerCase();
        return productSku.includes(currValue);
      });
      setProductsSearchResult(filteredData);
      await delay(1000).then(() => {
        allSearchedProducts = filteredData;
        document.getElementById("app-loader-container").style.display = "none";
      });
      if (allSearchedProducts.length > 0) setShow(true);
    }
  };

  const handleSelect = (e) => {
    let selectedProductId = e.target.value;
    selectedProductId = selectedProductId.toString();
    setSelectedSearchValue(e.target.innerText.toString()); //searchName
    setSelectedProductId(selectedProductId); //passes productId
    setShow(false); //imp new ver
  };

  const handleAddProduct = () => {
    handleAddProductData(selectedProductId);
    setSelectedSearchValue("");
    setProductsSearchResult([]);
    setSelectedProductId(null);
    setProductQty(1);
  };

  const handleAddProductData = (selectedProdId) => {
    if (!selectedProdId) {
      showAlertUi(true, "Please select a Product!");
      return;
    }
    let productExistsCheck = false;
    const index = registereProductsData.findIndex(
      (item) => selectedProdId === item.id
    );
    if (index > -1) {
      const selectedItem = JSON.parse(
        JSON.stringify(registereProductsData[index])
      );
      productsTableData.forEach((p) => {
        if (p.id === selectedItem.id) {
          productExistsCheck = true;
          let inputQtyValue = Helpers.var_check(productQty) ? productQty : 1;
          p.qty = parseFloat(p.qty) + parseFloat(inputQtyValue);
        }
      }); //end of for loop

      if (productExistsCheck) {
        calculateProductsTotalQuantity([...productsTableData]); //imp
        setProductsTableData([...productsTableData]); //imp
      }
      if (!productExistsCheck) {
        let inputQtyValue = Helpers.var_check(productQty) ? productQty : 0;
        selectedItem.qty = parseFloat(inputQtyValue);
        productsTableData.push(selectedItem); //new
        calculateProductsTotalQuantity(productsTableData);
        setProductsTableData([...productsTableData]);
      }
    } //end of top first if
  };

  const calculateProductsTotalQuantity = (data) => {
    let productsTotalQuantity = 0;
    const newData = [...data];
    newData.forEach((item) => {
      productsTotalQuantity = productsTotalQuantity + parseFloat(item.qty || 0);
    });

    setProductsTotalQuantity(productsTotalQuantity);
  };

  const handleChangeProductsData = (
    productsData,
    productsTotalQuantity = 0
  ) => {
    setProductsTableData(productsData);
    setProductsTotalQuantity(productsTotalQuantity);
  };

  const handleDownloadFile = async (event) => {
    event.preventDefault();
    let csv = "sku,quantity\n";
    csv += "SKU1,0\n";
    const fileName = new Date().toUTCString() + "-Adjustment-Product-SKU";
    Helpers.createCSV(fileName, csv);
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  const handleBulkOrderSwitch = (value) => {
    setShowBulkUploadSwitch(value);
  };

  const onBulkFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && fileExtention(file.name) === "csv") {
      setSelectedFile(event.target.files[0]);
      setIsFilePicked(true);
      event.target.value = "";
    } else {
      event.target.value = "";
      showAlertUi(true, "Please select a CSV file");
    }
  };

  function fileExtention(filename) {
    const parts = filename.split(".");
    return parts[parts.length - 1];
  }

  const handleBulkFileUpload = async (event) => {
    event.preventDefault();
    let file = selectedFile;
    if (file && fileExtention(file.name) === "csv") {
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = async (evt) => {
        let json = JSON.parse(Helpers.CSV2JSON(evt.target.result));
        let uniqueProducts = [];
        let grouped = groupBy(json, function (obj) {
          return obj.sku;
        });
        for (let key in grouped) {
          let sum = grouped[key].reduce(function (accumulator, current) {
            return parseFloat(accumulator) + parseFloat(current.quantity);
          }, 0);
          if (key) {
            uniqueProducts.push({ sku: key, quantity: sum });
          }
        }
        let bulkProducts = [];
        uniqueProducts.forEach((v, k) => {
          let selectedItemCopy = JSON.parse(JSON.stringify(v));
          selectedItemCopy.qty = 0;
          bulkProducts.push(selectedItemCopy);
          return 0;
        }); // end of for loop
        calculateProductsTotalQuantity(bulkProducts);
        setProductsTableData([...bulkProducts]);
      };
      reader.onerror = function (evt) {
        showAlertUi(true, "error reading file"); //imp
      };
    } else {
      showAlertUi(true, "Not a csv file");
    }
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();

    if (productsTableData.length === 0) {
      showAlertUi(true, "No products added");
      return;
    }
    if (typeof message === "undefined" || message === "") {
      showAlertUi(true, "No message added");
      return;
    }
    productsTableData.forEach((item) => {
      if (item.type === "" || typeof item.type === "undefined") {
        showAlertUi(true, "Please add the adjustment type");
        return;
      }
    });
    if (isFetchBtnSelected) {
      document.getElementById("app-loader-container").style.display = "block";
      let stockAdjustmentPostData = {};
      let wmsStockAdjustmentBody = {};
      let dataStockAdjustmentWMS = [];
      let clonedProductsPostData = [];
      let checkType = true;
      productsTableData.forEach((item) => {
        if (item.type === "" || typeof item.type === "undefined") {
          checkType = false;
          showAlertUi(true, "Please add the adjustment type");
          document.getElementById("app-loader-container").style.display =
            "none";
          return;
        }
      });
      if (checkType) {
        productsTableData.forEach((item, index) => {
          clonedProductsPostData.push({
            sku: item.sku,
            quantity_pos: item.quantity,
            system_quantity: item.systemQty,
            difference: item.difference,
            adjustment_quantity: item.qty,
            type: item.type,
          });
          dataStockAdjustmentWMS.push({
            warehouseLocation: item.location,
            variantSKU: item.sku,
            type: item.type,
            quantity: item.qty.toString(),
          });
        });
        wmsStockAdjustmentBody = {
          data: dataStockAdjustmentWMS,
        };
        stockAdjustmentPostData = {
          message: message,
          is_wms: true,
          products: clonedProductsPostData,
        };
        const stockAdjustmentWMSResponse =
          await StockApiUtil.sendStockAdjustmentWMS(wmsStockAdjustmentBody);
        if (
          stockAdjustmentWMSResponse.hasError ||
          !stockAdjustmentWMSResponse.success
        ) {
          document.getElementById("app-loader-container").style.display =
            "none";
          if (stockAdjustmentWMSResponse.errorMessage) {
            showAlertUi(true, stockAdjustmentWMSResponse.errorMessage); //imp
          } else {
            showAlertUi(true, stockAdjustmentWMSResponse.data.message); //imp
          }
        } else {
          const stockAdjustmentSystemResponse =
            await StockApiUtil.addStockAdjustment(stockAdjustmentPostData);
          if (stockAdjustmentSystemResponse.hasError) {
            document.getElementById("app-loader-container").style.display =
              "none";
            showAlertUi(true, stockAdjustmentSystemResponse.errorMessage); //imp
          } else {
            document.getElementById("app-loader-container").style.display =
              "none";
            setTimeout(() => {
              history.push({
                pathname: "/stock-control/stock-adjustments",
                activeKey: "stock-adjustments",
              });
            }, 500);
          }
        }
      }
    } else {
      showAlertUi(true, "Please fetch the latest inventory first.");
    }
  };

  const fetchProductsInventoryData = async () => {
    if (productsTableData.length === 0) {
      showAlertUi(true, "No Products Added");
      return;
    }
    document.getElementById("app-loader-container").style.display = "block";
    setIsFetchBtnSelected(true);
    productsTableData.forEach((item, index) => {
      getInventoryBody.push({
        sku: item.sku,
        location: "SUM/Stock",
      });
    });
    const inventoryResponse = await StockApiUtil.fetchLatestInventoryProducts(
      getInventoryBody
    );
    if (inventoryResponse.hasError) {
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, inventoryResponse.errorMessage);
      setIsFetchBtnSelected(false); //imp
    } else {
      if (mounted) {
        //imp if unmounted
        let products = productsTableData;
        inventoryResponse.data.forEach((item, index) => {
          products.forEach((pro) => {
            if (item.sku === pro.sku) {
              pro.systemQty = item.systemQty.toString();
              pro.location = "SUM/Stock";
              const total = parseInt(pro.quantity) - parseInt(item.systemQty);
              pro.difference = total.toString();
            }
          });
        });
        setProductsTableData([...products]);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  const handleSelectedFileDelete = () => {
    setSelectedFile(null);
    setIsFilePicked(false);
  };

  return (
    <div className="page new_stock_adjustment">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack
          text="Back to Stock Control"
          link="/stock-control/stock-adjustments"
        />
      </div>

      <div className="page__body">
        <section className="page__header">
          <h1 className="heading heading--primary">New Stock Cycling</h1>
          <CustomButtonWithIcon
            size="small"
            isPrimary={true}
            text="Save"
            onClick={onFormSubmit}
          />
        </section>

        <section className="page__content stock-add-po">
          <form className="form">
            <fieldset className="form__fieldset">
              <div className="fieldset_switch">
                <h2 className="heading heading--secondary">Details</h2>
              </div>

              <div className="form__row">
                <div className="form__input">
                  <Input
                    className="primary required"
                    inputProps={{
                      disabled: false,
                      onChange: handleFormChange,
                      name: "message",
                      value: message,
                    }}
                    width="100%"
                    label="*Message"
                    errorMessage="Field Is Required"
                    error={messageNameError}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="form__fieldset">
              <div className="fieldset_switch">
                <h2 className="heading heading--secondary">Bulk Order</h2>
                <Switch initialState={false} ontoggle={handleBulkOrderSwitch} />
              </div>

              {showBulkUploadSwitch && (
                <div className="form__row" style={{ marginBottom: "1rem" }}>
                  <div className="form__input">
                    <ButtonUpload
                      text="Upload Products File"
                      uploadHandler={onBulkFileUpload}
                    />
                  </div>

                  <div className="form__input">
                    <Button
                      size="small"
                      isPrimary={true}
                      text="Download sample File"
                      icon="Import"
                      onClick={handleDownloadFile}
                    />
                  </div>
                </div>
              )}

              {showBulkUploadSwitch && (
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
              )}

              {showBulkUploadSwitch && (
                <div className="form__row">
                  <div className="form__input">
                    <CustomButtonWithIcon
                      size="medium"
                      isPrimary={true}
                      text="Done"
                      onClick={handleBulkFileUpload}
                    />
                  </div>
                </div>
              )}
            </fieldset>
          </form>
        </section>
      </div>

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
                  icon: "Search",
                  className: "search-autocomplete",
                  isFloatedLabel: false,
                  boxed: true,
                  inputProps: {
                    placeholder: "Search by SKU Number",
                    onChange: (e) => handleChange(e),
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
                  className: "stock-autocomplete-popup",
                  onSearchAll: (event) => console.log(event),
                  onSelect: (data) => console.log(data, "data..."),
                  onClearSearch: (event, iconState) => {
                    setShow(false);
                    setSelectedSearchValue("");
                  },
                  onEscPress: () => setShow(false),
                  onBodyClick: () => setShow(false),
                }}
                children={
                  <div>
                    <ul>
                      {productsSearchResult &&
                        productsSearchResult.map((item) => (
                          <li
                            key={item.id}
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
              <div className="btn_row">
                <CustomButtonWithIcon
                  className="mb-5"
                  text="Add"
                  iconName="Add"
                  isPrimary={true}
                  onClick={handleAddProduct}
                />
                <CustomButtonWithIcon
                  className="mb-5 w-150"
                  text="Fetch Inventory"
                  iconName="fetchInventory"
                  isPrimary={true}
                  onClick={fetchProductsInventoryData}
                />
              </div>
            </div>
          </fieldset>

          <div className="page__table">
            <StockNestedProductsTable
              tableData={[...productsTableData]}
              onChangeProductsData={handleChangeProductsData}
              tableType="addStockAdjustment"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default AddStockAdjustment;
