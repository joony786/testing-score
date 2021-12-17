import React, { Fragment, useEffect, useState } from "react";
import InfoBox from "../../atoms/info_box";

function InfoRow({ salesMops }) {
  const [renderData, setItems] = useState([]);
  useEffect(() => {
    renderMops();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesMops]);

  const returnType = (type) => {
    switch (type) {
      case "cash": {
        return "Cash";
      }
      case "credit": {
        return "Credit Card";
      }
      case "online": {
        return "Online";
      }
      case "customer": {
        return "Customer Layby";
      }
      case "discounts": {
        return "Invoice Discounts";
      }
      default:
        return;
    }
  };

  const renderMops = () => {
    let items = [];
    [salesMops].map((item, index) => {
      for (const [key, value] of Object.entries(salesMops)) {
        const name = returnType(key);
        items.push(<InfoBox text={name} number={value} />);
      }
    });
    setItems(items);
    
  };
  return (
    <div className="info_row">
      {renderData && renderData.length > 0
        ? renderData.map((item, index) => {
            return <Fragment key={index + 1}>{item}</Fragment>;
          })
        : ["Cash", "Credit Card","Online", "Customer Layby", "Invoice Discounts"].map(
            (item) => {
              return (
                <InfoBox
                  key={item.trim().toLowerCase()}
                  text={item}
                  number={' '}
                />
              );
            }
          )}
    </div>
  );
}

export default InfoRow;
