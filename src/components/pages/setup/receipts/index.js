import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import ViewtableSetup from "../../../organism/table/setup";
import CustomTableAtionMenuItem from "../../../organism/table/table_helpers/tableActionMenu";
import * as SetupApiUtil from "../../../../utils/api/setup-api-utils";
import * as Helpers from "../../../../utils/helpers/scripts";
import Permissions from "../../../../utils/constants/user-permissions";
import * as PermissionsHelpers from "../../../../utils/helpers/check-user-permission";

const Receipts = () => {
  const history = useHistory();
  const [paginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});

  let mounted = true;

  useEffect(() => {
    fetchUsersTemplatesData();

    return () => {
      mounted = false;
    };
  }, []);

  const moduleEditCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.UPDATE.TEMPLATES
  );
  const moduleDeleteCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.DELETE.TEMPLATES
  );

  const fetchUsersTemplatesData = async (pageLimit = 10, pageNumber = 1) => {
    document.getElementById("app-loader-container").style.display = "block";
    const userTemplatesViewResponse = await SetupApiUtil.viewTemplates(
      pageLimit,
      pageNumber
    );
    console.log("userTemplatesViewResponse:", userTemplatesViewResponse);

    if (userTemplatesViewResponse.hasError) {
      console.log(
        "Cant fetch Users templates Data -> ",
        userTemplatesViewResponse.errorMessage
      );
      setLoading(false);
      setData([]);
      document.getElementById("app-loader-container").style.display = "none";
      // showAlertUi(true, userTemplatesViewResponse.errorMessage);
    } else {
      if (mounted) {
        //imp if unmounted
        const templatesData =
          userTemplatesViewResponse.templates.data ||
          userTemplatesViewResponse.templates;
        /*----------------------setting menu option-----------------------------*/
        if (moduleEditCheck || moduleDeleteCheck) {
          for (let i = 0; i < templatesData.length; i++) {
            let item = templatesData[i];
            item.menu = (
              <CustomTableAtionMenuItem
                tableItem={item}
                tableItemId={item.id}
                tableItemMenuType="setup/templates"
                handleTableMenuItemClick={handleTableMenuItemClick}
                moduleEditCheck={moduleEditCheck}
                moduleDeleteCheck={moduleDeleteCheck}
              />
            );
          }
        }
        /*--------------------------setting menu option-------------------------*/
        setData(templatesData);
        setPaginationData(userTemplatesViewResponse.templates.page || {});
        setLoading(false);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  const handleTableMenuItemClick = (templateId, template, itemLabel) => {
    if (itemLabel === "Edit") {
      return history.push({
        pathname: `/setup/receipts-templates/${templateId}/edit`,
      });
    } else if (itemLabel === "Delete") {
      return history.push({
        pathname: `/setup/receipts-templates/${templateId}/delete`,
      });
    }
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  const handlePageChange = (currentPg) => {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchUsersTemplatesData(paginationLimit, currentPg);
  }

  return (
    <div className="setup-templates">
      {/* Table */}
      <div className="table">
        <ViewtableSetup
          pageLimit={paginationLimit}
          tableData={data}
          tableDataLoading={loading}
          onClickPageChanger={handlePageChange}
          paginationData={paginationData}
          tableType="receipts"
          currentPageIndex={currentPage}
        />
      </div>
      {/* Table */}
    </div>
  );
};

export default Receipts;
