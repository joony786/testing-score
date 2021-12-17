
import React, { } from "react";
import CustomFlyout from "../../../../atoms/flyout";
import Constants from "../../../../../utils/constants/constants";


function CustomTableActionMenu(props) {
    const { tableItem = "",
        tableItemId = "",
        tableItemMenuType = "",
        moduleEditCheck = true,
        moduleDeleteCheck = true,
        tableStatus = "",
    } = props;


    let menuOption = [];

    if (tableItemMenuType === "categories" ||
        tableItemMenuType === "couriers" ||
        tableItemMenuType === "taxes" ||
        tableItemMenuType === "suppliers" ||
        tableItemMenuType === "setup/templates" ||
        tableItemMenuType === "setup/user-roles"
    ) {

        if (moduleEditCheck) {
            menuOption.push({ label: "Edit" });
        }
        if (moduleDeleteCheck) {
            menuOption.push({ label: "Delete" });
        }

    }
    if (tableItemMenuType === "customers" ||
        tableItemMenuType === "setup/outlets" ||
        tableItemMenuType === "users"  ||
        tableItemMenuType ===  "products-discounts" ||
        tableItemMenuType ===  "products-discounts-listing" ||
        tableItemMenuType === "setup/brands"
    ) {
      
        if (moduleEditCheck) {
            menuOption.push({ label: "Edit" });
        }

    }
    if (tableItemMenuType === "stockRequest") 
    {
        if(tableItem.status === Constants.STOCK_CONTROL.FORCE_CLOSED || tableItem.status === Constants.STOCK_CONTROL.RECEIVED || tableItem.status === Constants.STOCK_CONTROL.REJECTED || tableItem.status === Constants.STOCK_CONTROL.GONE_FOR_APPROVAL){
            menuOption.push({ label: "View" });
        }else{
            if (moduleEditCheck) {
                menuOption = [
                    {
                        label: "Receive",
                    },
                    {
                        label: "Force Close",
                    },
                    {
                        label: "View",
                    },
                ];
            }
        }
    }
    if (tableItemMenuType === "returnStock")
    {
        menuOption.push({ label: "View" });
    }
    if (tableItemMenuType === "stockAdjustment")
    {
        menuOption.push({ label: "View" });
    }
    if(tableItemMenuType === 'purchaseRequest')
    {
        menuOption = [
            {
                label: "Receive",
            },
            {
                label: "Force Close",
            },

        ];
    }
    if(tableItemMenuType === 'purchaseOrderSuperAdmin')
    {
        menuOption = [
            {
                label: "Approve",
            },
            {
                label: "Reject",
            },

        ];
    }
    if(tableItemMenuType === 'stockRequestSuperAdmin')
    {
        menuOption = [
            {
                label: "Approve",
            },
            {
                label: "Reject",
            },
            {
                label: "View",
            },

        ];
    }
    if(tableItemMenuType === 'EcommerceOrder') {
        menuOption = [
            {
                label: "View",
            }
        ];
        const isDispatched = tableItem.status === "dispatched";
        if (tableItem?.courier?.shippingLabel && isDispatched) {
            menuOption.push({
                label: "Download",
            })
        }
        if (!isDispatched){
            menuOption.push({
                label: "Mark Shipped",
            })
            menuOption.push({
                label: "Cancel",
            })

        }
      
    }
    if (tableItemMenuType === 'EcommerceManualReturn') {
        menuOption.push({
            label: "Sync Return",
        })
    }

    const handleTableMenuItemClick = (propId, propObj, itemLabel) => {
        props.handleTableMenuItemClick(propId, propObj, itemLabel);
    }

    return (
        <CustomFlyout propId={tableItemId}
            propObj={tableItem}
            menuItems={menuOption}
            menuItemClick={handleTableMenuItemClick} />
    );
}

export default CustomTableActionMenu;