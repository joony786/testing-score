
import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';

export const addSupplier = async (supplierName, supplierContactName,
    supplierPhone, supplierEmail, supplierTaxNumber) => {

    const addSupplierDataBody = {
        name: supplierName,
        contact_name: supplierContactName,
        phone: supplierPhone,
        email: supplierEmail,
        tax_number: supplierTaxNumber,
    };

    const url = UrlConstants.SUPPLIERS.ADD_SUPPLIER;
    const callType = GenericConstants.API_CALL_TYPE.POST;
    const headers = {'Content-Type': 'application/json'};

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        addSupplierDataBody, //body
        headers
    );
};


export const getSupplier = async (supplierId) => {

    const url = UrlConstants.SUPPLIERS.GET_SUPPLIER + `?id=${supplierId}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};


export const searchSuppliers = async (limit, PageNumber, searchvalue) => {

    const url = UrlConstants.SUPPLIERS.SEARCH + `?name=${searchvalue}&limit=${limit}&page=${PageNumber}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};



export const viewSuppliers = async (limit, PageNumber) => {
    
    
    const url = UrlConstants.SUPPLIERS.VIEW + `?limit=${limit}&page=${PageNumber}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};

export const viewAllSuppliers = async () => {
    
    const url = UrlConstants.SUPPLIERS.VIEW_ALL;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};

export const deleteSupplier = async (supplierId) => {
   
    const url = UrlConstants.SUPPLIERS.DELETE_SUPPLIER  +`/${supplierId}`;
    const callType = GenericConstants.API_CALL_TYPE.DELETE;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};

export const editSupplier = async (supplierId, supplierName, supplierContactName,
    supplierPhone, supplierEmail, supplierTaxNumber) => {
    const updateSupplierDataBody = {
        name: supplierName,
        contact_name: supplierContactName,
        phone: supplierPhone,
        email: supplierEmail,
        tax_number: supplierTaxNumber,
    };
  
    const url = UrlConstants.SUPPLIERS.EDIT_SUPPLIER + `/${supplierId}`;
    const callType = GenericConstants.API_CALL_TYPE.PUT;
    const headers = {'Content-Type': 'application/json'};

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        updateSupplierDataBody, //body
        headers,
    );
};

