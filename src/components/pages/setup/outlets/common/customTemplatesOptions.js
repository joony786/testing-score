import React from 'react';

const CustomTemplatesOptions = (props) => {

    const { templatesData, onSelectTemplate } = props;

    return (
        <div>
            {templatesData.map((templates, i) => (
                <li onClick={() => onSelectTemplate(templates)} className="currency_li" key={i}>
                    {templates.name}
                </li>
            ))}
        </div>
    )
}

export default CustomTemplatesOptions;