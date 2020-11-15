import React, { useEffect } from "react";
import Chart from "chart.js";
import { fetchShopping } from "./api";

export default function Charts() {
  useEffect(() => {
    fetchShopping().then((shopping) => {
      const sorted = shopping.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      console.log(sorted);
      let data = sorted.map(({ date, price }) => {
        let isoDate = new Date(date).setHours(0, 0, 0, 0);
        return { x: isoDate, y: price };
      });
      let finalData = [];
      for (let i = 0; i < data.length; i++) {
        let found = false;
        for (let j = 0; j < finalData.length; j++) {
          if (data[i].x === finalData[j].x) {
            finalData[j].y += data[i].y;
            found = true;
          }
        }
        if (!found) {
          finalData.push(data[i]);
        }
      }
      console.log(finalData);

      let ctx = "myChart";
      new Chart(ctx, {
        type: "line",
        data: {
          datasets: [
            {
              label: "Grocery Spending",
              data: finalData,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(54, 162, 235, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
            xAxes: [
              {
                type: "time",
                time: {
                  unit: "month",
                },
              },
            ],
          },
          title: {
            display: true,
            text: "Track Your Grocery Spending",
            fontSize: 36,
            fontFamily: "Montserrat",
          },
          elements: {
            line: {
              fill: false,
            },
          },
        },
      });
    });
  }, []);

  return (
    <div>
      <canvas id="myChart" width="80vw" height="40vh"></canvas>
    </div>
  );
}
