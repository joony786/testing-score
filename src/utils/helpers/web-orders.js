import { useEffect } from "react";

export const calculateTotalData = (productsData, discount = 0) => {
  let paid = 0;
  let totalAmount = 0;
  let subTotal = 0;
  let change = 0;
  let totalTax = 0;
  let discountedAmount = discount || 0;
  if (productsData && productsData.length > 0) {
    for (const pro of productsData) {
      subTotal = parseFloat(subTotal);
      totalTax = parseFloat(totalTax);
      if (pro?.promosApplied?.length > 0) {
        const newPrice = pro.prices.discount_price - parseInt(pro?.discounted_amount / pro.selectQty);
        const taxAmount = (newPrice * pro.tax_info.tax_value) / 100
        totalTax = parseFloat(
          totalTax + pro.selectQty * taxAmount
        ).toFixed(2); 
      } else {
        totalTax = parseFloat(
          totalTax + pro.selectQty * pro.tax_info.tax_amount
        ).toFixed(2);
      }
      subTotal = parseFloat(
        subTotal + pro.selectQty * pro.prices.discount_price
      ).toFixed(2);
    }
  }
  paid = parseFloat(
    parseFloat(subTotal) + parseFloat(totalTax) - parseFloat(discountedAmount)
  ).toFixed(2);
  totalAmount = parseFloat(
    parseFloat(subTotal) + parseFloat(totalTax) - parseFloat(discountedAmount)
  ).toFixed(2);
  change = totalAmount - paid;
  return {
    totalAmount: totalAmount,
    paidAmount: paid,
    subTotal: subTotal,
    change: change,
    totalTax: totalTax,
    discountedAmount: discountedAmount,
  };
};

export const createPayloadToSave = (
  customerData,
  addressData,
  productsData,
  shippingData,
  totalData
) => {
  const itemsData = [];
  const phoneDetails =
    customerData?.phone?.length > 0 ? customerData?.phone[0] : {};
  for (const pro of productsData) {
    const discountedPrice =
      pro.selectQty * pro.prices.discount_price - pro.discounted_amount;
    itemsData.push({
      price: pro.prices.discount_price,
      sample: false,
      discountedQuantity: pro.discounted_amount > 0 ? pro.selectQty : 0,
      group: [],
      weightUnit: "lb",
      isPickup: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      itemId: pro.external_code,
      quantity: pro.selectQty,
      sku: pro.sku,
      priceListId: 100000,
      taxCode: "FFFFF",
      title: pro.name,
      weight: 0,
      lineItemId: 1,
      attributeTotalPrice: 0,
      totalPrice: {
        currency: "USD",
        amount:
          pro.selectQty * pro.prices.discount_price - pro.discounted_amount,
      },
      attributes: [],
      shipTo: addressData._id,
      id: customerData._id,
      currency: "USD",
      shipToId: shippingData?.shippingMethodId,
      discount: pro.discounted_amount,
      promosApplied: pro.promosApplied || [],
      estimatedTax: pro.tax_info.tax_value,
      total: discountedPrice + pro.selectQty * pro.tax_info.tax_amount,
    });
  }
  const data = {
    attributes: [],
    customerEmail: customerData?.email,
    orderCurrency: "USD",
    orderTotal: totalData.totalAmount,
    taxTotal: totalData.totalTax,
    channel: 12,
    status: "ORDER_CREATED",
    statusLog: "Order has been created",
    shipTo: [
      {
        _id: shippingData._id,
        shipMethod: {
          cost: {
            amount: 0,
            base: shippingData?.cost,
            realPrice: null,
            discount: 0,
          },
          shipMethodId: shippingData._id,
          shipmentCarrier: shippingData?.name,
          shipmentMethod: shippingData?.name,
        },
        address: {
          name: {
            first: addressData?.name?.first,
            last: addressData?.name?.last,
          },
          street1: addressData?.address1,
          city: addressData?.city,
          state: addressData?.state,
          country: addressData?.country,
          zipCode: addressData?.zipCode,
          kind: addressData?.kind,
          email: customerData?.email,
        },
        billTo: [],
        shipToType: "SHIP_TO_ADDRESS",
        taxCode: shippingData?.taxCode,
        shipToId: shippingData?.shippingMethodId,
        createdAt: shippingData?.createdAt,
        updatedAt: shippingData?.updatedAt,
        price: shippingData?.cost,
        shipmentMethodId: shippingData._id,
        estimatedTax: 0,
        shipmentCarrier: shippingData?.name,
        shipmentMethod: shippingData?.name,
        total: shippingData?.cost,
        items: itemsData,
        payments: [
          {
            paymentStatus: "succeeded",
            amount: totalData.totalAmount,
            currency: "USD",
            billToAddress: {
              name: {
                first: addressData?.name?.first,
                last: addressData?.name?.last,
              },
              phone: {
                number: phoneDetails?.number || "0000",
                kind: phoneDetails?.kind || "mobile",
              },
              street1: addressData?.address1,
              city: addressData?.city,
              state: addressData?.state,
              country: addressData?.country,
              zipCode: addressData?.zipCode,
              email: customerData?.email,
            },
            transactionDetails: {
              paymentType: "NON_CARD",
            },
            paymentIdentifier: {
              cardIdentifier: "POS_TXN",
            },
            paymentMethod: "POS",
            paymentKind: "POS",
            conversion: 1,
            shipToId: [shippingData?.shippingMethodId],
          },
        ],
      },
    ],
    orderReference: null,
  };
  return data;
};

export const useOutsideAlerter = (ref, handleCloseDropDown) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handleCloseDropDown();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};

export const promotionPayload = (productsData, promoCodes) => {
  const promotionsData = [];
  for (const pro of productsData) {
    promotionsData.push({
      sku: pro.sku,
      itemId: pro.external_code,
      priceListId: 100000,
      lineItemId: 100000,
      price: {
        base: pro.prices.discount_price,
        sale: pro.prices.discount_price,
        currency: "USD",
      },
      group: [],
      quantity: pro.selectQty || pro.qty,
    });
  }
  return {
    isLoggedIn: false,
    promoCodes: promoCodes || [],
    items: promotionsData,
  };
};
