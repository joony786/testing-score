
import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';

export const getPOSuperAdmin = async (startDate, finishDate, limit, pageNumber) => {
   
    const url = UrlConstants.SUPER_ADMIN.GET_PO_SUPER_ADMIN + `?startDate=${startDate}&finishDate=${finishDate}&page=${pageNumber}&limit=${limit}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;
    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};

export const getSRSuperAdmin = async (startDate, finishDate, limit, pageNumber, is_super) => {
   
    const url = UrlConstants.SUPER_ADMIN.GET_SR_SUPER_ADMIN + `?startDate=${startDate}&finishDate=${finishDate}&page=${pageNumber}&limit=${limit}&is_super=${is_super}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;
    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};

export const approveStockRequest = async (requestId, requestStatus) => {
    const formDataPair = {
        status:  requestStatus,
        is_super: 1
    };

    const url = UrlConstants.SUPER_ADMIN.APPROVE_REQUEST_STATUS + requestId;
    const callType = GenericConstants.API_CALL_TYPE.PUT;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        formDataPair,  //body
    );
};


export const getStockRequestSuperAdminById = async (requestId, limit, pageNumber, is_super) => {
    const url = UrlConstants.SUPER_ADMIN.GET_STOCK_REQUEST_BY_ID + `?id=${requestId}&page=${pageNumber}&limit=${limit}&is_super=${is_super}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;
    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};


