import React, { useState, useEffect } from "react";
import { Icon, Button, Dropdown, Timepicker } from "@teamfabric/copilot-ui";

// components
import CustomCalendar from "../../atoms/CustomCalendar";
import { filterOptions } from "./filter";
import moment from "moment";
const todayDate = moment().format("yyyy-MM-DD");

function DateRangePicker(props) {
  const {
    startDateLabel = "",
    endDateLabel = "",
    isFilter = false,
    buttonText = "",
    // isTime = false,
  } = props;

  const [calenderStartDate, setCalenderStartDate] = useState(todayDate);
  const [calenderEndDate, setCalenderEndDate] = useState(todayDate);
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[1]);
  // const [startTime, setStartTime] = useState('');
  // const [endTime, setEndTime] = useState('');

  useEffect(() => {}, [
    startDateLabel,
    endDateLabel,
    props.onCalenderDateSelect,
    props.onFetchButtonClick,
  ]); //imp to pass showAlert to re render and event handlers as well

  const handleCalenderChangeStartDateSelect = (dateString) => {
    //console.log("formatted string", dateString); //formatted date
    setCalenderStartDate(dateString);
    const endDate = moment(dateString).add(1, "days").format("yyyy-MM-DD");
    setCalenderEndDate(endDate);
    const findDateFilter = filterOptions.find(
      (i) => i.startDate === dateString && i.endDate === calenderEndDate
    );
    if (findDateFilter) {
      setSelectedFilter(findDateFilter);
    } else {
      setSelectedFilter(filterOptions[0]);
    }
    props.onCalenderDateSelect([dateString, endDate]);
  };

  const handleCalenderChangeEndDateSelect = (dateString) => {
    //console.log("formatted string", dateString); //formatted date
    setCalenderEndDate(dateString);
    const findDateFilter = filterOptions.find(
      (i) => i.startDate === calenderStartDate && i.endDate === dateString
    );
    if (findDateFilter) {
      setSelectedFilter(findDateFilter);
    } else {
      setSelectedFilter(filterOptions[0]);
    }
    props.onCalenderDateSelect([calenderStartDate, dateString]);
  };

  const onFetchSelectedDatesData = () => {
    //console.log("formatted strings", calenderStartDate, calenderEndDate); //formatted dates both
    props.onFetchButtonClick([calenderStartDate, calenderEndDate]);
  };

  const handleFilterSelect = (value) => {
    if (value.id !== 0) {
      setCalenderStartDate(value.startDate);
      setCalenderEndDate(value.endDate);
      props.onCalenderDateSelect([value.startDate, value.endDate]);
    }
    setSelectedFilter(value);
  };
  // const pickTime = (value) => {
  //   const t = moment(value).toISOString();
  //   const modifiedTieme = t.split("T");
  //   const finalTime = "T" + modifiedTieme[1];
  //   setTime(finalTime);
  // };
  return (
    <div className="date_range_picker">
      <CustomCalendar
        previousDate={calenderStartDate}
        text={startDateLabel}
        onCalenderDateSelect={handleCalenderChangeStartDateSelect}
      />
      <Icon iconName="RightArrow" size={16} />
      <CustomCalendar
        maxDate={calenderStartDate}
        previousDate={calenderEndDate}
        text={endDateLabel}
        onCalenderDateSelect={handleCalenderChangeEndDateSelect}
      />
      {/* {
        isTime && (
          <>
          <Timepicker
            // date={currentTime}
            date={null}
            label="Start time"
            onChange={pickTime}
            width="100px"
          />
           <Icon iconName="RightArrow" size={16} />
           <Timepicker
            // date={currentTime}
            date={null}
            label="End time"
            onChange={pickTime}
            width="100px"
          />
</>
        )
      } */}
      <div className="custom__filter">
        {isFilter && (
          <Dropdown
            onSelect={handleFilterSelect}
            options={filterOptions}
            titleLabel="Filter"
            type="large"
            value={selectedFilter}
            width="100%"
          />
        )}
      </div>
      
      <Button
        onClick={onFetchSelectedDatesData}
        size="small"
        text={buttonText || "Fetch"}
      />
    </div>
  );
}

export default DateRangePicker;
