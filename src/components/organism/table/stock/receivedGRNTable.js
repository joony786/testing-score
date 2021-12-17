import React, { useState, useEffect } from "react";
import { Table } from "@teamfabric/copilot-ui";
import { Input } from "@teamfabric/copilot-ui/dist/atoms";
import { Icon } from "@teamfabric/copilot-ui/dist/atoms/icon/Icon";

let perPageNo = 20;

const ReceiveGrnTable = (props) => {
  const { tableType = "" } = props;
  const [allData, setAllData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("im rerenderd");
    setAllData(props.tableData);
    setTableData([]);
    renderData(props.tableData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.tableData]);

  let data = props.tableData;
  const renderData = (tableData) => {
    console.log("inside loop");
    setAllData(tableData);
    let allStockData = [...tableData];
    for (let i = 0; i < allStockData.length; i++) {
      let item = allStockData[i];
      if (props.tableType === "default") {
        item.quantity_received = (
          <div>
            <Input
              className="primary"
              inputProps={{
                disabled: false,
                onChange: (e) => handleChanges(e.target.value, item.product_id),
                value: item.qty,
                type: "text",
              }}
              maskOptions={{
                regex: "[0-9]*",
              }}
              width="50%"
            />
          </div>
        );
        item.delete = (
          <div>
            <Icon
              iconName="Delete"
              size={15}
              className="delete-action-btn"
              onClick={() => handleDelete(item.product_id)}
            />
          </div>
        );
      } else if (tableType === "addAll") {
        item.qty = item.purchase_order_junction_quantity
        ? item.purchase_order_junction_quantity
        : item.quantity
        item.quantity_received = (
          <div>
            <Input
              className="primary"
              inputProps={{
                disabled: true,
                onChange: (e) =>
                  handleChangesForAddAll(e.target.value, item.product_id),
                value: item.qty,
                type: "text",
              }}
              maskOptions={{
                regex: "[0-9]*",
              }}
              width="50%"
            />
          </div>
        );
        item.delete = (
          <div>
            <Icon
              iconName="Delete"
              size={15}
              className="delete-action-btn"
              onClick={() => handleDelete(item.product_id)}
            />
          </div>
        );
      }
    }
    setTableData(allStockData);
  };

  const handleDelete = (selectedProdId) => {
    let productsTotalQuantity = 0;
    const newData = [...props.tableData];
    const index =
      newData &&
      newData.length > 0 &&
      newData.findIndex((item) => selectedProdId === item.product_id);
    if (index > -1) {
      newData.splice(index, 1);
      newData.forEach((item) => {
        productsTotalQuantity = productsTotalQuantity + parseInt(item.qty);
      });
      props.onChangeProductsData(newData, productsTotalQuantity);
    }
  };
  const handleChanges = (changeValue, selectedProdId) => {
    let productsTotalQuantity = 0;
    let newData = [...props.tableData];
    const index =
      newData &&
      newData.length > 0 &&
      newData.findIndex((item) => selectedProdId === item.product_id);
    if (index > -1) {
      newData.forEach((item) => {
        if (item.product_id === selectedProdId) {
          item.qty = changeValue;
          // item.total = item.qty
          // ? (parseFloat(item.qty) * parseFloat(item.price)).toFixed(2)
          // : item.price;
        }
        productsTotalQuantity = productsTotalQuantity + parseInt(item.qty);
      });
      props.onChangeProductsData(newData, productsTotalQuantity);
    }
  };
  const handleChangesForAddAll = (changeValue, selectedProdId) => {
    let productsTotalQuantity = 0;
    let newData = [...props.tableData];
    const index =
      newData &&
      newData.length > 0 &&
      newData.findIndex((item) => selectedProdId === item.product_id);
    if (index > -1) {
      newData.forEach((item) => {
        if (item.product_id === selectedProdId) {
        item.qty = changeValue;
          // item.OrderQuantity = changeValue;
        }
        productsTotalQuantity = productsTotalQuantity + parseInt(item.qty);
      });
      props.onChangeProductsData(newData, productsTotalQuantity);
    }
  };

  const getValueType = (item) =>
    item.purchase_order_junction_quantity
      ? item.purchase_order_junction_quantity
      : item.quantity;

  const tableColumns = [
    {
      title: " Product Name",
      accessor: "name",
    },
    {
      title: "SKU",
      accessor: "sku",
    },
    {
      title: "Quantity ordered",
      accessor: "quantity",
    },
    {
      title: "Ordered received",
      accessor: "quantity_received",
    },
    {
      title: "Price",
      accessor: "price",
    },
    {
      title: "Delete",
      accessor: "delete",
    },
  ];

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const handlePagination = async (id) => {
    setLoading(true);
    await delay(1000).then(() => {
      const d = data.slice(perPageNo * (id - 1), perPageNo * id);
      setTableData(d);
    });
    setLoading(false);
  };

  function isEmptyTableData(data) {
    return data.length === 0;
  }
  console.log(tableData);
  return (
    <div className="table__fixed">
      <Table
        data={tableData}
        columns={tableColumns}
        showPagination={true}
        totalRecords={data.length}
        perPage={perPageNo}
        handlePagination={handlePagination}
        loading={loading}
        rowClassName="sell-history-nested-invoices-table"
        render={({ data }) => {
          return isEmptyTableData(data) && !loading ? (
            <tbody>
              <tr>
                <td colSpan={tableColumns.length + 1}>
                  <div className="table-no-search-data">NO RESULTS FOUND</div>
                </td>
              </tr>
            </tbody>
          ) : null;
        }}
      />
    </div>
  );
};

export default ReceiveGrnTable;
