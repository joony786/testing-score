import React, { useEffect, useState } from "react";
import { AutoComplete, SearchLoader } from "@teamfabric/copilot-ui";

function CustomSearch(props) {
  const { handleEnterSearch, disabled = false, isLoading = false, inputValue = "", placeholder = "Search by SKU Number, Category, or Collections"} = props;
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const handleChange = (e) => {
    setValue(e.target.value);
    props.onChange(e.target.value);   //imp new ver
  };

  useEffect(() => {
    //if (value.length > 3) setShow(true);
    setValue(inputValue);
  }, [inputValue, placeholder]);

  return (
    isLoading ? (
      <SearchLoader
        theme="light"
        className="loading-autocomplete-search-bar"
      />
    ) : (
    <AutoComplete
      inputProps={{
        icon: "Search",
        className: "search-autocomplete",
        isFloatedLabel: false,
        inputProps: {
          placeholder: placeholder,
          onChange: (e) => handleChange(e),
          onKeyDown: (e) => {
            if (handleEnterSearch && e.keyCode === 13) {
              handleEnterSearch(e)
            }
          },
          value: value,
          disabled: disabled
        },
      }}
      autoCompleteProps={{
        data: {},
        isLoading: false,
        toggleSearchAll: true,
        className: "autocomplete-popup",
        onSearchAll: (event) => console.log(event),
        onSelect: (data) => console.log(data, "data..."),
        onClearSearch: (event, iconState) => {
          console.log(event, iconState, "event");
          setShow(false);
          setValue("");
          props.onClearSearch("");   //imp new ver
        },
        onEscPress: () => setShow(false),
        onBodyClick: () => setShow(false),
      }}
    />
    )
  );
}

export default CustomSearch;
