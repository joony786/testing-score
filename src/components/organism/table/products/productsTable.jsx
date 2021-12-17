import React, { useState, useEffect } from "react";
import { Table } from "@teamfabric/copilot-ui";

const _ = require('lodash');


let perPageNo = 10;

const ProductsTable = (props) => {
    const { paginationData = {}, tableType = "", tableData = [], tableDataLoading } = props;
    const [allTableData, setAllData] = useState([]);
    const [tableDataPerPage, setTableData] = useState([]);
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    //const [loading, setLoading] = useState(false);

    //console.log(paginationData);
    let totalRecordsLength;

    if (isEmptyPaginationData(paginationData)) {
        totalRecordsLength = 0;
    }
    else {
        totalRecordsLength = parseInt(paginationData.totalElements);
    }
    //console.log(totalRecordsLength);


    useEffect(() => {
        console.log(tableData);
        //setAllData(props.tableData);
        /*----------------------setting menu option-----------------------------*/
        if (tableType === "products-listing") {
            for (let i = 0; i < tableData.length; i++) {
                let item = tableData[i];
                let variantItems = item.variants ? [...item.variants] : [];
                item.product_name_formatted = item.name && (
                    <div>
                        {item.name}
                        <br />
                        <small>{item.sku}</small>
                    </div>);

                let lastCategory = "";
                let categoriesLength = item.categories ? item.categories.length : [];
                if(categoriesLength > 0) { 
                    lastCategory = item.categories[categoriesLength - 1];
                }
                item.category_name =  lastCategory && lastCategory.name;
                item.sale_price_formatted =  item.prices.sale_price && parseFloat(item.prices.sale_price).toFixed(2);
                item.variants_length_formatted = item.variants.length > 0 && (
                    <div className="table-row-variants-link">
                        {item.variants.length > 1 ? item.variants.length + " variants" : "-"}
                    </div>);

                item.children = [];
                if (variantItems.length > 0) {
                    for (let i = 0; i < variantItems.length; i++) {
                        let varItem = variantItems[i];
                        let salePriceFormatted = item.prices.sale_price && parseFloat(item.prices.sale_price).toFixed(2);
                        item.children.push(
                            {
                                sku: varItem.sku,
                                category: item.category_name,
                                sale_price: salePriceFormatted,
                                quantity: item.quantity,
                                variants: "",
                            });
                    }
                }

            }

        }

        if (tableType === "products-bundles-listing") {
            for (let i = 0; i < tableData.length; i++) {
                let item = tableData[i];
                let bundleItems = item.bundle_items ? [...item.bundle_items] : [];

                let lastCategory = "";
                let categoriesLength = item.categories ? item.categories.length : [];
                if(categoriesLength > 0) { 
                    lastCategory = item.categories[categoriesLength - 1];
                }
                item.category_name =  lastCategory && lastCategory.name;
                item.sale_price_formatted = item.prices.sale_price && parseFloat(item.prices.sale_price).toFixed(2);

                item.children = [];
                if (bundleItems.length > 0) {
                    for (let i = 0; i < bundleItems.length; i++) {
                        let bundleItem = bundleItems[i];
                        let lastCategoryInner = "";
                        let categoriesLength = item.categories ? item.categories.length : [];
                        if(categoriesLength > 0) { 
                            lastCategoryInner = item.categories[categoriesLength - 1];
                        }
                        let salePriceFormatted = bundleItem.prices.sale_price && parseFloat(bundleItem.prices.sale_price).toFixed(2);
                        item.children.push(
                            {
                                name: bundleItem.name,
                                sku: bundleItem.sku,
                                category: lastCategoryInner && lastCategoryInner.name,
                                quantity: bundleItem.quantity,
                                sale_price: salePriceFormatted,
                            });
                    }
                }

            }

        }

        /*--------------------------setting menu option-------------------------*/
        setTableData(tableData.slice(0, perPageNo));
        setcurrentPageNumber(props.currentPageIndex);
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
        // API call with page number (ie. id)
        //console.log(id);
        props.onClickPageChanger(id);
    }



    let tableColumns = [];
    if (tableType === "products-listing") {
        tableColumns = [
            {
                "title": "Product Name",
                "accessor": "product_name_formatted",
                children: [
                    {
                        title: "SKU",
                        accessor: "sku",
                    },
                    {
                        title: "Category",
                        accessor: "category"
                    },
                    {
                        title: "Quantity",
                        accessor: "quantity",
                    },
                    {
                        title: "",
                        accessor: "variants",
                    },
                    {
                        title: "sale Price",
                        accessor: "sale_price",
                    },
                ],
            },
            {
                "title": "Category",
                "accessor": "category_name",
            },
            {
                "title": "QTY",
                "accessor": "quantity",
            },
            {
                "title": "Variants",
                "accessor": "variants_length_formatted",
            },
            {
                "title": "Sale Price",
                "accessor": "sale_price_formatted",
            },

        ];
    }
    if (tableType === "products-bundles-listing") {
        tableColumns = [
            {
                "title": "Product Name",
                "accessor": "name",
                children: [
                    {
                        title: "Name",
                        accessor: "sku",
                    },
                    {
                        title: "SKU",
                        accessor: "sku",
                    },
                    {
                        title: "Category",
                        accessor: "category"
                    },
                    {
                        title: "Quantity",
                        accessor: "quantity",
                    },
                    {
                        title: "sale Price",
                        accessor: "sale_price",
                    },
                ],
            },
            {
                "title": "Sku",
                "accessor": "sku",
            },
            {
                "title": "Category",
                "accessor": "category_name",
            },
            {
                "title": "QTY",
                "accessor": "quantity",
            },
            {
                "title": "Sale Price",
                "accessor": "sale_price_formatted",
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

export default ProductsTable;

