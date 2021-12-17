import React, { useState, useEffect } from "react";
import { Table, Icon } from "@teamfabric/copilot-ui";
//import * as Helpers from "./table_helpers/dummy_data";
//import CustomButtonWithIcon from "../../atoms/button_with_icon";
const _ = require('lodash');


let perPageNo = 10;

const ProductsLookTable = (props) => {
    const { 
        paginationData = {},
        tableType = "",
        tableData = [],
        tableDataLoading,
        activeStore = null
    } = props;
    const [tableDataPerPage, setTableData] = useState([]);
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        console.log(tableData);
        /*----------------------setting menu option-----------------------------*/
        if (tableType === "variants_table") {
            for (let i = 0; i < tableData.length; i++) {
                let item = tableData[i];
                item.fetch_btn_formatted = (<Icon
                    iconName="Import"
                    fill='#121213'
                    size={15}
                    className="table-row-action-btn"
                    size={15}
                    onClick={() => handleLookUpFetch(item)}
                />);

            }
        }
        if (tableType === "lookup-stores_table") {
            for (let i = 0; i < tableData.length; i++) {
                let item = tableData[i];

                item.store_quantity_formatted = (
                    <span className="store-count-heading">
                        {`${item.quantity} pcs`}
                    </span>);

                item.store_name_formatted =  ( <>
                    {item.store_name}
                    {item.store_id === activeStore && 
                    <span className="store-count-heading">
                        {`current`}
                    </span>}
                    </>);
            }
        }
        /*--------------------------setting menu option-------------------------*/
        setTableData(tableData.slice(0, perPageNo));
        setcurrentPageNumber(props.currentPageIndex);
        


    }, [
        props.tableData,
        props.tableType,
    ]);



    //const delay = ms => new Promise(res => setTimeout(res, ms));
    function isEmptyPaginationData(obj) {
        return Object.keys(obj).length === 0;
    }

    function isEmptyTableData(data) {
        return data.length === 0;
    }

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const handlePagination = async (id) => {
        setLoading(true);
        await delay(1000).then(() => {
            const d = tableData && tableData.length > 0 && tableData.slice(perPageNo * (id - 1), perPageNo * id);
            setTableData(d);
        });
        setLoading(false);
    };


    const handleLookUpFetch = async (item) => {
        //console.log(item);
        props.onClickFetchProductLookupData(item);
        
    };




    let tableColumns = [];
    if (tableType === "attributes_table") {
        tableColumns = [
            {
                "title": "Attribute Name",
                "accessor": "name",
            },
            {
                "title": "Attribute Value",
                "accessor": "value",
            },
        ];

    }
    if (tableType === "variants_table") {
        tableColumns = [
            {
                "title": "Product Name",
                "accessor": "parent_product_name",
            },
            {
                "title": "SKU",
                "accessor": "sku",
            },
            {
                "title": "Fetch",
                "accessor": "fetch_btn_formatted",
            },

        ];

    }
    if (tableType === "lookup-stores_table") {
        tableColumns = [
            {
                "title": "Store Name",
                "accessor": "store_name_formatted",
            },
            {
                "title": "Product Name",
                "accessor": "name",
            },
            {
                "title": "SKU",
                "accessor": "sku",
            },
            {
                "title": "Count",
                "accessor": "store_quantity_formatted",
            },

        ];

    }






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
                //activePageNumber={currentPageNumber}
                rowClassName="products-lookup-view-nested-table"
                render={({ data }) => {
                    return (isEmptyTableData(data) ) ? (
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

export default ProductsLookTable;
