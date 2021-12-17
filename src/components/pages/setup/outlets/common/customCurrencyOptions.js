import React from 'react';

const CustomCurrencyOptions = (props) => {

    const { currencyData, onSelectCurrency } = props;

    return (
        <div>
            {currencyData.map((currency, i) => (
                <li onClick={() => onSelectCurrency(currency)} className="currency_li">
                    <img className="currency-flag-img "
                        src={`/images/flags/${((currency.code).substring(0, 2)).toLowerCase()}.png`} />
                    {currency.name}
                </li>
            ))}
        </div>
    )
}

export default CustomCurrencyOptions;