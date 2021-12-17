import React, { useState, useEffect, useRef, useReducer } from "react";
import { Input, AutoComplete, Loading, Snackbar } from "@teamfabric/copilot-ui";
import * as CustomersApiUtil from "../../../../../utils/api/customer-api-utils";
import * as WebOrdersApiUtil from "../../../../../utils/api/web-orders-api-utils";
import * as ProductsApiUtil from "../../../../../utils/api/products-api-utils";
import * as Helpers from "../../../../../utils/helpers/scripts";
import { calculateTotalData } from "../../../../../utils/helpers/web-orders";
import DynamicModal from "../../../../atoms/modal";
import CustomButtonWithIcon from "../../../../atoms/button_with_icon";
import CreateCustomerModal from "./createCustomer";
import CreateAddressModal from "./createAddress";
import ProductsTable from "./productsTable";
import { useOutsideAlerter } from "../../../../../utils/helpers/web-orders";
import ApplyCoupon from "./applyCoupon";

let customerTimeout = null;
let productTimeout = null;
const WebOrders = (props) => {
  const addressDropRef = useRef(null);
  const shippingMethodRef = useRef(null);
  const {
    totalData,
    setTotalData,
    selectedCustomerData,
    setSelectedCustomerData,
    setSelectedAddressData,
    selectedShippingData,
    setSelectedShippingData,
    setSelectedProductsData,
    selectedProductsData,
    showError,
    setShowError,
    errorMessage,
    setErrorMessage,
    paymentMethod,
    handleApplyPromotion,
    handleApplyCoupon,
    couponApplied,
    promotionApplied,
    handleClearWebOrderAllDiscount,
  } = props;
  // Web Orders Component Work //

  const [customerDropDown, setCustomerDropDown] = useState(false);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customerSearchValue, setCustomerSearchValue] = useState("");
  const [customersDataToMap, setCustomersDataToMap] = useState([]);

  const [addressDropDown, setAddressDropDown] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressSearchValue, setAddressSearchValue] = useState("");
  const [addressData, setAddressData] = useState([]);
  const [addressesDataToMap, setAddressesDataToMap] = useState([]);

  const [createCustomerModal, setCreateCustomerModal] = useState(false);
  const [createAddressModal, setCreateAddressModal] = useState(false);
  const [couponModal, setCouponModal] = useState(false);

  const [shippingDropDown, setShippingDropDown] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingSearchValue, setShippingSearchValue] = useState("");
  const [shippingData, setShippingData] = useState([]);
  const [shippingDataToMap, setShippingDataToMap] = useState([]);

  const [productsDropDown, setProductsDropDown] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsSearchValue, setProductsSearchValue] = useState("");
  const [productsDataToMap, setProductsDataToMap] = useState([]);

  const [discountValue, setDiscountValue] = useState("");

  const closeCustomerDropDown = () => setCustomerDropDown(false);
  const closeAddressDropDown = () => setAddressDropDown(false);
  const closeShippingDropDown = () => setShippingDropDown(false);
  const closeProductsDropDown = () => setProductsDropDown(false);
  const handleCreateCustomer = () => {
    setCreateCustomerModal(!createCustomerModal);
  };
  const handleCreateAddress = () => {
    setCreateAddressModal(!createAddressModal);
  };
  const handleToggleCoupon = () => {
    setCouponModal(!couponModal);
  };
  const handleWebOrderCustomerSearch = (e) => {
    setCustomerSearchValue(e.target.value);
    if (customerTimeout) {
      clearTimeout(customerTimeout);
    }
    if (e.target.value.length > 0) {
      setCustomerDropDown(true);
      setCustomersLoading(true);
      // customerTimeout = setTimeout(() => {
      onSearchCustomers(e.target.value);
      // }, 2000);
    }
  };

  const onSearchCustomers = async (searchValue) => {
    setCustomerDropDown(true);
    const dataToSeach = {
      search: searchValue,
      limit: 10,
      offset: 0,
    };
    const customersSearchResponse = await WebOrdersApiUtil.searchCustomer(
      dataToSeach
    );
    console.log("customersSearchResponse:", customersSearchResponse);
    if (customersSearchResponse.status !== 200) {
      console.log(
        "Cant search Customer -> ",
        customersSearchResponse.errorMessage
      );
      setCustomersLoading(false); //imp to hide customers search loading
      showAlertUi(true, customersSearchResponse.errorMessage);
    } else {
      setCustomersLoading(false); //imp to hide customers search loading
      setCustomersDataToMap(customersSearchResponse?.data);
    }
  };
  const handleCustomerSelect = (customer) => {
    setSelectedCustomerData(customer);
    console.log("customer", customer);
    setCustomerSearchValue(customer.fullName);
    setAddressData(customer.address);
    setAddressesDataToMap(customer.address);
    setAddressDropDown(true);
    setCustomersDataToMap([]);
    setCustomerDropDown(false);
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  const handleAddressSearch = (event) => {
    const searchValue = event.target.value;
    if (searchValue.length > 0) {
      const searchedAddress = addressData.filter(
        (address) =>
          address.address1.toLowerCase().includes(searchValue) ||
          address.city.includes(searchValue) ||
          address.state.includes(searchValue) ||
          address.zipCode.includes(searchValue) ||
          address.country.includes(searchValue)
      );
      setAddressesDataToMap(searchedAddress);
    } else {
      setAddressesDataToMap(addressData);
    }
  };
  const handleAddresSelect = (address) => {
    setSelectedAddressData(address);
    setAddressSearchValue(address.address1);
    setAddressDropDown(false);
  };

  const handleShippingMethodSearch = (event) => {
    const searchValue = event.target.value;
    setShippingSearchValue(searchValue);
    if (searchValue.length > 0) {
      const searchedShippingMethod = shippingData.filter((shipping) =>
        shipping.name.toLowerCase().includes(searchValue)
      );
      setShippingDataToMap(searchedShippingMethod);
    } else {
      setShippingDataToMap(shippingData);
    }
  };

  const handleShippingMethodSelect = (shippingMethod) => {
    setSelectedShippingData(shippingMethod);
    setShippingSearchValue(shippingMethod.name);
    setShippingDropDown(false);
  };

  const fetchShippingMethods = async () => {
    setShippingLoading(true);
    const shippingMethodsResponse = await WebOrdersApiUtil.getShippingMethods();
    console.log("shippingMethodsResponse:", shippingMethodsResponse);
    if (shippingMethodsResponse.hasError) {
      console.log(
        "Cant Get Shipping Methods -> ",
        shippingMethodsResponse.errorMessage
      );
      setShippingLoading(false); //imp to hide shipping search loading
      showAlertUi(true, shippingMethodsResponse.errorMessage);
    } else {
      setShippingLoading(false); //imp to hide shipping search loading
      setShippingDataToMap(shippingMethodsResponse?.data);
      setShippingData(shippingMethodsResponse?.data);
    }
  };

  const handleProductsSearch = (e) => {
    setProductsSearchValue(e.target.value);
    if (productTimeout) {
      clearTimeout(productTimeout);
    }
    if (e.target.value.length > 0) {
      setProductsDropDown(true);
      setProductsLoading(true);
      // productTimeout = setTimeout(() => {
      onSearchProducts(e.target.value);
      // }, 2000);
    }
  };
  const onSearchProducts = async (searchValue) => {
    setProductsDropDown(true);
    const productsSearchResponse = await ProductsApiUtil.searchProducts(
      Helpers.productsSearchPageLimit,
      Helpers.productsSearchPageNumber,
      searchValue
    );
    console.log("productsSearchResponse:", productsSearchResponse);
    if (productsSearchResponse.hasError) {
      console.log(
        "Cant search Customer -> ",
        productsSearchResponse.errorMessage
      );
      setProductsLoading(false); //imp to hide customers search loading
      showAlertUi(true, productsSearchResponse.errorMessage);
    } else {
      setProductsLoading(false); //imp to hide customers search loading
      setProductsDataToMap(
        productsSearchResponse?.products?.data ||
          productsSearchResponse?.products
      );
    }
  };
  const handleSelectProducts = async (product) => {
    const productExist = selectedProductsData.find(
      (pro) => pro.id === product.id && pro.sku === product.sku
    );
    if (productExist) {
      const indexOfProductExist = selectedProductsData.findIndex(
        (pro) => pro.id === product.id
      );
      productExist.selectQty = productExist.selectQty + 1;
      selectedProductsData.splice(indexOfProductExist, 1, productExist);
      setSelectedProductsData(selectedProductsData);
      setTotalData(calculateTotalData(selectedProductsData, discountValue));
    } else {
      setSelectedProductsData([
        ...selectedProductsData,
        {
          ...product,
          selectQty: 1,
        },
      ]);
      setTotalData(
        calculateTotalData(
          [
            ...selectedProductsData,
            {
              ...product,
              selectQty: 1,
            },
          ],
          discountValue
        )
      );
    }
    if (selectedProductsData.length > 0) {
      handleClearWebOrderAllDiscount();
    }
    setProductsDropDown(false);
    setProductsSearchValue("");
    setProductsDataToMap([]);
  };
  useEffect(() => {
    fetchShippingMethods();
  }, []);
  useOutsideAlerter(addressDropRef, closeAddressDropDown);
  useOutsideAlerter(shippingMethodRef, closeShippingDropDown);
  return (
    <div className='web_orders'>
      <h2 style={{ marginBottom: "3rem" }}>Add Web Order</h2>
      <section className='customer'>
        <div className='alert-snackbar'>
          <Snackbar
            dismissable
            height='60px'
            kind='alert'
            position='top-center'
            label={errorMessage}
            onDismiss={() => {
              setErrorMessage("");
              setShowError(false);
            }}
            zIndex={10000}
            show={showError}
            width='600px'
            withIcon
          />
        </div>
        <div className='form'>
          <div className='form__row align-center'>
            <div className='form__input autocomplete-margin'>
              <AutoComplete
                inputProps={{
                  icon: "Search",
                  className: "search-autocomplete",
                  isFloatedLabel: false,
                  boxed: false,
                  kind: "md",
                  inputProps: {
                    placeholder: "Select Customer",
                    onChange: (e) => handleWebOrderCustomerSearch(e),
                    value: customerSearchValue,
                    boxed: true,
                    //onKeyDown: SelectProductOnEnter,
                    onFocus: (event) => {
                      console.log(event);
                      setCustomerDropDown(
                        customersDataToMap?.length > 0 ? true : false
                      );
                      setAddressDropDown(false);
                    },
                  },
                }}
                autoCompleteProps={{
                  data: {},
                  isLoading: true,
                  show: customerDropDown,
                  toggleSearchAll: true,
                  className: "search-autocomplete-popup",
                  onSearchAll: (event) => console.log(event),
                  onSelect: (data) => console.log(data, "data..."),
                  onClearSearch: (event, iconState) => {
                    console.log(event, iconState, "event");
                    setCustomerDropDown(false);
                    setAddressDropDown(false);
                    setCustomerSearchValue("");
                    setAddressesDataToMap([]);
                    setAddressData([]);
                    setSelectedAddressData({});
                    setSelectedCustomerData({});
                  },
                  onEscPress: closeCustomerDropDown,
                  onBodyClick: closeCustomerDropDown,
                }}
                children={
                  <div>
                    <Loading
                      strokeColor='#0033B3'
                      strokeWidth={5}
                      size={20}
                      show={customersLoading}
                    />
                    <ul>
                      {customersDataToMap &&
                        customersDataToMap.map((item) => (
                          <li
                            key={item._id}
                            value={item._id}
                            onClick={() => handleCustomerSelect(item)}
                            className='products-search-list-item'
                          >
                            {item.fullName}
                          </li>
                        ))}
                    </ul>
                    {!customersLoading && customersDataToMap?.length === 0 && (
                      <h3>No Customer Found</h3>
                    )}
                  </div>
                }
              />
            </div>
            <CustomButtonWithIcon
              text='Create New Customer'
              iconName='Add'
              onClick={handleCreateCustomer}
              className='btn-align-right'
            />
          </div>
          <div className='form__row align-center'>
            <div
              className='form__input autocomplete-margin'
              ref={addressDropRef}
            >
              <AutoComplete
                inputProps={{
                  icon: "Search",
                  className: "search-autocomplete",
                  isFloatedLabel: false,
                  boxed: false,
                  kind: "md",
                  inputProps: {
                    disabled: !selectedCustomerData?.email,
                    placeholder: "Select Address",
                    onChange: (e) => handleAddressSearch(e),
                    value: addressSearchValue,
                    boxed: true,
                    //onKeyDown: SelectProductOnEnter,
                    onFocus: (event) => {
                      console.log(event);
                      setAddressDropDown(
                        addressesDataToMap?.length > 0 ? true : false
                      );
                    },
                  },
                }}
                autoCompleteProps={{
                  data: {},
                  isLoading: true,
                  show: addressDropDown,
                  toggleSearchAll: true,
                  className: "search-autocomplete-popup",
                  onSearchAll: (event) => console.log(event),
                  onSelect: (data) => console.log(data, "data..."),
                  onClearSearch: (event, iconState) => {
                    console.log(event, iconState, "event");
                    setAddressDropDown(false);
                    setAddressSearchValue("");
                    setSelectedAddressData({});
                  },
                  onEscPress: closeAddressDropDown,
                  onBodyClick: closeAddressDropDown,
                }}
                children={
                  <div>
                    <Loading
                      strokeColor='#0033B3'
                      strokeWidth={5}
                      size={20}
                      show={customersLoading}
                    />
                    <ul>
                      {addressesDataToMap &&
                        addressesDataToMap.map((item) => (
                          <li
                            key={item._id}
                            value={item._id}
                            onClick={() => handleAddresSelect(item)}
                            className='products-search-list-item'
                          >
                            {item.address1}
                          </li>
                        ))}
                    </ul>
                    {!customersLoading && addressesDataToMap?.length === 0 && (
                      <h3>No Address Found</h3>
                    )}
                  </div>
                }
              />
            </div>
            <CustomButtonWithIcon
              text='Create New Address'
              iconName='Add'
              onClick={handleCreateAddress}
              className='btn-align-right'
              // disabled={!selectedCustomerData?.email}
            />
          </div>
          <div className='form__row align-center'>
            <div
              className='form__input autocomplete-margin'
              ref={shippingMethodRef}
            >
              <AutoComplete
                inputProps={{
                  icon: "Search",
                  className: "search-autocomplete",
                  isFloatedLabel: false,
                  boxed: false,
                  kind: "md",
                  inputProps: {
                    placeholder: "Select Shipping Method",
                    onChange: (e) => handleShippingMethodSearch(e),
                    value: shippingSearchValue,
                    boxed: true,
                    //onKeyDown: SelectProductOnEnter,
                    onFocus: (event) => {
                      console.log(event);
                      setShippingDropDown(
                        shippingDataToMap?.length > 0 ? true : false
                      );
                    },
                  },
                }}
                autoCompleteProps={{
                  data: {},
                  isLoading: true,
                  show: shippingDropDown,
                  toggleSearchAll: true,
                  className: "search-autocomplete-popup",
                  onSearchAll: (event) => console.log(event),
                  onSelect: (data) => console.log(data, "data..."),
                  onClearSearch: (event, iconState) => {
                    console.log(event, iconState, "event");
                    setShippingDropDown(false);
                    setShippingSearchValue("");
                    setSelectedShippingData({});
                  },
                  onEscPress: closeShippingDropDown,
                  onBodyClick: closeShippingDropDown,
                }}
                children={
                  <div>
                    <Loading
                      strokeColor='#0033B3'
                      strokeWidth={5}
                      size={20}
                      show={shippingLoading}
                    />
                    <ul>
                      {shippingDataToMap &&
                        shippingDataToMap.map((item) => (
                          <li
                            key={item._id}
                            value={item._id}
                            onClick={() => handleShippingMethodSelect(item)}
                            className='products-search-list-item'
                          >
                            {item.name}
                          </li>
                        ))}
                    </ul>
                    {!shippingLoading && shippingDataToMap?.length === 0 && (
                      <h3>No Shipping Method Found</h3>
                    )}
                  </div>
                }
              />
            </div>
            <div className='form__input autocomplete-margin'>
              <AutoComplete
                inputProps={{
                  icon: "Search",
                  className: "search-autocomplete",
                  isFloatedLabel: false,
                  boxed: false,
                  kind: "md",
                  inputProps: {
                    placeholder: "Select Products",
                    onChange: (e) => handleProductsSearch(e),
                    value: productsSearchValue,
                    boxed: true,
                    //onKeyDown: SelectProductOnEnter,
                    onFocus: (event) => {
                      console.log(event);
                      setProductsDropDown(
                        productsDataToMap?.length > 0 ? true : false
                      );
                    },
                  },
                }}
                autoCompleteProps={{
                  data: {},
                  isLoading: true,
                  show: productsDropDown,
                  toggleSearchAll: true,
                  className: "search-autocomplete-popup",
                  onSearchAll: (event) => console.log(event),
                  onSelect: (data) => console.log(data, "data..."),
                  onClearSearch: (event, iconState) => {
                    console.log(event, iconState, "event");
                    setProductsDropDown(false);
                    setProductsSearchValue("");
                    setProductsDataToMap([]);
                  },
                  onEscPress: closeProductsDropDown,
                  onBodyClick: closeProductsDropDown,
                }}
                children={
                  <div>
                    <Loading
                      strokeColor='#0033B3'
                      strokeWidth={5}
                      size={20}
                      show={productsLoading}
                    />
                    <ul>
                      {productsDataToMap &&
                        productsDataToMap.map((item) => (
                          <li
                            key={item._id}
                            value={item._id}
                            onClick={() => handleSelectProducts(item)}
                            className='products-search-list-item'
                          >
                            {item.name}
                          </li>
                        ))}
                    </ul>
                    {!productsLoading && productsDataToMap?.length === 0 && (
                      <h3>No Products Found</h3>
                    )}
                  </div>
                }
              />
            </div>
          </div>
          <div className='page__table'>
            <ProductsTable
              tableData={selectedProductsData}
              setSelectedProductsData={setSelectedProductsData}
              totalData={totalData}
              discountValue={discountValue}
              setTotalData={setTotalData}
              handleClearWebOrderAllDiscount={handleClearWebOrderAllDiscount}
            />
          </div>
          <div className='form__row' />
          <div className='form__row'>
            <div className='form__input'>
              <h3>Payment Method: {paymentMethod}</h3>
            </div>
          </div>
          <div className='form__row'>
            <div className='form__input'>
              <Input
                className='number'
                inputProps={{
                  //min: 0,
                  disabled: true,
                  type: "text",
                  value: totalData.subTotal,
                }}
                label='Subtotal'
                isFloatedLabel={false}
              />
            </div>
            <div className='form__input'>
              <Input
                className='number'
                inputProps={{
                  disabled: true,
                  type: "number",
                  value: totalData.paidAmount,
                  //   onChange: handlePaidChange,
                  //   disabled:
                  //     saleInvoiceData && saleInvoiceData.method !== "Cash",
                }}
                label='Paid'
                isFloatedLabel={false}
              />
            </div>
          </div>
          <div className='form__row'>
            <div className='form__input'>
              <Input
                className='number'
                inputProps={{
                  disabled: true,
                  type: "text",
                  value: totalData.discountedAmount,
                }}
                label='Discounted Amount'
                isFloatedLabel={false}
              />
            </div>
            <div className='form__input buttons'>
              <CustomButtonWithIcon
                text='Apply Promotion'
                iconName='Add'
                onClick={handleApplyPromotion}
                disabled={selectedProductsData.length === 0 || promotionApplied}
                className={promotionApplied && "green-button"}
              />
              <CustomButtonWithIcon
                text='Apply Coupon'
                iconName='Add'
                onClick={handleToggleCoupon}
                disabled={selectedProductsData.length === 0 || couponApplied}
                className={couponApplied && "green-button"}
              />
            </div>
          </div>

          <div className='form__row'>
            <div className='form__input'>
              <Input
                className='number'
                inputProps={{
                  disabled: true,
                  type: "text",
                  value: totalData.totalTax,
                }}
                label='Tax'
                isFloatedLabel={false}
              />
            </div>
            <div className='form__input'>
              <Input
                className='number'
                inputProps={{
                  disabled: true,
                  type: "text",
                  value: totalData.totalAmount,
                }}
                label='Total'
                isFloatedLabel={false}
              />
            </div>
          </div>
        </div>
      </section>
      {/* Create Customer Modal */}
      {createCustomerModal && (
        <CreateCustomerModal
          setCreateCustomerModal={setCreateCustomerModal}
          handleCreateCustomer={handleCreateCustomer}
          setCustomerSearchValue={setCustomerSearchValue}
          setCustomerDropDown={setCustomerDropDown}
          setSelectedCustomerData={setSelectedCustomerData}
        />
      )}
      {/* Create Customer Modal */}

      {/* Create Address Modal */}
      {createAddressModal && (
        <CreateAddressModal
          handleCreateAddress={handleCreateAddress}
          setAddressSearchValue={setAddressSearchValue}
          setAddressDropDown={setAddressDropDown}
          setCreateAddressModal={setCreateAddressModal}
          setSelectedAddressData={setSelectedAddressData}
          selectedCustomerData={selectedCustomerData}
          setAddressesDataToMap={setAddressesDataToMap}
        />
      )}
      {couponModal && (
        <ApplyCoupon
          handleApplyCoupon={handleApplyCoupon}
          handleToggleCoupon={handleToggleCoupon}
          setCouponModal={setCouponModal}
        />
      )}
    </div>
  );
};

export default WebOrders;
