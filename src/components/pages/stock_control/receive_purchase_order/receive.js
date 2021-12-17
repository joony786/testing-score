import { Table } from "@teamfabric/copilot-ui";
import { useHistory, useParams } from "react-router-dom";
import "../style.scss";
import { viewPurchaseOrdersGRN } from "../../../../utils/api/stock-api-utils";
import React, { useEffect, useState } from "react";
import { formatDate } from "../stock_control_utils";
import { Input, Button } from "@teamfabric/copilot-ui/dist/atoms";
import ButtonBack from "../../../atoms/button_back";
import * as StockApiUtil from "../../../../utils/api/stock-api-utils";
import * as Helpers from "../../../../utils/helpers/scripts";
import SwitchOutlet from "../../../atoms/switch_outlet";
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import AddOrderQunatityInGRN from "./grn_checkbox";
import ReceivedGRNTable from "../../../organism/table/stock/receivedGRNTable";

const ReceivePurchaseOrder = () => {
  const [purchaseProducts, setPurchaseProducts] = useState([]);
  const [purchaseOrder, setPurchaseOrder] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState([]);
  const [totalQuantity, seTotalQuantity] = useState(0);
  const [newTableData, setNewTableData] = useState([]);
  const [initialData, setInitialData] = useState("default");
  const [totalReceivedQuantity, setTotalReceivedQuantity] = useState("");
  const [tableType, setTableType] = useState("default");
  const [reset,setReset] = useState('')

  //grn section
  const [grnData, setGrnData] = useState([]);

  const history = useHistory();
  const { location } = useHistory();
  const { po_id, grn_id } = useParams();

  useEffect(() => {
    setPurchaseProducts([]);
    setPurchaseOrder([]);
    if (location.state !== undefined) {
      const { grn_id, po_id } = location.state;
      getPurchaseOrder(po_id, grn_id).then((r) => r);
    }
    getPurchaseOrder(po_id, grn_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const getPurchaseOrder = async (po_id, grn_id) => {
    document.getElementById("app-loader-container").style.display = "block";
    const fetchPurchaseOrder = await viewPurchaseOrdersGRN(po_id, grn_id);
    if (fetchPurchaseOrder.hasError) {
      console.log(
        "Cant fetch registered products Data -> ",
        fetchPurchaseOrder.errorMessage
      );
      //message.warning(productsDiscountsViewResponse.errorMessage, 3);
      document.getElementById("app-loader-container").style.display = "none";
    } else {
      console.log("res -> ", fetchPurchaseOrder);
      document.getElementById("app-loader-container").style.display = "none";
      const Data = fetchPurchaseOrder.products;
      setPurchaseProducts(Data);
      setPurchaseOrder(fetchPurchaseOrder.purchase_order_info);
      setGrnData(Data);
    }
  };

 


  const sendDataToParent = (data, qty) => {
    let total = 0;
    total = parseInt(total) + parseInt(qty);
    // setReset(Math.random())
    seTotalQuantity(total);
    setNewData(data);
    setTableData(data);
  };
  let mounted = true;

  const { id, status, date, delivery_datetime, supplier_name, name } =
    purchaseOrder;

  const addAllItems = () => {
    console.log("inside addAllItems");
    setTableType("addAll");
    setTableData(grnData);
  };
  const restTable = () => {
    setTableType("default");
    setTableData([]);
    setReset(Math.random())
  };

  //    all alerts
  const showAlertUi = (show, errorText, s) => {
    if (s) {
      return Helpers.showWarningAppAlertUiContent(show, errorText);
    }
    return Helpers.showAppAlertUiContent(show, errorText);
  };

  //   submitReceive GRN
  const submitGrn = async () => {
    let data;
    if (newData && newData.length > 0) {
      data = newData.map((item) => {
        return {
          product_id: item.product_id,
          price: item.price,
          quantity: totalQuantity.toString(),
          // total: item.quantity,
        };
      });
    }
    console.log(data);
    let Final = {
      purchase_order_id: purchaseOrder.id,
      date: formatDate(purchaseOrder.delivery_datetime),
      product: data,
    };
    console.log(Final);
    document.getElementById("app-loader-container").style.display = "block";
    let response = await StockApiUtil.ChangePurchaseOrderGRN(Final);
    if (response.hasError) {
      console.log("Cant Change Grn status -> ", response.errorMessage);
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, response.errorMessage);
    } else {
      console.log("res -> ", response);
      showAlertUi(true, response.message, "s");
      document.getElementById("app-loader-container").style.display = "none";

      history.push({
        pathname: "/stock-control/purchase-orders",
        activeKey: "stock-control",
      });
    }
  };

  const senBackToParent = (d, q) => {
    seTotalQuantity(q);
    setTableData(d);
    setNewData(d)
  };
  return (
    <div className="page">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack
          text="Back to Stock Control"
          link="/stock-control/purchase-orders"
        />
      </div>
      <section className="page__header">
        <h1 className="heading heading--primary">Purchase order GRN</h1>
      </section>
      <div className="submit__order">
        <Button
          isPrimary={false}
          onClick={() => history.goBack()}
          size="small"
          text="Cancel"
        />
        <Button
          disabled={!totalQuantity}
          isPrimary={true}
          onClick={submitGrn}
          size="small"
          text="Save"
        />
      </div>

      <AddOrderQunatityInGRN
        grnData={grnData}
        senBackToParent={senBackToParent}
        restData={reset}
      />
      <div>
        <div className={"mainContent_heading"}>
          <span>Details</span>
          <span>
            Name / reference: <p>{name}</p>{" "}
          </span>
          <span>
            Order No: <p>{id}</p>
          </span>
          <span>status: {status}</span>
          <span>
            Ordered date: <p>{formatDate(date)}</p>
          </span>
          <span>
            Due date: <p>{formatDate(delivery_datetime)}</p>
          </span>
          <span>Supplier: {supplier_name}</span>
       
        </div>
        <div className={"table__container"}>
          <ReceivedGRNTable
            tableData={[...tableData]}
            onChangeProductsData={sendDataToParent}
            tableType={tableType}
          />

          <div className="subHeading bottom__btn">
            <div>
              <Button
                isPrimary={false}
                onClick={addAllItems}
                size="small"
                text="Mark all received"
              />
              <Button
                isPrimary={false}
                onClick={restTable}
                size="small"
                text="Reset"
              />
            </div>

            <div className="quantity">
              <span>Total quantity:</span>
              <span>{totalQuantity}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivePurchaseOrder;
