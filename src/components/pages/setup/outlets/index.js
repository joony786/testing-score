import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import ViewtableSetup from "../../../organism/table/setup";
import CustomTableAtionMenuItem from "../../../organism/table/table_helpers/tableActionMenu";
import * as SetupApiUtil from "../../../../utils/api/setup-api-utils";
import * as Helpers from "../../../../utils/helpers/scripts";
import Permissions from "../../../../utils/constants/user-permissions";
import * as PermissionsHelpers from "../../../../utils/helpers/check-user-permission";

const Outlets = () => {
  const history = useHistory();
  const [paginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const { pathname } = history.location;

  let mounted = true;

  useEffect(() => {
    if (pathname === "/setup/outlets") {
      fetchOutletsData();
    }
    return () => {
      mounted = false;
    };
  }, []);

  const moduleEditCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.UPDATE.STORES
  );

  const fetchOutletsData = async (pageLimit = 10, pageNumber = 1) => {
    document.getElementById("app-loader-container").style.display = "block";
    const outletsViewResponse = await SetupApiUtil.viewOutlets(
      pageLimit,
      pageNumber
    );
    console.log("outletsViewResponse:", outletsViewResponse);

    if (outletsViewResponse.hasError) {
      console.log(
        "Cant fetch Outlets Data -> ",
        outletsViewResponse.errorMessage
      );
      setLoading(false);
      setData([]);
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, outletsViewResponse.errorMessage);
    } else {
      if (mounted) {
        //imp if unmounted
        const outletsData =
          outletsViewResponse.stores.data || outletsViewResponse.data;
        /*----------------------setting menu option-----------------------------*/
        if (moduleEditCheck) {
          for (let i = 0; i < outletsData.length; i++) {
            let item = outletsData[i];
            item.menu = (
              <CustomTableAtionMenuItem
                tableItem={item}
                tableItemId={item.id}
                tableItemMenuType="setup/outlets"
                handleTableMenuItemClick={handleTableMenuItemClick}
                moduleEditCheck={moduleEditCheck} 
              />
            );
          }
        }

        /*--------------------------setting menu option-------------------------*/
        setData(outletsData);
        setPaginationData(outletsViewResponse.stores.page || {});
        setLoading(false);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  const handleTableMenuItemClick = (outletId, outlet, itemLabel) => {
    if (itemLabel === "Edit") {
      return history.push({
        pathname: `/setup/outlets/${outletId}/edit`,
      });
    }
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchOutletsData(paginationLimit, currentPg);
  }

  return (
    <div className="setup-outlets">
      {/* Table */}
      <div className="table">
        <ViewtableSetup
          pageLimit={paginationLimit}
          tableData={data}
          tableDataLoading={loading}
          onClickPageChanger={handlePageChange}
          paginationData={paginationData}
          tableType="outlets"
          currentPageIndex={currentPage}
        />
      </div>
      {/* Table */}
    </div>
  );
};

export default Outlets;
