import React, { useState, useEffect } from "react";
import { Table, Icon } from "@teamfabric/copilot-ui";


let perPageNo = 20;

const ActionsHistoryViewTable = (props) => {
    const { paginationData = {}, tableType = "", tableData = [], tableDataLoading } = props;
    // const [allTableData, setAllData] = useState([]);
    const [tableDataPerPage, setTableData] = useState([]);
    const [currentPageNumber, setcurrentPageNumber] = useState(1);

    let totalRecordsLength;
    if (isEmptyPaginationData(paginationData)) {
        totalRecordsLength = 0;
    }
    else {
        totalRecordsLength = parseInt(paginationData.totalElements);
    }


    const handleActionDataView = (record) =>  props.onClickViewTableActionData(record);
    
      const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
      const sortName = (str) => {
        if (str.includes("_")) {
          const splitData = str.split("_");
          return (
            capitalizeFirstLetter(splitData[0]) +
            capitalizeFirstLetter(splitData[1])
          );
        } else {
          return capitalizeFirstLetter(str);
        }
      };
    useEffect(() => {
        /*----------------------setting menu option-----------------------------*/
        if (tableType === "actions-history-listing") {
            for (const item of tableData) {
                if (item.data) {
                    item.view_button = item && (<Icon
                        iconName="Eye"
                        className="table-row-action-btn"
                        size={15}
                        onClick={() => handleActionDataView(item)}
                    />);
                }
                item.entity_name_val = sortName(item?.entity_name);
                item.message =  item?.message?.split('_').join(' ');
            }
        }
        /*--------------------------setting menu option-------------------------*/
        setTableData(tableData.slice(0, perPageNo));
        setcurrentPageNumber(props.currentPageIndex);
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
    if (tableType === "actions-history-listing") {
        tableColumns = [
            {
                "title": "Entity Name",
                "accessor": "entity_name_val",
            },
            {
                "title": "Message",
                "accessor": "message",
            },
            {
                "title": "Type",
                "accessor": "action_type",
            },
            {
                "title": "User",
                "accessor": "name",
            },
            {
                "title": "Created At",
                "accessor": "created_at",
            },
            {
                "title": "View",
                "accessor": "view_button",
            }

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
                rowClassName="actions-history-view-nested-table"
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

export default ActionsHistoryViewTable;

