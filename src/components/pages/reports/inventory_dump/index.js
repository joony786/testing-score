import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
// components
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import DateRangePicker from "../../../molecules/date_range_picker";
import SwitchOutlet from "../../../atoms/switch_outlet";
import PageTitle from "../../../organism/header";
import ReportsInventoryTable from "../../../organism/table/reports";
import * as Helpers from "../../../../utils/helpers/scripts";
import * as ReportsApiUtil from "../../../../utils/api/reports-api-utils";
import { Button } from "@teamfabric/copilot-ui/dist/atoms";

function InventoryDump() {
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [inventoryCount, setInventoryCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [selectedDatesRange, setselectedDatesRange] = useState([]);
  const [datesRange, setDatesRange] = useState([]);

  let mounted = true;
  const dateFormat = "YYYY-MM-DD";

  const fetchInventoryDumpData = async (currentPage, paginationLimit) => {
    document.getElementById("app-loader-container").style.display = "block";
    const reportsInventoryViewResponse =
    // startDate,
    // finishDate,
    // currentPage,
    // paginationLimit
      await ReportsApiUtil.viewPrductsInventory();
    if (reportsInventoryViewResponse.hasError) {
      setLoading(false);
      setData([]); //imp
      document.getElementById("app-loader-container").style.display = "none";
      // showAlertUi(true, reportsInventoryViewResponse.errorMessage); //imp
    } else {
      if (mounted) {
        //imp if unmounted
        const inventoryData = reportsInventoryViewResponse?.data;
        let totalQuantity = 0;
        inventoryData.map((item) => {
          return (totalQuantity = Number(totalQuantity) + Number(item.Quantity));
        });
        setData(inventoryData);
        setInventoryCount(totalQuantity);
        setPaginationData(reportsInventoryViewResponse?.totalItems);
        setLoading(false);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  useEffect(() => {
    fetchInventoryDumpData(currentPage, paginationLimit);
    return () => {
      mounted = false;
    };
  }, [selectedDatesRange]);

  let selectedDates = [];

  const exportInventoryData = async () => {
    if (data.length > 0) {
      if (buttonDisabled === false) {
        setButtonDisabled(true);
      }

      document.getElementById("app-loader-container").style.display = "block";
      const inventoryExportResponse =
        await ReportsApiUtil.exportInventoryDumpData();
      console.log("inventory export response:", inventoryExportResponse);

      if (inventoryExportResponse.hasError) {
        setButtonDisabled(false);
        document.getElementById("app-loader-container").style.display = "none";
        showAlertUi(true, inventoryExportResponse.errorMessage);
      } else {
        /*---------------csv download--------------------------------*/
        if (mounted) {
          //imp if unmounted
          let a = document.createElement("a");
          //console.log(customersExportResponse.link);
          a.href =
            inventoryExportResponse &&
            inventoryExportResponse.link &&
            inventoryExportResponse.link;
          a.download = "customers_" + new Date().toUTCString() + ".csv";
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          //a.target = "_blank";
          a.click();
          a.remove(); //afterwards we remove the element again
          /*---------------csv download--------------------------------*/
          //imp if not mounted then change state
          setButtonDisabled(false);
          document.getElementById("app-loader-container").style.display =
            "none";
        }
      }
    } else {
      showAlertUi(true, "No Inventory Found");
    }
  };

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchInventoryDumpData(currentPg, paginationLimit);
  }

  const fetchSalesHistoryWithDateRange = (e) => {
    console.log("inside fetch dates");
    let dates = [...datesRange];
    setselectedDatesRange(dates);
  };

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

  const startDate = selectedDatesRange[0]
    ? selectedDatesRange[0]
    : moment(new Date()).format(dateFormat);

  const finishDate = selectedDatesRange[1]
    ? selectedDatesRange[1]
    : moment(new Date()).format(dateFormat);

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  return (
    <section className="page">
      <div className="page__top">
        <SwitchOutlet />
      </div>

      <PageTitle title="Inventory Dump" />
      <div className="page__buttons">
        {
          <CustomButtonWithIcon
            text="Download"
            iconName="Download"
            isLoading={loading}
            onClick={exportInventoryData}
            disabled={buttonDisabled}
          />
        }
      </div>

      {/* {inventoryCount > 0 && ( */}
      <section className="page__header inventory-dump">
        <span className="products-inventory-count"> {inventoryCount}</span>
      </section>
      {/* )} */}

      <div className="page__body">
        {/* <div className="fetch__btn-inventoryDump "> */}
          {/* <DateRangePicker
            startDateLabel="Start Date"
            endDateLabel="End Date"
            isFilter={true}
            onCalenderDateSelect={handleRangePicker}
            onFetchButtonClick={fetchSalesHistoryWithDateRange}
          /> */}
          {/* <Button
        onClick={fetchInventoryDumpData}
        size="small"
        text={"Fetch"}
      /> */}
        {/* </div> */}

        {/* Table */}
        <div className="page__table t-big">
          <ReportsInventoryTable
            pageLimit={paginationLimit}
            Data={data}
            tableDataLoading={loading}
            onClickPageChanger={handlePageChange}
            currentPageIndex={currentPage}
            paginationData={paginationData}
            tableType="reports-inventory-dump-listing"
          />
        </div>
        {/* Table */}
      </div>
    </section>
  );
}

export default InventoryDump;
