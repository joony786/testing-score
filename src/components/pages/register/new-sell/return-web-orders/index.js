import React, { useState } from "react";
import { Input, Loading, Snackbar } from "@teamfabric/copilot-ui";
import * as WebOrdersApiUtil from "../../../../../utils/api/web-orders-api-utils";
import { getDataFromLocalStorage } from "../../../../../utils/local-storage/local-store-utils";
import { calculateTotalData } from "../../../../../utils/helpers/web-orders";
import CustomButtonWithIcon from "../../../../atoms/button_with_icon";
import ProductsTable from "../web-orders/productsTable";
import Constants from "../../../../../utils/constants/constants";
import { toFixed } from "../../../../../utils/helpers/scripts";

const ReturnWebOrders = (props) => {
  const {
    showError,
    setShowError,
    errorMessage,
    setErrorMessage,
    totalData,
    setTotalData,
    paymentMethod,
    returnWebOrderData,
    setReturnWebOrderData,
    selectedProductsData,
    setSelectedProductsData,
    errorMessageWebOrder,
    setShowManualReturnButton,
    showManualReturnButton,
    handleManualReturn,
  } = props;
  let readFromLocalStorage = getDataFromLocalStorage(
    Constants.USER_DETAILS_KEY
  );
  readFromLocalStorage = readFromLocalStorage?.data || null;
  const [webOrderSearchValue, setWebOrderSearchValue] = useState("");
  const [webOrdersLoading, setWebOrdersLoading] = useState(false);

  const searchWebOrder = async (value) => {
    setWebOrdersLoading(true);
    const storeId = readFromLocalStorage?.auth?.Store_info?.external_code;
    const dataToFind = {
      orderId: value,
      store: storeId,
    };
    const webOrderRes = await WebOrdersApiUtil.getWebOrderById(dataToFind);
    console.log("webOrderRes", webOrderRes)
    if (webOrderRes.status !== 200) {
      console.log("Cant search Web Order -> ", webOrderRes.errorMessage);
      setWebOrdersLoading(false); //imp to hide customers search loading
      errorMessageWebOrder(webOrderRes.errorMessage);
      setShowManualReturnButton(true);
    } else {
      setWebOrdersLoading(false); //imp to hide customers search loading
      const orderData = webOrderRes?.data[0];
      setReturnWebOrderData(orderData);
      const productsData = [];
      let totalDis = 0;
      if (orderData?.items?.length) {
        for (const pro of orderData?.items) {
          const discountPerItem = await toFixed(pro?.discount / pro?.quantity);
          productsData.push({
            ...pro,
            prices: {
              discount_price: pro.specialPrice,
            },
            discountPerItem: discountPerItem,
            originalQty: -pro.quantity, 
            selectQty: -pro.quantity,
            name: pro.title,
            discounted_amount: pro.discount,
            tax_info: {
              tax_amount: (pro.tax * pro.specialPrice) / 100,
            },
          });
          totalDis = totalDis + pro.discount;
        }
      }
      setSelectedProductsData(productsData);
      setTotalData(calculateTotalData(productsData, -totalDis));
    }
  };
  const handleSearchWebOrder = async (e) => {
    const { value } = e.target;
    setWebOrderSearchValue(value);
    if (value.length === 0) {
      setShowManualReturnButton(false);
    }
    // if (value.length > 0) {
    //   searchWebOrder(value);
    // }
  };
  const handleSearchOrder = () => {
    if (webOrderSearchValue.length > 0) {
      searchWebOrder(webOrderSearchValue);
    }
  };
  const handleClearSearchOrder = () => {
    setSelectedProductsData([]);
    setReturnWebOrderData({});
    setTotalData(calculateTotalData([], 0));
    setShowManualReturnButton(false);
  };
  return (
    <div className="return_web_orders">
      <h2 style={{ marginBottom: "3rem" }}>Return Web Order</h2>
      <section className="customer">
        <div className="alert-snackbar">
          <Snackbar
            dismissable
            height="60px"
            kind="alert"
            position="top-center"
            label={errorMessage}
            onDismiss={() => {
              setErrorMessage("");
              setShowError(false);
            }}
            zIndex={10000}
            show={showError}
            width="600px"
            withIcon
          />
        </div>
        <div className="form">
          <div className="form__row align-center">
            <Input
              className="search-local"
              icon={webOrderSearchValue === "" && "Search"}
              inputProps={{
                boxed: false,
                onChange: (e) => handleSearchWebOrder(e),
                onKeyDown: (e) => {
                  if (e.keyCode === 13) {
                    handleSearchOrder();
                  }
                },
                value: webOrderSearchValue,
                disabled: webOrdersLoading || selectedProductsData?.length > 0,
              }}
              kind="md"
              label=""
              width="100%"
            />
            {webOrdersLoading ? (
              <Loading
                strokeColor="#0033B3"
                strokeWidth={5}
                size={20}
                show={webOrdersLoading}
              />
            ) : (
              <CustomButtonWithIcon
                text="Search"
                iconName="Search"
                disabled={webOrdersLoading || selectedProductsData?.length > 0}
                onClick={handleSearchOrder}
              />
            )}
            {showManualReturnButton && webOrderSearchValue !== "" && (
              <CustomButtonWithIcon
              text="Manual Return"
              iconName="Search"
              disabled={webOrdersLoading}
              onClick={() => handleManualReturn(webOrderSearchValue)}
            />
            )}
            <CustomButtonWithIcon
              text="Clear All"
              iconName="Search"
              disabled={webOrdersLoading}
              onClick={handleClearSearchOrder}
            />
          </div>
          <div className="page__table">
            <ProductsTable
              tableData={selectedProductsData}
              setSelectedProductsData={setSelectedProductsData}
              totalData={totalData}
              // discountValue={discountValue}
              setTotalData={setTotalData}
              isReturned={true}
            />
          </div>
          <div className="form__row" />
          <div className="form__row">
            <div className="form__input">
              <Input
                className="number"
                inputProps={{
                  //min: 0,
                  disabled: true,
                  type: "text",
                  value: totalData.subTotal,
                }}
                label="Subtotal"
                isFloatedLabel={false}
              />
            </div>
            <div className="form__input">
              <Input
                className="number"
                inputProps={{
                  disabled: true,
                  type: "number",
                  value: totalData.paidAmount,
                  //   onChange: handlePaidChange,
                  //   disabled:
                  //     saleInvoiceData && saleInvoiceData.method !== "Cash",
                }}
                label="Paid"
                isFloatedLabel={false}
              />
            </div>
          </div>
          <div className="form__row">
            <div className="form__input">
              <Input
                className="number"
                inputProps={{
                  disabled: true,
                  type: "text",
                  value: totalData.discountedAmount,
                }}
                label="Discounted Amount"
                isFloatedLabel={false}
              />
            </div>
          </div>

          <div className="form__row">
            <div className="form__input">
              <Input
                className="number"
                inputProps={{
                  disabled: true,
                  type: "text",
                  value: totalData.totalTax,
                }}
                label="Tax"
                isFloatedLabel={false}
              />
            </div>
            <div className="form__input">
              <Input
                className="number"
                inputProps={{
                  disabled: true,
                  type: "text",
                  value: totalData.totalAmount,
                }}
                label="Total"
                isFloatedLabel={false}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReturnWebOrders;
