import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';
import axios from 'axios';



export const addProduct = async (productAddData) => {

};

export const updateProduct = async (productAddData) => {
    const url = UrlConstants.PRODUCTS.UPDATE_PRODUCT_DISCOUNT;
    const callType = GenericConstants.API_CALL_TYPE.PUT;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        productAddData //body
    );
};


export const syncProducts = async (lastUpdated) => {

    const userAuth = ApiCallUtil.getUserAuth();

    const url = UrlConstants.PRODUCTS.SYNC_PRODUCTS + `?lastUpdated=${lastUpdated}`;
    let headers = {
        'Authorization': `Bearer ${ApiCallUtil.getUserAuthToken()}`,
    };

    if (userAuth?.brand_id) {
        headers["brand_id"] = userAuth?.brand_id;
    }

    if (userAuth?.store_id) {
        headers["store_id"] = userAuth?.store_id;
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


export const syncPrices = async (postSyncPriceData) => {

    const userAuth = ApiCallUtil.getUserAuth();
 
    const url = UrlConstants.PRODUCTS.SYNC_PRICES;
    let headers = {
        'Authorization': `Bearer ${ApiCallUtil.getUserAuthToken()}`,
    };

    if (userAuth?.brand_id) {
        headers["brand_id"] = userAuth?.brand_id;
    }

    if (userAuth?.store_id) {
        headers["store_id"] = userAuth?.store_id;
    }
  
    return await axios.post(url, postSyncPriceData, {
        headers: headers
    })
        .then(async (res) => {
          let responseData = res?.data;
          if(responseData?.success) {
            return { hasError: false, ...responseData };
          }
          else {
            return { hasError: true, errorMessage: responseData.message, ...responseData  };
          }
  
        })
        .catch((err) => {
            console.log("AXIOS ERROR: ", err);
            const errorMessage =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                err?.response?.data?.data?.message ||
                "Unable to complete the request";
            return { hasError: true, errorMessage: errorMessage };
  
        })

};


export const productsBulkUpload = async (bulkProductsFile) => {
    const bulkProductsDataBody = {
        file: bulkProductsFile
    };

    const productsBulkUploadFormDataBody = ApiCallUtil.constructFormData(bulkProductsDataBody);
    const url = UrlConstants.PRODUCTS.BULK_UPLOAD;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        productsBulkUploadFormDataBody,  //body
    );
};


export const viewVariants = async (productUniqueId) => {
    const formDataPair = {
        id: productUniqueId
    };
    const productVariantsFormDataBody = ApiCallUtil.constructFormData(
        formDataPair
    );
    const url = UrlConstants.PRODUCTS.VIEW_VARIANTS;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        productVariantsFormDataBody //body
    );
};

export const productsLookUp = async (productSku) => {
    const url = UrlConstants.PRODUCTS.LOOKUP + `?sku=${productSku}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType //calltype
    );
};

export const viewProducts = async (limit, PageNumber) => {
   
    const url = UrlConstants.PRODUCTS.VIEW + `?limit=${limit}&page=${PageNumber}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};


export const viewBundlesProducts = async (limit, PageNumber) => {
   
    const url = UrlConstants.PRODUCTS.VIEW + `?limit=${limit}&page=${PageNumber}&has_bundle=${1}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};


export const searchProduct = async (searchValue) => {
   
    const url = UrlConstants.PRODUCTS.VIEW + `?name=${searchValue}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};

export const viewBundleProducts = async (limit, PageNumber) => {
   
    const url = UrlConstants.PRODUCTS.VIEW + `?limit=${limit}&page=${PageNumber}&has_bundle=${1}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype

    );
};

export const fetchByName = async (value,limit, PageNumber) => {

    const params = `?name=${value}&limit=${limit}&page=${PageNumber}`

    const url = UrlConstants.PRODUCTS.GET_REGISTERED_PRODUCTS + params;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url,
        callType,
    );
};

export const fetchProductBySku = async (value,limit, PageNumber) => {

     const params = `?sku=${value}&limit=${limit}&page=${PageNumber}`

    const url = UrlConstants.PRODUCTS.VIEW + params;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url,
        callType,
    );
};

export const getFullRegisteredProducts = async () => {
    const url = UrlConstants.PRODUCTS.GET_FULL_REGISTERED_PRODUCTS;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType //calltype
    );
};

export const saveProductsDiscountedData = async (discountedProducts) => {
   
};

export const searchProducts = async (limit, PageNumber, searchvalue) => {
    
    const url = UrlConstants.PRODUCTS.SEARCH + `?name=${searchvalue}&limit=${limit}&page=${PageNumber}&register=1`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};


export const searchProductsMain = async (limit, PageNumber, searchvalue) => {
    
    const url = UrlConstants.PRODUCTS.SEARCH + `?name=${searchvalue}&limit=${limit}&page=${PageNumber}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};


export const searchBundlesProducts = async (limit, PageNumber, searchvalue) => {
    
    const url = UrlConstants.PRODUCTS.SEARCH + `?name=${searchvalue}&limit=${limit}&page=${PageNumber}&has_bundle=${1}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};


export const searchProductsByName = async (searchvalue) => {
    const formDataPair = {
        name: searchvalue
    };
    const searchProductsByNameFormDataBody = ApiCallUtil.constructFormData(
        formDataPair
    );
    const url = UrlConstants.PRODUCTS.SEARCH;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        searchProductsByNameFormDataBody
    );
};

export const deleteProduct = async (productId) => {
    const formDataPair = {
        id: productId
    };
    const deleteProductFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.PRODUCTS.DELETE_PRODUCT;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        deleteProductFormDataBody //body
    );
};

export const editProduct = async (productEditData) => {
    const editProductFormDataBody = ApiCallUtil.constructFormData(
        productEditData
    );
    const url = UrlConstants.PRODUCTS.EDIT_PRODUCT;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        editProductFormDataBody //body
    );
};

export const getProduct = async (productId) => {
    const formDataPair = {
        id: productId
    };
    const getProductFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.PRODUCTS.GET_PRODUCT;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        getProductFormDataBody //body
    );
};

export const imageUpload = async (productImg) => {
    const formDataPair = {
        image: productImg
    };
    const imageUploadFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.PRODUCTS.IMG_UPLOAD;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        imageUploadFormDataBody //body
    );
};

export const getProductMovementReport = async (productId) => {
    const formDataPair = {
        id: productId
    };

    const producttMovementReportFormDataBody = ApiCallUtil.constructFormData(
        formDataPair
    );
    const url = UrlConstants.PRODUCTS.GET_MOVEMENT_REPORT;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        producttMovementReportFormDataBody //body
    );
};


export const getStoreId = async () => {

    const url = UrlConstants.PRODUCTS.GET_STORE;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};



export const exportProductsData = async (params) => {

    let query = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
    

    //const url = UrlConstants.SALES.EXPORT_INVENTORY_DUMP+`/${storeId}`;         //imp prev
    const userAuth = ApiCallUtil.getUserAuth();
    const url = UrlConstants.PRODUCTS.EXPORT_PRODUCTS+'?'+ query;
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
            console.log('Products Export Data Response -> ', res);
            return { hasError: false, message: "Products Data Succesfully Exported", data: res.data };

        })
        .catch((error) => {
            console.log("AXIOS ERROR: ", error);
            return { hasError: true, errorMessage: error };

        })

};



export const createComplexAddFormData = (addProductData) => {
    const addProductFormDataBody = new FormData();

    Object.entries(addProductData).forEach(([objKey, objValue]) => {
        console.log(objKey);
        /////////////chec entries///////////////
        if (objKey === 'varData') {
            objValue.forEach((varDataItem, varDataIndex) => {
                Object.entries(varDataItem).forEach(
                    ([varDataItemEntriesKey, varDataItemEntriesObjValue]) => {
                        if (varDataItemEntriesKey === 'outletInfo') {
                            varDataItemEntriesObjValue.forEach((outletItem, outletIndex) => {
                                Object.entries(outletItem).forEach(
                                    ([outletItemEntriesKey, outletItemEntriesValue]) => {
                                        addProductFormDataBody.append(
                                            `varData[${varDataIndex}]outletInfo[${outletIndex}][${outletItemEntriesKey}]`,
                                            outletItemEntriesValue
                                        ); //inner level basic
                                    }
                                );
                            });
                        } else if (varDataItemEntriesKey === 'qty') {
                            varDataItemEntriesObjValue.forEach((qtyItem, qtyIndex) => {
                                Object.entries(qtyItem).forEach(
                                    ([qtyItemEntriesKey, qtyItemEntriesValue]) => {
                                        addProductFormDataBody.append(
                                            `varData[${varDataIndex}]qty[${qtyIndex}][${qtyItemEntriesKey}]`,
                                            qtyItemEntriesValue
                                        ); //inner level basic
                                    }
                                );
                            });
                        } else {
                            addProductFormDataBody.append(
                                `varData[${varDataIndex}][${varDataItemEntriesKey}]`,
                                varDataItemEntriesObjValue
                            ); //inner level basic
                        }
                    }
                );
            }); /**end of foreach */
        } else if (objKey == 'open_qty') {
            objValue.forEach((openQtyItem, openQtyItemIndex) => {
                Object.entries(openQtyItem).forEach(
                    ([openQtyItemItemEntriesKey, openQtyItemItemEntriesValue]) => {
                        addProductFormDataBody.append(
                            `open_qty[${openQtyItemIndex}][${openQtyItemItemEntriesKey}]`,
                            openQtyItemItemEntriesValue
                        ); //inner level basic
                    }
                );
            });
        } else {
            addProductFormDataBody.append(objKey, objValue); //root level main
        }

        //////////////////check entries//////////
    });

    //console.log(addProductFormDataBody);

    return addProductFormDataBody;
};
