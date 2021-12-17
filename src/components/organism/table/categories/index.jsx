import React, { useState, useEffect } from "react";
import { Table } from "@teamfabric/copilot-ui";

let perPageNo = 10;

const CategoriesTable = (props) => {
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
        /*----------------------setting menu option-----------------------------*/
        if (tableType === "categories") {
            for (let i = 0; i < tableData.length; i++) {
                let item = tableData[i];
                item.children = [];
                if(item.child_categories && item.child_categories.length > 0){
                    for(let j = 0; j < item.child_categories.length; j++) {
                        item.children.push({ child_name: item.child_categories[j].name, child_menu: item.child_categories[j].child_menu});
                    }
                }
            }
        }
        /*--------------------------setting menu option-------------------------*/
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
    if (tableType === "categories") {
        tableColumns = [
            {
                "title": "Category Name",
                "accessor": "name",
                children: [
                    {
                        title: "Child Categories",
                        accessor: "child_name",
                    },
                    {
                        "title": "",
                        "accessor": "child_menu",
                    },
                ],
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

export default CategoriesTable;

