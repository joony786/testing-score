import React, { useState, useEffect } from "react";
// components
import CustomTableAtionMenuItem from "../../../organism/table/table_helpers/tableActionMenu";
import * as SuperAdminApiUtil from '../../../../utils/api/super-admin-api-utils';
import * as Helpers from "../../../../utils/helpers/scripts";
import { useHistory } from "react-router-dom";
import SuperAdminTable from "../../../organism/table/super_admin/superAdminTable";
import moment from "moment";


const dateFormat = "YYYY-MM-DD";

function POSuperAdmin(props) {

    const { selectedDates = "" } = props;
    const [paginationLimit,] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [paginationData, setPaginationData] = useState({});
    const history = useHistory();

    let mounted = true;

    const fetchPOSuperAdminData = async (pageLimit = 10, pageNumber = 1) => {
        let startDate = selectedDates[0] ? selectedDates[0] : moment(new Date()).format(dateFormat);
        let finishDate = selectedDates[1] ? selectedDates[1] : moment(new Date()).format(dateFormat);
        document.getElementById('app-loader-container').style.display = "block";
        const pOSuperAdminViewResponse = await SuperAdminApiUtil.getPOSuperAdmin(startDate, finishDate, pageLimit, pageNumber);
        if (pOSuperAdminViewResponse.hasError) {
            setLoading(false);
            setData([]); 
            document.getElementById('app-loader-container').style.display = "none";
            if(pOSuperAdminViewResponse.errorMessage !== "No Purchase Order"){
                showAlertUi(true, pOSuperAdminViewResponse.errorMessage);  
            }
        } else {
            if (mounted) {     
                const poSuperAdminData = pOSuperAdminViewResponse?.data;
                for (let i = 0; i < poSuperAdminData.length; i++) {
                    let item = poSuperAdminData[i];
                    if (item.delivery_datetime) {
                        item.delivery_datetime = moment(item.delivery_datetime).format(dateFormat);
                    }
                    item.menu = <CustomTableAtionMenuItem tableItem={item}
                        tableItemId={item.po_id} tableItemMenuType="purchaseOrderSuperAdmin"
                        handleTableMenuItemClick={handleTableMenuItemClick} />
                }
                setData(poSuperAdminData);
                setPaginationData(pOSuperAdminViewResponse?.data?.page || {});
                setLoading(false);
                document.getElementById('app-loader-container').style.display = "none";
            }
        }
    };

    useEffect(() => {
        fetchPOSuperAdminData();
        return () => {
            mounted = false;
        }
    }, [selectedDates]);


    function handlePageChange(currentPg) {
        setCurrentPage(currentPg);
        setLoading(true);
        fetchPOSuperAdminData(paginationLimit, currentPg);
    }

    const handleTableMenuItemClick = (poId, poSuperAdmin, itemLabel) => {
        if (itemLabel === "Approve") {
            return (
                history.push({
                    pathname: `/taxes/${poId}/edit`,
                })
            )
        }
        else if (itemLabel === "Reject") {
            history.push({
                pathname: `/taxes/${poId}/delete`,
            });
        }
    };


    const showAlertUi = (show, errorText) => {
        Helpers.showAppAlertUiContent(show, errorText);
    }

    return (

        <section className="page">
            <div className='page__table'>
                <SuperAdminTable
                    pageLimit={paginationLimit}
                    tableData={data}
                    tableDataLoading={loading}
                    onClickPageChanger={handlePageChange}
                    currentPageIndex={currentPage}
                    paginationData={paginationData}
                    tableType="purchaseOrderSuperAdmin"
                />
            </div>
        </section>
    );
}

export default POSuperAdmin;
