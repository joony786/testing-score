import React, { useState, useEffect } from "react";
import { Table } from "@teamfabric/copilot-ui";

let perPageNo = 10; 

const TaxesTableView = (props) => {
    const { paginationData = 0,
        tableType = "",
        Data = [],
        tableDataLoading = false,
        currentPageIndex = 1,
    } = props;

    const [tableData, setTableData] = useState([]);
    const [currentPageNumber, setcurrentPageNumber] = useState(currentPageIndex);
    const [loading,setLoading] = useState(false)
    let totalRecordsLength = paginationData && paginationData;


    useEffect(() => {
        /*----------------------setting menu option-----------------------------*/
        if (tableType === "reports-inventory-dump-listing") {
            for (let i = 0; i < Data.length; i++) {
                let item = Data[i];
                item.sale_value_formatted = item.Sale_Value && parseFloat(item.Sale_Value).toFixed(2);
                item.stock_sale_value_formatted = item.Stock_Sale_Value && parseFloat(item.Stock_Sale_Value).toFixed(2);
                item.special_price_formatted = item.Special_Price && parseFloat(item.Special_Price).toFixed(2);
            }
        }
        /*--------------------------setting menu option-------------------------*/
        setTableData(Data.slice(0, perPageNo));
        setcurrentPageNumber(currentPageIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        props.Data,
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

    // const handlePagination = async id => {
    //     props.onClickPageChanger(id);
    // }
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));


    const handlePagination = async (id) => {
        setLoading(true);
        await delay(1000).then(() => {
          const d = Data.slice(perPageNo * (id - 1), perPageNo * id);
          setTableData(d);
        });
        setLoading(false);
      };

    let tableColumns = [];
    if (tableType === "reports-inventory-dump-listing") {
        tableColumns = [
            {
                "title": "SKU",
                "accessor": "SKU",
            },
            {
                "title": "Name",
                "accessor": "Name",
            },
            // {
            //     "title": "Quantity",
            //     "accessor": "Quantity",
            // },
            {
                "title": "Sellable Quanity",
                "accessor": "SellableQuanity",
            },
            {
                "title": "Stock Value",
                "accessor": "Stock_Value",
            },{
                "title": "Item Value",
                "accessor": "Item_Value",
            },{
                "title": "Sale Value",
                "accessor": "sale_value_formatted",
            },{
                "title": "Stock Sale Value",
                "accessor": "stock_sale_value_formatted",
            },{
                "title": "Special Price",
                "accessor": "special_price_formatted",
            },

        ];
    }


    return (
        <div>
            <Table
                data={tableData}
                columns={tableColumns}
                showPagination={true}
                totalRecords={totalRecordsLength}
                perPage={perPageNo}
                handlePagination={handlePagination}
                loading={loading}
                activePageNumber={currentPageNumber}
                render={({ data }) => {
                    return (isEmptyTableData(data) && !loading) ? (
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