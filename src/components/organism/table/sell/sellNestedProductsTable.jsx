import React, { useState, useEffect } from "react";
import { Table, Icon, Input } from "@teamfabric/copilot-ui";

const _ = require("lodash");

let perPageNo = 10;
let allSellProductsTableData = [];

const SellNestedProductsTable = (props) => {
  const {
    tableType = "",
    tableData = [],
    checkCashier = false,
    isReturned,
  } = props;
  const [tableDataPerPage, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  //const [currentPageNumber, setcurrentPageNumber] = useState(1);
  const [productsTotalAmount, setProductsTotalAmount] = useState(0);
  const [productQty, setProductQty] = useState("");
  const isReturningData = isReturned === "-";

  useEffect(() => {
    console.log("use-effect->tabledata->", tableData);
    /*----------------------setting menu option-----------------------------*/
    //allSellProductsTableData = [...tableData];  //vvv imp to set
    //calculateTotalAmount(allSellProductsTableData);
    handleTableFields();
    /*--------------------------setting menu option-------------------------*/
    //setTableData(tableData.slice(0, perPageNo));
  }, [props.tableData, props.tableType]);

  const handleTableFields = () => {
    for (let i = 0; i < tableData.length; i++) {
      let item = tableData[i];
    //   item.discount_price_promotion =
      item.offer_price = item.offer_price || 0;
      if (item?.offer_price > 0) {
        item.total_val = item.qty
        ? (
            parseFloat(item.qty) * parseFloat(item.offer_price)
          ).toFixed(2)
        : 0;
      } else {
        item.total_val = item.qty
        ? (
            parseFloat(item.qty) * parseFloat(item.prices.discount_price)
          ).toFixed(2)
        : 0;
      }
      // item.product_sale_price = <Input inputProps={{
      //     min: 0,
      //     value: item.product_sale_price,
      //     type: 'number',
      //     onChange: (e) => handleChange(e, item, "sale_price"),
      // }} width="100px" />
      item.quantity = (
        <Input
          inputProps={{
            value: item.qty,
            type: "number",
            onChange: (e) => handleChange(e, item, "quantity"),
          }}
          width="100px"
        />
      );
      item.delete_button = (
        <Icon
          iconName="Delete"
          size={15}
          className="delete-action-btn"
          //value={item.product_id}
          onClick={() => handleDelete(item.product_id)}
        />
      );
    }

    setTableData(tableData.slice(0, perPageNo));
  };

  const handleSave = (e, row) => {
    console.log(e.target.value);
    var productsTotal = 0;
    var productsTotalQuantity = 0;

    allSellProductsTableData.forEach((item) => {
      productsTotal =
        productsTotal +
        parseFloat(item.qty || 0) * parseFloat(item.product_sale_price);
      productsTotal = parseFloat(productsTotal).toFixed(2);
      productsTotalQuantity = productsTotalQuantity + parseFloat(item.qty || 0);
    });

    console.log(allSellProductsTableData);

    setProductsTotalAmount(productsTotal);
    //setData(newData); //previous code imp one
    props.onChangeProductsData(allSellProductsTableData, productsTotalQuantity);
  };

  const handleChange = (e, row, inputType) => {
    if (
      isReturningData &&
      e.target.value <= parseInt(row.oldQty) &&
      e.target.value >= -parseInt(row.oldQty)
    ) {
      const index = tableData.findIndex(
        (item) => row.product_id === item.product_id
      );
      let attrData = "";
      if (inputType === "quantity") {
        attrData = { qty: parseInt(e.target.value) };
      }
      if (index > -1) {
        const item = tableData[index];
        tableData.splice(index, 1, {
          ...item,
          ...attrData,
        });
        props.onChangeProductsData([...tableData], row);
      }
    } else if (!isReturningData && e.target.value >= 0) {
      const index = tableData.findIndex(
        (item) => row.product_id === item.product_id
      );
      let attrData = "";
      if (inputType === "quantity") {
        attrData = { qty: parseInt(e.target.value) };
      }
      // if (inputType === "sale_price") {
      //     console.log("im", parseFloat(e.target.value));
      //     attrData = {
      //         prices: { sale_price: e.target.value },
      //         product_sale_price: e.target.value,
      //     };
      // }

      if (index > -1) {
        const item = tableData[index];
        tableData.splice(index, 1, {
          ...item,
          ...attrData,
        });
        props.onChangeProductsData([...tableData]);
      }
    }
  };

  const handleDelete = (selectedProdId) => {
    var productsTotal = 0;
    var productsTotalQuantity = 0;

    const newData = [...tableData];
    const index = newData.findIndex((item) => selectedProdId === item.id);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1);

      newData.forEach((item) => {
        productsTotal =
          productsTotal +
          parseFloat(item.qty) * parseFloat(item.product_sale_price);
        productsTotalQuantity = productsTotalQuantity + item.qty;
      });
      setProductsTotalAmount(productsTotal);
      props.onChangeProductsData(newData, productsTotalQuantity);
    }
  };

  const calculateTotalAmount = (data) => {
    var productsTotal = 0;
    const newData = [...data];
    newData.forEach((item) => {
      productsTotal =
        productsTotal +
        parseFloat(item.qty || 0) * parseFloat(item.product_sale_price);
      productsTotal = parseFloat(productsTotal).toFixed(2);
    });
    setProductsTotalAmount(productsTotal);
  };

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  function isEmptyTableData(data) {
    return data.length === 0;
  }

  const handlePagination = async (id) => {
    // API call with page number (ie. id)

    setLoading(true);
    await delay(1000).then(() => {
      const d = tableData.slice(perPageNo * (id - 1), perPageNo * id);
      setTableData(d);
    });
    setLoading(false);
  };

  let tableColumns = [];

  tableColumns = [
    {
      title: "Product Name",
      accessor: "name",
    },
    {
      title: "QTY",
      accessor: "quantity",
    },
    {
      title: "Price",
      accessor: "original_sale_price",
    },
    {
      title: "Discount Price",
      accessor: "offer_price",
    },
    {
      title: "Total",
      accessor: "total_val",
    },
    {
      title: "Delete",
      accessor: "delete_button",
    },
  ];

  return (
    <div>
      <Table
        data={tableDataPerPage}
        columns={tableColumns}
        showPagination={true}
        totalRecords={tableData.length}
        perPage={perPageNo}
        handlePagination={handlePagination}
        loading={loading}
        //activePageNumber={currentPageNumber}  //but not in use
        rowClassName="sell-nested-products-table"
        render={({ data }) => {
          return isEmptyTableData(data) ? (
            <tbody>
              <tr>
                <td colSpan={tableColumns.length + 1}>
                  <div className="table-no-search-data">NO RESULTS FOUND</div>
                </td>
              </tr>
            </tbody>
          ) : null;
        }}
        //width={"500px"}
      />
    </div>
  );
};

export default SellNestedProductsTable;
