<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-card
        style="
          display: inline-block;
          margin-left: 50px;
          margin-top: 30px;
          font-weight: bold;
          font-size: 22px;
          color: #ffb02a;
        "
        >RM Total：{{ total | numFilter }}</el-card
      >
      <!--      bar chart-->
      <el-tab-pane label="Revenue by Category Bar Chart" name="bar">
        <div
          id="bar"
          style="width: 1200px; height: 500px; margin: auto auto"
        ></div>
      </el-tab-pane>
      <!--      pie chart-->
      <el-tab-pane label="Revenue by Category Pie Chart" name="pie">
        <div
          id="pie"
          style="width: 600px; height: 600px; margin: 10px auto"
        ></div>
      </el-tab-pane>
      <!--  This Week Revenue line chart-->
      <el-tab-pane label="This Week Revenue" name="line1">
        <div
          id="weekLine"
          style="width: 900px; height: 500px; margin: 10px auto"
        ></div>
      </el-tab-pane>
      <!-- This Month Revenue line chart-->
      <el-tab-pane label="This Month Revenue" name="line2">
        <div
          id="monthLine"
          style="width: 1500px; height: 500px; margin: 10px auto"
        ></div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "IncomeChart",
  data() {
    return {
      sumIncome: 0,
      categoryIncomes: [],
      categoryNames: [],
      incomes: [],
      activeName: "bar",
      totalAll: 0,
      totalWeek: 0,
      totalMonth: 0,
      total: 0,
    };
  },
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case "bar":
          this.total = this.totalAll;
          break;
        case "pie":
          this.total = this.totalAll;
          break;
        case "line1":
          this.total = this.totalWeek;
          break;
        case "line2":
          this.total = this.totalMonth;
          break;
      }
    },
  },

  mounted() {
    var barChart = echarts.init(document.getElementById("bar"));
    var pieChart = echarts.init(document.getElementById("pie"));
    var lineChart1 = echarts.init(document.getElementById("weekLine"));
    var lineChart2 = echarts.init(document.getElementById("monthLine"));
    var barOption = {
      tooltip: {
        trigger: "item",
      },
      title: {
        text: "Revenue Bar Chart",
        x: "center",
      },
      label: {
        show: true, //whether to show
        position: "top",
      },
      xAxis: {
        type: "category",
        data: [],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [],
          type: "bar",
        },
      ],
    };
    var pieOption = {
      tooltip: {
        trigger: "item",
      },

      title: {
        text: "Revenue Pie Chart",
        x: "center",
      },
      series: [
        {
          type: "pie",
          data: [],
        },
      ],
    };
    var lineOption1 = {
      tooltip: {
        trigger: "item",
      },
      label: {
        show: true, //whether to show
      },
      title: {
        text: "This Week Revenue",
        x: "center",
      },
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [],
          type: "line",
        },
      ],
    };
    var lineOption2 = {
      tooltip: {
        trigger: "item",
      },
      label: {
        show: true, //whether to show
      },
      title: {
        text: "This Month Revenue",
        x: "center",
      },
      xAxis: {
        type: "category",
        data: [],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [],
          type: "line",
        },
      ],
    };
    //Render bar and pie charts
    this.request.get("/api/income/chart").then((res) => {
      if (res.code === "200") {
        let categoryIncomes = res.data.categoryIncomes;
        let categoryNames = categoryIncomes.map((item) => {
          return item.categoryName;
        });
        let incomes = categoryIncomes.map((item) => {
          return item.categoryIncome;
        });
        barOption.xAxis.data = categoryNames;
        barOption.series[0].data = incomes;
        barChart.setOption(barOption);

        for (let i = 0; i < categoryNames.length; i++) {
          let item = { value: incomes[i], name: categoryNames[i] };
          pieOption.series[0].data.push(item);
        }
        pieChart.setOption(pieOption);
        //Calculate total
        let sum = 0;
        incomes.forEach((item) => {
          sum += item;
        });
        this.total = sum;
        this.totalAll = sum;
      }
    });
    //Render this week line chart
    this.request.get("/api/income/week").then((res) => {
      if (res.code === "200") {
        // lineOption1.xAxis.data = res.data.weekDays;
        let weekIncome = res.data.weekIncome;
        lineOption1.series[0].data = weekIncome;
        lineChart1.setOption(lineOption1);
        //Calculate this week revenue
        let sum = 0;
        weekIncome.forEach((item) => {
          sum += item;
        });
        this.totalWeek = sum;
      }
    });
    //Render this month line chart
    this.request.get("/api/income/month").then((res) => {
      if (res.code === "200") {
        lineOption2.xAxis.data = res.data.monthDays;
        let monthIncome = res.data.monthIncome;
        lineOption2.series[0].data = monthIncome;
        lineChart2.setOption(lineOption2);
        //Calculate this month revenue
        let sum = 0;
        monthIncome.forEach((item) => {
          sum += item;
        });
        this.totalMonth = sum;
      }
    });
  },
  filters: {
    numFilter(value) {
      // Round current value to two decimal places

      let realVal = Number(value).toFixed(2);

      // num.toFixed(2) returns a string

      return Number(realVal);
    },
  },
};
</script>

<style scoped>
</style>