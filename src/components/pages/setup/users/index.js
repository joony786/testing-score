import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import ViewtableSetup from "../../../organism/table/setup";
import CustomTableAtionMenuItem from "../../../organism/table/table_helpers/tableActionMenu";
import * as SetupApiUtil from "../../../../utils/api/setup-api-utils";
import * as Helpers from "../../../../utils/helpers/scripts";
import Permissions from "../../../../utils/constants/user-permissions";
import * as PermissionsHelpers from "../../../../utils/helpers/check-user-permission";

const Users = () => {
  const history = useHistory();
  const [paginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  let mounted = true;

  const moduleEditCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.UPDATE.USERS
  );

  useEffect(() => {
    fetchUsersData();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mounted = false;
    };
  }, []);

  const fetchUsersData = async (pageLimit = 10, pageNumber = 1) => {
    document.getElementById("app-loader-container").style.display = "block";
    const usersViewResponse = await SetupApiUtil.viewAllUsers(
      pageLimit,
      pageNumber
    );
    if (usersViewResponse.hasError) {
      setLoading(false);
      setData([]);
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, usersViewResponse.errorMessage);
    } else {
      if (mounted) {
        const usersData = (usersViewResponse?.data?.result || usersViewResponse?.data?.data);
        if (moduleEditCheck ) {
          usersData.forEach((element,index) => {
            let item = usersData[index];
            item.menu = (
              <CustomTableAtionMenuItem
                tableItem={item}
                tableItemId={item.id}
                tableItemMenuType="users"
                handleTableMenuItemClick={handleTableMenuItemClick}
                moduleEditCheck={moduleEditCheck}
              />
          );
          })
        }


        //   for (let i = 0; i < usersData.length; i++) {
        
        //     let item = usersData[i];
        //     item.menu = (
        //       <CustomTableAtionMenuItem
        //         tableItem={item}
        //         tableItemId={item.id}
        //         tableItemMenuType="users"
        //         handleTableMenuItemClick={handleTableMenuItemClick}
        //         moduleEditCheck={moduleEditCheck}
        //       />
        //     );
        //   }
        // }
        setData(usersData);
        setPaginationData(usersViewResponse.data.page || {});
        setLoading(false);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  const handleTableMenuItemClick = (userId, user, itemLabel) => {
    if (itemLabel === "Edit") {
      return history.push({
        pathname: `/setup/users/${userId}/edit`,
      });
    }
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchUsersData(paginationLimit, currentPg);
  }

  return (
    <div className="setup-users">
      <div className="page__table">
        <ViewtableSetup
          pageLimit={paginationLimit}
          tableData={data}
          tableDataLoading={loading}
          onClickPageChanger={handlePageChange}
          paginationData={paginationData}
          tableType="users"
          currentPageIndex={currentPage}
        />
      </div>
    </div>
  );
};

export default Users;
