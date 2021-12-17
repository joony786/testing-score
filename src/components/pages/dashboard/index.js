import React, { useEffect, useState } from "react";
import SwitchOutlet from "../../atoms/switch_outlet";
import PageTitle from "../../organism/header";
import { useHistory } from "react-router-dom";
import * as DasboardApiUtil from "../../../utils/api/dashboard-api-utils";
import { Line, Pie } from "react-chartjs-2";
import moment from "moment";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [salesToday, setSalesToday] = useState(null);
  const [salesChartData, setSalesChartData] = useState(null);
  const [mostSoldData, setMostSoldData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [dashboardInfo, setDashboardInfo] = useState(false);
  const [screenWidth, setScreenWidth] = useState(null);
  const [totalSku, setTotalSku] = useState("");
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const updateSize = () => {
      const screen =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      setScreenWidth(screen);
    };

    window.addEventListener("resize", updateSize);
    fetchDashboardData();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const fetchDashboardData = async (e) => {
    document.getElementById("app-loader-container").style.display = "block";

    // Calculate current week dates ranges
    let Dates = [];
    let customDates = [];

    // const startDate = moment().subtract(1, "week").format("YYYY-MM-DD");
    // const endDate = moment().format("YYYY-MM-DD");

    // const mapWeekData = (start, end) => {
    //   let s = start.split("-")[2];
    //   let e = end.split("-")[2];
    //   const startingPoint = start.substring(0, start.length - 2);
    //   for (s; s <= e; s++) {
    //     let date = startingPoint + s.toString();
    //     Dates.push(formatDate(formatDate(date)));
    //     customDates.push(date);
    //   }
    //   console.log(Dates);
    //   setDates(Dates);
    // };
    // mapWeekData(startDate, endDate);

    function getCurrentWeek() {
      const weekStart = moment().subtract(1, "week").format("YYYY-MM-DD");
      for (var i = 1; i <= 7; i++) {
        const date = moment(weekStart).add(i, "days").format("YYYY-MM-DD");
        Dates.push(formatDate(formatDate(date)));
        customDates.push(date);
      }
      setDates(Dates);
    }

    getCurrentWeek();

    const fetchDashboardDataviewResponse =
      await DasboardApiUtil.getDashboardData();
    console.log(
      "fetchDashboardDataviewResponse:",
      fetchDashboardDataviewResponse
    );
    if (fetchDashboardDataviewResponse.hasError) {
      console.log(
        "Cant fetch Dashboard Data -> ",
        fetchDashboardDataviewResponse.errorMessage
      );
      //message.error(fetchDashboardDataviewResponse.errorMessage, 3);
      document.getElementById("app-loader-container").style.display = "none";
      setLoading(false);
    } else {
      document.getElementById("app-loader-container").style.display = "none";
      setLoading(false);
      //message.success(fetchDashboardDataviewResponse.message, 3);
      setDashboardInfo(fetchDashboardDataviewResponse.status); //imp
      let screen =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      setScreenWidth(screen); //imp

      /*------formulating data for dashboard graphs------------------*/

      const dashboardData = fetchDashboardDataviewResponse;
      let salesToday = dashboardData.salesToday;
      setTotalSku(dashboardData?.no_of_sku);
      setSalesToday(salesToday);
      const salesChartData = {
        labels: [],
        data: {
          sale: [],
          unit: [],
        },
      };
      let obj = {};
      let final = [];
      const reversedArray = [...dashboardData.salesChart].reverse();
      customDates.forEach((item, index) => {
        reversedArray.filter((elem, I) => {
          if (item === elem.date) {
            obj = {
              date: elem.date,
              sale_total: elem.sale_total,
              units: elem.units,
            };
            final.push(obj);
          } else {
            obj = {
              date: item,
              sale_total: 0,
              units: 0,
            };
          }
        });
        final.push(obj);
      });
      const uniqueData = (array, key) =>
        array.reduce(
          (prev, curr) =>
            prev.find((a) => a[key] === curr[key])
              ? prev
              : prev.push(curr) && prev,
          []
        );
      const UniqueData = uniqueData(final, "date");
      UniqueData.forEach(({ date, sale_total, units }) => {
        salesChartData.labels.push(formatDate(formatDate(date)));
        salesChartData.data.sale.push(parseFloat(sale_total).toFixed(2));
        salesChartData.data.unit.push(units);
      });

      setSalesChartData(salesChartData);

      const mostSoldData = {
        data: [],
        labels: [],
      };

      const isArrayCheck = Array.isArray(dashboardData.mostSold);
      if (isArrayCheck && dashboardData.mostSold.length > 0) {
        dashboardData.mostSold.forEach(({ quantity, name }) => {
          mostSoldData.data.push(quantity);
          mostSoldData.labels.push(name);
        });
      }

      setMostSoldData(mostSoldData);

      const pieChartData = {
        totalSales: dashboardData.pieChart[0].total_sales,
      };

      setPieChartData(pieChartData);
    }
  };

  function formatDate(d) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date(d);

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return day + " " + monthNames[monthIndex] + " " + year;
  }

  let salesHistoryLineChartDataSets;

  if (salesChartData && Object.keys(salesChartData).length) {
    salesHistoryLineChartDataSets = {
      labels: salesChartData.labels,
      datasets: [
        {
          label: "unit",
          data: salesChartData.data.unit,
          backgroundColor: "#CFE0FF",
          borderColor: "#CFE0FF",
          borderWidth: 3,
          yAxisID: "y-axis-1",
          fill: true,
          lineTension: 0,
          pointStyle: "rectRot",
        },
        {
          label: "sale",
          data: salesChartData.data.sale,
          backgroundColor: "#0D62FF",
          borderColor: "#0D62FF",
          borderWidth: 3,
          yAxisID: "y-axis-2",
          fill: true,
          lineTension: 0,
        },
      ],
    };
  } else {
    const salesChart = {
      labels: dates,
      data: {
        sale: [0, 0, 0, 0, 0, 0, 0, 0],
        unit: [0, 0, 0, 0, 0, 0, 0, 0],
      },
    };
    salesHistoryLineChartDataSets = {
      labels: salesChart.labels,
      datasets: [
        {
          label: "unit",
          data: salesChart.data.unit,
          backgroundColor: "#CFE0FF",
          borderColor: "#CFE0FF",
          borderWidth: 3,
          yAxisID: "y-axis-1",
          fill: true,
          lineTension: 0,
          pointStyle: "rectRot",
        },
        {
          label: "sale",
          data: salesChart.data.sale,
          backgroundColor: "#0D62FF",
          borderColor: "#0D62FF",
          borderWidth: 3,
          yAxisID: "y-axis-2",
          fill: true,
          lineTension: 0,
        },
      ],
    };
  }
  let salesHistoryPieChartDataSets;
  if (pieChartData && Object.keys(pieChartData).length) {
    salesHistoryPieChartDataSets = {
      labels: ["Totalsales"],
      datasets: [
        {
          data: [pieChartData.totalSales],
          backgroundColor: ["#58BE86", "#6bcec6"],
          label: "sales ($)",
        },
      ],
    };
  } else {
    salesHistoryPieChartDataSets = {
      labels: ["Totalsales"],
      datasets: [
        {
          data: null,
          backgroundColor: ["#58BE86", "#6bcec6"],
          label: "sales ($)",
        },
      ],
    };
  }
  let salesHistoryMostSoldLineChartDataSets;
  if (mostSoldData) {
    salesHistoryMostSoldLineChartDataSets = {
      labels: mostSoldData.labels,
      datasets: [
        {
          label: "unit",
          data: mostSoldData.data,
          backgroundColor: "#EF5DA8",
          borderColor: "#EF5DA8",
          borderWidth: 3,
          yAxisID: "y-axis-1",
          fill: false,
          lineTension: 0,
        },
      ],
    };
  } else {
    salesHistoryMostSoldLineChartDataSets = {
      labels: "",
      datasets: [
        {
          label: "unit",
          data: null,
          backgroundColor: "#EF5DA8",
          borderColor: "#EF5DA8",
          borderWidth: 3,
          yAxisID: "y-axis-1",
          fill: false,
          lineTension: 0,
        },
      ],
    };
  }
  const salesHistoryLineChartOptions = {
    title: {
      display: true,
      text: "Sales History",
    },
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "units",
            stacked: false,
          },
          display: true,
          text: "units",
          position: "left",
          id: "y-axis-1",
          ticks: {
            beginAtZero: true,
          },
        },
        {
          scaleLabel: {
            display: true,
            labelString: "sales ($)",
          },
          display: true,
          position: "right",
          id: "y-axis-2",
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: true,
  };
  const salesHistoryMostSoldLineChartOptions = {
    title: {
      display: true,
      text: "Most Sold",
    },
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "units",
          },
          display: true,
          text: "units",
          position: "left",
          id: "y-axis-1",
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: true, //imp
  };
  const pieChartOptions = {
    responsive: true,
    title: {
      display: true,
      text: "Sales Channel",
    },
    maintainAspectRatio: true,
  };

  // const getNum = (val) => {
  //   if (isNaN(val)) {
  //     return "0%";
  //   }
  //   return val;
  // };
  /*  formulas 
        --  Sales profit / total sales = Avg Ticket Size
        --  gross profit margin = sales today – total cost /sales today  * 100 
        --  units per transaction = total sku added /total invoices count (or sale_count.)
            */
  // const {gross_profit,sales_today,total_cost,sales_count,product_sold} = salesToday
  // const AvgTicketSize =
  //   salesToday &&
  //   getNum((salesToday.gross_profit / salesToday.sales_today) * 100);
  // const grossProfitMargin =
  //   salesToday &&
  //   getNum(
  //     ((salesToday.sales_today - salesToday.total_cost) /
  //       salesToday.sales_today) *
  //       100
  //   );
  // const unitPerTransaction =
  //   salesToday &&
  //   totalSku &&
  //   getNum(totalSku.no_of_skus / salesToday.sales_count);
  const plugins = [
    {
      afterDraw: (chart) => {
        if (chart.data.datasets[0].data.length < 1) {
          let ctx = chart.ctx;
          let width = chart.width;
          let height = chart.height;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "15px Arial";
          ctx.fillText("No data to display", width / 2, height / 2);
          ctx.restore();
        }
      },
    },
  ];

  const formatValues = (value) => {
    if (value > 1) {
      return `${value} units`;
    } else return `${value} unit`;
  };

  const returnFormateValues = (value) => {
    return value % 1 !== 0 ? parseFloat(value).toFixed(2) : value;
  };

  const dashboardTiles = [
    {
      id: 1,
      title: "Sales Today",
      value:
        salesToday && salesToday.sales_today
          ? returnFormateValues(salesToday.sales_today)
          : 0,
    },
    {
      id: 2,
      title: "Sales Count",
      value: salesToday && salesToday.sales_count ? salesToday.sales_count : 0,
    },
    {
      id: 3,
      title: "Products Sold",
      value:
        salesToday && salesToday.product_sold ? salesToday.product_sold : 0,
    },
    {
      id: 4,
      title: "Gross Profit",
      value:
        salesToday && salesToday.gross_profit
          ? returnFormateValues(salesToday.gross_profit)
          : 0,
    },
    {
      id: 5,
      title: "Avg Ticket Size",
      value:
        salesToday && salesToday.avg_ticket_size
          ? returnFormateValues(salesToday.avg_ticket_size)
          : 0,
    },
    {
      id: 6,
      title: "Gross profit margin",
      value:
        salesToday && salesToday.gross_profit_margin
          ? returnFormateValues(salesToday.gross_profit_margin)
          : 0,
    },
    {
      id: 7,
      title: "units per transaction",
      value:
        salesToday && salesToday.unit_per_transaction
          ? salesToday.unit_per_transaction % 1 !== 0
            ? formatValues(
                parseFloat(salesToday.unit_per_transaction).toFixed(2)
              )
            : formatValues(salesToday.unit_per_transaction)
          : formatValues(0),
    },
  ];
  const returnTrue = (num) => {
    switch (num) {
      // case 5: {
      //   return true;
      // }
      case 6: {
        return true;
      }
      default: {
        return false;
      }
    }
  };
  return (
    <div className="page dashboard">
      <div className="page__top">
        <SwitchOutlet />
      </div>

      <PageTitle title="Dashboard" />

      <section className="section section__sales">
        <div>
          <h1 className="heading heading--primary">Daily Sales</h1>
          <div className="section__sales_content">
            <Line
              data={salesHistoryLineChartDataSets}
              options={salesHistoryLineChartOptions}
            />
          </div>
        </div>
      </section>

      <section className="section section__graph">
        <div className="section__graph_content">
          <div className="history">
            <h1 className="heading heading--primary">Sales History</h1>
            <Pie
              data={salesHistoryPieChartDataSets}
              width={100}
              height={100}
              options={pieChartOptions}
              plugins={plugins}
            />
          </div>

          <div className="most_sold">
            <h1 className="heading heading--primary">Most Sold Items</h1>
            <Line
              data={salesHistoryMostSoldLineChartDataSets}
              options={salesHistoryMostSoldLineChartOptions}
              plugins={plugins}
            />
          </div>
        </div>
      </section>
      <section className="section section__stats">
        {dashboardTiles.map(({ title, id, value }) => {
          return (
            <div key={id} className="box">
              <span className="text">{title}</span>
              <span className="number">
                {returnTrue(id) ? `${value + " %"}` : value}
              </span>
            </div>
          );
        })}
      </section>
    </div>
  );
};
export default Dashboard;
