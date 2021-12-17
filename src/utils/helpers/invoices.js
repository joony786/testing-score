export const calculateInvoiceTotalData = (
  productsData,
  discount = 0,
  manualPaid = 0,
  selectedTaxCategory = {},
  isPromotion = false,
  isReturnedInvoice = false,
  discountPer = 0,
  discountInputValue = 0,
) => {
  let paid = 0;
  let totalAmount = 0;
  let subTotal = 0;
  let change = 0;
  let totalTax = 0;
  let discountedAmount = discount || 0;
  let discountedAmountPerItem = 0;
  if (isReturnedInvoice) {
    discountedAmountPerItem = parseFloat(discountPer).toFixed(2)
  } else {
    discountedAmountPerItem = parseFloat(discountPer).toFixed(2);
  }
  if (productsData && productsData.length > 0) {
    for (const pro of productsData) {
      if (discountInputValue > 0) {
        discountedAmountPerItem = (discountInputValue * pro.prices.discount_price) / 100
      }
      subTotal = parseFloat(subTotal);
      totalTax = parseFloat(totalTax);
      if (pro?.offer_price > 0 && isPromotion) {
        totalTax = parseFloat(
          totalTax +
            (pro.selectQty * pro.tax_info.tax_value * pro.offer_price) / 100
        ).toFixed(2);
      } else {
        totalTax = parseFloat(
          totalTax +
            (pro.selectQty *
              pro.tax_info.tax_value *
              (pro.prices.discount_price - discountedAmountPerItem)) /
              100
        ).toFixed(2);
      }

      if (pro?.offer_price > 0) {
        subTotal = parseFloat(
          subTotal + pro.selectQty * pro.offer_price
        ).toFixed(2);
      } else {
        subTotal = parseFloat(
          subTotal + pro.selectQty * pro.prices.discount_price
        ).toFixed(2);
      }
    }
  }
  if (isReturnedInvoice) {
    if (discountedAmount < 0) {
      discountedAmount = discountedAmount * -1;
    }
  }
  if (isPromotion) {
    paid = parseFloat(parseFloat(subTotal) + parseFloat(totalTax)).toFixed(2);
  } else if (isReturnedInvoice && !isPromotion) {
    paid = parseFloat(
      parseFloat(subTotal) + parseFloat(totalTax) + parseFloat(discountedAmount)
    ).toFixed(2);
  } else {
    paid = parseFloat(
      parseFloat(subTotal) + parseFloat(totalTax) - parseFloat(discountedAmount)
    ).toFixed(2);
  }
  if (manualPaid > 0) {
    paid = manualPaid;
  }
  if (isPromotion) {
    totalAmount = parseFloat(
      parseFloat(subTotal) + parseFloat(totalTax)
    ).toFixed(2);
  } else if (isReturnedInvoice && !isPromotion) {
    totalAmount = parseFloat(
      parseFloat(subTotal) + parseFloat(totalTax)  + parseFloat(discountedAmount)
    ).toFixed(2);
  } else {
    totalAmount = parseFloat(
      parseFloat(subTotal) + parseFloat(totalTax) - parseFloat(discountedAmount)
    ).toFixed(2);
  }
  paid = parseFloat(paid).toFixed(2);
  change = parseFloat(paid - totalAmount).toFixed(2);
  discountedAmount = parseFloat(discountedAmount).toFixed(2);
  return {
    totalAmount: totalAmount,
    paidAmount: paid,
    subTotal: subTotal,
    change: change,
    totalTax: totalTax,
    discountedAmount: isReturnedInvoice ? -discountedAmount : discountedAmount,
    discountedAmountPerItem,
  };
};

export const addInvoicePayload = (
  selectedCustomer,
  selectedProducts,
  invoiceTotalData,
  status,
  calenderDate,
  storeLocation,
  paymentMethod,
  invoiceNoteValue,
  invoiceNumber
) => {
  const invoiceDataToSave = {
    date: calenderDate,
    status: status,
    discount: invoiceTotalData?.discountedAmount,
    shipping_address: storeLocation,
    billing_address: storeLocation,
    payment_method: paymentMethod || "Cash",
    invoice_note: invoiceNoteValue,
    invoice_number: invoiceNumber,
  };
  if (selectedCustomer?.id) {
    invoiceDataToSave.customer_id = selectedCustomer?.id;
  }
  const invoiceProducts = [];
  for (const product of selectedProducts) {
    invoiceProducts.push({
      product_id: product.id,
      quantity: product.selectQty,
      discount: product.discount,
      promotions: product.promotions || [],
    });
    if (product?.promotions?.length) {
      invoiceDataToSave.promotion_id = product.promotions[0].promotion_id;
      invoiceDataToSave.promotion_title = product.promotions[0].promotion_title;
      invoiceDataToSave.promotion_value = product.promotions[0].promotion_value;
    }
  }
  invoiceDataToSave.invoice_products = invoiceProducts;
  return invoiceDataToSave;
};

export const calculateDiscountValue = (discountAmount, originalPrice) => {
  let discountVal = 0;
  discountVal = (100 * (originalPrice - discountAmount)) / originalPrice;
  discountVal = 100 - discountVal;
  return parseFloat(discountVal).toFixed(2);
};
