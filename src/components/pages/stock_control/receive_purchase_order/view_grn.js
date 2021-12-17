import React, { useEffect, useState } from "react";
import { Table } from "@teamfabric/copilot-ui";
import ButtonBack from "../../../atoms/button_back";
import { useHistory } from "react-router";
import * as StockApiUtil from "../../../../utils/api/stock-api-utils";
import * as Helpers from "../../../../utils/helpers/scripts";
import SwitchOutlet from "../../../atoms/switch_outlet";
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import "../style.scss";

const perPageNo = 20;
const ViewGRN = () => {
  const [paginationDta, setPaginationData] = useState([]);
  const [purchaseOrder, setPurchaseOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState("");

  const { location } = useHistory();
  const history = useHistory();

  console.log(location.state);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.state !== undefined) {
      getGrnData();
    } else history.goBack();

    // return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const getGrnData = async () => {
    const limit = Helpers.genericSearchPageLimit;
    const { po_id, grn_id, date } = location.state;
    const purchase_order_id = po_id;
    const good_receive_notes_id = grn_id;
    document.getElementById("app-loader-container").style.display = "block";
    const grnResponse = await StockApiUtil.viewGrnOrder(
      limit,
      1,
      purchase_order_id,
      good_receive_notes_id
    );
    console.log(grnResponse);
    if (grnResponse.hasError) {
      console.log("Cant change grn status -> ", grnResponse.errorMessage);
      //message.warning(productsDiscountsViewResponse.errorMessage, 3);
      document.getElementById("app-loader-container").style.display = "none";
    } else {
      console.log("res -> ", grnResponse.good_receive_notes.data);
      document.getElementById("app-loader-container").style.display = "none";
      let productsTotalQuantity = 0;
      grnResponse.good_receive_notes.data.forEach((item) => {
        productsTotalQuantity =
          productsTotalQuantity + parseInt(item.total_grn_quantity);
      });
      setTotalQuantity(productsTotalQuantity);
      setPurchaseOrder(grnResponse.good_receive_notes.data);
      setPaginationData(grnResponse.good_receive_notes.data);
    }
  };

  const tableColumns = [
    {
      title: "SKU",
      accessor: "sku",
    },
    {
      title: "Description",
      accessor: "product_name",
    },
    {
      title: "Price",
      accessor: "price",
    },
    {
      title: "Qty",
      accessor: "quantity",
    },
  ];
  function isEmptyTableData(data) {
    return data.length === 0;
  }
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const handlePagination = async (id) => {
    // API call with page number (ie. id)
    console.log(id);

    setLoading(true);
    await delay(1000).then(() => {
      const d =
        paginationDta &&
        paginationDta.slice(perPageNo * (id - 1), perPageNo * id);
      purchaseOrder(d);
    });
    setLoading(false);
  };

  const handleDownloadFile = async (e) => {
    e.preventDefault();
    document.getElementById("app-loader-container").style.display = "block";
    let csv = "SKU,Description,Price,Qty\n";
    const arr = purchaseOrder;
    arr.forEach(
      (row) =>
        (csv +=
          row.sku +
          "," +
          row.product_name +
          "," +
          row.price +
          "," +
          row.total_grn_quantity +
          "\n")
    );
    csv += "\n";
    csv += "Total Quantity,," + totalQuantity;
    const fileName = new Date().toUTCString() + "-grn-order";
    Helpers.createCSV(fileName, csv);
    document.getElementById("app-loader-container").style.display = "none";
  };

  return (
    <div className='page'>
      <div className='page__top'>
        <SwitchOutlet />
        <ButtonBack text="Back to Stock Control" link="/stock-control/purchase-orders" />
    </div>
      <div className="subHeading">
        {/* <h4>GRN</h4> */}
        <section className='page__header'>
          <h1 className='heading heading--primary'>Purchase Order GRN</h1>
          <CustomButtonWithIcon
            size='small'
            isPrimary={true}
            text='Download'
            onClick={handleDownloadFile}
          />
        </section>
        <div className={"page__content"}>
          <ul className='info_list'>
            <li>
              Status: <span>Completed</span>
            </li>
            <li>
              Ordered Date: <span>{location?.state?.date}</span>
            </li>
          </ul>
          {/* <span>Status: Completed</span>
          <span>Ordered Date:{location?.state?.date}</span> */}
        </div>
        <div className={"page__table"}>
          <Table
            data={purchaseOrder}
            columns={tableColumns}
            showPagination={true}
            totalRecords={paginationDta.length}
            perPage={perPageNo}
            handlePagination={handlePagination}
            loading={loading}
            render={({ data }) => {
              return isEmptyTableData(data) && !loading ? (
                <tbody>
                  <tr>
                    <td colSpan={tableColumns.length + 1}>
                      <div className='table-no-search-data'>
                        NO RESULTS FOUND
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : null;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewGRN;
