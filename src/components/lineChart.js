import React from "react";
import { Line } from "react-chartjs-2"; // Importing Line component from react-chartjs-2
import { CategoryScale, LinearScale, PointElement, LineElement } from "chart.js"; // Importing necessary elements from chart.js library
import Chart from "chart.js/auto"; // Importing Chart from chart.js/auto

function LineChart() {
    Chart.register(CategoryScale, LinearScale, PointElement, LineElement); // Registering necessary chart elements for use

    // Data for the chart
    const labels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: "Issued",
                backgroundColor: "#93AAFD",
                borderColor: "#93AAFD",
                data: [100, 120, 140, 130, 150, 170, 180, 190, 200, 180, 160, 140],
                tension: 0.4,
                pointBackgroundColor: "#93AAFD",
                pointBorderColor: "#93AAFD",
                pointRadius: 5,
                pointHoverRadius: 7,
            },
            {
                label: "Expired",
                backgroundColor: "#962DFF",
                borderColor: "#962DFF",
                data: [80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190],
                tension: 0.4,
                pointBackgroundColor: "#962DFF",
                pointBorderColor: "#962DFF",
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    // Render the LineChart component
    return (
        <div className="outer-container">
            <input className="chart-date" type="date" /> {/* Input for selecting date */}
            <Line
                width={"100%"}
                height={"90%"}
                data={chartData} // Pass the chart data to the Line component
                options={{
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: "top",
                        },
                    },
                    elements: {
                        line: {
                            borderWidth: 1,
                            borderCapStyle: "round",
                            borderJoinStyle: "round",
                        },
                        point: {
                            hoverRadius: 7,
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

export default LineChart; // Exporting the LineChart component for use in other files
