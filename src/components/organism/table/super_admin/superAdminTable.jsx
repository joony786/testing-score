import React, { useState, useEffect } from "react";
import { Table } from "@teamfabric/copilot-ui";

let perPageNo = 10;

const SuperAdminTable = (props) => {
    const { paginationData = {}, tableType = "", tableData = [], tableDataLoading } = props;
    const [tableDataPerPage, setTableData] = useState([]);
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    let totalRecordsLength;

    if (isEmptyPaginationData(paginationData)) {
        totalRecordsLength = 0;
    }
    else {
        totalRecordsLength = parseInt(paginationData.totalElements);
    }


    useEffect(() => {
        setTableData(tableData.slice(0, perPageNo));
        setcurrentPageNumber(props.currentPageIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.tableData, props.tableDataLoading, props.tableType, props.currentPageIndex,]);

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
    if (tableType === "purchaseOrderSuperAdmin") {
        tableColumns = [
            {
                "title": "Name",
                "accessor": "name",
            },
            {
                "title": "Supplier",
                "accessor": "supplier_name",
            },
            {
                "title": "Status",
                "accessor": "status",
            },
            {
                "title": "Delivery Date",
                "accessor": "delivery_datetime",
            },
            {
                "title": "GRN",
                "accessor": "purchase_order_grn",
            },
            {
                "title": "Action",
                "accessor": "menu",
            },
        ];
    }else if (tableType === "stockRequestSuperAdmin") {
        tableColumns = [
            {
                "title": "Name",
                "accessor": "title",
            },
            {
                "title": "Date",
                "accessor": "date",
            },
            {
                "title": "Issued Location",
                "accessor": "from_store",
            },
            {
                "title": "Destination Location",
                "accessor": "to_store",
            },
            {
                "title": "Status",
                "accessor": "status",
            },
            {
                "title": "Action",
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
                rowClassName="products-view-nested-table"
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

export default SuperAdminTable;

