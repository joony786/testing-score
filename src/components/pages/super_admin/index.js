import React, { useEffect, useState } from "react";
import { Tab, TabItem } from "@teamfabric/copilot-ui";
import { useHistory } from "react-router-dom";
// components
import CustomTable from "../../organism/table";
import SwitchOutlet from "../../atoms/switch_outlet";
import PageTitle from "../../organism/header";
import DateRangePicker from "../../molecules/date_range_picker";
import Constants from '../../../utils/constants/constants';
import moment from "moment";
import POSuperAdmin from "./po_super_admin";
import SRSuperAdmin from "./sr_super_admin";

const dateFormat = "YYYY-MM-DD";
let selectedDates = [];

function SuperAdmin(props) {

  const history = useHistory();
  const historySelectedDatesValue = history.location.selectedDateRange || [];
  const [datesRange, setDatesRange] = useState([]);
  const [selectedDatesRange, setselectedDatesRange] = useState([]);


  const { activeKey = "" } = props;

  let componentPassedDatesRange = selectedDatesRange;

  useEffect(() => {
    return () => { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.activeKey]);

  const fetchSalesHistoryWithDateRange = (e) => {
    let dates = [...datesRange];
    setselectedDatesRange(dates);
  };

  const handleRangePicker = (values) => {
    if (values) {
      let startDate = values[0] ? moment(values[0]).format(dateFormat) : moment(new Date()).format(dateFormat);
      let endDate = values[1] ? moment(values[1]).format(dateFormat) : moment(new Date()).format(dateFormat);
      selectedDates[0] = startDate;
      selectedDates[1] = endDate;
      setDatesRange(values);
    }
  };

  const handletabChange = (index) => {
    console.log(index);
    //let key = index === 0 ? Constants.SUPER_ADMIN.PURCHASE_ORDER : Constants.SUPER_ADMIN.STOCK_REQUEST;
    let key = Constants.SUPER_ADMIN.STOCK_REQUEST;
    history.push({
      pathname: `/super-admin`,
      activeKey: key,
      selectedDateRange:  selectedDatesRange.length > 0 ? selectedDatesRange : historySelectedDatesValue,
    });
  };

  return (
    <section className="page">
      <div className="page__top">
        <SwitchOutlet />
      </div>

      <PageTitle title="Super Admin" />

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

        <div className="page__tabs">
          <Tab
            {...props}
            variant="horizontal"
            heading=""
            navClassName="tabitem-space"
            tabChangeHandler={handletabChange}>

            {/* <TabItem title="Approvals for POs" active={activeKey && activeKey === Constants.SUPER_ADMIN.PURCHASE_ORDER}>
              <POSuperAdmin selectedDates={componentPassedDatesRange} />
            </TabItem> */}
            <TabItem title="Approvals for STRs" active={activeKey && activeKey === Constants.SUPER_ADMIN.STOCK_REQUEST}>
              <SRSuperAdmin selectedDates={componentPassedDatesRange} />
            </TabItem>
          </Tab>
        </div>
      </div>
    </section>
  );
}

export default SuperAdmin;
