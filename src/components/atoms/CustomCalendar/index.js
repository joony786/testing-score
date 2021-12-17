import React, { useState, useEffect } from "react";
import { Calendar, Input } from "@teamfabric/copilot-ui";
import moment from "moment";

const todayDate = moment().format("yyyy/MM/DD");

function CustomCalendar(props) {
  const { text = "Date", previousDate, maxDate } = props;
  const [calenderDate, setCalenderDate] = useState(todayDate);

  useEffect(() => {}, [text, props.onCalenderDateSelect]); //imp to pass showAlert to re render and event handlers as well

  useEffect(() => {
    if (previousDate) {
      setCalenderDate(previousDate);
    }
  }, [previousDate]);

  const onCalenderPickerDateChange = (value) => {
    //console.log(value); //gmt string always
    let formattedDate = moment(value).format("yyyy-MM-DD");
    //console.log("formatted string", formattedDate); //formatted date
    setCalenderDate(formattedDate);
    props.onCalenderDateSelect(formattedDate);
  };
  return (
    <Calendar
      dateFormat="yyyy-MM-dd" //imp format keep it or comment it but not chanhe it
      popperPlacement="bottom-start"
      fixedHeight={true}
      numberOfYears={10}
      minDate={new Date(maxDate)}
      onDateChange={onCalenderPickerDateChange}
      className="calendar"
      customInput={({ value }) => {
        return (
          <Input
            isFloatedLabel
            label={text}
            inputProps={{
              value: calenderDate,
            }}
            maskOptions={{
              alias: "datetime",
              placeholder: "yyyy-mm-dd",
              inputFormat: "yyyy-MM-dd",
            }}
          />
        );
      }}
    />
  );
}

export default CustomCalendar;
