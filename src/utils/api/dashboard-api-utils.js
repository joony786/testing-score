
import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';


export const getDashboardData = async () => {
  
  const url = UrlConstants.DASHBOARD.VIEW_DATA;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype

  );
};



