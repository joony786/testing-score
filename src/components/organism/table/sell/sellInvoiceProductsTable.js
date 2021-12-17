import React, { useState, useEffect } from "react";
import { Table, Icon, Input } from "@teamfabric/copilot-ui";
import { calculateInvoiceTotalData } from "../../../../utils/helpers/invoices";


let perPageNo = 10;
let allSellProductsTableData = [];

const SellInvoiceProductsTable = (props) => {
  const {
    tableData = [],
    isReturned,
    trigger,
    setInvoiceProductsSelected,
    setInvoiceTotalData,
    invoiceTotalData,
    selectedTaxCategory,
    handleClearAllDiscount,
    isPromotion,
    discountInputValue,
    setDiscountInputValue,
  } = props;
  const [tableDataPerPage, setTableDataPerPage] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tableData.length > 0 || tableData.length == 0) {
      handleTableFields();
    }
  }, [tableData, trigger, invoiceTotalData]);
  const handleTableFields = () => {
    for (let i = 0; i < tableData.length; i++) {
      let item = tableData[i];
      item.offer_price = item.offer_price || item?.prices?.discount_price || 0;
      item.original_price = parseFloat(item.prices.sale_price).toFixed(2);
      if (item?.offer_price > 0) {
        item.total_val = parseFloat(
          parseFloat(item.selectQty) * parseFloat(item.offer_price)
        ).toFixed(2);
      } else {
        item.total_val = parseFloat(
          parseFloat(item.selectQty) * parseFloat(item.prices.discount_price)
        ).toFixed(2);
      }
      item.quantity = (
        <Input
          inputProps={{
            value: item.selectQty,
            type: "number",
            // min: 0,
            onChange: (e) => handleQuantity(e, item.id),
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
    setTableDataPerPage(tableData.slice(0, perPageNo));
  };

  const handleQuantity = (e, productId) => {
    const { value } = e.target;
    const findProduct = tableData.find((pro) => pro.id === productId);
    if (findProduct) {
      let productDataToUpdate = {
        ...findProduct,
      };
      if (isReturned && value < 0 && value >= findProduct?.oldQty) {
        productDataToUpdate.selectQty = e.target.value;
      } else if (!isReturned && value > 0) {
        productDataToUpdate.selectQty = e.target.value;
      } else {
        return;
      }
      const findIndexPro = tableData.indexOf(findProduct);
      tableData.splice(findIndexPro, 1, productDataToUpdate);
      let subTotal = 0;
      let customDis = 0;
      for (const pro of tableData) {
        if (pro?.offer_price > 0 && isPromotion) {
          subTotal = parseInt(subTotal) + parseInt(pro.selectQty) * parseInt(pro.offer_price)
          subTotal = parseFloat(subTotal).toFixed(2);
          pro.discount = parseFloat(pro?.discount_per_item * pro.selectQty).toFixed(2);
          customDis = parseFloat(customDis + (pro?.discount * -1)).toFixed(2)
        } else {
          subTotal = parseInt(subTotal) + parseInt(pro.selectQty) * parseInt(pro.prices.discount_price)
          subTotal = parseFloat(subTotal).toFixed(2);
        }
      }
      let discountAmount = (discountInputValue * subTotal) / 100;
      if (isReturned) {
        if (customDis > 0) {
        discountAmount = customDis;
        }
        if (discountAmount > 0) {
          discountAmount = discountAmount;
        }
      }
      if (isPromotion && !isReturned) {
        handleClearAllDiscount();
        setInvoiceTotalData(
          calculateInvoiceTotalData(
            tableData,
            0,
            0,
            selectedTaxCategory,
            isPromotion,
            isReturned,
          )
        );
      } else if (isPromotion && isReturned) {
        setInvoiceTotalData(
          calculateInvoiceTotalData(
            tableData,
            discountAmount,
            0,
            selectedTaxCategory,
            isPromotion,
            isReturned
          )
        );
      } else {
        setInvoiceTotalData(
          calculateInvoiceTotalData(
            tableData,
            discountAmount,
            0,
            selectedTaxCategory,
            false,
            isReturned,
            invoiceTotalData?.discountedAmountPerItem,
            discountInputValue
          )
        );
      }
      handleTableFields();
    }
  };

  const handleDelete = (productId) => {
    const filterData = tableData.filter((pro) => pro.id !== productId);
    setInvoiceProductsSelected(filterData);
    if (isPromotion) {
      handleClearAllDiscount();
      setInvoiceTotalData(
        calculateInvoiceTotalData(filterData, 0, 0, selectedTaxCategory)
      );
    } else {
      let subTotal = 0;
      for (const pro of filterData) {
          subTotal = parseInt(subTotal) + parseInt(pro.selectQty) * parseInt(pro.prices.discount_price)
          subTotal = parseFloat(subTotal).toFixed(2);
      }
      let discountAmount = (discountInputValue * subTotal) / 100;
      setInvoiceTotalData(
        calculateInvoiceTotalData(
          filterData,
          discountAmount,
          0,
          selectedTaxCategory,
          false,
          false,
          invoiceTotalData?.discountedAmountPerItem,
          discountInputValue
        )
      );
    }
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
      setTableDataPerPage(d);
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
      accessor: "original_price",
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

export default SellInvoiceProductsTable;
