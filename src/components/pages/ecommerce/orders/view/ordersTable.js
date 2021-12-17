import React, { useState, useEffect } from "react";
import { Table, Icon, Input } from "@teamfabric/copilot-ui";
import { calculateTotalData } from "../../../../../utils/helpers/web-orders";

const _ = require("lodash");

let perPageNo = 2;

const OrdersTable = (props) => {
  const { tableData = [] } = props;
  const [tableDataPerPage, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tableData.length > 0) {
      handleTableFields(tableData);
    }
  }, [tableData]);

  const handleTableFields = (data) => {
    for (const item of data) {
      item.salePrice = parseFloat(item.salePrice  || 0).toFixed(2);
      item.specialPrice = parseFloat(item.specialPrice || 0).toFixed(2);
      item.salePriceTotal = parseFloat(item.salePriceTotal || 0).toFixed(2);
      item.discount = parseFloat(item.discount || 0).toFixed(2);
      item.tax = parseFloat(item.tax || 0).toFixed(2);
      item.total = parseFloat(item.total || 0).toFixed(2);
    }
    setTableData(tableData.slice(0, perPageNo));
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
      title: "Name",
      accessor: "title",
    },
    {
      title: "SKU",
      accessor: "sku",
    },
    {
      title: "Quantity",
      accessor: "quantity",
    },
    {
      title: "Sale Price",
      accessor: "salePrice",
    },
    {
      title: "Discount Price",
      accessor: "specialPrice",
    },
    {
      title: "Sub-Total",
      accessor: "salePriceTotal",
    },
    {
      title: "Discount",
      accessor: "discount",
    },
    {
      title: "Tax",
      accessor: "tax",
    },
    {
      title: "Total",
      accessor: "total",
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

export default OrdersTable;
