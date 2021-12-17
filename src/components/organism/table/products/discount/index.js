import React, { useState, useEffect } from "react";
import { Table, Icon, Input } from "@teamfabric/copilot-ui";
//import * as Helpers from "./table_helpers/dummy_data";
//import CustomButtonWithIcon from "../../atoms/button_with_icon";
//import CustomTableAtionMenuItem from "../../../../organism/table/table_helpers/tableActionMenu";


let perPageNo = 10;

const ProductsDiscountsTable = (props) => {
    const { paginationData = {}, tableType = "", tableData = [], tableDataLoading } = props;
    const [allTableData, setAllData] = useState([]);
    const [tableDataPerPage, setTableData] = useState([]);
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    //const [loading, setLoading] = useState(false);


    let totalRecordsLength;

    if (isEmptyPaginationData(paginationData)) {
        totalRecordsLength = 0;
    }
    else {
        totalRecordsLength = parseInt(paginationData.totalElements);
    }
    //console.log(totalRecordsLength);


    useEffect(() => {
        //setAllData(props.tableData);
        /*----------------------setting menu option-----------------------------*/

        for (let i = 0; i < tableData.length; i++) {
            let item = tableData[i];
            let variantItems = item.variants ? [...item.variants] : [];
            let itemPricesObj = { ...item.prices };
            item.product_name_formatted = item.name && (
                <div>
                    {item.name}
                    <br />
                    <small>{item.sku}</small>
                </div>);

            let lastCategory = "";
            let categoriesLength = item.categories ? item.categories.length : 0;
            if(categoriesLength > 0) { 
                lastCategory = item.categories[categoriesLength - 1];
            }
            item.category_name = lastCategory && lastCategory.name;
            item.sale_price_formatted = item.prices.sale_price && parseFloat(item.prices.sale_price).toFixed(2);
            item.discount_price_formatted = item.prices.discount_price && parseFloat(item.prices.discount_price).toFixed(2);
            item.variants_length_formatted = item.variants && item.variants.length > 0 && (
                <div className="table-row-variants-link">
                    {item.variants.length > 1 ? item.variants.length + " variants" : "-"}
                </div>);


            /*item.children = [];
            if (variantItems.length > 0) {
                for (let i = 0; i < variantItems.length; i++) {
                    let varItem = variantItems[i];
                    item.children.push(
                        {
                            sku: varItem.sku,
                            //category: item.category_name,
                            //sale_price: item.sale_price_formatted,
                            //quantity: item.quantity,
                        });
                }
            }*/

            let discounted_percentage = 0;
            if (itemPricesObj.discount_price > 0) {
                discounted_percentage = ((parseFloat(itemPricesObj.discount_price) / parseFloat(itemPricesObj.sale_price)) * 100);
                discounted_percentage = (100 - (parseFloat(discounted_percentage))).toFixed(2);
            }

            item.discounted_percentage_formatted = itemPricesObj.sale_price &&
                <span className={`${discounted_percentage >= 1 ? 'products-discount-tag' : 'products-zero-discount-tag'}`}>
                    {itemPricesObj.sale_price == '0' || isNaN(discounted_percentage) ? '0%'
                        : discounted_percentage >= 1 ? discounted_percentage + '%'
                            : '0%'
                    }
                </span>


        }

        /*--------------------------setting menu option-------------------------*/
        setTableData(tableData.slice(0, perPageNo));
        setcurrentPageNumber(props.currentPageIndex);
    }, [
        props.tableData,
        props.tableDataLoading,
        props.tableType,
        props.currentPageIndex,
        //props.onChangeProductsData,
    ]);


    //const delay = ms => new Promise(res => setTimeout(res, ms));
    function isEmptyPaginationData(obj) {
        return Object.keys(obj).length === 0;
    }

    function isEmptyTableData(data) {
        return data.length === 0;
    }



    const handlePagination = async id => {
        // API call with page number (ie. id)
        props.onClickPageChanger(id);
    }


    const handleAllRowsSelected = (e, isSelected) => {
        let newData = [...tableData];
        props.onSelectedTableRows('all-select', e.target.checked, {}, newData);
    }

    const handleRowSelect = (e, rowData) => {
        props.onSelectedTableRows('single-select', e.target.checked, rowData);
    }



    let tableColumns = [];
    tableColumns = [
        {
            "title": "Product Name",
            "accessor": "product_name_formatted",
            children: [
                {
                    title: "SKU",
                    accessor: "sku",
                },
            ],
        },
        {
            "title": "SKU",
            "accessor": "sku",
        },
        {
            "title": "Sale Price",
            "accessor": "sale_price_formatted",
        },
        {
            "title": "Discount",
            "accessor": "discounted_percentage_formatted",
        },
        {
            "title": "Special Price",
            "accessor": "discount_price_formatted",
        },
        {
            "title": "",
            "accessor": "menu",
        },

    ];







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
                rowSelectHandler={(e, rowData) => handleRowSelect(e, rowData)}
                onAllRowSelect={(isSelected) => handleAllRowsSelected(isSelected)}
                collapseOnRowClick={false}
                isSelectable={true}     //imp
                rowClassName="products-discounts-view-nested-table"
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

export default ProductsDiscountsTable;
