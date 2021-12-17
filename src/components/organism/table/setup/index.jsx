import React, { useState, useEffect } from "react";
import { Table } from "@teamfabric/copilot-ui";


const _ = require('lodash');

let perPageNo = 10;


const SetupTableView = (props) => {
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



    //const delay = ms => new Promise(res => setTimeout(res, ms));
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
    if (tableType === "outlets") {
        tableColumns = [
            {
                "title": "Name",
                "accessor": 'name',
            },
            {
                "title": "Location",
                "accessor": 'location',
            },
            {
                "title": "",
                "accessor": "menu",
            },

        ];

    }
    else if (tableType === "users" ) {
        tableColumns = [
            {
                "title": "Name",
                "accessor": "name",
            },
            {
                "title": "Username",
                "accessor": "email",
            },
            {
                "title": "Phone No.",
                "accessor": "phone",
            },
            {
                "title": "Role",
                "accessor": "user_role_name",
            },
            {
                "title": "",
                "accessor": "menu",
            },

        ];
    } else if (tableType === "roles" ) {
        tableColumns = [
            {
                "title": "Name",
                "accessor": "name",
            },
            {
                "title": "",
                "accessor": "menu",
            },
        ];
    } else if (tableType === "brands" ) {
        tableColumns = [
            {
                "title": "Key",
                "accessor": "key",
            },
            {
                "title": "Name",
                "accessor": "brand_name",
            },
            {
                "title": "",
                "accessor": "menu",
            },
        ];
    } else if (tableType === "receipts" ) {
        tableColumns = [
            {
                "title": "Name",
                "accessor": "name",
            },
            {
                "title": "Header",
                "accessor": "header",
            },
            {
                "title": "Footer",
                "accessor": "footer",
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
                //width={"500px"}

            />
        </div>
    )
}

export default SetupTableView;