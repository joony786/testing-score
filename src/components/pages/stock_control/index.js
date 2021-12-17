import React, { useEffect, useState } from "react";
import { Tab, TabItem } from "@teamfabric/copilot-ui";
import { Link, useHistory } from "react-router-dom";

// components
import CustomTable from "../../organism/table";
import SwitchOutlet from "../../atoms/switch_outlet";
import PageTitle from "../../organism/header";
import DateRangePicker from "../../molecules/date_range_picker";
import Constants from "../../../utils/constants/constants";
import StockRequest from "./stock_request";
import StockAdjustment from "./stock_adjustment";
import ActionsCustomFlyout from "../../atoms/actionsMenuFlyout";
import moment from "moment";
import PurchaseOrderProductTable from "../../organism/table/stock/purchaseOrderProductTable";

import ReturnStock from "./return_stock";
import Permissions from "../../../utils/constants/user-permissions";
import * as PermissionsHelpers from "../../../utils/helpers/check-user-permission";
import ActionMenuForSubItems from "../../atoms/actionsMenuFlyout/actionMenuForSubItems";


const dateFormat = "YYYY-MM-DD";
let selectedDates = [];

function StockControl(props) {
  const history = useHistory();
  const historySelectedDatesValue = history.location.selectedDateRange || [];
  const [datesRange, setDatesRange] = useState([]);
  const [selectedDatesRange, setselectedDatesRange] = useState([]);
  const modulePOAddCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.WRITE.PURCHASE_ORDERS
  );
  const moduleSRIAddCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.WRITE.TRANSFERS
  );
  const moduleSAAddCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.WRITE.STOCK_ADJUSTMENTS
  );
  const moduleSRAddCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.WRITE.STOCK_RETURNS
  );

  const moduleSRIReadCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.READ.TRANSFERS
  );
  const moduleSAReadCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.READ.STOCK_ADJUSTMENTS
  );

  const { activeKey = "" } = props;

  let componentPassedDatesRange = selectedDatesRange;

  const [tabOptions, setTabOptions] = useState([]);

  useEffect(() => {
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.activeKey]);

  const fetchSalesHistoryWithDateRange = (e) => {
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

  const handletabChange = (index) => {
    const key = tabOptions.at(index);
    history.push({
      pathname: `/stock-control/${key}`,
      activeKey: key,
      selectedDateRange:
        selectedDatesRange.length > 0
          ? selectedDatesRange
          : historySelectedDatesValue,
    });
  };

  const changeRoute = (label) => {
    switch (label) {
      case "Order Stock": {
        history.push("/stock-control/purchase-orders/add");
        break;
      }
      case "Stock Request": {
        history.push("/stock-control/stock-request/add");
        break;
      }
      case "Stock Cycling": {
        history.push("/stock-control/stock-adjustments/add");
        break;
      }
      case "Return Stock": {
        history.push("/stock-control/returned-stock/add");
        break;
      }
      default:
        break;
    }
  };

  const handleTableMenuItemClick = (propId, propObj, itemLabel) => {
    console.log('inside');
    // changeRoute(itemLabel);
    changeRoute(itemLabel.props.children)
  };

  let actionMenuOptions = [
        /*{
      label: (
        <Link className={!modulePOAddCheck ? "button-disabled": "flyout-action-menu-link"} to="/stock-control/purchase-orders/add">
          Order Stock
        </Link>
      ),
    },*/
    {
      label: (
        <Link className={!moduleSRIAddCheck ? "button-disabled": "flyout-action-menu-link"} to="/stock-control/stock-request/add">
          Stock Request
        </Link>
      ),
    },
    {
      label: (
        <Link
          className={!moduleSAAddCheck ? "button-disabled" : "flyout-action-menu-link"} to="/stock-control/stock-adjustments/add">
           Stock Cycling
        </Link>
      ),
    },
     /*{
      label: (
        <Link
          className={!moduleSRAddCheck ? "button-disabled": "flyout-action-menu-link"} to="/stock-control/returned-stock/add">
          Return Stock
        </Link>
      ),
    }*/
  ];
  useEffect(() => {
    const options = [];
    if (moduleSRIReadCheck) {
      options.push(Constants.STOCK_CONTROL.STOCK_REQUEST);
    }
    if (moduleSAReadCheck) {
      options.push(Constants.STOCK_CONTROL.STOCK_ADJUSTMENTS);
    }
    setTabOptions(options);
  }, []);
  return (
    <section className="page">
      <div className="page__top">
        <SwitchOutlet />
      </div>

      <PageTitle title="Stock Control" />

      <div className="page__buttons">
        <ActionMenuForSubItems
          propId={"setup-actions-menu"}
          //propObj={tableItem}
          menuItems={actionMenuOptions}
          menuItemClick={handleTableMenuItemClick}
        />
      </div>

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
            tabChangeHandler={handletabChange}
          >
            {/*<TabItem title="Purchase Orders" active={activeKey && activeKey === Constants.STOCK_CONTROL.PURCHASE_ORDER}>
              <PurchaseOrderProductTable selectedDates={componentPassedDatesRange} />
            </TabItem>*/}

            {moduleSRIReadCheck &&
            <TabItem
              title="Stock Request"
              active={
                activeKey && activeKey === Constants.STOCK_CONTROL.STOCK_REQUEST
              }
            >
              <StockRequest selectedDates={componentPassedDatesRange} />
            </TabItem>}

            {moduleSAReadCheck &&
            <TabItem
              title="Stock Cycling"
              active={
                activeKey &&
                activeKey === Constants.STOCK_CONTROL.STOCK_ADJUSTMENTS
              }
            >
              <StockAdjustment selectedDates={componentPassedDatesRange} />
            </TabItem>}
            
            {/*<TabItem title="Returned Stock" active={activeKey && activeKey === Constants.STOCK_CONTROL.RETURN_STOCK}>
              <ReturnStock selectedDates={componentPassedDatesRange}/>
            </TabItem>*/}
          </Tab>
        </div>
      </div>
    </section>
  );
}

export default StockControl;
