import React, { useState } from "react";
import { Input, Loading, Snackbar } from "@teamfabric/copilot-ui";
import * as WebOrdersApiUtil from "../../../../../utils/api/web-orders-api-utils";
import { calculateTotalData } from "../../../../../utils/helpers/web-orders";
import CustomButtonWithIcon from "../../../../atoms/button_with_icon";
import ProductsTable from "../web-orders/productsTable";

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
  } = props;

  const [webOrderSearchValue, setWebOrderSearchValue] = useState("");
  const [webOrdersLoading, setWebOrdersLoading] = useState(false);

  const searchWebOrder = async (value) => {
    setWebOrdersLoading(true);
    const webOrderRes = await WebOrdersApiUtil.getWebOrderById(value);
    if (webOrderRes.status !== 200) {
      console.log("Cant search Web Order -> ", webOrderRes.errorMessage);
      setWebOrdersLoading(false); //imp to hide customers search loading
      errorMessageWebOrder(webOrderRes.errorMessage);
    } else {
      setWebOrdersLoading(false); //imp to hide customers search loading
      console.log("webOrderRes", webOrderRes);
      const orderData = webOrderRes?.data?.order;
      setReturnWebOrderData(orderData);
      const productsData = [];
      let totalDis = 0;
      if (orderData?.items?.length) {
        for (const pro of orderData?.items) {
          productsData.push({
            ...pro,
            prices: {
              discount_price: pro.price,
            },
            selectQty: -pro.quantity,
            name: pro.title,
            discounted_amount: pro.discount,
            tax_info: {
              tax_amount: (pro.estimatedTax * pro.price) / 100,
            },
          });
          totalDis = totalDis + pro.discount;
        }
      }
      console.log("totalDis", totalDis);
      setSelectedProductsData(productsData);
      setTotalData(calculateTotalData(productsData, totalDis));
    }
  };
  const handleSearchWebOrder = async (e) => {
    const { value } = e.target;
    setWebOrderSearchValue(value);
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
  };
  return (
    <div className="web_orders">
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
                value: webOrderSearchValue,
                disabled: webOrdersLoading || selectedProductsData?.length > 0,
              }}
              kind="md"
              label=""
              width="350px"
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
              //   discountValue={discountValue}
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
