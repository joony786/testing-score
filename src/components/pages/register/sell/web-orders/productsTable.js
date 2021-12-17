import React, { useState, useEffect } from "react";
import { Table, Icon, Input } from "@teamfabric/copilot-ui";
import { calculateTotalData } from "../../../../../utils/helpers/web-orders";


let perPageNo = 2;

const ProductsTable = (props) => {
  const {
    tableData = [],
    setSelectedProductsData,
    setTotalData,
    totalData,
    discountValue,
    handleClearWebOrderAllDiscount,
    isReturned = false,
  } = props;
  const [tableDataPerPage, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tableData.length > 0 || tableData.length === 0) {
      handleTableFields();
    }
  }, [tableData, totalData]);

  const handleTableFields = () => {
    for (let item of tableData) {
      item.sale_price = item?.prices?.discount_price;
      item.discounted_amount = item?.discounted_amount || 0;
      item.total_val = item.selectQty
        ? (
            parseFloat(item.selectQty) *
              parseFloat(item.prices.discount_price) -
            item.discounted_amount
          ).toFixed(2)
        : 0;
      item.quantity = (
        <Input
          inputProps={{
            min: 0,
            value: item.selectQty,
            disabled: isReturned,
            type: "number",
            onChange: (e) => handleChange(e, item),
          }}
          width="100px"
        />
      );
      item.delete_button = !isReturned ? (
        <Icon
          iconName="Delete"
          size={15}
          className="delete-action-btn"
          //value={item.product_id}
          onClick={() => handleDelete(item.id)}
        />
      ) : (
        "-"
      );
    }
    setTableData(tableData.slice(0, perPageNo));
  };

  const handleChange = (e, row) => {
    const productExist = tableData.find((pro) => pro.id === row.id);
    if (productExist) {
      const indexOfProductExist = tableData.findIndex(
        (pro) => pro.id === row.id
      );
      productExist.selectQty = e.target.value;
      tableData.splice(indexOfProductExist, 1, productExist);
      setSelectedProductsData(tableData);
      setTotalData(calculateTotalData(tableData, discountValue));
      handleTableFields();
      handleClearWebOrderAllDiscount();
    }
  };

  const handleDelete = (productId) => {
    const productsLeft = tableData.filter((pro) => pro.id !== productId);
    setSelectedProductsData(productsLeft);
    setTotalData(calculateTotalData(productsLeft, discountValue));
    handleTableFields();
    handleClearWebOrderAllDiscount();
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
      accessor: "sale_price",
    },
    {
      title: "Discount",
      accessor: "discounted_amount",
    },
    {
      title: "Total",
      accessor: "total_val",
    },
    {
      title: isReturned ? "-" : "Delete",
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

export default ProductsTable;
