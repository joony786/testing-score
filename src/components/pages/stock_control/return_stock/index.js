import React, { useState, useEffect } from "react";

// components
import CustomTableView from "../../../organism/table/tableView/index";
import CustomTableAtionMenuItem from "../../../organism/table/table_helpers/tableActionMenu";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import * as Helpers from "../../../../utils/helpers/scripts";
import { useHistory } from "react-router-dom";
import moment from "moment";

const dateFormat = "YYYY-MM-DD";

function ReturnStock(props) {

  const { selectedDates = ""} = props;
  const [paginationLimit,] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const history = useHistory();


  let mounted = true;

  const fetchReturnStockData = async (pageLimit = 10, pageNumber = 1) => {
    let startDate  =  selectedDates[0] ? selectedDates[0]  : moment(new Date()).format(dateFormat);
    let finishDate =  selectedDates[1] ? selectedDates[1]  : moment(new Date()).format(dateFormat);
    document.getElementById('app-loader-container').style.display = "block";
    const returnStockViewResponse = await StockApiUtil.getStockReturnData(pageLimit, pageNumber, startDate, finishDate);
    if (returnStockViewResponse.hasError) {
      setLoading(false);
      setData([]);  //imp
      document.getElementById('app-loader-container').style.display = "none";
      if(returnStockViewResponse.errorMessage !== "No Returns"){
        showAlertUi(true, returnStockViewResponse.errorMessage);  //imp
      }
    } else {
      if (mounted) {     //imp if unmounted
        const returnStockData = returnStockViewResponse.return.data;
        for (let i = 0; i < returnStockData.length; i++) {
          let item = returnStockData[i];
          if(item.is_synced === "1"){
            item.is_synced = "waiting";
          }
          item.menu = <CustomTableAtionMenuItem tableItem={item}
            tableItemId={item.id} tableItemMenuType="returnStock"
            handleTableMenuItemClick={handleTableMenuItemClick} />
        }
        /*--------------------------setting menu option-------------------------*/
        setData(returnStockData);
        setPaginationData(returnStockViewResponse.return.page || {});
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }
  };


  useEffect(() => {
    fetchReturnStockData();
    return () => {
      mounted = false;
    }
  }, [selectedDates]);


  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchReturnStockData(paginationLimit, currentPg);
  }


  const handleTableMenuItemClick = (returnId, returnStock, itemLabel) => {
    if (itemLabel === "View") {
      history.push({
        pathname: `/stock-control/returned-stock/${returnId}/view`,
      });
    }
  };


  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  }

  return (

    <section className="page">
      {/* Table */}
      <div className="page__table">
        <CustomTableView
          tableData={data}
          paginationData={paginationData}
          tableDataLoading={loading}
          onClickPageChanger={handlePageChange}
          currentPageIndex={currentPage}
          tableType="returnStock"
        />
      </div>
      {/* Table */}

    </section>
  );
}

export default ReturnStock;