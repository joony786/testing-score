import React, { useEffect, useState } from "react";
import { Input } from "@teamfabric/copilot-ui";

// components
import ButtonBack from "../../../../atoms/button_back";
import CustomButtonWithIcon from "../../../../atoms/button_with_icon";
import PageTitle from "../../../../organism/header";
import SwitchOutlet from "../../../../atoms/switch_outlet";
import List from "../../../../molecules/section_list";
import CustomTable from "../../../../organism/table";
import * as Helpers from "../../../../../utils/helpers/scripts";
import * as EcommerceApiUtil from "../../../../../utils/api/ecommerce-api-utils";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
import OrdersTable from "./ordersTable";

const ViewOrder = (props) => {
  const { params } = props.match;
  const { orderId } = params;
  const history = useHistory();

  const [orderData, setOrderData] = useState({});
  const [customerData, setCustomerData] = useState([]);
  const [orderDetailData, setOrderDetailData] = useState([]);
  const fetchOrderById = async () => {
    document.getElementById("app-loader-container").style.display = "block";
    const orderRes = await EcommerceApiUtil.getOrderById(orderId);
    if (orderRes.hasError) {
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, "No Order found!");
      // setTimeout(() => {
      //   history.push("/ecommerce/orders");
      // }, 1000);
    } else {
      document.getElementById("app-loader-container").style.display = "none";

      const data = orderRes?.orders[0];
      setOrderData(orderRes?.orders[0]);
      const billingAddress = data?.addresses?.find(
        (ad) => ad.addressType === "billing"
      );
      const shippingAddress = data?.addresses?.find(
        (ad) => ad.addressType === "shipping"
      );
      setCustomerData([
        {
          title: "Name",
          value:
            `${data?.customer?.customerFirstName} ${data?.customer?.customerMiddleName} ${data?.customer?.customerLastName}` ||
            "",
        },
        {
          title: "Email",
          value: data?.customer?.email || "",
        },
        {
          title: "Phone",
          value: data?.customer?.phone || "",
        },
        {
          title: "Billing Address",
          value: `${billingAddress?.streetAddress} ${billingAddress?.state} ${billingAddress?.city} ${billingAddress?.country}`,
        },
        {
          title: "Shipping Address",
          value: `${shippingAddress?.streetAddress} ${shippingAddress?.state} ${shippingAddress?.city} ${shippingAddress?.country}`,
        },
      ]);
      setOrderDetailData([
        {
          title: "Stauts",
          value: data?.status || "",
        },
        {
          title: "Dated",
          value: moment(data?.dateTime).format("DD MM,YYYY HH:mm a") || "",
        },
        {
          title: "MOP",
          value: data?.paymentMethod || "",
        },
        {
          title: "Coupon Discount",
          value: parseFloat(data?.orderDiscount  || 0).toFixed(2),
        },
        {
          title: "Shipping Method",
          value: data?.courier?.shippingMethod || "",
        },
        {
          title: "Shipping cost",
          value: parseFloat(data?.courier?.shippingPrice  || 0).toFixed(2),
        },
        {
          title: "Total",
          value: parseFloat(data?.orderTotal || 0).toFixed(2),
        },
      ]);
    }
  };
  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };
  useEffect(() => {
    if (orderId) {
      fetchOrderById();
    }
  }, []);

  return (
    <div className="page">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack text="Back to Orders" link="/ecommerce/orders" />
      </div>

      <PageTitle title={`Sale Order - ${orderData?.orderId || ""}`} />

      <section className="page__info_box">
        <List title="Details" listItemsData={orderDetailData} />

        <List listItemsData={customerData} title="Customer" />
      </section>

      <section className="page__table">
        <OrdersTable tableData={orderData?.items || []} />
      </section>
    </div>
  );
};

export default ViewOrder;
