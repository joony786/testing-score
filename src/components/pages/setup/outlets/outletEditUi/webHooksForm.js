import React, { useState, useReducer } from 'react';
import { Input, Button, Modal } from "@teamfabric/copilot-ui";
import CustomButtonWithIcon from "../../../../atoms/button_with_icon";

const WebHooksForm = () => {
    const initialFormValues = {
        url: '',
    }
    const initialFormErrorsValues = {
        urlError: false,
    }

    const formReducer = (state, event) => {
        return { ...state, ...event };
    }
    const formErrorsReducer = (state, event) => {
        return { ...state, ...event };
    }
    const [storeToken, setStoreToken] = useState('');
    const [isWebHookModalVisible, setIsWebHookModalVisible] = useState(false)

    const [formData, setFormData] = useReducer(formReducer, initialFormValues);
    const [formErrorsData, setFormErrorsData] = useReducer(formErrorsReducer, initialFormErrorsValues);
    const { url } = formData;
    const { urlError } = formErrorsData;

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({ [name]: value });

        let inputErrorKey = `${name}Error`;
        setFormErrorsData({
            [inputErrorKey]: false,
        });

    }

    const handleWebhookModalAdd = () => {}
    const onGenerateKey = async () => {

    }
    const onWebhookModalOpen = () => setIsWebHookModalVisible(true)
    const handleWebHookModalCancel = () => setIsWebHookModalVisible(!isWebHookModalVisible);

    const renderWebHookModalContent = () => {
        return (
            <>
                <h2 style={{ marginBottom: "3rem" }}>Add WebHook</h2>
                <div className="form__input">
                    <Input
                        className="primary required"
                        inputProps={{
                            onChange: handleFormChange,
                            name: "url",
                            value: url,
                        }}
                        label="*Enter a url for webhook"
                        errorMessage="Field Is Required"
                        error={urlError}
                    />
                </div>

            </>
        )
    }
    return (
        <React.Fragment>
            <section className="section">
                <div className="header">
                    <h2 className="heading heading--secondary">Outlet API Key</h2>
                    <h3 className="heading--sub">
                        Token Type: <span className="pill">Bearer</span>
                    </h3>
                </div>
                <div className="body">
                    <div className="input">
                        <Input
                            className="primary"
                            inputProps={{
                                disabled: true,
                                value: "●●●●●●●●●●"
                            }}
                            label="API Key"
                            width="100%"
                        />

                        <Button
                            isPrimary={false}
                            onClick={function noRefCheck() { }}
                            size="small"
                            text="Copy"
                        />
                    </div>

                    <div className="button">
                        <Button
                            onClick={function noRefCheck() { }}
                            size="small"
                            text="Generate Key"
                            onClick={onGenerateKey}
                        />
                    </div>
                </div>
            </section>
            <section className="section hooks">
                <div className="header">
                    <h2 className="heading heading--secondary">HTTP WebHooks</h2>
                    <CustomButtonWithIcon
                        size="small"
                        isPrimary={false}
                        theme="light"
                        emphasis="low"
                        text="Add New"
                        icon="Add"
                        onClick={onWebhookModalOpen}
                    />
                </div>

                <div className="body">{/* add table here */}</div>
            </section>
            {/*------------------------add webhook--modal---------------------------*/}
            {isWebHookModalVisible && (
                <Modal
                    //headerText={`Edit Ordered Quantity For ${editProduct.product_name}`}
                    headerButtons={[]}
                    height='150px'
                    onBackdropClick={handleWebHookModalCancel}
                    onClose={handleWebHookModalCancel}
                    padding='20px 40px 20px 40px'
                    render={renderWebHookModalContent}
                    //className=""
                    showCloseButton
                    size='small'
                    width='200px'
                    footerButtons={[
                        {
                            isPrimary: false,
                            onClick: handleWebHookModalCancel,
                            text: "Cancel",
                        },
                        {
                            isPrimary: true,
                            onClick: handleWebhookModalAdd,
                            text: "Add",
                        },
                    ]}
                />
            )}

            {/*--------------------------add webhook--modal---------------------------*/}
        </React.Fragment>
    )
}

export default WebHooksForm;