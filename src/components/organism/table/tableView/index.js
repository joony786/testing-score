import React, { useState, useEffect } from "react";
import { Table } from "@teamfabric/copilot-ui";
//import * as Helpers from "./table_helpers/dummy_data";
//import CustomButtonWithIcon from "../../atoms/button_with_icon";

let perPageNo = 10;

const CustomTableView = (props) => {
  const {
    paginationData = {},
    tableType = "",
    tableData = [],
    tableDataLoading,
  } = props;
  const [allTableData, setAllData] = useState([]);
  const [tableDataPerPage, setTableData] = useState([]);
  const [currentPageNumber, setcurrentPageNumber] = useState(1);
  //const [loading, setLoading] = useState(false);

  let totalRecordsLength;

  if (isEmptyPaginationData(paginationData)) {
    totalRecordsLength = 0;
  } else {
    totalRecordsLength = parseInt(paginationData.totalElements);
  }
  //console.log(totalRecordsLength);

  useEffect(() => {
    //setAllData(props.tableData);
    setTableData(tableData.slice(0, perPageNo));
    setcurrentPageNumber(props.currentPageIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.tableData,
    props.tableDataLoading,
    props.tableType,
    props.currentPageIndex,
  ]);

  //const delay = ms => new Promise(res => setTimeout(res, ms));
  function isEmptyPaginationData(obj) {
    return Object.keys(obj).length === 0;
  }

  function isEmptyTableData(data) {
    return data.length === 0;
  }

  const handlePagination = async (id) => {
    props.onClickPageChanger(id);
  };

  let tableColumns = [];
  if (tableType === "categories") {
    tableColumns = [
      {
        title: "Category Name",
        accessor: "name",
      },
      {
        title: "",
        accessor: "menu",
      },
    ];
  } else if (tableType === "couriers") {
    tableColumns = [
      {
        title: "Name",
        accessor: "courier_name",
      },
      {
        title: "Code",
        accessor: "courier_code",
      },
      {
        title: "",
        accessor: "menu",
      },
    ];
  } else if (tableType === "taxes") {
    tableColumns = [
      {
        title: "Tax Name",
        accessor: "name",
      },
      {
        title: "Tax Percentage",
        accessor: "value",
      },
      {
        title: "",
        accessor: "menu",
      },
    ];
  } else if (tableType === "suppliers") {
    tableColumns = [
      {
        title: "Supplier Name",
        accessor: "name",
      },
      {
        title: "Contact Person",
        accessor: "contact_name",
      },
      {
        title: "Email",
        accessor: "email",
      },
      {
        title: "Phone No.",
        accessor: "phone",
      },
      {
        title: "Tax ID",
        accessor: "tax_number",
      },
      {
        title: "",
        accessor: "menu",
      },
    ];
  } else if (tableType === "customers") {
    tableColumns = [
      {
        title: "Name",
        accessor: "name",
      },
      {
        title: "Phone",
        accessor: "phone",
      },
      {
        title: "Email",
        accessor: "email",
      },
      {
        title: "Balance",
        accessor: "balance",
      },
      {
        title: "",
        accessor: "menu",
      },
    ];
  } else if (tableType === "stockRequest") {
    tableColumns = [
      {
        title: "Name",
        accessor: "title",
      },
      {
        title: "Source outlet",
        accessor: "from_store",
      },
      {
        title: "Destination outlet",
        accessor: "to_store",
      },
      {
        title: "Sent date",
        accessor: "date",
      },
      {
        title: "Status",
        accessor: "status",
      },
      {
        title: "Action",
        accessor: "menu",
      },
    ];
  } else if (tableType === "stockAdjustment") {
    tableColumns = [
      {
        title: "Reason",
        accessor: "message",
      },
      {
        title: "Date",
        accessor: "date",
      },
      {
        title: "Action",
        accessor: "menu",
      },
    ];
  } else if (tableType === "returnStock") {
    tableColumns = [
      {
        title: "Return #",
        accessor: "id",
      },
      {
        title: "Name",
        accessor: "name",
      },
      {
        title: "Return Date",
        accessor: "date",
      },
      {
        title: "Supplier",
        accessor: "supplier",
      },
      {
        title: "Sync Status",
        accessor: "is_synced",
      },
      {
        title: "Action",
        accessor: "menu",
      },
    ];
  }

  return (
    <div>
      <Table
        data={tableDataPerPage}
        columns={tableColumns}
        showPagination={true}
        //totalRecords={allData.length}
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
                  <div className='table-no-search-data'>NO RESULTS FOUND</div>
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

export default CustomTableView;
