import React from "react";
import { string } from "prop-types";
import { Link } from "react-router-dom";

function TimelineBlock({
  className,
  customerName,
  invoiceNumber,
  storeName,
  deposit,
  redirectCustomerLink,
  isInvoiceData,
  redirectInvoiceLink,
  timeLineItemData,
}) {
  return (
    <div className={deposit}>
      <div className={className}>
        <p>
          <Link to={redirectCustomerLink} className="highlight">
            {customerName}
          </Link>{" "}
          {isInvoiceData && (
            <>
              invoice #
              <Link to={redirectInvoiceLink} className="highlight">
                {" "}
                {invoiceNumber}
              </Link>
            </>
          )}{" "}
          &nbsp;
          {timeLineItemData}
        </p>
      </div>
    </div>
  );
}

TimelineBlock.propTypes = {
  className: string,
  customerName: string,
  invoiceNumber: string,
  storeName: string,
  deposit: string,
  redirectCustomerLink: string,
  isInvoiceData: string,
  redirectInvoiceLink: string,
  timeLineItemData: string,
};

export default TimelineBlock;
