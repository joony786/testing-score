import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import ViewtableSetup from "../../../organism/table/setup";
import CustomTableAtionMenuItem from "../../../organism/table/table_helpers/tableActionMenu";
import * as SetupApiUtil from "../../../../utils/api/setup-api-utils";
import * as Helpers from "../../../../utils/helpers/scripts";
import Permissions from "../../../../utils/constants/user-permissions";
import * as PermissionsHelpers from "../../../../utils/helpers/check-user-permission";

const Brands = () => {
  const history = useHistory();
  const [paginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});

  let mounted = true;

  useEffect(() => {
    fetchBrandsData();

    return () => {
      mounted = false;
    };
  }, []);

  const moduleEditCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.UPDATE.BRANDS
  );
  const moduleDeleteCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.DELETE.BRANDS
  );

  const fetchBrandsData = async (pageLimit = 10, pageNumber = 1) => {
    document.getElementById("app-loader-container").style.display = "block";
    const brandsViewResponse = await SetupApiUtil.viewBrands(
      pageLimit,
      pageNumber
    );
    console.log("brandsViewResponse:", brandsViewResponse);

    if (brandsViewResponse.hasError) {
      console.log(
        "Cant fetch User Roles Data -> ",
        brandsViewResponse.errorMessage
      );
      setLoading(false);
      setData([]);
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, brandsViewResponse.errorMessage);
    } else {
      if (mounted) {
        //imp if unmounted
        const brandsData =
          brandsViewResponse?.brands?.data || brandsViewResponse?.brands;
        if (moduleEditCheck || moduleDeleteCheck) {
          /*----------------------setting menu option-----------------------------*/
          for (let i = 0; i < brandsData.length; i++) {
            let item = brandsData[i];
            item.menu = (
              <CustomTableAtionMenuItem
                tableItem={item}
                tableItemId={item.brand_id}
                tableItemMenuType="setup/brands"
                handleTableMenuItemClick={handleTableMenuItemClick}
                moduleEditCheck={moduleEditCheck}
                moduleDeleteCheck={moduleDeleteCheck}
              />
            );
          }
        }

        /*--------------------------setting menu option-------------------------*/
        setData(brandsData);
        setPaginationData(brandsViewResponse?.brands?.page || {});
        setLoading(false);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  const handleTableMenuItemClick = (brandId, user, itemLabel) => {
    if (itemLabel === "Edit") {
      return history.push({
        pathname: `/setup/brands/${brandId}/edit`,
      });
    }
    if (itemLabel === "Delete") {
      return history.push({
        pathname: `/setup/brands/${brandId}/delete`,
      });
    }
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchBrandsData(paginationLimit, currentPg);
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
          tableType="brands"
          currentPageIndex={currentPage}
        />
      </div>
      {/* Table */}
    </div>
  );
};

export default Brands;
