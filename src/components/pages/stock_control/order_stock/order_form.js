import { Input } from "@teamfabric/copilot-ui/dist/atoms";
import { Button } from "@teamfabric/copilot-ui/dist/atoms/button/Button";
import moment from "moment";
import "../style.scss";
import React, { useEffect, useReducer, useState } from "react";
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import { Calendar } from "@teamfabric/copilot-ui/dist/atoms/calendar/Calendar";
import * as Helpers from "../../../../utils/helpers/scripts";
import * as StockckApiUtil from "../../../../utils/api/stock-api-utils";
import { AutoComplete } from "@teamfabric/copilot-ui";
import * as SuppliersApiUtil from "../../../../utils/api/suppliers-api-utils";
import { useHistory } from "react-router";

export default function OrderForm(props) {
  const {
    productsTableData,
    showSupplier,
    setShowSupplier,
    checkedValue,
    setProductsTableData,
  } = props;
  const [purchaseData, setPurchaseData] = useReducer(
    pOrderReducer,
    initialPValues
  );
  const [purchaseErrorData, setPurchaseErrorData] = useReducer(
    formErrorsReducer,
    initialPErrorsValues
  );
  const [calenderDate, setCalenderDate] = useState(todayDate);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const { productName } = purchaseData;
  const { productNameError } = purchaseErrorData;
  const [supplierValue, setSupplierValue] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [supplierIdError, setSupplierIdError] = useState(false);
  const [searchData, setSearchedData] = useState([]);

  const history = useHistory();

  const tableDataLength =
    !Array.isArray(productsTableData) || !productsTableData.length;
  const { scanCheckedType1, scanCheckedType2, scanCheckedType3 } = checkedValue;
  let mounted = true;
  useEffect(() => {
    resetFieldsData();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanCheckedType1, scanCheckedType2, scanCheckedType3]);
  const resetFieldsData = () => {
    setSupplierValue("");
    setPurchaseData(initialPValues);
    setShowSupplier(false);
    setSupplierId(null);
  };
  const submitPurchaseOrder = async (event) => {
    event.preventDefault(); //imp
    let formValidationsPassedCheck = true;
    if (!productName) {
      formValidationsPassedCheck = false;
      Object.entries(purchaseData).forEach(([key, val]) => {
        //console.log(key, val);
        if (!val) {
          let inputErrorKey = `${key}Error`;
          setPurchaseErrorData({
            [inputErrorKey]: true,
          });
        }
      });
    }
    if (!supplierValue) {
      setSupplierIdError(true);
      formValidationsPassedCheck = false;
    }
    // else if (!Array.isArray(productsTableData) || !productsTableData.length) {
    //   setButtonDisabled(true)
    // }

    if (formValidationsPassedCheck) {
      if (buttonDisabled === false) {
        setButtonDisabled(true);
      }
      console.log(productsTableData, "123===");
      // let purchaseData = new FormData();

      let P1 = [];
      productsTableData.forEach((item) => {
        P1.push({
          product_id: item.id,
          quantity: item.qty,
          price: item.prices.sale_price,
        });
      });

      let purchaseData = {};
      purchaseData.name = productName;
      purchaseData.supplier_id = supplierId; // changed
      purchaseData.status = "open";
      purchaseData.delivery_datetime = moment(new Date()).format(
        "yyyy-MM-DD h:mm:ss"
      );
      purchaseData.date = calenderDate;
      purchaseData.products = P1;

      document.getElementById("app-loader-container").style.display = "block";

      let purchaseResponse = await StockckApiUtil.addPurchaseOrder(
        purchaseData
      );

      if (purchaseResponse.hasError) {
        console.log(
          "Cant Add purchase order -> ",
          purchaseResponse.errorMessage
        );
        setButtonDisabled(false);
        document.getElementById("app-loader-container").style.display = "none";
        showAlertUi(true, purchaseResponse.errorMessage);
      } else if (purchaseResponse.status === true) {
        document.getElementById("app-loader-container").style.display = "none";
        showAlertUi(true, purchaseResponse.message, "s");
        setPurchaseData(initialPValues);
        setSupplierValue("");
        setProductsTableData([]);
        history.push('/stock-control/purchase-orders')
      } else {
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };
  const handleDateChange = (value) => {
    const t = formatDate(value);
    setCalenderDate(t);
  };


  //   input change value
  const handleFormChange = ({ target: { value, name } }) => {
    setPurchaseData({ [name]: value });
    let inputErrorKey = `${name}Error`;
    setPurchaseErrorData({
      [inputErrorKey]: false,
    });
  };


  const handleChange = async ({ target: { value } }) => {
    console.log(value);
    //setValue(value)
    setSupplierValue(value);
    if (value.length > 0) {
      await fetchSearchSuppliers(value);
      setSupplierIdError(false);
      setShowSupplier(true);
    }
  };

  const fetchSearchSuppliers = async (searchValue) => {
    const pageLimit = 10;
    const pageNumber = 1;
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
      // setLoading(false);
      setSearchedData([]);
      // showAlertUi(true, suppliersSearchResponse.errorMessage);
    } else {
      if (mounted) {
        //imp if unmounted
        const suppliersSearchData = suppliersSearchResponse.suppliers.data;
        setSearchedData(suppliersSearchData);
        // setLoading(false);
      }
    }
  };

  const handleSelect = (item) => {
    setSupplierValue(item.name);
    setSupplierId(item.id.toString());
    setShowSupplier(false);
  };
  return (
    <div>
      <section className="page__header">
        <h1 className="heading heading--primary">New Purchase Order</h1>
        <CustomButtonWithIcon
          size="small"
          isPrimary={true}
          text="Save"
          onClick={submitPurchaseOrder}
          disabled={tableDataLength}
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
                  className="primary"
                  inputProps={{
                    disabled: false,
                    onChange: handleFormChange,
                    name: "productName",
                    value: productName,
                  }}
                  label="Name / Reference"
                  errorMessage="Field Is Required"
                  error={productNameError}
                />
              </div>

              <div className="form__input">
                <AutoComplete
                  inputProps={{
                    icon: "Search",
                    className: "search-autocomplete search",
                    isFloatedLabel: false,
                    errorMessage: "Field Is Required",
                    error: supplierIdError,
                    boxed: true,
                    inputProps: {
                      placeholder: "Search supplier",
                      onChange: (e) => handleChange(e),
                      value: supplierValue,
                      boxed: true,
                    },
                  }}
                  autoCompleteProps={{
                    data: {},
                    isLoading: false,
                    show: showSupplier,
                    toggleSearchAll: true,
                    className: "stock-autocomplete-popup",
                    onSearchAll: (event) => console.log(event, "event"),
                    onSelect: (data) => console.log(data, "data..."),
                    onClearSearch: (event, iconState) => {
                      console.log(event, iconState, "event");
                      setShowSupplier(false);
                      setSupplierValue("");
                    },
                    onEscPress: () => setShowSupplier(false),
                    onBodyClick: () => setShowSupplier(false),
                  }}
                  children={
                    <div>
                      <ul>
                        {searchData && searchData.length > 0 ?
                          searchData.map((item) => {
                            return (
                              <li
                                key={item.id}
                                value={item.id}
                                onClick={() => handleSelect(item)}
                                className="products-search-list-item"
                              >
                                {item.name}Z
                              </li>
                            );
                          }) : (
                            <li>No Supplier found </li>
                          )
                          }
                      </ul>
                    </div>
                  }
                />
              </div>

              <div className="form__input">
                <Calendar
                  popperPlacement="bottom-end"
                  onDateChange={handleDateChange}
                  customInput={({ value }) => {
                    return (
                      <Input
                        isFloatedLabel
                        label="Date"
                        inputProps={{
                          value: calenderDate,
                        }}
                        maskOptions={{
                          alias: "datetime",
                          placeholder: "yyyy-MM-dd",
                          inputFormat: "yyyy-MM-dd",
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <div className="form__input">
              <Button
                size="small"
                isPrimary={true}
                text="Bulk upload"
                // icon="Import"
                onClick={() =>
                  history.push("/stock-control/purchase-orders/bulk-upload")
                }
              />
            </div>
          </fieldset>
        </form>
      </section>
    </div>
  );
}

// Helpers
const formatDate = (date) => {
  if (!date) date = new Date();
  return moment(date).format("yyyy-MM-DD");
};
const todayDate = formatDate();
const initialPValues = {
  productName: "",
  supplierID: "",
  products: [],
};
const initialPErrorsValues = {
  productNameError: false,
  supplierIdError: false,
  products: false,
};
const pOrderReducer = (state, event) => {
  return { ...state, ...event };
};
const formErrorsReducer = (state, event) => {
  return { ...state, ...event };
};
const showAlertUi = (show, errorText, s) => {
  if (s) {
    return Helpers.showWarningAppAlertUiContent(show, errorText);
  }
  return Helpers.showAppAlertUiContent(show, errorText);
};
