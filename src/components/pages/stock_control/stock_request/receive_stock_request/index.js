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
import moment from "moment";


const dateFormat = "YYYY-MM-DD";

function ReceiveStockRequest(props) {

    const [productsTableData, setProductsTableData] = useState([]);
    const [viewStockRequestData, setViewStockRequestData] = useState([]);
    const [productsTotalQuantity, setProductsTotalQuantity] = useState(0);
    const history = useHistory();
    const { match = {} } = props;
    const { requestId = {} } = match !== undefined && match.params;
    let mounted = true;


    useEffect(() => {
        window.scrollTo(0, 0);
        if (requestId !== undefined) { getStockRequestById(requestId); }
        else {
            return popPage();
        }
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            mounted = false;
        }
    }, []);



    const getStockRequestById = async (requestId, pageLimit = 10, pageNumber = 1) => {
        document.getElementById('app-loader-container').style.display = "block";
        const getStockRequestResponse = await StockApiUtil.getStockRequestById(requestId, pageLimit, pageNumber);
        if (getStockRequestResponse.hasError) {
            document.getElementById('app-loader-container').style.display = "none";
            showAlertUi(true, getStockRequestResponse.errorMessage);  //imp
            return delayPopPage();
        }
        else {
            if (mounted) {     //imp if unmounted
                var products = getStockRequestResponse.transfer.products;
                setProductsTableData(products);
                setViewStockRequestData(getStockRequestResponse.transfer);
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

    const handleReceiveStockRequest = async () => {
        document.getElementById('app-loader-container').style.display = "block";
        const stockRequestViewResponse = await StockApiUtil.receivedRequestInventoryOrder(viewStockRequestData.id, "recieved", moment(new Date()).format(dateFormat));
        if (stockRequestViewResponse.hasError) {
          document.getElementById('app-loader-container').style.display = "none";
          showAlertUi(true, stockRequestViewResponse.errorMessage);  //imp
        } else {
          document.getElementById('app-loader-container').style.display = "none";
          history.push({
            pathname: '/stock-control/stock-request',
            activeKey: 'stock-request'
          });
        }
      }


    return (

        <div className="page">
            <div className="page__top">
                <SwitchOutlet />
                <ButtonBack text="Back to Stock Control" link="/stock-control/stock-request" />
            </div>

            <div className="page__body stock-order-products-container">
                <section className="page__header">
                    <h1 className="heading heading--primary">Stock Request In</h1>
                    <CustomButtonWithIcon
                        size="small"
                        isPrimary={true}
                        text="Receive"
                        onClick={handleReceiveStockRequest}
                    />
                </section>
                <section className="page__content stock-add-po">
                    <fieldset className="form__fieldset">
                        <div className="fieldset_switch order-products-title">
                            <h2 className="heading heading--secondary">Details</h2>
                        </div>
                        <div className="fieldset_switch order-products-title">
                            <span className="label-stock-count lh-35">
                                Name / reference: {viewStockRequestData.title}
                                <br />
                                Transfer date: {moment(viewStockRequestData.date).format(dateFormat)}
                                <br />
                                Source oulet: {viewStockRequestData.from_store}
                            </span>
                        </div>
                    </fieldset>

                    <fieldset>
                    <div className="fieldset_switch order-products-title">
                            <h2 className="heading heading--secondary">Receive products</h2>
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
                            tableType="viewRequestStock"
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ReceiveStockRequest;
