import React, { useState, useEffect } from "react";

// components
import CustomTableView from "../../../organism/table/tableView/index";
import CustomTableAtionMenuItem from "../../../organism/table/table_helpers/tableActionMenu";
import { Modal } from "@teamfabric/copilot-ui/dist/organisms";
import * as StockApiUtil from "../../../../utils/api/stock-api-utils";
import * as Helpers from "../../../../utils/helpers/scripts";
import Constants from "../../../../utils/constants/constants";
import { useHistory } from "react-router-dom";
import moment from "moment";
import Permissions from "../../../../utils/constants/user-permissions";
import * as PermissionsHelpers from "../../../../utils/helpers/check-user-permission";

const dateFormat = "YYYY-MM-DD";

function StockRequest(props) {
  const { selectedDates = "" } = props;
  const [paginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForceCloseModal, setShowForceCloseModal] = useState(false);
  const [requestDataModal, setRequestDataModal] = useState([]);
  const [requestContentModel, setRequestContentModel] = useState("");
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const history = useHistory();
  const { pathname } = history.location;

  let mounted = true;
  let renderModalContent = "";

  const moduleEditCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.UPDATE.TRANSFERS
  );

  const fetchStockRequestData = async (pageLimit = 10, pageNumber = 1) => {
    let startDate = selectedDates[0]
      ? selectedDates[0]
      : moment(new Date()).format(dateFormat);
    let finishDate = selectedDates[1]
      ? selectedDates[1]
      : moment(new Date()).format(dateFormat);
    document.getElementById("app-loader-container").style.display = "block";
    const stockRequestViewResponse = await StockApiUtil.getAllStockRequest(
      pageLimit,
      pageNumber,
      startDate,
      finishDate
    );
    if (stockRequestViewResponse.hasError) {
      setLoading(false);
      setData([]); //imp
      document.getElementById("app-loader-container").style.display = "none";
      if (stockRequestViewResponse.errorMessage !== "No Transfer Order") {
        showAlertUi(true, stockRequestViewResponse.errorMessage); //imp
      }
    } else {
      if (mounted) {
        //imp if unmounted
        const stockRequestData = stockRequestViewResponse.transfer.data;
        for (let i = 0; i < stockRequestData.length; i++) {
          let item = stockRequestData[i];
          item.date = moment(item.date).format(dateFormat);
          item.status = item.status === "open"
              ? Constants.STOCK_CONTROL.OPEN : item.status === "recieved"
              ? Constants.STOCK_CONTROL.RECEIVED : item.status === "waiting_for_admin_approval"
              ? Constants.STOCK_CONTROL.GONE_FOR_APPROVAL : item.status === "rejected"
              ? Constants.STOCK_CONTROL.REJECTED
              : Constants.STOCK_CONTROL.FORCE_CLOSED;
          item.menu = (
            <CustomTableAtionMenuItem
              tableItem={item}
              tableItemId={item.id}
              tableItemMenuType="stockRequest"
              handleTableMenuItemClick={handleTableMenuItemClick}
              moduleEditCheck={moduleEditCheck}
            />
          );
        }
        /*--------------------------setting menu option-------------------------*/
        setData(stockRequestData);
        setPaginationData(stockRequestViewResponse.transfer.page || {});
        setLoading(false);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  const handleSaveForceClosedData = async () => {
    document.getElementById("app-loader-container").style.display = "block";
    const stockRequestViewResponse =
      await StockApiUtil.closeRequestInventoryOrder(
        requestDataModal.id,
        "force_closed"
      );
    if (stockRequestViewResponse.hasError) {
      setShowForceCloseModal(false);
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, stockRequestViewResponse.errorMessage); //imp
    } else {
      setShowForceCloseModal(false);
      fetchStockRequestData();
      document.getElementById("app-loader-container").style.display = "none";
    }
  };

  useEffect(() => {
    if (pathname === "/stock-control/stock-request") {
      fetchStockRequestData();
    }
    return () => {
      mounted = false;
    };
  }, [selectedDates]);

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchStockRequestData(paginationLimit, currentPg);
  }

  const handleTableMenuItemClick = (requestId, request, itemLabel) => {
    if (itemLabel === "Receive") {
      history.push({
        pathname: `/stock-control/stock-request/${requestId}/receive`,
      });
    } else if (itemLabel === "Force Close") {
      renderModalContent =
        "Do you really want to Force Close '" + request.title + "'?";
      setShowForceCloseModal(true);
      setRequestContentModel(renderModalContent);
      setRequestDataModal(request);
    } else if (itemLabel === "View") {
      history.push({
        pathname: `/stock-control/stock-request/${requestId}/view`,
      });
    }
  };

  const forceColsedContent = () => {
    return <span className="modal-content-custom">{requestContentModel}</span>;
  };

  const handleCloseModal = () => {
    setShowForceCloseModal(false);
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  return (
    <>
      <div className="stock_tables">
        <div className="page__table">
          <CustomTableView
            tableData={data}
            paginationData={paginationData}
            tableDataLoading={loading}
            onClickPageChanger={handlePageChange}
            currentPageIndex={currentPage}
            tableType="stockRequest"
          />
        </div>
      </div>
      {showForceCloseModal && (
        <Modal
          headerButtons={[]}
          height="150px"
          onBackdropClick={handleCloseModal}
          onClose={handleCloseModal}
          padding="20px 40px 20px 40px"
          render={forceColsedContent}
          className="edit-product-ordered-qty-modal"
          showCloseButton
          size="small"
          width="200px"
          footerButtons={[
            {
              isPrimary: false,
              onClick: handleCloseModal,
              text: "Cancel",
            },
            {
              isPrimary: true,
              onClick: handleSaveForceClosedData,
              text: "Ok",
            },
          ]}
        />
      )}
    </>
  );
}

export default StockRequest;
