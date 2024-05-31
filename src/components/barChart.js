import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2"; 
import { CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import Chart from "chart.js/auto";
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const getYears = (numYears) => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: numYears }, (_, i) => currentYear - i);
};

function BarChart() {
    const [responseData, setResponseData] = useState(null);
    const [email, setEmail] = useState(''); // Placeholder email
    const [token, setToken] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false); // State to track loading status
    Chart.register(CategoryScale, LinearScale, BarElement, Title);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser && storedUser.JWTToken) {
            setToken(storedUser.JWTToken);
            setEmail(storedUser.email);
        } else {
            router.push("/");
        }
    }, []);

    const fetchData = async (selectedYear) => {
        try {
            setLoading(true); // Set loading to true before making the API call
            const encodedEmail = encodeURIComponent(email);
            const response = await fetch(`${apiUrl}/api/get-graph-data/${selectedYear}/${encodedEmail}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            setResponseData(data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // Set loading to false after the API call
        }
    };

    useEffect(() => {
        if(email){
            fetchData(year);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year, email]);

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    const labels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    
    const chartData = responseData ? {
        labels: labels,
        datasets: [
            {
                label: "Single Issued",
                backgroundColor: "#93AAFD",
                borderColor: "#93AAFD",
                data: responseData.map(item => item.count[0]),
                barThickness: 20,
                borderRadius: 6,
            },
            {
                label: "Batch Issued",
                backgroundColor: "#962DFF",
                borderColor: "#962DFF",
                data: responseData.map(item => item.count[1]),
                barThickness: 20,
                borderRadius: 6,
            },
        ],
    } : {
        labels: labels,
        datasets: [
            {
                label: "Single Issued",
                backgroundColor: "#93AAFD",
                borderColor: "#93AAFD",
                data: Array(12).fill(0),
                barThickness: 20,
                borderRadius: 6,
            },
            {
                label: "Batch Issued",
                backgroundColor: "#962DFF",
                borderColor: "#962DFF",
                data: Array(12).fill(0),
                barThickness: 20,
                borderRadius: 6,
            },
        ],
    };

    return (
        <div className="container outer-container">
            {/* <div className="chart-date">
                <label htmlFor="year-select">Select Year:</label>
                <select id="year-select" value={year} onChange={handleYearChange}>
                    {getYears(5).map(yearOption => (
                        <option key={yearOption} value={yearOption}>
                            {yearOption}
                        </option>
                    ))}
                </select>
            </div> */}
            {loading ? (
                <div className="loader">
                <div class="spinner-border text-danger" role="status">
                </div>
              </div>
            ) : (
                <Bar
                    width={"100%"}
                    height={"90%"}
                    data={chartData}
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
                                    display: false,
                                },
                                ticks: {
                                    display: true,
                                },
                                barPercentage: 0.6,  // Adjust this value for bar width
                                categoryPercentage: 0.5,  // Adjust this value for space between groups
                            },
                            y: {
                                grid: {
                                    color: "rgba(0,0,0,0.2)",
                                    borderDash: [5],
                                },
                                ticks: {
                                    stepSize: 50,
                                    callback: function (value) {
                                        return value === 0 ? value : value + 200;
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
            )}
        </div>
    );
}

export default BarChart;
