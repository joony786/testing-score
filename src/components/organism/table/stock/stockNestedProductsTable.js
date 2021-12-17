import React, { useState, useEffect } from "react";
import { Dropdown, Table } from "@teamfabric/copilot-ui";
import { Input } from "@teamfabric/copilot-ui/dist/atoms";
import { Icon } from "@teamfabric/copilot-ui/dist/atoms/icon/Icon";
import { Pill } from "@teamfabric/copilot-ui/dist/atoms/pill/Pill";

let perPageNo = 10;
let typeData = [
  { id: 1, name: "ADD" },
  { id: 2, name: "SUBTRACT" },
  { id: 3, name: "OVERWRITE" },
];

const StockNestedProductsTable = (props) => {
  const { tableType = "" } = props;
  const [allData, setAllData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAllData(props.tableData);
    setTableData(props.tableData);
    renderData(props.tableData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.tableData]);

  let data = props.tableData;
  const renderData = (tableData) => {
    setAllData(tableData);
    let allStockData = [...tableData];
    for (let i = 0; i < allStockData.length; i++) {
      let item = allStockData[i];
      if (tableType === "addStockRequest") {
        item.order_quantity = (
          <div>
            <Input
              className="primary"
              inputProps={{
                disabled: false,
                onChange: (e) => handleChanges(e.target.value, item.id, item.sku),
                value: item.qty,
                type: "text",
              }}
              maskOptions={{
                regex: '[0-9]*'
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
              onClick={() => handleDelete(item.id)}
            />
          </div>
        );
      } else if (tableType === "addStockAdjustment") {
        item.adjusted_quantity = (
          <div>
            <Input
              className="primary"
              inputProps={{
                disabled: false,
                onChange: (e) => handleChanges(e.target.value, item.id, item.sku),
                value: item.qty,
              }}
              width="70%"
            />
          </div>
        );
        item.delete = (
          <div>
            <Icon
              iconName="Delete"
              size={15}
              className="delete-action-btn"
              onClick={() => handleDelete(item.id)}
              width="100%"
            />
          </div>
        );
        item.adjustment_type = (
          <div>
            <Dropdown
              onSelect={(e) => handleTypeChange(e, item.id, item.sku)}
              options={typeData}
              titleLabel="Adjustment Type"
              width="100%"
            />
          </div>
        );
        if (item.difference && item.difference > 0) {
          item.custom_difference = (
            <div>
              <Pill
                text={item.difference}
                variant="alert"
              />
            </div>
          );
        }else if (item.difference && item.difference < 0) {
          item.custom_difference = (
            <div>
              <Pill
                text={item.difference}
                variant="warning"
              />
            </div>
          );
        } else if (item.difference && item.difference === 0){
          item.custom_difference = (
            <div>
              <Pill
                text={item.difference}
                variant="success"
              />
            </div>
          );
        }
      } else if (tableType === "viewStockAdjustment") {
        if (item.difference && item.difference > 0) {
          item.custom_difference = (
            <div>
              <Pill
                text={item.difference}
                variant="alert"
              />
            </div>
          );
        }else if (item.difference && item.difference < 0) {
          item.custom_difference = (
            <div>
              <Pill
                text={item.difference}
                variant="warning"
              />
            </div>
          );
        } else if (item.difference && item.difference === 0){
          item.custom_difference = (
            <div>
              <Pill
                text={item.difference}
                variant="success"
              />
            </div>
          );
        }
      } else if (tableType === "addReturnStock") {
        item.return_quantity = (
          <div>
            <Input
              className="primary"
              inputProps={{
                disabled: false,
                onChange: (e) => handleChanges(e.target.value, item.id, item.sku),
                value: item.qty,
                type: "text",
              }}
              maskOptions={{
                regex: '[0-9]*'
              }}
              width="70%"
            />
          </div>
        );
        item.delete = (
          <div>
            <Icon
              iconName="Delete"
              size={15}
              className="delete-action-btn"
              onClick={() => handleDelete(item.id)}
            />
          </div>
        );
        item.tbl_cost_price = item.prices.cost_price;
        item.tbl_sale_price = item.prices.sale_price;
      }
    }
  };

  const handleDelete = (selectedProdId) => {
    let productsTotalQuantity = 0;
    const newData = [...props.tableData];
    const index = newData && newData.length > 0 && newData.findIndex((item) => selectedProdId === item.id);
    if (index > -1) {
      newData.splice(index, 1);
      newData.forEach((item) => {
        productsTotalQuantity = productsTotalQuantity + parseInt(item.qty);
      });
      props.onChangeProductsData(newData, productsTotalQuantity);
    }
  };
  const handleChanges = (changeValue, selectedProdId, selectedProSKU) => {
    if (typeof selectedProdId !== "undefined") {
      let productsTotalQuantity = 0;
      let newData = [...props.tableData];
      const index = newData && newData.length > 0 && newData.findIndex((item) => selectedProdId === item.id);
      if (index > -1) {
        newData.forEach((item) => {
          if (item.id === selectedProdId) {
            item.qty = changeValue;
          }
          productsTotalQuantity = productsTotalQuantity + parseInt(item.qty);
        });
        props.onChangeProductsData(newData, productsTotalQuantity);
      }
    } else {
      let productsTotalQuantity = 0;
      let newData = [...props.tableData];
      const index = newData && newData.length > 0 && newData.findIndex((item) => selectedProSKU === item.sku);
      if (index > -1) {
        newData.forEach((item) => {
          if (item.sku === selectedProSKU) {
            item.qty = changeValue;
          }
          productsTotalQuantity = productsTotalQuantity + parseInt(item.qty);
        });
        props.onChangeProductsData(newData, productsTotalQuantity);
      }
    }
  };
  const handleTypeChange = (changeValue, selectedProdId, selectedProSKU) => {
    if (typeof selectedProdId !== "undefined") {
      props.tableData && props.tableData.length > 0 && props.tableData.forEach(item => {
        if (item.id === selectedProdId) {
          item.type = changeValue.name;
        }
      });
    } else {
      props.tableData && props.tableData.length > 0 && props.tableData.forEach(item => {
        if (item.sku === selectedProSKU) {
          item.type = changeValue.name;
        }
      });
    }
  }

  let tableColumns = [];
  if (tableType === "addStockRequest") {
    tableColumns = [
      {
        title: "Name",
        accessor: "name",
      },
      {
        title: "Product SKU",
        accessor: "sku",
      },
      {
        title: "Quantity In Hand",
        accessor: "quantity",
      },
      {
        title: "Ordered Quantity",
        accessor: "order_quantity",
      },
      {
        title: "Delete",
        accessor: "delete",
      },
    ];
  } else if (tableType === "addStockAdjustment") {
    tableColumns = [
      {
        title: "Product SKU",
        accessor: "sku",
      },
      {
        title: "Quantity In POS",
        accessor: "quantity",
      },
      {
        title: "System Quantity",
        accessor: "systemQty",
      },
      {
        title: "Difference",
        accessor: "custom_difference",
      },
      {
        title: "Adjustment Quantity",
        accessor: "adjusted_quantity",
      },
      {
        title: "Adjustment Type",
        accessor: "adjustment_type",
      },
      {
        title: "Delete",
        accessor: "delete",
      },
    ];
  } else if (tableType === "addReturnStock") {
    tableColumns = [
      {
        title: "Product Name",
        accessor: "name",
      },
      {
        title: "Product SKU",
        accessor: "sku",
      },
      {
        title: "Quantity In Hand",
        accessor: "quantity",
      },
      {
        title: "Return Quantity",
        accessor: "return_quantity",
      },
      {
        title: "Purchase Price",
        accessor: "tbl_cost_price",
      },
      {
        title: "Sale Price",
        accessor: "tbl_sale_price",
      },
      {
        title: "Delete",
        accessor: "delete",
      },
    ];
  } else if (tableType === "viewReturnStock") {
    tableColumns = [
      {
        title: "Product SKU",
        accessor: "sku",
      },
      {
        title: "Quantity",
        accessor: "quantity",
      },
    ];
  } else if (tableType === "viewRequestStock") {
    tableColumns = [
      {
        title: "Product Name",
        accessor: "name",
      },
      {
        title: "Product SKU",
        accessor: "sku",
      },
      {
        title: "Quantity",
        accessor: "quantity",
      },
    ];
  } else if (tableType === "viewStockAdjustment") {
    tableColumns = [
      {
        title: "Product Name",
        accessor: "name",
      },
      {
        title: "Product SKU",
        accessor: "sku",
      },
      {
        title: "Quantity in POS",
        accessor: "quantity_pos",
      },
      {
        title: "System Quantity",
        accessor: "system_quantity",
      },
      {
        title: "Difference",
        accessor: "custom_difference",
      },
      {
        title: "Adjustment Quantity",
        accessor: "adjustment_quantity",
      },
      {
        title: "Adjustment Type",
        accessor: "type",
      },
    ];
  } else {
    tableColumns = [
      {
        title: "Name",
        accessor: "product_name",
      },
      {
        title: "SKU",
        accessor: "product_sku",
      },
      {
        title: "Quantity In Hand",
        accessor: "product_quantity",
      },
      {
        title: "Ordered quantity",
        accessor: "qty",
      },
      {
        title: "Purchase Price",
        accessor: "product_purchase_price",
      },
      {
        title: "Sale Price",
        accessor: "product_sale_price",
      },
      {
        title: "Opetation",
        accessor: "menu",
      },
    ];
  }

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

export default StockNestedProductsTable;
