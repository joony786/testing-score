import React, { useState, useEffect } from "react";
// components
import CustomTableAtionMenuItem from "../../../organism/table/table_helpers/tableActionMenu";
import * as SuperAdminApiUtil from '../../../../utils/api/super-admin-api-utils';
import * as Helpers from "../../../../utils/helpers/scripts";
import { useHistory } from "react-router-dom";
import SuperAdminTable from "../../../organism/table/super_admin/superAdminTable";
import Constants from "../../../../utils/constants/constants";
import moment from "moment";
import { Modal } from "@teamfabric/copilot-ui/dist/organisms";


const dateFormat = "YYYY-MM-DD";
let renderModalContent = "";
let totalOpenSTR = 0;

function SRSuperAdmin(props) {

    const { selectedDates = "" } = props;
    const [paginationLimit,] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [paginationData, setPaginationData] = useState({});
    const [requestContentModel, setRequestContentModel] = useState("");
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [requestApproveDataModal, setRequestApproveDataModal] = useState([]);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [requestRejectDataModal, setRequestRejectDataModal] = useState([]);
    const history = useHistory();

    let mounted = true;

    const fetchSRSuperAdminData = async (pageLimit = 10, pageNumber = 1) => {
        let startDate = selectedDates[0] ? selectedDates[0] : moment(new Date()).format(dateFormat);
        let finishDate = selectedDates[1] ? selectedDates[1] : moment(new Date()).format(dateFormat);
        let is_super = 1; totalOpenSTR = 0;
        document.getElementById('app-loader-container').style.display = "block";
        const sRSuperAdminViewResponse = await SuperAdminApiUtil.getSRSuperAdmin(startDate, finishDate, pageLimit, pageNumber, is_super);
        if (sRSuperAdminViewResponse.hasError) {
            setLoading(false);
            setData([]);
            document.getElementById('app-loader-container').style.display = "none";
        } else {
            if (mounted) {
                const srSuperAdminData = sRSuperAdminViewResponse?.transfer?.data;
                for (let i = 0; i < srSuperAdminData.length; i++) {
                    let item = srSuperAdminData[i];
                    item.date = moment(item.date).format(dateFormat);
                    item.status = item.status === "waiting_for_admin_approval" ? Constants.STOCK_CONTROL.OPEN : Constants.STOCK_CONTROL.REJECTED;
                    if (item.status === Constants.STOCK_CONTROL.OPEN) {
                        totalOpenSTR = totalOpenSTR + 1;
                    }
                    item.menu = <CustomTableAtionMenuItem tableItem={item}
                        tableItemId={item.id} tableItemMenuType="stockRequestSuperAdmin"
                        handleTableMenuItemClick={handleTableMenuItemClick} />
                }
                setData(srSuperAdminData);
                setPaginationData(sRSuperAdminViewResponse?.transfer?.page || {});
                setLoading(false);
                document.getElementById('app-loader-container').style.display = "none";
            }
        }
    };

    useEffect(() => {
        fetchSRSuperAdminData();
        return () => {
            mounted = false;
        }
    }, [selectedDates]);


    function handlePageChange(currentPg) {
        setCurrentPage(currentPg);
        setLoading(true);
        fetchSRSuperAdminData(paginationLimit, currentPg);
    }

    const handleTableMenuItemClick = (requestId, transfer, itemLabel) => {
        if (itemLabel === "Approve") {
            renderModalContent = "Do you really want to approve '" + transfer.title + "'?";
            setShowApproveModal(true);
            setRequestContentModel(renderModalContent);
            setRequestApproveDataModal(transfer);
        }
        else if (itemLabel === "Reject") {
            renderModalContent = "Do you really want to reject '" + transfer.title + "'?";
            setShowRejectModal(true);
            setRequestContentModel(renderModalContent);
            setRequestRejectDataModal(transfer);
        } else if (itemLabel === "View") {
            history.push({
                pathname: `/super-admin/${requestId}/view`,
            });
        }
    };

    const handleCloseModal = () => {
        setShowApproveModal(false);
    };
    const handleRejectCloseModal = () => {
        setShowRejectModal(false);
    };

    const approveContent = () => {
        return <span className="modal-content-custom">{requestContentModel}</span>;
    };
    const rejectContent = () => {
        return <span className="modal-content-custom">{requestContentModel}</span>;
    };

    const showAlertUi = (show, errorText) => {
        Helpers.showAppAlertUiContent(show, errorText);
    };

    const handleSaveApproveData = async () => {
        document.getElementById("app-loader-container").style.display = "block";
        const stockRequestViewResponse = await SuperAdminApiUtil.approveStockRequest(requestApproveDataModal.id, "open");
        if (stockRequestViewResponse.hasError) {
            setShowApproveModal(false);
            document.getElementById("app-loader-container").style.display = "none";
            showAlertUi(true, stockRequestViewResponse.errorMessage); //imp
        } else {
            setShowApproveModal(false);
            fetchSRSuperAdminData();
            document.getElementById("app-loader-container").style.display = "none";
        }
    };

    const handleSaveRejectData = async () => {
        document.getElementById("app-loader-container").style.display = "block";
        const stockRequestViewResponse = await SuperAdminApiUtil.approveStockRequest(requestRejectDataModal.id, "rejected");
        if (stockRequestViewResponse.hasError) {
            setShowRejectModal(false);
            document.getElementById("app-loader-container").style.display = "none";
            showAlertUi(true, stockRequestViewResponse.errorMessage); //imp
        } else {
            setShowRejectModal(false);
            fetchSRSuperAdminData();
            document.getElementById("app-loader-container").style.display = "none";
        }
    };




    return (
        <>
            <div className="label-stock-count">
                <label>{"Opened STRs : "}</label>
                <label>{totalOpenSTR}</label>
            </div>
            <div className="super_admin">
                <div className='page__table'>
                    <SuperAdminTable
                        pageLimit={paginationLimit}
                        tableData={data}
                        tableDataLoading={loading}
                        onClickPageChanger={handlePageChange}
                        currentPageIndex={currentPage}
                        paginationData={paginationData}
                        tableType="stockRequestSuperAdmin"
                    />
                </div>
            </div>
            {showApproveModal && (
                <Modal
                    headerButtons={[]}
                    height="150px"
                    onBackdropClick={handleCloseModal}
                    onClose={handleCloseModal}
                    padding="20px 40px 20px 40px"
                    render={approveContent}
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
                            onClick: handleSaveApproveData,
                            text: "Approve",
                        },
                    ]}
                />
            )}
            {showRejectModal && (
                <Modal
                    headerButtons={[]}
                    height="150px"
                    onBackdropClick={handleRejectCloseModal}
                    onClose={handleRejectCloseModal}
                    padding="20px 40px 20px 40px"
                    render={rejectContent}
                    className="edit-product-ordered-qty-modal"
                    showCloseButton
                    size="small"
                    width="200px"
                    footerButtons={[
                        {
                            isPrimary: false,
                            onClick: handleRejectCloseModal,
                            text: "Cancel",
                        },
                        {
                            isPrimary: true,
                            onClick: handleSaveRejectData,
                            text: "Reject",
                        },
                    ]}
                />
            )}
        </>

    );
}

export default SRSuperAdmin;
