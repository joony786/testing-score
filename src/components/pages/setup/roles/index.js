import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import ViewtableSetup from "../../../organism/table/setup";
import CustomTableAtionMenuItem from "../../../organism/table/table_helpers/tableActionMenu";
import * as SetupApiUtil from "../../../../utils/api/setup-api-utils";
import * as Helpers from "../../../../utils/helpers/scripts";
import Permissions from "../../../../utils/constants/user-permissions";
import * as PermissionsHelpers from "../../../../utils/helpers/check-user-permission";

const Roles = () => {
  const history = useHistory();
  const [paginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});

  let mounted = true;

  useEffect(() => {
    fetchUserRolesData();

    return () => {
      mounted = false;
    };
  }, []);

  const moduleEditCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.UPDATE.USER_ROLES
  );
  const moduleDeleteCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.DELETE.USER_ROLES
  );

  const fetchUserRolesData = async (pageLimit = 10, pageNumber = 1) => {
    document.getElementById("app-loader-container").style.display = "block";
    const rolesViewResponse = await SetupApiUtil.viewUserRoles(
      pageLimit,
      pageNumber
    );
    console.log("rolesViewResponse:", rolesViewResponse);

    if (rolesViewResponse.hasError) {
      console.log(
        "Cant fetch User Roles Data -> ",
        rolesViewResponse.errorMessage
      );
      setLoading(false);
      setData([]);
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, rolesViewResponse.errorMessage);
    } else {
      if (mounted) {
        //imp if unmounted
        const rolesData =
          rolesViewResponse?.data?.data || rolesViewResponse?.data;
        /*----------------------setting menu option-----------------------------*/
        if (moduleEditCheck || moduleDeleteCheck) {
          for (let i = 0; i < rolesData.length; i++) {
            let item = rolesData[i];
            item.menu = (
              <CustomTableAtionMenuItem
                tableItem={item}
                tableItemId={item.id}
                tableItemMenuType="setup/user-roles"
                handleTableMenuItemClick={handleTableMenuItemClick}
                moduleEditCheck={moduleEditCheck}
                moduleDeleteCheck={moduleDeleteCheck}
              />
            );
          }
        }
        /*--------------------------setting menu option-------------------------*/
        setData(rolesData);
        setPaginationData(rolesViewResponse?.data?.page || {});
        setLoading(false);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  const handleTableMenuItemClick = (roleId, user, itemLabel) => {
    if (itemLabel === "Edit") {
      return history.push({
        pathname: `/setup/user-roles/${roleId}/edit`,
      });
    }
    if (itemLabel === "Delete") {
      return history.push({
        pathname: `/setup/user-roles/${roleId}/delete`,
      });
    }
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchUserRolesData(paginationLimit, currentPg);
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
          tableType="roles"
          currentPageIndex={currentPage}
        />
      </div>
      {/* Table */}
    </div>
  );
};

export default Roles;
