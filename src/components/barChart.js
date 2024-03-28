import React from "react";
import { Bar } from "react-chartjs-2"; // Importing Bar component from react-chartjs-2
import { CategoryScale, LinearScale, BarElement, Title } from "chart.js"; // Importing necessary elements from chart.js library
import Chart from "chart.js/auto"; // Importing Chart from chart.js/auto

function BarChart() {
    Chart.register(CategoryScale, LinearScale, BarElement, Title); // Registering necessary chart elements for use

    // Data for the chart
    const labels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: "Sales",
                backgroundColor: "#93AAFD",
                borderColor: "#93AAFD",
                data: [100, 120, 140, 130, 150, 170, 180, 190, 200, 180, 160, 140],
                barThickness: 20, // Define the thickness of each bar
                borderRadius: 6, // Define the border radius of each bar
            },
            {
                label: "Expenses",
                backgroundColor: "#962DFF",
                borderColor: "#962DFF",
                data: [80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190],
                barThickness: 20, // Define the thickness of each bar
                borderRadius: 6, // Define the border radius of each bar
            },
        ],
    };

    // Render the BarChart component
    return (
        <div className="outer-container">
             <input  className="chart-date" type="date"/> {/* Input for selecting date */}
            <Bar
                width={"100%"}
                height={"90%"}
                data={chartData} // Pass the chart data to the Bar component
                options={{
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: "top",
                        },
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false, // Hide vertical grid lines
                            },
                            ticks: {
                                display: false, // Hide vertical labels
                            },
                        },
                        y: {
                            grid: {
                                color: "rgba(0,0,0,0.2)",
                                borderDash: [5], // Dashed grid lines
                            },
                            ticks: {
                                stepSize: 50, // Define the step size for y-axis ticks
                                callback: function (value, index, values) {
                                    return value === 0 ? value : value + 200; // Manipulate y-axis tick labels
                                },
                            },
                        },
                    },
                    layout: {
                        padding: {
                            top: 50,
                            bottom: 50,
                            left: 50,
                            right: 50,
                        },
                    },
                }}
            />
        </div>
    );
}

export default BarChart; // Exporting the BarChart component for use in other files
