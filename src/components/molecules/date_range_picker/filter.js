import moment from 'moment';

const format = "YYYY-MM-DD";
const today = moment().format(format);
const yesterday = moment().subtract(1, 'days').format(format);
const startOfLast7Days = moment().subtract(7, 'days').format(format);
const startOfLast30Days = moment().subtract(30, 'days').format(format);
const startOfCurrentMonth = moment().startOf('month').format(format);
const endOfCurrentMonth = moment().endOf('month').format(format);
const startOfLastYear = moment().subtract(1, 'year').format(format);

export const filterOptions = [
  {
    id: 0,
    name: "Custom",
    startDate: today,
    endDate: today,
  },
  {
    id: 1,
    name: "Today",
    startDate: today,
    endDate: today,
  },
  {
    id: 2,
    name: "Yesterday",
    startDate: yesterday,
    endDate: yesterday,
  },
  {
    id: 3,
    name: "Last 7 days",
    startDate: startOfLast7Days,
    endDate: today,
  },
  {
    id: 3,
    name: "Last 30 days",
    startDate: startOfLast30Days,
    endDate: today,
  },
  {
    id: 4,
    name: "This Month",
    startDate: startOfCurrentMonth,
    endDate: endOfCurrentMonth,
  },
  {
    id: 5,
    name: "Last Year",
    startDate: startOfLastYear,
    endDate: today,
  },
];
