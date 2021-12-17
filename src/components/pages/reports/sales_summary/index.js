import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

// components
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import InfoRow from "../../../molecules/info_row";
import SwitchOutlet from "../../../atoms/switch_outlet";
import PageTitle from "../../../organism/header";
import DateRangePicker from "../../../molecules/date_range_picker";
import moment from "moment";
import SalesSummaryTable from "../../../organism/table/reports/sales_summary/salesSummaryTable";
import * as ReportsAPIUtils from "../../../../utils/api/reports-api-utils";
import * as Helper from "../../../../utils/helpers/scripts";
import PrintOverviewSales from "./salesSummaryPrint";

let mops = {
  cash: 0,
  credit: 0,
  customer: 0,
  discounts: 0,
};
function SalesSummary() {
  const history = useHistory();
  const historySelectedDatesValue = history.location.selectedDateRange || [];
  const [datesRange, setDatesRange] = useState([]);
  const [selectedDatesRange, setselectedDatesRange] = useState([]);

  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [salesMops, setSalesMops] = useState(mops);
  const [showSummaryTable, setShowSummaryTable] = useState(false);

  let selectedDates = [];
  const dateFormat = "YYYY-MM-DD";
  const handleRangePicker = (values) => {
    if (values) {
      let startDate = values[0]
        ? moment(values[0]).format(dateFormat)
        : moment(new Date()).format(dateFormat);
      let endDate = values[1]
        ? moment(values[1]).format(dateFormat)
        : moment(new Date()).format(dateFormat);
      selectedDates[0] = startDate;
      selectedDates[1] = endDate;
      setDatesRange(values);
    }
  };

  const fetchSalesHistoryWithDateRange = (e) => {
    let dates = [...datesRange];
    setselectedDatesRange(dates);
  };

  const startDate = selectedDatesRange[0]
    ? selectedDatesRange[0]
    : moment(new Date()).format(dateFormat);

  const finishDate = selectedDatesRange[1]
    ? selectedDatesRange[1]
    : moment(new Date()).format(dateFormat);

  let mounted = true;

  useEffect(() => {
    resetData();
    const page = 1;
    fetchSalesSummary(page, paginationLimit);

    return () => {
      mounted = false;
    };
  }, [selectedDatesRange]);

  const resetData = () => {
    setData([]);
    setCurrentPage(1);
    setPaginationData(0);
    setSalesMops({});
  };
  const checkValues = (value)=> {
   return  Helper.var_check_updated_all(
      value
    ) ? value % 1 !== 0
      ? parseFloat(value).toFixed(2)
      : value
      : 0;
  }

  const fetchSalesSummary = async (page, paginationLimit) => {
    document.getElementById("app-loader-container").style.display = "block";
    setLoading(true)
    const salesSummaryResponse = await ReportsAPIUtils.viewSalesSummery(
      startDate,
      finishDate,
      page,
      paginationLimit
    );

    console.log(salesSummaryResponse);
    if (salesSummaryResponse.hasError) {
      setLoading(false);
      setShowSummaryTable(false);
      document.getElementById("app-loader-container").style.display = "none";
      // showAlertUi(true, salesSummaryResponse.errorMessage);
    }
    if (salesSummaryResponse.success) {
      if (mounted) {
        const salesSummaryData = salesSummaryResponse?.data;
        let salesDataMops = {
          cash: 0,
          credit: 0,
          customer: 0,
          online: 0,
          discounts: 0,
        };
        salesSummaryData.forEach((element) => {
          if (element.MOP === "Credit Card") {
            salesDataMops.credit += parseFloat(element.Gross_Sales);
          } else if (element.MOP === "Online") {
            salesDataMops.online += parseFloat(element.Gross_Sales);
          } else if (element.MOP === "Cash") {
            salesDataMops.cash += parseFloat(element.Gross_Sales);
          } else {
            salesDataMops.customer += parseFloat(element.Gross_Sales);
          }
            salesDataMops.discounts += parseFloat(element.Discount);
        });

        salesDataMops.discounts = checkValues(salesDataMops.discounts)

        salesDataMops.cash = checkValues(salesDataMops.cash)
        salesDataMops.online = checkValues(salesDataMops.online)

        salesDataMops.credit = checkValues(salesDataMops.credit)

        salesDataMops.customer = checkValues(salesDataMops.customer)

        setSalesMops(salesDataMops); //setting sales mops
        setData(salesSummaryData);
        setPaginationData(salesSummaryResponse?.totalItems);
        setLoading(false);
        setShowSummaryTable(true);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  const showAlertUi = (show, errorText) => {
    return Helper.showAppAlertUiContent(show, errorText);
  };

  const handlePageChange = (currentPg) => {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchSalesSummary(currentPg, paginationLimit);
  };
  const downloadCSV = async () => {
    document.getElementById("app-loader-container").style.display = "block";
    const downloadResponse = await ReportsAPIUtils.downloadCsvFile(
      startDate,
      finishDate
    );
    console.log(downloadResponse);
    if (downloadResponse.hasError) {
      document.getElementById("app-loader-container").style.display = "none";
      console.log(
        "Cant fetch  products categories Data -> ",
        downloadResponse.errorMessage
      );
      showAlertUi(true, downloadResponse.errorMessage);
    }
    if (downloadResponse.success) {
      if (mounted) {
        const { link } = downloadResponse;
        let a = document.createElement("a");
        a.href = link;
        a.download = "sales_summary_data" + new Date().toUTCString() + ".csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
    document.getElementById("app-loader-container").style.display = "none";
  };
  const printSalesSummary = () => {
    const previewSalesHtml = document.getElementById("printTable").innerHTML;
    const doc =
      '<html><head><title></title><link rel="stylesheet" type="text/css" href="css/print.css" /></head><body onload="window.print(); window.close();">' +
      previewSalesHtml +
      "</body></html>";

    const popupWin = window.open(
      "",
      "_blank",
      "toolbar=no,scrollbars=yes,resizable=yes,top=100,left=400,width=500,height=500"
    );
    popupWin.document.open();

    popupWin.document.write(doc);
    popupWin.document.close();
  };

  return (
    <section className="page sales_summary">
      <div className="page__top">
        <SwitchOutlet />
      </div>

      <PageTitle title="Sales Summary" />

      <div className="page__buttons">
        <CustomButtonWithIcon
          onClick={downloadCSV}
          text="Download"
          iconName="Download"
          // disabled={!showSummaryTable}
        />

        <CustomButtonWithIcon
          onClick={printSalesSummary}
          text="Print Overview"
          disabled={!showSummaryTable}
        />
      </div>

      <InfoRow salesMops={salesMops} />
      {showSummaryTable && (
        <PrintOverviewSales
          salesSummaryMopsData={salesMops}
          calenderDates={datesRange}
        />
      )}
      <div className="page__body">
        <div className="page__date_picker">
          <DateRangePicker
            startDateLabel="Start Date"
            endDateLabel="End Date"
            isFilter={true}
            onCalenderDateSelect={handleRangePicker}
            onFetchButtonClick={fetchSalesHistoryWithDateRange}
          />
        </div>
        <div className="page__table t-summary">
          <SalesSummaryTable
            Data={data}
            paginationData={paginationData}
            tableDataLoading={loading}
            onClickPageChanger={handlePageChange}
            tableType="actions-history-listing"
            currentPageIndex={currentPage}
          />
        </div>
      </div>
    </section>
  );
}

export default SalesSummary;
