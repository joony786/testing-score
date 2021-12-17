
import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';
import axios from 'axios';

export const getAllProducts = async (product_sku) => {
    const url = UrlConstants.STOCK.GET_ALL_SYSTEM_PRODUCTS + `?sku=${product_sku}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;
    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
}

export const downloadSystemProductSampleFile = async () => {
    const url = UrlConstants.STOCK.GET_ALL_SYSTEM_PRODUCTS;
    const callType = GenericConstants.API_CALL_TYPE.GET;
    return await ApiCallUtil.http(
        url, //api url
        callType //calltype
    );
}

export const fetchLatestInventoryProducts = async (inventoryBody) => {
    const url = UrlConstants.STOCK.GET_LATEST_INVENTORY;
    const callType = GenericConstants.API_CALL_TYPE.POST;
    return await ApiCallUtil.http_sandbox(
        url, //api url
        callType,
        inventoryBody
    );
}

export const getAllStockRequest = async (limit, pageNumber, startDate, finishDate) => {
    const url = UrlConstants.STOCK.GET_ALL_STOCK_REQUEST + `?startDate=${startDate}&finishDate=${finishDate}&page=${pageNumber}&limit=${limit}`;;
    const callType = GenericConstants.API_CALL_TYPE.GET;
    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};

export const getStockRequestById = async (requestId, limit, pageNumber) => {
    const url = UrlConstants.STOCK.GET_ALL_STOCK_REQUEST + `?id=${requestId}&page=${pageNumber}&limit=${limit}`;;
    const callType = GenericConstants.API_CALL_TYPE.GET;
    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};

export const sendStockRequestWMS = async (body) => {
    const url = UrlConstants.STOCK.SEND_STOCK_REQUEST_WMS;
    const callType = GenericConstants.API_CALL_TYPE.POST;
    return await ApiCallUtil.http_sandbox(
        url, //api url
        callType, //calltype
        body
    );
}

export const sendStockAdjustmentWMS = async (body) => {
    const url = UrlConstants.STOCK.SEND_STOCK_ADJUSTMENT_WMS;
    const callType = GenericConstants.API_CALL_TYPE.PUT;
    return await ApiCallUtil.http_sandbox(
        url, //api url
        callType, //calltype
        body
    );
}

export const sendStockRequestSystem = async (body) => {
    const url = UrlConstants.STOCK.SEND_STOCK_REQUEST_SYSTEM;
    const callType = GenericConstants.API_CALL_TYPE.POST;
    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        body
    );
}

export const sendStockRequestBulkSystem =  async (stockBulkRequestSystemBody) => {
    const url = UrlConstants.STOCK.SEND_STOCK_REQUEST_BULK_FILE_SYSTEM;
    const callType = GenericConstants.API_CALL_TYPE.POST;
    const stockRequestBulkSystemFormDataBody = ApiCallUtil.constructFormData(stockBulkRequestSystemBody);
    return await ApiCallUtil.http(
        url, 
        callType,
        stockRequestBulkSystemFormDataBody,
    );
};
export const sendStockRequestBulkWMS =  async (stockBulkRequestWMSBody) => {
    const url = UrlConstants.STOCK.SEND_STOCK_REQUEST_BULK_FILE_WMS;
    const callType = GenericConstants.API_CALL_TYPE.POST;
    const stockRequestBulkSystemFormDataBody = ApiCallUtil.constructFormData(stockBulkRequestWMSBody);
    return await ApiCallUtil.http_sandbox(
        url, 
        callType,
        stockRequestBulkSystemFormDataBody,
    );
};

export const bulkUploadPurchaseOrder =  async (bulkPurchaseOrderFile) => {
    const bulkProductsDataBody = {
        file: bulkPurchaseOrderFile
    };
    const productsBulkUploadFormDataBody = ApiCallUtil.constructFormData(bulkProductsDataBody);
    const url = UrlConstants.STOCK.BULK_UPLOAD_PURCHASE_ORDER
    const callType = GenericConstants.API_CALL_TYPE.POST;
    return await ApiCallUtil.http(
        url, 
        callType,
        productsBulkUploadFormDataBody,
    );
};

export const viewPurchaseOrders = async (limit, page, startDate, finishDate) => {
    // const formDataPair = {
    //     limit,
    //     page,
    //     startDate,
    //     finishDate,
    // };

    // const viewPurchaseOrdersFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.VIEW_PURCHASE_ORDER + `?limit=${limit}&page=${page}&startDate=${startDate}&finishDate=${finishDate}` ;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        // viewPurchaseOrdersFormDataBody,  //body
    );
};

export const viewPurchaseOrdersGRN = async function(purchase_order_id,good_receive_notes_id) {
        const url = UrlConstants.STOCK.VIEW_PURCHASE_ORDER + `?purchase_order_id=${purchase_order_id}&good_receive_notes_id=${good_receive_notes_id}`
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url,
        callType,
    );
}
// GRn apis
export const forceCloseGRN =  async function(id) {
    const status = {status: 'close'}
    const url = UrlConstants.STOCK.VIEW_PURCHASE_ORDER + `/${id}`
    const callType = GenericConstants.API_CALL_TYPE.PUT
    return await ApiCallUtil.http(
        url,
        callType,
        status
    );
}

export const ChangePurchaseOrderGRN = async function (data) {
    const url = UrlConstants.STOCK.CHANGE_GRN_STATUS
    const callType = GenericConstants.API_CALL_TYPE.POST
    return await ApiCallUtil.http(
        url,
        callType,
        data
    );
    
}

export const viewGrnOrder = async (limit,page,purchase_order_id,good_receive_notes_id) => {

    const url = UrlConstants.STOCK.CHANGE_GRN_STATUS + `?limit=${limit}&page=${page}&purchase_order_id=${purchase_order_id}&good_receive_notes_id=${good_receive_notes_id}`
    const callType = GenericConstants.API_CALL_TYPE.GET
    return await ApiCallUtil.http(
        url,
        callType,
    );

}


export const addReceivePurchaseOrder = async (receivePoData) => {
    const addReceivedPoFormDataBody = {
        grn: receivePoData,
    };

    //const addReceivedPoFormDataBody =  $.param({grn: receivePoData});
    const url = UrlConstants.STOCK.ADD_RECEIVE_PO;
    const callType = GenericConstants.API_CALL_TYPE.POST;
    const headers = { 'Content-Type': 'application/json' };

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        addReceivedPoFormDataBody,  //body
        headers,
    );
};


export const addPurchaseOrder = async (addPurchaseOrderData) => {
    // const addPurchaseOrderFormData = {
    //     purchase: addPurchaseOrderData,
    // };

    //const addPurchaseOrderFormDataBody =  $.param(addPurchaseOrderFormData);       //imp prev ver
    const url = UrlConstants.STOCK.ADD_PURCHASE_ORDER;
    const callType = GenericConstants.API_CALL_TYPE.POST;
    const headers = { 'Content-Type': 'application/json' };

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        addPurchaseOrderData,  //body
        headers,
    );
};


export const closePurchaseOrder = async (closePurchaseOrderId) => {
    const formDataPair = {
        purchase_order_id: closePurchaseOrderId,
    };

    const closePurchaseOrderFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.CLOSE_PURCHASE_ORDER;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        closePurchaseOrderFormDataBody,  //body
    );
};


export const downloadPoForm = async () => {

    const url = UrlConstants.STOCK.DOWNLOAD_PO_FORM;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};



export const receivePurchaseOrder = async (purchaseOrderId) => {
    const formDataPair = {
        purchase_order_id: purchaseOrderId,
    };

    const getPurchaseOrderFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.RECEIVE_PO;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        getPurchaseOrderFormDataBody,  //body
    );
};


export const receiveCompletedPurchaseOrder = async (purchaseOrderId, poGrnId) => {
    const formDataPair = {
        purchase_order_id: purchaseOrderId,
        grn_id: poGrnId,
    };

    const getPurchaseOrderFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.RECEIVE_COMPLETED_PO;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        getPurchaseOrderFormDataBody,  //body
    );
};


export const receiveTransfer = async (receiveTransferId) => {
    const formDataPair = {
        transfer_id: receiveTransferId,
    };

    const receiveTransferFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.RECEIVE_TRANSFER_IN;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        receiveTransferFormDataBody,  //body
    );
};


export const addReceiveTransfersStatus = async (addReceiveTransferStatusData) => {

    const addReceiveTransferStatusFormDataBody = ApiCallUtil.constructFormData(
        addReceiveTransferStatusData
    );
    const url = UrlConstants.STOCK.CLOSE_TRANSFER_STATUS;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        addReceiveTransferStatusFormDataBody,  //body
    );
};

export const closeRequestInventoryOrder = async (requestId, requestStatus) => {
    const formDataPair = {
        status:  requestStatus,
        is_super: 0
    };

    const url = UrlConstants.STOCK.CLOSE_REQUEST_STATUS + requestId;
    const callType = GenericConstants.API_CALL_TYPE.PUT;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        formDataPair,  //body
    );
};

export const receivedRequestInventoryOrder = async (requestId, requestStatus, dateReceived) => {
    const formDataPair = {
        status:  requestStatus,
        date_received: dateReceived,
        is_super: 0
    };

    const url = UrlConstants.STOCK.RECEIVED_REQUEST_STATUS + requestId;
    const callType = GenericConstants.API_CALL_TYPE.PUT;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        formDataPair,  //body
    );
};

export const returnStock = async (returnStockData) => {
    

    const url = UrlConstants.STOCK.RETURN_STOCK;
    const callType = GenericConstants.API_CALL_TYPE.POST;


    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        returnStockData,  //body
    );
};


export const viewStockAdjustments = async (limit, pageNumber, startDate, finishDate) => {

    const url = UrlConstants.STOCK.VIEW_ADJUSTMENTS + `?startDate=${startDate}&finishDate=${finishDate}&page=${pageNumber}&limit=${limit}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};

export const viewStockAdjustmentsById = async (adjustedId, limit, pageNumber) => {

    const url = UrlConstants.STOCK.VIEW_ADJUSTMENTS + `?id=${adjustedId}&page=${pageNumber}&limit=${limit}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};


export const viewStockReturned = async (limit, pageNumber, startDate, finishDate) => {
    const formDataPair = {
        limit: limit,
        page: pageNumber,
        startDate,
        finishDate,
    };

    const viewStockReturnedFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.VIEW_RETURNED_STOCK;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        viewStockReturnedFormDataBody, //body
    );
};


export const viewStockReturnedDataByReturnId = async (returnId) => {
    const formDataPair = {
        return: returnId,
    };

    const viewStockReturnedByReturnIdFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.GET_STOCK_RETURNED;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        viewStockReturnedByReturnIdFormDataBody, //body
    );
};

export const getStockReturnData = async (limit, pageNumber, startDate, finishDate) => {
    
    const url = UrlConstants.STOCK.GET_STOCK_RETURNED_DATA + `?startDate=${startDate}&finishDate=${finishDate}&page=${pageNumber}&limit=${limit}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};

export const getStockReturnByIdData = async (returnId, limit, pageNumber) => {
    
    const url = UrlConstants.STOCK.GET_STOCK_RETURNED_DATA + `?id=${returnId}&page=${pageNumber}&limit=${limit}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};


export const viewStockPurchaseOrdersViewGrnByPoId = async (purchaseOrderId, purchaseOrderGrnId) => {
    const formDataPair = {
        po: purchaseOrderId,
        grn_id: purchaseOrderGrnId,
    };

    const viewStockPurchaseOrderByPoIdFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.PO_VIEW_GRN;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        viewStockPurchaseOrderByPoIdFormDataBody, //body
    );
};


export const viewStockTransfersViewGrnByTransferId = async (transferId) => {
    const formDataPair = {
        transfer_id: transferId,
    };

    const viewStockTransferGrnByTransferIdFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.TRANSFER_VIEW_GRN;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        viewStockTransferGrnByTransferIdFormDataBody, //body
    );
};



export const addStockAdjustment = async (stockAdjustmentData) => {

    const url = UrlConstants.STOCK.ADD_ADJUSTMENT;
    const callType = GenericConstants.API_CALL_TYPE.POST;


    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        stockAdjustmentData //body
    );
};


export const viewInventoryTransfers = async (limit, pageNumber, startDate, finishDate) => {
    const formDataPair = {
        limit: limit,
        page: pageNumber, 
        startDate: startDate,
        finishDate: finishDate,
    };

    const viewInventoryTransfersFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.VIEW_TRANSFER;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        viewInventoryTransfersFormDataBody, //body
    );

};


export const transferInventory = async (transferInventoryData) => {
    const  transferInventoryFormData = {
        transfer: transferInventoryData,
    };

    //const transferInventoryFormDataBody =  $.param(transferInventoryFormData);
    const url = UrlConstants.STOCK.TRANSFER_OUT;
    const callType = GenericConstants.API_CALL_TYPE.POST;
    const headers = { 'Content-Type': 'application/json' };
    

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        transferInventoryFormData, //body
        headers,

        
    );

};



export const exportInventoryTransfers = async (params) => {

    let query = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
    

    //const url = UrlConstants.SALES.EXPORT_INVENTORY_DUMP+`/${storeId}`;         //imp prev
    const url = UrlConstants.STOCK.EXPORT_INVENTORY_TRANSFERS+'?'+ query;
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
            console.log('Inventory Transfers Export Data Response -> ', res);
            return { hasError: false, message: "Inventory Transfers Succesfully Exported", data: res.data };

        })
        .catch((error) => {
            console.log("AXIOS ERROR: ", error);
            return { hasError: true, errorMessage: error };

        })

};


export const exportPurchaseOrders = async (params) => {

    let query = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
    

    //const url = UrlConstants.SALES.EXPORT_INVENTORY_DUMP+`/${storeId}`;         //imp prev
    const url = UrlConstants.STOCK.EXPORT_PURCHASE_ORDERS+'?'+ query;
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
            console.log('Purchase Orders Export Data Response -> ', res);
            return { hasError: false, message: "Purchase Orders Succesfully Exported", data: res.data };

        })
        .catch((error) => {
            console.log("AXIOS ERROR: ", error);
            return { hasError: true, errorMessage: error };

        })

};


export const exportStockAdjustments = async (params) => {

    let query = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
    

    //const url = UrlConstants.SALES.EXPORT_INVENTORY_DUMP+`/${storeId}`;         //imp prev
    const url = UrlConstants.STOCK.EXPORT_STOCK_ADJUSTMENTS+'?'+ query;
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
            console.log('Stock Adjustments Export Data Response -> ', res);
            return { hasError: false, message: "Stock Adjustments Succesfully Exported", data: res.data };

        })
        .catch((error) => {
            console.log("AXIOS ERROR: ", error);
            return { hasError: true, errorMessage: error };

        })

};


export const exportReturnedStock = async (params) => {

    let query = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
    

    //const url = UrlConstants.SALES.EXPORT_INVENTORY_DUMP+`/${storeId}`;         //imp prev
    const url = UrlConstants.STOCK.EXPORT_STOCK_RETURNED+'?'+ query;
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
            console.log('Stock Returned Export Data Response -> ', res);
            return { hasError: false, message: "Stock Returned Succesfully Exported", data: res.data };

        })
        .catch((error) => {
            console.log("AXIOS ERROR: ", error);
            return { hasError: true, errorMessage: error };

        })

};


















