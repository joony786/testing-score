import moment from "moment";
import {viewPurchaseOrdersGRN} from "../../../utils/api/stock-api-utils";

export const returnProductStatus = function (type){
    console.log(type)
    switch (type){
        case 'open': {
            return 'Partial Received'
        }
        case 'receive': {
            return 'Completed'
        }
        case 'closed' : {
            return 'Force closed'
        }
        default :
        {
             return 'Partial Received'
        }
    }
}
export  function formatDate(date) {
    return moment(date).format("yyyy-MM-DD");
}

export  const getPurchaseOrder = async (po_id, grn_id,f1,f2) => {
    document.getElementById("app-loader-container").style.display = "block";
    const fetchPurchaseOrder = await viewPurchaseOrdersGRN(po_id, grn_id)
    if (fetchPurchaseOrder.hasError) {
        console.log(
            "Cant fetch registered products Data -> ",
            fetchPurchaseOrder.errorMessage
        );
        //message.warning(productsDiscountsViewResponse.errorMessage, 3);
        document.getElementById("app-loader-container").style.display = "none";
    } else {
        console.log("res -> ", fetchPurchaseOrder);
        f1(fetchPurchaseOrder.products)
        f2(fetchPurchaseOrder.purchase_order_info)
        document.getElementById("app-loader-container").style.display = "none";
    }
}