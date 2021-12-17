import React from "react";
import TimelineBlock from "../../atoms/timeline_block";

const Timeline = ({ creditsHistory, customerData }) => {
  return (
    <div className="timeline">
      {creditsHistory &&
        creditsHistory.length > 0 &&
        creditsHistory.map(
          (
            { balance, date, invoice_id, method, name, invoice_show_id },
            index
          ) => {
            const customerName =
              customerData && customerData.length > 0 && customerData[0].name;
            const customerId = customerData[0].id;
            const even = index % 2 === 0;
            const isInvoiceData = balance < 0;
            const deposit = isInvoiceData
              ? "timeline__deposit_wrapper"
              : "timeline__credit_wrapper";
            if (isNaN(balance)) {
              return null;
            }
            const totalBalance = Math.abs(balance);
            let timeLineItemData;
            if (balance > 0) {
              timeLineItemData = `payed account balance of PK Rs. ${totalBalance} via ${method} at outlet ${name}`;
            }
            if (balance < 0) {
              timeLineItemData = `of ${totalBalance} payed through account balance at outlet ${name}`;
            }
            if (balance === '0') {
              timeLineItemData = `new account opend at outlet ${name}`;
            }
            const redirectInvoiceLink = `/register/invoice/${invoice_id}/view`;
            const redirectCustomerLink = `/customers/${customerId}/view`;

            return (
              <TimelineBlock
                key={totalBalance + index}
                className={`${
                  even
                    ? "timeline__block timeline__block--left"
                    : "timeline__block timeline__block--right"
                }`}
                customerName={customerName}
                invoiceNumber={invoice_id}
                deposit={deposit}
                redirectCustomerLink={redirectCustomerLink}
                redirectInvoiceLink={redirectInvoiceLink}
                timeLineItemData={timeLineItemData}
                isInvoiceData={invoice_id}
              />
            );
          }
        )}
    </div>
  );
};

export default Timeline;
