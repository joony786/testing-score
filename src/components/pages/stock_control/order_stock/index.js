import {
    AutoComplete, Checkbox, Input, Modal,
    Snackbar
} from "@teamfabric/copilot-ui";
import React, {useEffect, useState} from "react";
import * as ProductsApiUtil from "../../../../utils/api/products-api-utils";
import * as Helpers from "../../../../utils/helpers/scripts";
// components
import ButtonBack from "../../../atoms/button_back";
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import CustomFlyout from "../../../atoms/flyout";
import SwitchOutlet from "../../../atoms/switch_outlet";
import StockNestedVariantsProductsTable
    from "../../../organism/table/stock/stockNestedVariantsProductsTable";
import "../style.scss";
import OrderForm from "./order_form";
import {returnScanType, SearchDataWithoutScan} from "./order_stock_utlis";
import {viewSuppliers} from "../../../../utils/api/suppliers-api-utils";
import StockNestedOrderProductsTable from "../../../organism/table/stock/stockNestedOrderProductsTable";

//let data = Helpers.dummyTableData;
let currentScanType = "without-scan";

function OrderStock() {

    const [boxData, setBoxData] = useState('')

    const [show, setShow] = useState(false);
    const [showSupplier, setShowSupplier] = useState(false)
    const [registereProductsData, setRegistereProductsData] = useState([]);
    const [productsSearchResult, setProductsSearchResult] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedSearchValue, setSelectedSearchValue] = useState("");
    const [productsTotalQuantity, setProductsTotalQuantity] = useState(0);
    const [productsTableData, setProductsTableData] = useState([]);
    const [productQty, setProductQty] = useState(1);
    const [editProductOrderedQty, setEditProductOrderedQty] = useState("1");
    const [editProductSalePrice, setEditProductSalePrice] = useState("");
    const [editProduct, setEditProduct] = useState(null);
    const [scanCheckedType1, setScanCheckedType1] = useState("");
    const [scanCheckedType2, setScanCheckedType2] = useState("");
    const [scanCheckedType3, setScanCheckedType3] = useState("without-scan");
    const [showInvalidProductAlert, setShowInvalidProductAlert] = useState(false);
    const [showVariantsModal, setShowVariantsModal] = useState(false);
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [skuData, setSkuData] = useState([]);
    const [supplierData, setSupplierData] = useState([])


    const [scanBoxparentSku, setScanBoxparentSku] = useState("");


    let mounted = true;

    //without-scan ===> input change handler
    const handleChange = ({target: {value}}) => {
        console.log(value);
        //setValue(value)
        setSelectedSearchValue(value);
        handleSearch(value);
        if (value.length > 0) setShow(true);
    };


    const renderEditProductModalContent = () => {
        return (
            <>
                <h2 style={{marginBottom: "3rem"}}>
                    {`Edit Ordered Quantity For " ${editProduct.name}" `}
                </h2>

                <Input
                    className="primary"
                    inputProps={{
                        disabled: false,
                        value: editProductOrderedQty,
                        onChange: handleEditOrderedInputQty,
                        type:'text'
                    }}
                    label="Ordered Quantity"
                   
                    maskOptions={{
                  regex: '[0-9]*'
                }}
                />

                <Input
                    className="primary"
                    inputProps={{
                        disabled: false,
                        value: editProductSalePrice,
                        onChange: handleEditProductSalePrice,
                        type:'text'
                    }}
                    label="Sale Price"
                    maskOptions={{
                  regex: '[0-9]*'
                }}
                />
            </>
        );
    };


// scan-box modal
    const renderModalContent = () => {
        return <StockNestedVariantsProductsTable onChangeProductsData={handleChangeProductsData} setShowVariantsModal={setShowVariantsModal}
                                                 tableData={skuData}/>;
    };

    const handleTableMenuItemClick = (productId, product, itemLabel) => {
        console.log(product, 'pppppp12');
        console.log(itemLabel);
        if (itemLabel === "Edit") {
            console.log(productsTableData);
            setEditProduct(product); //imp
            setShowEditProductModal(true);
            setEditProductOrderedQty(product.qty); //vvimp
            setEditProductSalePrice(product.sale_price);
            // calculatePriceChange([...productsTableData])
        } else if (itemLabel === "Delete") {
            //setEditProduct(product);
            console.log("inside",productId);
            console.log(productsTableData);

            const index = productsTableData.findIndex(
                (item) => productId === item.id
            );
            if (index > -1) {
                //const item = newData[index];
                console.log("found");
                productsTableData.splice(index, 1);
                calculateProductsTotalQuantity([...productsTableData]);
                setProductsTableData([...productsTableData]);
            }
        }
    };

    const renderVariantsTableEditContent = (product) => {
        console.log(product, 'ppppProduct');
        console.log(product.id);
        console.log(currentScanType);
        console.log(productsTableData);
        // let menuOption = []
        let menuOption = returnScanType(currentScanType)
        return (
            <>
                <CustomFlyout
                    propId={product.id}
                    propObj={product}
                    menuItems={menuOption}
                    menuItemClick={handleTableMenuItemClick}
                />
            </>
        );
    };

    const handleCloseModal = () => {
        setShowVariantsModal(false);
    };

    const handleClosEditProductModal = () => {
        setShowEditProductModal(false);
        setEditProductOrderedQty("");
        setEditProductSalePrice("");
        setEditProduct(null);
    };

    useEffect(() => {
        console.log("use-effect");
        fetchRegisteredProductsData().then(r => r);
        fetchSuppliersData().then(r => r)
        return () => {
            mounted = false;
        };
    }, []);

    const fetchSuppliersData = async () => {
        let limit = 10;
        let pageNumber = 1;
        const supplier = await viewSuppliers(limit, pageNumber)
        if (supplier.status === true) {
            if (mounted) {
                let {suppliers: {data}} = supplier
                setSupplierData(data)
            }
        }
    }

    const fetchRegisteredProductsData = async () => {
        document.getElementById("app-loader-container").style.display = "block";
        const productsDiscountsViewResponse =
            await ProductsApiUtil.getFullRegisteredProducts();
        console.log(
            " productsDiscountsViewResponse:",
            productsDiscountsViewResponse
        );

        if (productsDiscountsViewResponse.hasError) {
            console.log(
                "Cant fetch registered products Data -> ",
                productsDiscountsViewResponse.errorMessage
            );
            //message.warning(productsDiscountsViewResponse.errorMessage, 3);
            document.getElementById("app-loader-container").style.display = "none";
        } else {
            console.log("res -> ", productsDiscountsViewResponse);

            if (mounted) {
                /*-------for filtering products--------*/
                const products =
                    productsDiscountsViewResponse.products.data ||
                    productsDiscountsViewResponse.products;
                setRegistereProductsData(products);

                /*-------for filtering products--------*/
                document.getElementById("app-loader-container").style.display = "none";
            }
        }
    };


// Search data for without-scan
    const handleSearch = async (value) => {
        const data = await SearchDataWithoutScan(value)
        setProductsSearchResult(data)
    };

    const handleInputQty = (e) => {
        console.log(e.target.value);
        setProductQty(e.target.value);
    };

    const handleInputParentSku = ({target: {value}}) => {
        setScanBoxparentSku(value);
    };

    const handleEnterInputParentSku = async (event) => {
        //console.log(event);

        if (event.key === "Enter") {
            console.log(" enter");
            console.log(scanBoxparentSku, 'scane ==='); //imp new searched value
            const fetchedBySku = await ProductsApiUtil.fetchProductBySku(scanBoxparentSku, 20, 1,)
            if (fetchedBySku.status === true) {
                console.log(fetchedBySku.products.data, 'fetched');
                setSkuData(fetchedBySku.products.data[0])

                const index = fetchedBySku?.products?.data.findIndex(
                    (item) => scanBoxparentSku.toLowerCase() === item.sku.toLowerCase()
                );
                console.log(index, 'scane == enter');
                if (index > -1) {
                    //deep copy
                    const selectedItem = fetchedBySku?.products?.data[index];
                    console.log(selectedItem, 'scane == item');

                    if (currentScanType === "scan-box") {
                        console.log("imp-unique-parent-sku", selectedItem);
                        if (Helpers.var_check_updated(selectedItem.variants)) {
                            let productVariants = selectedItem.variants;
                            console.log(productVariants, 'sku')
                            // for (let i = 0; i < productVariants.length; i++) {
                            //   let pro = productVariants[i];
                            //   pro.qty = 1;
                            //   pro.menu = renderVariantsTableEditContent(pro);
                            // }
                            // setVariantsData(productVariants);
                            /*-------------------------new ver--------------------------*/
                            setShowVariantsModal(true); //imp new one
                        }
                        setScanBoxparentSku("");
                    }

                    if (currentScanType === "scan-one-by-one") {
                        console.log("imp-item-sku-only", selectedItem.id);
                        handleAddSkuProductData(selectedItem)
                        setScanBoxparentSku("");
                    }
                } else {
                    //console.log("not found");
                }
            } else {
                //console.log("not enter");
            }
        }
    };


    const handleEditOrderedInputQty = (e) => {
        setEditProductOrderedQty(e.target.value);
    };

    const handleEditProductSalePrice = (e) => {
        setEditProductSalePrice(e.target.value);
    };

    const resetFieldsData = () => {
        setSelectedSearchValue("");
        setShow(false);
        setShowInvalidProductAlert(false);
        setProductsSearchResult([]);
        setSelectedProductId(null);
        //setProductsTableData([]);
        setProductsTableData([]);
        setProductsTotalQuantity(0);
    };

    const handleRadioButton = (e) => {
        let checkedValue = e.target.value;

        currentScanType = e.target.value;

        if (checkedValue === "scan-box") {
            setScanCheckedType1(checkedValue);
            setScanCheckedType2("");
            setScanCheckedType3("");
            resetFieldsData(); //imp
        } else if (checkedValue === "scan-one-by-one") {
            setScanCheckedType2(checkedValue);
            setScanCheckedType1("");
            setScanCheckedType3("");
            resetFieldsData();
        } else if (checkedValue === "without-scan") {
            setScanCheckedType3(checkedValue);
            setScanCheckedType1("");
            setScanCheckedType2("");
            resetFieldsData();
        }

        //setScanCheckedType(e.target.value);
        //inputEl.current.checked();
    };

    const handleSelect = (item) => {
        // setProductsTableData(prevState => [...prevState, item] );
        setProductsTableData([...productsTableData])
        //console.log(option.children);
        setSelectedSearchValue(item.name); //searchName
        setSelectedProductId(item.id.toString()); //passes productId
        setShow(false); //imp new ver
        setShowInvalidProductAlert(false); //imp new ver
    };

    const handleAddProduct = () => {
        handleAddProductData(selectedProductId);
        setSelectedSearchValue("");
        setProductsSearchResult([]);
        setSelectedProductId(null); //pro id   new ver
        setProductQty(1)

    };


    // edit box modal
    const handleSaveEditProduct = () => {
        let productExistsCheck = false;

        productsTableData.forEach((p) => {
            if (p.id === editProduct.id) {
                productExistsCheck = true;
                p.qty = parseFloat(editProductOrderedQty);
                p.prices.sale_price = parseFloat(editProductSalePrice);
                console.log(p.qty);
                console.log(p.sale_price, 'ppppSale');
            }
        });

        if (productExistsCheck) {
            calculateProductsTotalQuantity([...productsTableData]);
            // calculatePriceChange([...productsTableData])
            setProductsTableData([...productsTableData]);

            setShowEditProductModal(false);
            setEditProductOrderedQty("");
            setEditProductSalePrice("");
            setEditProduct(null);
        }
    };

    //without-scan add data to table
    const handleAddProductData = (selectedProdId) => {
        if (!selectedProdId) {
            setShowInvalidProductAlert(true);
            return;
        } else {
            setShowInvalidProductAlert(false);
        }
        let productExistsCheck = false;
        const index = productsSearchResult.findIndex(
            (item) => selectedProdId === item.id
        );
        if (index > -1) {
            const selectedItem = productsSearchResult[index]
            productsTableData.forEach((p) => {
                console.log(p, 'found p inside foreach');
                if (p.id === selectedItem.id) {
                    productExistsCheck = true;
                    let inputQtyValue = Helpers.var_check(productQty) ? productQty : 1;
                    p.qty = parseFloat(p.qty) + parseFloat(inputQtyValue);
                    console.log(p.qty);
                }
            });

            if (productExistsCheck) {
                calculateProductsTotalQuantity([...productsTableData]); //imp
                setProductsTableData([...productsTableData]);              //imp
            }
            if (!productExistsCheck) {
                let inputQtyValue = Helpers.var_check(productQty) ? productQty : 1;
                selectedItem.qty = parseFloat(inputQtyValue);
                /*----------------------setting menu option-----------------------------*/
                selectedItem.menu = renderVariantsTableEditContent(selectedItem);

                /*--------------------------setting menu option-------------------------*/
                productsTableData.push(selectedItem);
                calculateProductsTotalQuantity(productsTableData);
                //setProductsTableData(newData);  //prev
            }


        }
        if (selectedProdId.id) {
            setSelectedSearchValue("");
            setProductsSearchResult([]);
            setSelectedProductId(null); //pro id   new ver
        }
    };

    // Scan one-by-one add data to table
    const handleAddSkuProductData = (selectedProd) => {
        console.log(selectedProd)
        let productExistsCheck = false

        selectedProd.qty = Number(1);
        selectedProd.menu = renderVariantsTableEditContent(selectedProd);
        if (productsTableData) {
            productsTableData.forEach((p) => {
                console.log(p, 'found p inside foreach');
                if (p.id === selectedProd.id) {
                    productExistsCheck = true;
                    let inputQtyValue = Helpers.var_check(productQty) ? productQty : 1;
                    p.qty = parseFloat(p.qty) + parseFloat(inputQtyValue);
                }
            });
            if (productExistsCheck) {
                calculateProductsTotalQuantity([...productsTableData]); //imp
                setProductsTableData([...productsTableData]);              //imp
            }
        }
        if (!productExistsCheck) {
            productsTableData.push(selectedProd);
            calculateProductsTotalQuantity(productsTableData);
        }
        setSelectedSearchValue("");
        setProductsSearchResult([]);
        setSelectedProductId(null); //pro id   new ver
    };


    const calculateProductsTotalQuantity = (data) => {
        let productsTotalQuantity = 0;
        const newData = [...data];
        newData.forEach((item) => {
            productsTotalQuantity = productsTotalQuantity + parseFloat(item.qty || 0);
        });

        setProductsTotalQuantity(productsTotalQuantity);
    };

    const handleCloseAlert = () => {
        setShowInvalidProductAlert(false);
    };


    const handleChangeProductsData = (data,qty) => {
        console.log(data, 'incomming');
        let d = [data]
        // d.forEach((item,index)=> {
        //     d[index].children = item.variants
        // })
        data.children = [];
                if (data.variants.length > 0) {
                    for (let i = 0; i < data.variants.length; i++) {
                        let varItem = data.variants[i];
                        // console.log(varItem);
                        // const salePriceFormatted = varItem.prices.sale_price && parseFloat(data.prices.sale_price).toFixed(2);
                        // const purchasePriceFormatted = varItem.prices.cost_price && parseFloat(data.prices.cost_price).toFixed(2);
                        const salePriceFormatted = varItem.prices.sale_price 
                        const purchasePriceFormatted = varItem.prices.cost_price
                        data.children.push(
                            {
                                sku: varItem.sku,
                                qty: varItem.qty,
                                sale_price: salePriceFormatted,
                                purchase_price: purchasePriceFormatted,
                                menu: renderVariantsTableEditContent(data)
                                
                            });
                    }
                }
        // data.children = data.variants
        data.menu = renderVariantsTableEditContent(data);
        setBoxData(data)
    }
    const handleAddBoxData = () => {
        let productExistsCheck = false;
        if (productsTableData) {
            productsTableData.forEach((p) => {
                if (p.id === boxData.id) {
                    productExistsCheck = true;
                    p.qty = parseFloat(p.qty) + parseFloat(boxData.qty);
                }
            });
            if (productExistsCheck) {
                calculateProductsTotalQuantity([...productsTableData]);
                setProductsTableData([...productsTableData]);
            }
        }
        if (!productExistsCheck) {
            productsTableData.push(boxData);
            calculateProductsTotalQuantity(productsTableData);
        }
        setSelectedSearchValue("");
        setProductsSearchResult([]);
        setSelectedProductId(null);
        setShowVariantsModal(false)
    }
    let checkedValue = {
        scanCheckedType1,
        scanCheckedType2,
        scanCheckedType3
    }
    return (
        <div className="page">
            <div className="page__top">
                <SwitchOutlet/>
                <ButtonBack text="Back to Stock Control" link="/stock-control/purchase-orders"/>
            </div>

            <div className="page__body">
                {/*<section className="page__header">*/}
                {/*    <div className="form__row">*/}
                {/*        <div className="form__input">*/}
                {/*            <Checkbox*/}
                {/*                label="Scan Box"*/}
                {/*                onChange={handleRadioButton}*/}
                {/*                value="scan-box"*/}
                {/*                className="scan-check-button"*/}
                {/*                checked={scanCheckedType1 === "scan-box"}*/}
                {/*            />*/}
                {/*        </div>*/}
                {/*        <div className="form__input">*/}
                {/*            <Checkbox*/}
                {/*                label="Scan one by one"*/}
                {/*                onChange={handleRadioButton}*/}
                {/*                value="scan-one-by-one"*/}
                {/*                className="scan-check-button"*/}
                {/*                //ref={inputEl}*/}
                {/*                checked={scanCheckedType2 === "scan-one-by-one"}*/}
                {/*            />*/}
                {/*        </div>*/}
                {/*        <div className="form__input">*/}
                {/*            <Checkbox*/}
                {/*                label="Without Scan"*/}
                {/*                onChange={handleRadioButton}*/}
                {/*                value="without-scan"*/}
                {/*                className="scan-check-button"*/}
                {/*                checked={scanCheckedType3 === "without-scan"}*/}
                {/*            />*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</section>*/}


                <OrderForm productsTableData={productsTableData}  showSupplier={showSupplier}
                           setShowSupplier={setShowSupplier} supplierData={supplierData}
                           setProductsTotalQuantity={setProductsTotalQuantity}
                           setProductsTableData={setProductsTableData}
                           checkedValue={checkedValue}
                />


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
                            height="60px"
                            kind="alert"
                            label="Please select a Product!"
                            onDismiss={handleCloseAlert}
                            show={showInvalidProductAlert}
                            width="300px"
                            withIcon
                        />

                        <div className="form__row order-products">
                            {currentScanType === "without-scan" && (
                                <AutoComplete
                                    inputProps={{
                                        icon: "Search",
                                        className: "search-autocomplete",
                                        isFloatedLabel: false,
                                        boxed: true,
                                        inputProps: {
                                            placeholder: "Search by Name",
                                            onChange: (e) => handleChange(e),
                                            value: selectedSearchValue,
                                            boxed: true,

                                        },
                                    }}
                                    autoCompleteProps={{
                                        data: {},
                                        isLoading: false,
                                        show: show,
                                        toggleSearchAll: true,
                                        className: "stock-autocomplete-popup",
                                        onSearchAll: (event) => console.log(event, 'event'),
                                        onSelect: (data) => console.log(data, "data..."),
                                        onClearSearch: (event, iconState) => {
                                            console.log(event, iconState, "event");
                                            setShow(false);
                                            setSelectedSearchValue("");
                                        },
                                        onEscPress: () => setShow(false),
                                        onBodyClick: () => setShow(false),
                                    }}
                                    children={
                                        <div>
                                            <ul>
                                                {productsSearchResult &&
                                                productsSearchResult.map((item) => {
                                                    return (
                                                        <li
                                                            key={item.id}
                                                            value={item.id}
                                                            onClick={() => handleSelect(item)}
                                                            className="products-search-list-item"
                                                        >
                                                            {item.name}
                                                        </li>
                                                    )
                                                })
                                                }
                                            </ul>
                                        </div>
                                    }
                                />
                            )}

                            {(currentScanType === "scan-box" ||
                                currentScanType === "scan-one-by-one") && (
                                <div className="form__input">
                                    <Input
                                        className="search-local"
                                        icon="Search"
                                        inputProps={{
                                            boxed: false,
                                            placeholder: "Input Sku",
                                            value: scanBoxparentSku,
                                            onChange: handleInputParentSku,
                                            onKeyDown: handleEnterInputParentSku,
                                        }}
                                        kind="sm"
                                        label=""
                                        //width="350px"
                                    />
                                </div>
                            )}

                            {currentScanType === "without-scan" && (
                                <Input
                                    className="primary"
                                    inputProps={{
                                        disabled: false,
                                        value: productQty,
                                        onChange: handleInputQty,
                                        type:'text'
                                    }}
                                    label="Quantity"
                                    maskOptions={{
                  regex: '[0-9]*'
                }}
                                />
                            )}

                            {currentScanType === "without-scan" && (
                                <CustomButtonWithIcon
                                    text="Add"
                                    iconName="Add"
                                    //theme="dark"
                                    isPrimary={true}
                                    //isLoading={false}
                                    onClick={handleAddProduct}
                                />
                            )}
                        </div>


                    </fieldset>

                    <div className="page__table add-po">
                        <StockNestedOrderProductsTable
                            tableData={[...productsTableData]}
                            //  onChangeProductsData={handleChangeProductsData}
                            //tableType="order_stock"
                            //currency={userLocalStorageData.currency.symbol}             //imp prev ver
                            //currency={outletData ? outletData.currency_symbol : ""}       //imp new ver
                        />
                    </div>

                    {/*------------------------edit column-value--modal---------------------------*/}
                    {showEditProductModal && editProduct && (
                        <Modal
                            //headerText={`Edit Ordered Quantity For ${editProduct.product_name}`}
                            headerButtons={[]}
                            height="150px"
                            onBackdropClick={handleClosEditProductModal}
                            onClose={handleClosEditProductModal}
                            padding="20px 40px 20px 40px"
                            render={renderEditProductModalContent}
                            className="edit-product-ordered-qty-modal"
                            showCloseButton
                            size="small"
                            width="200px"
                            footerButtons={[
                                {
                                    //disabled: true,
                                    isPrimary: true,
                                    onClick: handleSaveEditProduct,
                                    text: "Save",
                                },
                                {
                                    isPrimary: false,
                                    onClick: handleClosEditProductModal,
                                    text: "Cancel",
                                },
                            ]}
                        />
                    )}

                    {/*--------------------------edit column-value--modal---------------------------*/}

                    {/*--------------------------modal---------------------------*/}
                    {showVariantsModal && (
                        <Modal
                            footerButtons={[
                                {
                                    //disabled: true,
                                    isPrimary: false,
                                    onClick: () => setShowVariantsModal(false),
                                    text: "Cancel",
                                },
                                {
                                    disabled: !boxData,
                                    isPrimary: true,
                                    onClick: handleAddBoxData,
                                    text: "Save",
                                },
                            ]}
                            headerButtons={[]}
                            height="500px"
                            onBackdropClick={handleCloseModal}
                            onClose={handleCloseModal}
                            padding="20px 40px 20px 40px"
                            render={renderModalContent}
                            className="products-variants-modal"
                            showCloseButton
                            size="medium"
                            width="800px"
                        />
                    )}

                    {/*--------------------------modal---------------------------*/}
                </section>
            </div>
        </div>
    );
}

export default OrderStock;
