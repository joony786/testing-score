import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "../../style.scss";

// components
import ButtonBack from "../../../../atoms/button_back";
import * as StockApiUtil from "../../../../../utils/api/stock-api-utils";
import * as Helpers from "../../../../../utils/helpers/scripts";
import CustomButtonWithIcon from "../../../../atoms/button_with_icon";
import SwitchOutlet from "../../../../atoms/switch_outlet";
import StockNestedProductsTable from "../../../../organism/table/stock/stockNestedProductsTable";



function ViewReturnStock(props) {

    const [productsTableData, setProductsTableData] = useState([]);
    const [productsTotalQuantity, setProductsTotalQuantity] = useState(0);
    const history = useHistory();
    const { match = {} } = props;
    const { returnId = {} } = match !== undefined && match.params;
    let mounted = true;


    useEffect(() => {
        window.scrollTo(0, 0);
        if (returnId !== undefined) { getStockReturnById(returnId); }
        else {
            return popPage();
        }
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            mounted = false;
        }
    }, []);



    const getStockReturnById = async (returnId, pageLimit = 10, pageNumber = 1) => {
        document.getElementById('app-loader-container').style.display = "block";
        const getStockReturnResponse = await StockApiUtil.getStockReturnByIdData(returnId, pageLimit, pageNumber);
        if (getStockReturnResponse.hasError) {
            document.getElementById('app-loader-container').style.display = "none";
            showAlertUi(true, getStockReturnResponse.errorMessage);  //imp
            return delayPopPage();
        }
        else {
            if (mounted) {     //imp if unmounted
                var products = getStockReturnResponse.return.data[0].products;
                setProductsTableData(products);
                calculateProductsTotalQuantity([...products]);
                document.getElementById('app-loader-container').style.display = "none";
            }

        }
    }

    const calculateProductsTotalQuantity = (data) => {
        var productsTotalQuantity = 0;
        const newData = [...data];
        newData.forEach(item => {
            productsTotalQuantity = productsTotalQuantity + parseFloat(item.quantity || 0);
        });
        setProductsTotalQuantity(productsTotalQuantity);
    }

    const showAlertUi = (show, errorText) => {
        Helpers.showAppAlertUiContent(show, errorText);
    }

    const popPage = () => {
        history.goBack();
    };

    const delayPopPage = () => {
        setTimeout(() => {
            history.goBack();
        }, 2000);
    };

    const handleDownloadFile = async (event) => {
        event.preventDefault();
        document.getElementById('app-loader-container').style.display = "block";
        var csv = "SKU,Quantity\n";
        var arr = productsTableData;
        arr.forEach(function (row) {
            csv += row.sku + "," + row.quantity + "\n";
        });
        csv += "Total Quantity," +  productsTotalQuantity;
        const fileName = "GRN_" + new Date().toUTCString();
        Helpers.createCSV(fileName, csv);
        document.getElementById('app-loader-container').style.display = "none";
    };

    return (

        <div className="page">
            <div className="page__top">
                <SwitchOutlet />
                <ButtonBack text="Back to Stock Control" link="/stock-control/returned-stock" />
            </div>

            <div className="page__body stock-order-products-container">
                <section className="page__header">
                    <h1 className="heading heading--primary">Returned Stock</h1>
                    <CustomButtonWithIcon
                        size="small"
                        isPrimary={true}
                        text="Download"
                        onClick={handleDownloadFile}
                    />
                </section>
                <section className="page__content stock-add-po">
                    <fieldset className="form__fieldset">
                        <div className="fieldset_switch order-products-title">
                            <h2 className="heading heading--secondary">GRN</h2>
                            <div className="label-stock-count">
                                <label className="mr-10">
                                    {"Total Quantity : "}
                                </label>
                                <label className="mr-50">
                                    {productsTotalQuantity}
                                </label>
                            </div>

                        </div>
                    </fieldset>

                    <div className="page__table">
                        <StockNestedProductsTable
                            tableData={[...productsTableData]}
                            tableType="viewReturnStock"
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ViewReturnStock;
