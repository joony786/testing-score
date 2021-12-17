import React, { useState, useEffect } from "react";
import { Table } from "@teamfabric/copilot-ui";

let perPageNo = 10;

const TaxesTableView = (props) => {
    const { paginationData,
        tableType = "",
        tableData = [],
        tableDataLoading = false,
        currentPageIndex = 1,
    } = props;

    const [tableDataPerPage, setTableData] = useState([]);
    const [currentPageNumber, setcurrentPageNumber] = useState(currentPageIndex);

    let totalRecordsLength;

    if (isEmptyPaginationData(paginationData)) {
        totalRecordsLength = 0;
    }
    else {
        totalRecordsLength = parseInt(paginationData.totalElements);
    }
    useEffect(() => {
        setTableData(tableData.slice(0, perPageNo));
        setcurrentPageNumber(currentPageIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        props.tableData,
        props.tableDataLoading,
        props.tableType,
        props.currentPageIndex,
    ]);

    function isEmptyPaginationData(obj) {
        return Object.keys(obj).length === 0;
    }
    function isEmptyTableData(data) {
        return data.length === 0;
    }

    const handlePagination = async id => {
        props.onClickPageChanger(id);
    }


    let tableColumns = [];
    if (tableType === "taxes") {
        tableColumns = [
            {
                "title": "Tax Name",
                "accessor": "name",
            },
            {
                "title": "Tax Percentage",
                "accessor": "value",
            },
            {
                "title": "",
                "accessor": "menu",
            },

        ];
    }


    return (
        <div>
            <Table
                data={tableDataPerPage}
                columns={tableColumns}
                showPagination={true}
                totalRecords={totalRecordsLength}
                perPage={perPageNo}
                handlePagination={handlePagination}
                loading={tableDataLoading}
                activePageNumber={currentPageNumber}
                render={({ data }) => {
                    return (isEmptyTableData(data) && !tableDataLoading) ? (
                        <tbody>
                            <tr>
                                <td colSpan={tableColumns.length + 1}>
                                    <div className="table-no-search-data">
                                        NO RESULTS FOUND
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    ) : null
                }}
            />
        </div>
    )
}

export default TaxesTableView;