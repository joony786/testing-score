import React, { useEffect, useState } from "react";
import {
  Table,
  TableWithScroll,
  Pagination,
} from "@teamfabric/copilot-ui/dist/organisms";

const SalesSummaryTable = (props) => {
  const { paginationData = 0, Data = [], tableDataLoading } = props;

  const [tableData, setTableData] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  let perPageNo = 10;

  useEffect(() => {
    return renderData();
    // return () => renderData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentPageIndex, Data]);

  const returnFormate = (value) => {
    return value % 1 !== 0 ? parseFloat(value).toFixed(2) : value;
  };

  const renderData = () => {
   Data && Data.length > 0 && Data.forEach((item) => {
      item.Retail_Price = returnFormate(item.Retail_Price);
      item.Sale_Price = returnFormate(item.Sale_Price);
      item.Quantity = returnFormate(item.Quantity);
      item.Sales = returnFormate(item.Sales);
      item.Gross_Sales = returnFormate(item.Gross_Sales);
      item.Tax = returnFormate(item.Tax);
      item.Net_Sales = returnFormate(item.Net_Sales);
      item.Cost = returnFormate(item.Cost);
      item.Margin = returnFormate(item.Margin);
      item.Discount = returnFormate(item.Discount);
    });
    setTableData(Data.slice(0, perPageNo));
    setCurrentPageNumber(props.currentPageIndex);
  };

  const tableColumns = [
    {
      title: "Date",
      accessor: "Date",
    },
    {
      title: "Invoice No.",
      accessor: "Invoice_No",
    },
    {
      title: "Invoice Note",
      accessor: "Invoice_Note",
    },
    {
      title: "Customer",
      accessor: "Customer",
    },
    {
      title: "SkU",
      accessor: "Sku",
    },
    {
      title: "Product Name",
      accessor: "Product_Name",
    },
    {
      title: "Base Price",
      accessor: "Retail_Price",
    },
    {
      title: "Sale Price",
      accessor: "Sale_Price",
    },
    {
      title: "Sales",
      accessor: "Sales",
    },
    {
      title: "Quantity",
      accessor: "Quantity",
    },
   
    {
      title: "Tax",
      accessor: "Tax",
    },
    {
      title: "Gross Sale",
      accessor: "Net_Sales",
    },
    {
      title: "Cost",
      accessor: "Cost",
    },
    {
      title: "Margin",
      accessor: "Margin",
    },
    {
      title: "Discount",
      accessor: "Discount",
    },
    {
      title: "Total Sales",
      accessor: "Gross_Sales",
    },
    {
      title: "MOP",
      accessor: "MOP",
    },
 
  ];

  let totalRecordsLength = paginationData && paginationData;

  function isEmptyPaginationData(obj) {
    return Object.keys(obj).length === 0;
  }

  function isEmptyTableData(data) {
    return data.length === 0;
  }

  const handlePagination = async (id) => {
    props.onClickPageChanger(id);
  };

  return (
    // <div className="salesSummaryTable__main">

    //   <TableWithScroll
    //     tableProps={{
    //       columns: tableColumns,
    //       data: tableData,
    //       // handlePagination: PaginationData,
    //       // showPagination: true,
    //       // perPage: perPageNo,
    //       // totalRecords: totalRecordsLength,
    //       // currentPageNumber: currentPageNumber
    //     }}
    //   />
    //   <div className='pagination'>
    //   <Pagination
    //     handlePagination={handlePagination}
    //     perPage={perPageNo}
    //     totalRecords={totalRecordsLength}
    //     activePageNumber={currentPageNumber}
    //   />
    //   </div>
    // </div>

      <Table
        data={tableData}
        columns={tableColumns}
        showPagination={true}
        totalRecords={totalRecordsLength}
        perPage={perPageNo}
        handlePagination={handlePagination}
        loading={tableDataLoading}
        activePageNumber={currentPageNumber}
        render={({ data }) => {
          return isEmptyTableData(data) && !tableDataLoading ? (
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
    
  );
};

export default SalesSummaryTable;
