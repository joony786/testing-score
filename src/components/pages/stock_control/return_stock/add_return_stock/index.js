import React, { useEffect, useState, useReducer } from "react";
import { Input, Switch, AutoComplete, Button, Snackbar } from "@teamfabric/copilot-ui";
import "../../style.scss";
import moment from 'moment';
// components
import ButtonBack from "../../../../atoms/button_back";
import CustomButtonWithIcon from "../../../../atoms/button_with_icon";
import ButtonUpload from "../../../../atoms/button_upload";
import StockNestedProductsTable from "../../../../organism/table/stock/stockNestedProductsTable";
import * as Helpers from "../../../../../utils/helpers/scripts";
import SwitchOutlet from "../../../../atoms/switch_outlet";
import * as StockApiUtil from "../../../../../utils/api/stock-api-utils";
import * as SupplierApiUtil from "../../../../../utils/api/suppliers-api-utils";
import _ from 'lodash';
import { useHistory } from "react-router";


const initialFormValues = {
    returnReferenceName: `Return - ${moment(new Date()).format("yyyy/MM/DD HH:mm:ss")}`,
}
const initialFormErrorsValues = {
    returnReferenceNameError: false,
    supplierError: false,
}
const formReducer = (state, event) => {
    return { ...state, ...event };
}
const formErrorsReducer = (state, event) => {
    return { ...state, ...event };
}

function AddReturnStock() {

    const [formData, setFormData] = useReducer(formReducer, initialFormValues);
    const [formErrorsData, setFormErrorsData] = useReducer(formErrorsReducer, initialFormErrorsValues);
    const { returnReferenceName } = formData;
    const { returnReferenceNameError, supplierError } = formErrorsData;
    const [value, setValue] = useState('');
    const [show, setShow] = useState(false);
    const [registereProductsData, setRegistereProductsData] = useState([]);
    const [productsSearchResult, setProductsSearchResult] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedSearchValue, setSelectedSearchValue] = useState("");
    const [productsTotalQuantity, setProductsTotalQuantity] = useState(0);
    const [productsTableData, setProductsTableData] = useState([]);
    const [productQty, setProductQty] = useState(1);
    const [showInvalidProductAlert, setShowInvalidProductAlert] = useState(false);
    const [showBulkUploadSwitch, setShowBulkUploadSwitch] = useState(false);
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [supplierSearch, setSupplierSearch] = useState('');
    const [supplierDropDown, setSupplierDropDown] = useState(false);
    const [supplierData, setSupplierData] = useState([]);
    const history = useHistory();

    let mounted = true;

    let allProducts = [];
    let allSearchedProducts = [];

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({ [name]: value });
        let inputErrorKey = `${name}Error`;
        setFormErrorsData({
            [inputErrorKey]: false,
        });
    }

    useEffect(() => {
        let pageNumber = 1;
        fetchSupplierData();
        return () => {
            mounted = false;
        }

    }, []);

    const onSupplierSearch = (e) => {
        setSupplierSearch(e.target.value)
        handleSearchSupplier(e.target.value)
        if (e.target.value.length > 0) setSupplierDropDown(true);
    }

    const handleSearchSupplier = (searchValue) => {
        const currValue = searchValue.toLowerCase();
        if (currValue === "") {
            setSupplierData(supplierData);
        } else {
            const filteredData = supplierData.filter((entry) => {
                let searchValue = entry.name;
                searchValue = searchValue.toLowerCase();
                return searchValue.includes(currValue)
            });
            setSupplierData(filteredData);
        }
    }

    const onSelectSupplier = (event) => {
        setFormData({ supplier: event.target.value });
        setSupplierSearch(event.target.innerText)
        setSupplierDropDown(false)
        setFormErrorsData({
            supplierError: false,
        });
    }

    const clearSupplierSearch = (e) => {
        e?.preventDefault();
        setSupplierSearch('');
        setSupplierDropDown(false);
        setFormData({ supplier: {} });
    }

    const fetchSupplierData = async (pageLimit = 50, pageNumber = 1) => {
        document.getElementById('app-loader-container').style.display = "block";
        const suppliersViewResponse = await SupplierApiUtil.viewSuppliers(pageLimit, pageNumber);
        if (suppliersViewResponse.hasError) {
            document.getElementById('app-loader-container').style.display = "none";
            showAlertUi(true, suppliersViewResponse.errorMessage);
        }
        else {
            setSupplierData(suppliersViewResponse.suppliers.data);
            document.getElementById('app-loader-container').style.display = "none";
        }
    }

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    //product search
    const handleChange = e => {
        setSelectedSearchValue(e.target.value);
    }

    const SelectProductOnEnter = async (event) => {
        if (event.key === "Enter") {
            fetchProductsSKUData(selectedSearchValue);
        }
    };

    const fetchProductsSKUData = async (sku) => {
        document.getElementById('app-loader-container').style.display = "block";
        const productsDiscountsViewResponse = await StockApiUtil.getAllProducts(sku);
        if (productsDiscountsViewResponse.hasError) {
            document.getElementById('app-loader-container').style.display = "none";
            showAlertUi(true, productsDiscountsViewResponse.errorMessage);  //imp
        } else {
            if (mounted) {
                const products = productsDiscountsViewResponse.products.data;
                for (let i in products) {
                    const productName = products[i].name;
                    const productSKU = products[i].sku;
                    products[i].searchName = productName + ' / ' + productSKU;
                }
                setRegistereProductsData(products);
                allProducts = products;
                handleSearch(selectedSearchValue);
            }
        }
    }

    const handleSearch = async (value) => {
        setSelectedSearchValue(value);
        let currValue = value;
        currValue = currValue.toLowerCase();
        if (currValue === "") {
            setProductsSearchResult([]);
        }
        else {
            const filteredData = allProducts.filter((entry) => {
                let productSku = entry.searchName.toLowerCase();
                return productSku.includes(currValue);
            });
            setProductsSearchResult(filteredData);
            await delay(1000).then(() => {
                allSearchedProducts = filteredData;
                document.getElementById('app-loader-container').style.display = "none";
            });
            if (allSearchedProducts.length > 0) setShow(true);
        }
    };

    const handleSelect = (e) => {
        let selectedProductId = e.target.value;
        selectedProductId = selectedProductId.toString();
        setSelectedSearchValue(e.target.innerText.toString());               //searchName
        setSelectedProductId(selectedProductId);                 //passes productId
        setShow(false);                                          //imp new ver
        setShowInvalidProductAlert(false);                       //imp new ver  
    };

    const handleAddProduct = () => {
        handleAddProductData(selectedProductId);
        setSelectedSearchValue("");
        setProductsSearchResult([]);
        setSelectedProductId(null);
        setProductQty(1);                             //pro id   new ver
    };

    const handleAddProductData = (selectedProdId) => {
        if (!selectedProdId) {
            setShowInvalidProductAlert(true);                        //imp new ver
            return;
        }
        else {
            setShowInvalidProductAlert(false);                       //imp new ver
        }
        let productExistsCheck = false;
        const index = registereProductsData.findIndex(
            item => selectedProdId === item.id);
        if (index > -1) {
            const selectedItem = JSON.parse(JSON.stringify(registereProductsData[index]));
            productsTableData.forEach((p) => {
                if (p.id === selectedItem.id) {
                    productExistsCheck = true;
                    let inputQtyValue = Helpers.var_check(productQty) ? productQty : 1;
                    p.qty = (parseFloat(p.qty) + parseFloat(inputQtyValue));
                }
            }); //end of for loop

            if (productExistsCheck) {
                calculateProductsTotalQuantity([...productsTableData]);    //imp
                setProductsTableData([...productsTableData]);              //imp
            }
            if (!productExistsCheck) {
                let inputQtyValue = Helpers.var_check(productQty) ? productQty : 1;
                selectedItem.qty = parseFloat(inputQtyValue);
                productsTableData.push(selectedItem);  //new
                calculateProductsTotalQuantity(productsTableData);
            }
        } //end of top first if
    };

    const calculateProductsTotalQuantity = (data) => {
        let productsTotalQuantity = 0;
        const newData = [...data];
        newData.forEach(item => {
            productsTotalQuantity = productsTotalQuantity + parseFloat(item.qty || 0);
        });

        setProductsTotalQuantity(productsTotalQuantity);
    }

    const handleChangeProductsData = (productsData, productsTotalQuantity = 0) => {
        setProductsTableData(productsData);
        setProductsTotalQuantity(productsTotalQuantity);
    };
    
    const handleInputQty = (e) => {
        setProductQty(e.target.value);
    };

    const handleDownloadFile = async (event) => {
        event.preventDefault();
        let csv = "sku,quantity\n";
        csv += "SKU1,0\n";
        const fileName = new Date().toUTCString() + "-Return-Product-SKU";
        Helpers.createCSV(fileName, csv);
    };
    
    const showAlertUi = (show, errorText) => {
        Helpers.showAppAlertUiContent(show, errorText);
    }

    const handleCloseAlert = () => {
        setShow(false);
        setProductsSearchResult([]);
        setShowInvalidProductAlert(false);
    }

    const handleBulkOrderSwitch = (value) => {
        setShowBulkUploadSwitch(value);
    }

    const onBulkFileUpload = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
        fetchProductsData();
    };

    const fetchProductsData = async () => {
        const productsDiscountsViewResponse = await StockApiUtil.downloadSystemProductSampleFile();
        if (productsDiscountsViewResponse.hasError) {
            document.getElementById('app-loader-container').style.display = "none";
            showAlertUi(true, productsDiscountsViewResponse.errorMessage);  //imp
        } else {
            if (mounted) {
                let products = productsDiscountsViewResponse.products.data;
                for (let i in products) {
                    const productName = products[i].name;
                    const productSKU = products[i].sku;
                    products[i].searchName = productName + ' / ' + productSKU;
                }
                setRegistereProductsData(products);
                document.getElementById('app-loader-container').style.display = "none";
            }
        }
    }

    function fileExtention(filename) {
        var parts = filename.split('.');
        return parts[parts.length - 1];
    }

    const handleBulkFileUpload = async (event) => {
        event.preventDefault();
        var file = selectedFile;
        if (file && fileExtention(file.name) === 'csv') {
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = async (evt) => {
                var json = JSON.parse(Helpers.CSV2JSON(evt.target.result));
                let uniqueProducts = [];
                let grouped = _.groupBy(json, function (obj) {
                    return obj.SKU;
                });
                for (let key in grouped) {
                    let sum = grouped[key].reduce(function (accumulator, current) {
                        return parseFloat(accumulator) + parseFloat(current.Quantity);
                    }, 0);
                    if (key) {
                        uniqueProducts.push({ SKU: key, Quantity: sum });
                    }
                }
                var bulkProducts = [];
                uniqueProducts.forEach((v, k) => {
                    registereProductsData.forEach((v2, k2) => {
                        if (v.SKU === v2.sku) {
                            let selectedItemCopy = JSON.parse(JSON.stringify(v2));
                            selectedItemCopy.qty = parseFloat(v.Quantity);
                            bulkProducts.push(selectedItemCopy);
                            return 0;
                        }
                    });
                });  // end of for loop
                calculateProductsTotalQuantity(bulkProducts);
                setProductsTableData([...bulkProducts]);
            }
            reader.onerror = function (evt) {
                showAlertUi(true, 'error reading file');  //imp
            }
        }
        else {
            showAlertUi(true, 'Not a csv file');
        }
    };

    const onFormSubmit = async (event) => {
        event.preventDefault();

        if (productsTableData.length === 0) {
            showAlertUi(true, "No Products Added");
            return;
        }
        if(typeof formData.supplier === 'undefined') {
            showAlertUi(true, "No Supplier Added");
            return;
        }
        document.getElementById('app-loader-container').style.display = "block";
        var returnStockPostData = {};
        var clonedProductsPostData = [];
        productsTableData.forEach((item, index) => {
            clonedProductsPostData.push({ qty: item.qty, product_id: item.id, price: item.prices.sale_price });
        });
        returnStockPostData = {
            name: returnReferenceName,
            date: moment(new Date()).format("yyyy/MM/DD"),
            supplier_id: formData.supplier.toString(),
            is_synced: "1",
            show_id: "0",
            products: clonedProductsPostData
        };
        const res = await StockApiUtil.returnStock(JSON.stringify(returnStockPostData));
        if (res.hasError) {
            document.getElementById('app-loader-container').style.display = "none";
            showAlertUi(true, res.errorMessage);
        }
        else {
            document.getElementById('app-loader-container').style.display = "none";
            setTimeout(() => {
                history.push({
                    pathname: '/stock-control/returned-stock',
                    activeKey: 'returned-stock'
                });
            }, 500);
        }
    }

    return (
        <div className="page">
            <div className="page__top">
                <SwitchOutlet />
                <ButtonBack text="Back to Stock Control" link="/stock-control/returned-stock" />
            </div>


            <div className="page__body">

                <section className="page__header">
                    <h1 className="heading heading--primary">New Return Stock</h1>
                    <CustomButtonWithIcon
                        size="small"
                        isPrimary={true}
                        text="Save"
                        onClick={onFormSubmit} />
                </section>

                <section className="page__content stock-add-po">
                    <form className="form">
                        <fieldset className="form__fieldset">
                            <div className="fieldset_switch">
                                <h2 className="heading heading--secondary">Details</h2>
                            </div>

                            <div className="form__row">
                                <div className="form__input">
                                    <Input
                                        className="primary required"
                                        inputProps={{
                                            disabled: false,
                                            onChange: handleFormChange,
                                            name: "returnReferenceName",
                                            value: returnReferenceName,
                                        }}
                                        width="100%"
                                        label="*Name / reference"
                                        errorReturnReferenceName="Field Is Required"
                                        error={returnReferenceNameError}
                                    />

                                </div>
                                <div className="form__input">
                                    <AutoComplete
                                        inputProps={{
                                            icon: "Search",
                                            className: "search-autocomplete",
                                            isFloatedLabel: false,
                                            boxed: false,
                                            errorMessage: "Field Is Required",
                                            error: supplierError,
                                            inputProps: {
                                                placeholder: "*Select Supplier",
                                                onChange: (e) => onSupplierSearch(e),
                                                value: supplierSearch,
                                                boxed: true,
                                                //onKeyDown: SelectProductOnEnter,   //no need now
                                                onFocus: (event) => {
                                                    console.log(event);
                                                    setSupplierDropDown(true)
                                                },
                                            },
                                        }}
                                        autoCompleteProps={{
                                            data: {},
                                            isLoading: false,
                                            show: supplierDropDown,
                                            toggleSearchAll: true,
                                            className: "search-autocomplete-popup",
                                            onSearchAll: (event) => console.log(event),
                                            onSelect: (data) => console.log(data, "data..."),
                                            onClearSearch: (event, iconState) => {
                                                clearSupplierSearch(event);
                                            },
                                            onEscPress: (e) => setSupplierDropDown(false),
                                            onBodyClick: (e) => setSupplierDropDown(false),
                                        }}
                                        children={
                                            <div>
                                                <ul>
                                                    {supplierData && supplierData.map((item) => (
                                                        <li key={item.id}
                                                            value={item.id}
                                                            onClick={onSelectSupplier}
                                                            className="products-search-list-item"
                                                        >
                                                            {item.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        }
                                    />
                                </div>
                            </div>


                        </fieldset>

                        <fieldset className="form__fieldset">
                            <div className="fieldset_switch">
                                <h2 className="heading heading--secondary">Bulk Order</h2>
                                <Switch initialState={false} ontoggle={handleBulkOrderSwitch} />
                            </div>

                            {showBulkUploadSwitch &&
                                <div className="form__row" style={{ marginBottom: "1rem" }}>
                                    <div className="form__input">
                                        <ButtonUpload text="Upload Products File"
                                            uploadHandler={onBulkFileUpload} />
                                    </div>

                                    <div className="form__input">
                                        <Button
                                            size="small"
                                            isPrimary={true}
                                            text="Download sample File"
                                            icon="Import"
                                            onClick={handleDownloadFile}
                                        />
                                    </div>
                                </div>}

                            {showBulkUploadSwitch &&
                                <>
                                    {isFilePicked ? (
                                        <div>
                                            <p>Filename: {selectedFile.name}</p>
                                        </div>
                                    ) : (
                                        <p>Select a file to show details</p>

                                    )}
                                </>
                            }

                            {showBulkUploadSwitch &&
                                <div className="form__row" >
                                    <div className="form__input">
                                        <CustomButtonWithIcon
                                            size="medium"
                                            isPrimary={true}
                                            text="Done"
                                            onClick={handleBulkFileUpload}
                                        />
                                    </div>
                                </div>}
                        </fieldset>
                    </form>
                </section>
            </div>

            <div className="page__body stock-order-products-container">
                <section className="page__content stock-add-po">
                    <fieldset className="form__fieldset">
                        <div className="fieldset_switch order-products-title">
                            <h2 className="heading heading--secondary">Order Products</h2>
                            <label className="label-stock-count">
                                {productsTotalQuantity}
                            </label>
                        </div>

                        <Snackbar
                            dismissable
                            height="35px"
                            kind="alert"
                            label="Please select a Product!"
                            onDismiss={handleCloseAlert}
                            show={showInvalidProductAlert}
                            width="30%"
                            withIcon
                            
                        />
                        <div className="form__row order-products">
                            <AutoComplete
                                inputProps={{
                                    icon: 'Search',
                                    className: 'search-autocomplete',
                                    isFloatedLabel: false,
                                    boxed: true,
                                    inputProps: {
                                        placeholder: 'Search by SKU Number',
                                        onChange: e => handleChange(e),
                                        value: selectedSearchValue,
                                        boxed: true,
                                        onKeyDown: SelectProductOnEnter,
                                    },
                                }}

                                autoCompleteProps={{
                                    data: {},
                                    isLoading: false,
                                    show: show,
                                    toggleSearchAll: true,
                                    className: 'stock-autocomplete-popup',
                                    onSearchAll: event => console.log(event),
                                    onSelect: data => console.log(data, 'data...'),
                                    onClearSearch: (event, iconState) => {
                                        setShow(false)
                                        setSelectedSearchValue("")
                                    },
                                    onEscPress: () => setShow(false),
                                    onBodyClick: () => setShow(false),
                                }}

                                children={
                                    <div>
                                        <ul>
                                            {productsSearchResult && productsSearchResult.map((item) => (
                                                <li key={item.id}
                                                    value={item.id}
                                                    onClick={handleSelect}
                                                    className="products-search-list-item"
                                                >
                                                    {item.searchName}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                }

                            />

                            <div className="form__input">
                                <Input
                                    className="primary"
                                    inputProps={{
                                        disabled: false,
                                        value: productQty,
                                        onChange: handleInputQty,
                                        type: "text"
                                    }}
                                    maskOptions={{
                                        regex: '[0-9]*'
                                      }}
                                    label="Quantity"
                                />
                            </div>
                            <CustomButtonWithIcon
                                text="Add"
                                iconName="Add"
                                isPrimary={true}
                                onClick={handleAddProduct}
                            />
                        </div>
                    </fieldset>


                    <div className="page__table add-po">
                        <StockNestedProductsTable
                            tableData={[...productsTableData]}
                            onChangeProductsData={handleChangeProductsData}
                            tableType="addReturnStock"
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AddReturnStock;
