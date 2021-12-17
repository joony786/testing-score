import React, { useState } from "react";
import { Table, TableWithScroll } from "@teamfabric/copilot-ui/dist/organisms";

let perPage = 20;

const ActionHistoryQuickViewTable = ({ tableData, tableColumns, ...args }) => {
  const [input, setInput] = useState(() => {
    return tableData.slice(0, perPage);
  });
  
  const[loading,setLoading] = useState(false)
 

  const handlePagination = (id) => {
    const d = tableData.slice(perPage * (id - 1), perPage * id);
    setInput(d);
  };

  function isEmptyTableData(data) {
    return data.length === 0;
}

  return (
    // <div className='table__actionHistory-main'>
      <Table
        data={input}
        columns={tableColumns}
        className='table__row'
        showPagination={true}
        totalRecords={input.length}
        perPage={perPage}
        handlePagination={handlePagination}
        loading={loading}
        rowClassName="actions-history-view-nested-table "
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
      
    // </div>
  );
};

export default ActionHistoryQuickViewTable;

{/* <TableWithScroll
        // width='1400px'
        tableProps={{
          columns: tableColumns,
          data: input,
          handlePagination: handlePagination,
          showPagination: true,
          totalRecords: tableData.length,
          perPage: perPage,
        }}
      /> */}