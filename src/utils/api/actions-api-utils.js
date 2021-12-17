import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';

export const viewActionsHistoryData = async (
  limit,
  PageNumber,
  storeId,
  startDateTime,
  endDateTime
) => {
  const url =
    UrlConstants.ACTIONS_HISTORY.VIEW +
    `?store=${storeId}&startDate=${startDateTime}&finishDate=${endDateTime}&limit=${limit}&page=${PageNumber}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;
  return ApiCallUtil.http(url, callType);
};
