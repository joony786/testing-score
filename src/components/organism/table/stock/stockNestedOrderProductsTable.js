import React, { useState, useEffect } from "react";
import { Table } from "@teamfabric/copilot-ui";

let perPageNo = 20;

const StockNestedOrderProductsTable = (props) => {
  const [allData, setAllData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("use-effect-tbale");
    console.log(props.tableData);
    let finalData = [...props.tableData];
    finalData.forEach((item, index, arr) => {
      let data = arr[index];
      // data.product_name_formatted = item.name && (
      //   <div>
      //       {item.name}
      //       <br />
      //       <small>{item.sku}</small>
      //   </div>);
      data.product_name_formatted = item.name;
      data.sku = item.sku;
      data.qty = item.qty;
      if (item.quantity) {
        data.quantity_in_hand = item.quantity;
      }
      data.purchase_price = item.prices.cost_price;
      data.sale_price = item.prices.sale_price;
    });
    setAllData(props.tableData);
    // setTableData(props.tableData.slice(0,2));
    setTableData(finalData);
  }, [props.tableData]);

  let tableColumns = [
    {
      title: "Name",
      accessor: "product_name_formatted",
      // children: [
        
      
      //   {
      //     title: "Sku",
      //     accessor: "sku",
      //   },
      //   {
      //     title: "Sku",
      //     accessor: "-",
      //   },
      //   {
      //     title: "Quantity In Hand",
      //     accessor: "-",
      //   },
      //   {
      //     title: "Quantity",
      //     accessor: "qty",
      //   },
      //   {
      //     title: "Purchase Price",
      //     accessor: "purchase_price",
      //   },
      //   {
      //     title: "Sale Price",
      //     accessor: "sale_price",
      //   },
      //   {
      //     title: "Opetation",
      //     accessor: "menu",
      //   },
      // ],
    },
    {
      title: "SKU",
      accessor: "sku",
    },
    {
      title: "Quantity In Hand",
      accessor: "quantity_in_hand",
    },
    {
      title: "Ordered quantity",
      accessor: "qty",
    },
    {
      title: "Purchase Price",
      accessor: "purchase_price",
    },
    {
      title: "Sale Price",
      accessor: "sale_price",
    },
    {
      title: "Opetation",
      accessor: "menu",
    },
  ];

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const handlePagination = async (id) => {
    // API call with page number (ie. id)
    console.log(id);

    setLoading(true);
    await delay(1000).then(() => {
      const d = props.tableData && props.tableData.slice(perPageNo * (id - 1), perPageNo * id);
      setTableData(d);
    });
    setLoading(false);
  };

  function isEmptyTableData(data) {
    return data.length === 0;
  }
  return (
    <div>
      <Table
        data={tableData}
        columns={tableColumns}
        showPagination={true}
        totalRecords={props.tableData.length}
        perPage={perPageNo}
        handlePagination={handlePagination}
        loading={loading}
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

export default StockNestedOrderProductsTable;
