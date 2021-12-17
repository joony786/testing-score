import React, { useState, useEffect } from "react";

// components
import CustomTableView from "../../../organism/table/tableView/index";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import * as Helpers from "../../../../utils/helpers/scripts";
import CustomTableAtionMenuItem from "../../../organism/table/table_helpers/tableActionMenu";
import moment from "moment";
import { useHistory } from "react-router";

const dateFormat = "YYYY-MM-DD";

function StockAdjustment(props) {

  const { selectedDates = ""} = props;
  const [paginationLimit,] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const history = useHistory();

  let mounted = true;

  const fetchStockAdjustmentData = async (pageLimit = 10, pageNumber = 1) => {
    let startDate  =  selectedDates[0] ? selectedDates[0]  : moment(new Date()).format(dateFormat);
    let finishDate =  selectedDates[1] ? selectedDates[1]  : moment(new Date()).format(dateFormat);
    document.getElementById('app-loader-container').style.display = "block";
    const stockAdjustmentViewResponse = await StockApiUtil.viewStockAdjustments(pageLimit, pageNumber, startDate, finishDate);
    if (stockAdjustmentViewResponse.hasError) {
      setLoading(false);
      setData([]);  //imp
      document.getElementById('app-loader-container').style.display = "none";
      if(stockAdjustmentViewResponse.errorMessage !== "No Adjustment Found"){
        showAlertUi(true, stockAdjustmentViewResponse.errorMessage);  //imp
      }
    } else {
      if (mounted) {     //imp if unmounted
        const stockAdjustmentData = stockAdjustmentViewResponse.stockAdjustment.data;
        for (let i = 0; i < stockAdjustmentData.length; i++) {
          let item = stockAdjustmentData[i];
          item.date = moment(item.date).format(dateFormat);
          item.menu = (
            <CustomTableAtionMenuItem
              tableItem={item}
              tableItemId={item.id}
              tableItemMenuType="stockAdjustment"
              handleTableMenuItemClick={handleTableMenuItemClick}
            />
          );
        }
        setData(stockAdjustmentData);
        setPaginationData(stockAdjustmentViewResponse.stockAdjustment.page || {});
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }

  };

  useEffect(() => {
    fetchStockAdjustmentData();
    return () => {
      mounted = false;
    }
  }, [selectedDates]);

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchStockAdjustmentData(paginationLimit, currentPg);
  }

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  }

  const handleTableMenuItemClick = (adjustmentId, stockAdjustment, itemLabel) => {
    if (itemLabel === "View") {
      history.push({
        pathname: `/stock-control/stock-adjustments/${adjustmentId}/view`,
      });
    }
  };

  return (

    <div className="stock_tables">
      <div className="page__table">
        <CustomTableView
          tableData={data}
          paginationData={paginationData}
          tableDataLoading={loading}
          onClickPageChanger={handlePageChange}
          currentPageIndex={currentPage}
          tableType="stockAdjustment"
        />
      </div>
    </div>
  );
}

export default StockAdjustment;
