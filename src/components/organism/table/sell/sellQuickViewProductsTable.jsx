import React, { useState, useEffect } from "react";
import { Table, Icon } from "@teamfabric/copilot-ui";
import * as Helpers from "../../../../utils/helpers/scripts";


let perPageNo = 20;

const SellQuickViewProductsTable = (props) => {
  const { tableData = [], selectedHistoryRecordData } = props;

  const [tableDataPerPage, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("use-effect->tabledata->", tableData);
    /*----------------------setting menu option-----------------------------*/
    //let allInvoicesData = [...tableData]; //vvv imp to set
    const isPromotion = selectedHistoryRecordData?.promotion_id;

    for (let i = 0; i < tableData.length; i++) {
      let item = tableData[i];
      item.qty = item.quantity;
      item.offer_price = item.discount_price;
      if (selectedHistoryRecordData?.status === "0") {
        item.qty = item.original_quantity;
      }
      if ((item?.discount > 0 || item?.discount < 0) && isPromotion) {
        if (item.original_quantity < 0) {
          item.offer_price = item.sale_price - (item?.discount / item.qty);
        } else {
          item.offer_price = item.sale_price - item?.discount / item.qty;
        }
      }
      if (selectedHistoryRecordData?.status === "0") {
        item.qty = item.original_quantity;
        item.total_formatted = item.original_quantity
          ? (
              parseFloat(item.original_quantity) * parseFloat(item.offer_price)
            ).toFixed(2)
          : 0;
      } else {
        item.total_formatted = item.quantity
          ? (parseFloat(item.quantity) * parseFloat(item.offer_price)).toFixed(
              2
            )
          : 0;
      }
      item.tax_total = item.tax_total;
      item.product_name = item.name;
      item.product_name_formatted = <small>{item.product_name}</small>;
      item.product_sale_price_formatted = parseFloat(item.sale_price).toFixed(
        2
      );
      item.product_discounted_price_formatted = parseFloat(
        item.offer_price
      ).toFixed(2);
    }

    /*--------------------------setting menu option-------------------------*/
    setTableData(tableData.slice(0, perPageNo));
  }, [props.tableData]);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const handlePagination = async (id) => {
    setLoading(true);
    await delay(1000).then(() => {
      const d = tableData.slice(perPageNo * (id - 1), perPageNo * id);
      setTableData(d);
    });
    setLoading(false);
  };

  function isEmptyTableData(data) {
    return data.length === 0;
  }

  let tableColumns = [];

  tableColumns = [
    {
      title: "Product Name",
      accessor: "product_name_formatted",
    },
    {
      title: "Sku",
      accessor: "sku",
    },
    {
      title: "QTY",
      accessor: "qty",
    },
    {
      title: "Sale Price",
      accessor: "product_sale_price_formatted",
    },
    {
      title: "Discount Price",
      accessor: "product_discounted_price_formatted",
    },
    {
      title: "Total",
      accessor: "total_formatted",
    },
  ];

  //console.log(tableDataPerPage);

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

export default SellQuickViewProductsTable;
