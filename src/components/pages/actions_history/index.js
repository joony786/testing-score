import React, { useState, useEffect } from 'react';
import { Modal } from '@teamfabric/copilot-ui';
import ReactJson from 'react-json-view';

// components
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
} from '../../../utils/local-storage/local-store-utils';
import Constants from '../../../utils/constants/constants';
import PageTitle from '../../organism/header';
import ActionsViewDataTable from '../../organism/table/actions_table';
import * as ActionsHistoryApiUtil from '../../../utils/api/actions-api-utils';
// import * as Helpers from "../../../utils/helpers/scripts";
import SwitchOutlet from '../../atoms/switch_outlet';
import DateRangePicker from '../../molecules/date_range_picker';
import moment from 'moment';

function ActionHistory() {
  const [paginationLimit] = useState(20);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [datesRange, setDatesRange] = useState([]);
  const [selectedDatesRange, setselectedDatesRange] = useState([]);


  const dateFormat = 'YYYY-MM-DD';
  const startDate = selectedDatesRange[0]
    ? selectedDatesRange[0]
    : moment(new Date()).format(dateFormat);

  const finishDate = selectedDatesRange[1]
    ? selectedDatesRange[1]
    : moment(new Date()).format(dateFormat);

  const startDateTime = startDate + ' 00:00:00';
  const endDateTime = finishDate + ' 23:59:59';
  

  const [isViewActionDataModalVisible, setIsViewActionDataModalVisible] =
    useState(false);
  const [viewItemActionData, setViewItemActionData] = useState(null);
  const [currentStoreId, setCurrentStoreId] = useState('');

  let mounted = true;

  useEffect(() => {
    resetData();
    const page = 1;
    let readFromLocalStorage = getDataFromLocalStorage(
      Constants.USER_DETAILS_KEY
    );
    readFromLocalStorage = readFromLocalStorage.data
      ? readFromLocalStorage.data
      : null;
    if (readFromLocalStorage) {
      if (
        checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
      ) {
        let currentStore = readFromLocalStorage?.store_id;
        setCurrentStoreId(currentStore);
        fetchActionsHistoryData(paginationLimit, page, currentStore);
      } else {
        setCurrentStoreId('');
      }
    }

    return () => {
      mounted = false;
    };
  }, [selectedDatesRange]);

  const resetData = () => {
    setData([]);
    setCurrentPage(1);
    setPaginationData(0);
  };
  const fetchActionsHistoryData = async (
    pageLimit,
    pageNumber,
    currentStore
  ) => {
    document.getElementById('app-loader-container').style.display = 'block';
    const actionsHistoryViewResponse =
      await ActionsHistoryApiUtil.viewActionsHistoryData(
        pageLimit,
        pageNumber,
        currentStore && currentStore,
        startDateTime,
        endDateTime
      );
    if (actionsHistoryViewResponse.hasError) {
      setLoading(false);
      document.getElementById('app-loader-container').style.display = 'none';
    } else {
      if (mounted) {
        //imp if unmounted
        const actionsHistoryData = actionsHistoryViewResponse?.Record?.data;
        setData(actionsHistoryData && actionsHistoryData);
        setPaginationData(actionsHistoryViewResponse?.Record?.page);
        setLoading(false);
        document.getElementById('app-loader-container').style.display = 'none';
      }
    }
  };

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchActionsHistoryData(
      paginationLimit,
      currentPg,
      currentStoreId && currentStoreId
    );
  }

  const handleRangePicker = (values) => {
    if (values) {
      setDatesRange(values);
    }
  };

  const renderViewActionDataModalContent = (ActionItemData) => {
    let quickViewData = ActionItemData.data;
    return (
      <div className='action_modal__content'>
        <h2 className='action_modal__heading'>Action Data</h2>
        <div className='action_modal__inner'>
          <ReactJson displayDataTypes={false} src={quickViewData} />
        </div>
      </div>
    );
  };

  const handleViewActionDataModalCancel = () => {
    setIsViewActionDataModalVisible(false);
  };

  const handleViewActionData = (tableRecordActionItemData) => {
    setIsViewActionDataModalVisible(true);
    setViewItemActionData(
      tableRecordActionItemData && tableRecordActionItemData
    );
  };

  const fetchSalesHistoryWithDateRange = (e) => {
    let dates = [...datesRange];
    setselectedDatesRange(dates);
  };

  return (
    <section className='page actions-history'>
      <div className='page__top'>
        <SwitchOutlet />
      </div>

      <PageTitle title='Actions History' />

      <div className='page__body'>
        <div className='page__date_picker'>
          <DateRangePicker
            startDateLabel='Start Date'
            endDateLabel='End Date'
            isFilter={true}
            isTime={true}
            onCalenderDateSelect={handleRangePicker}
            onFetchButtonClick={fetchSalesHistoryWithDateRange}
          />
        </div>

        <div className='page__table'>
          <ActionsViewDataTable
            tableData={data}
            paginationData={paginationData && paginationData}
            tableDataLoading={loading}
            onClickPageChanger={handlePageChange}
            onClickViewTableActionData={handleViewActionData}
            tableType='actions-history-listing'
            currentPageIndex={currentPage}
          />
        </div>

        {/*------------------------edit column-value--modal---------------------------*/}
        {isViewActionDataModalVisible && (
          <Modal
            headerButtons={[]}
            onBackdropClick={handleViewActionDataModalCancel}
            onClose={handleViewActionDataModalCancel}
            padding='20px 40px 20px 40px'
            render={() => renderViewActionDataModalContent(viewItemActionData)}
            className='action_modal'
            showCloseButton
            footerButtons={[
              {
                isPrimary: false,
                onClick: handleViewActionDataModalCancel,
                text: 'Cancel',
              },
            ]}
          />
        )}
      </div>
    </section>
  );
}

export default ActionHistory;
