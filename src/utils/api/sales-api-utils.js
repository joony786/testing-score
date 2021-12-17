

import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';
import axios from 'axios';
import isArray  from "lodash/isArray";



export const getSalesHistory = async (dataToFind) => {
    const salesHistoryFormDataBody = ApiCallUtil.constructParamsData(dataToFind);
    const url = UrlConstants.SALES.VIEW_HISTORY + `?${salesHistoryFormDataBody}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        salesHistoryFormDataBody //body
    );
};



export const getSalesInvoiceHistory = async (showId) => {
   
    const url = UrlConstants.SALES.GET_SALE_HISTORY + `?show_id=${showId}&invoice_details=1`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );

};

export const getSalesInvoiceHistoryWithStatus = async (showId, status) => {
   
    const url = UrlConstants.SALES.GET_SALE_HISTORY + `?show_id=${showId}&invoice_details=1&status=${status}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );

};

export const getCurrentInvoiceNumber = async () => {

    const url = UrlConstants.SALES.GET_INVOICE_NUMBER;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
      
    );

};


export const registerInvoice = async (invoiceQueue) => {
    //const registerInvoiceFormDataBody =  $.param(registerInvoiceFormData);
    const url = UrlConstants.SALES.REGISTER_INVOICE;
    const callType = GenericConstants.API_CALL_TYPE.POST;
    const headers = {'Content-Type': 'application/json'};

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        invoiceQueue, //body
        headers,
    );

};

export const updateRegisterInvoice = async (invoiceQueue, invoiceId) => {
    //const registerInvoiceFormDataBody =  $.param(registerInvoiceFormData);
    const url = UrlConstants.SALES.REGISTER_INVOICE + `/${invoiceId}`;
    const callType = GenericConstants.API_CALL_TYPE.PUT;
    const headers = {'Content-Type': 'application/json'};

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        invoiceQueue, //body
        headers,
    );

};


export const deadSaleHistory = async (oldInvoiceNo) => {
    const formDataPair = {
        invoice_id: oldInvoiceNo,
    };
    
    const deadInvoiceHistoryFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.SALES.REGISTER_INVOICE_MARK_DEAD;
    const callType = GenericConstants.API_CALL_TYPE.POST;
 
    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        deadInvoiceHistoryFormDataBody, //body
    );

};


export const getStoreId = async () => {

    const url = UrlConstants.SALES.GET_STORE;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};
  
  
export const exportParkedSalesInvoices = async (params) => {

    let query = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
    

    //const url = UrlConstants.SALES.EXPORT_INVENTORY_DUMP+`/${storeId}`;         //imp prev
    const url = UrlConstants.SALES.EXPORT_INVENTORY_DUMP+'?'+ query;
    const userAuth = ApiCallUtil.getUserAuth();
    let headers = {
        'Authorization': ApiCallUtil.getUserAuthToken(),
    };

    if (userAuth?.brand_id) {
        headers["Brand_id"] = userAuth?.brand_id;
    }

    if (userAuth?.store_id) {
        headers["Store_id"] = userAuth?.store_id;
    }

    return await axios.get(url, {
        headers: headers
    })
        .then(async (res) => {
            console.log('Parked Sales Invoices Export Data Response -> ', res);
            return { hasError: false, message: "Parked Sales Succesfully Exported", data: res.data };

        })
        .catch((error) => {
            console.log("AXIOS ERROR: ", error);
            return { hasError: true, errorMessage: error };

        })

};

export const exportSalesInvoices = async (params) => {

    const csvFormData = ApiCallUtil.constructParamsData(params);
    //const url = UrlConstants.SALES.EXPORT_INVENTORY_DUMP+`/${storeId}`; 
    const url = UrlConstants.SALES.EXPORT_CSV + `?${csvFormData}`;
    const userAuth = ApiCallUtil.getUserAuth();
    let headers = {
        'Authorization': `Bearer ${ApiCallUtil.getUserAuthToken()}`,
    };

    if (userAuth?.brand_id) {
        headers["Brand_id"] = userAuth?.brand_id;
    }

    if (userAuth?.store_id) {
        headers["Store_id"] = userAuth?.store_id;
    }

    return await axios.get(url, {
        headers: headers
    })
        .then(async (res) => {
            console.log('Sales Invoices Export Data Response -> ', res);
            return { hasError: false, message: "Sales Succesfully Exported", data: res.data };

        })
        .catch((err) => {
            const errData = err?.response?.data;
            const errorMessage = isArray(errData?.data)
            ? errData?.data[0]?.message
            : Object.keys(errData?.data || {}).length > 0 ?
            errData?.data || errData?.data?.message  || errData?.data?.data : 
            errData?.data || errData?.detail || errData?.message ||
            "Unable to complete the request";
            console.log("errorMessage", errorMessage)
            return { hasError: true, errorMessage: errorMessage };

        })

};



export const syncInvoices = async (data) => {

    const url = UrlConstants.SALES.SYNC_INVOICES + `?startDate=${data.startDate}&endDate=${data.endDate}`;
    const userAuth = ApiCallUtil.getUserAuth();
    let headers = {
        'Authorization': `Bearer ${ApiCallUtil.getUserAuthToken()}`,
    };

    if (userAuth?.brand_id) {
        headers["Brand_id"] = userAuth?.brand_id;
    }

    if (userAuth?.store_id) {
        headers["Store_id"] = userAuth?.store_id;
    }
  
    return await axios.get(url, {
        headers: headers
    })
        .then(async (res) => {
          let responseData = res?.data;
          if(responseData?.success) {
            //console.log('res -> ', responseData);
            return { hasError: false, ...responseData };
          }
          else {
            //console.log('Cannot Sync Products -> ', responseData);
            return { hasError: true, errorMessage: responseData.message, ...responseData  };
          }
  
        })
        .catch((err) => {
            console.log("AXIOS ERROR: ", err);
            const errorMessage =
                err?.response?.data?.message ||
                err?.response?.data?.data?.message ||
                "Unable to complete the request";
            return { hasError: true, errorMessage: errorMessage };
  
        })

};