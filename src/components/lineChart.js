import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import Chart from "chart.js/auto";
import { useRouter } from 'next/router';

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Utility function to get the current year and month options
const getOptions = () => {
    const currentYear = new Date().getFullYear();
    
    return [
        { value: currentYear, label: "Current Year" },
        ...Array.from({ length: 12 }, (_, i) => ({
            value: String(i + 1).padStart(2, '0'),
            label: new Date(0, i).toLocaleString('default', { month: 'long' }).toUpperCase()
        }))
    ];
};

function LineChart() {
    Chart.register(CategoryScale, LinearScale, PointElement, LineElement);
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Issued",
                backgroundColor: "#93AAFD",
                borderColor: "#93AAFD",
                data: [],
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
                data: [],
                tension: 0.4,
                pointBackgroundColor: "#962DFF",
                pointBorderColor: "#962DFF",
                pointRadius: 5,
                pointHoverRadius: 7,
            },
            {
                label: "Reactivated",
                backgroundColor: "#FFAA33",
                borderColor: "#FFAA33",
                data: [],
                tension: 0.4,
                pointBackgroundColor: "#FFAA33",
                pointBorderColor: "#FFAA33",
                pointRadius: 5,
                pointHoverRadius: 7,
            },
            {
                label: "Revoked",
                backgroundColor: "#FF3333",
                borderColor: "#FF3333",
                data: [],
                tension: 0.4,
                pointBackgroundColor: "#FF3333",
                pointBorderColor: "#FF3333",
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    });

    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0'); // Default to current month
    const [selectedOption, setSelectedOption] = useState(currentMonth);
    const [email, setEmail] = useState("");
    const [token, setToken] = useState(null);
    const router = useRouter();
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser && storedUser.JWTToken) {
            setToken(storedUser.JWTToken);
            setEmail(storedUser.email);
        } else {
            router.push("/");
        }
    }, [router]);
    useEffect(() => {
        const fetchData = async (option) => {
            setLoading(true)
            try {
                const encodedEmail = encodeURIComponent(email);
                const response = await fetch(`${apiUrl}/api/get-status-graph-data/${option}/${encodedEmail}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                updateChartData(data.data, option);
            } catch (error) {
                console.error('Error fetching data:', error);
            }finally {
                setLoading(false); // Set loading to false after the API call
            }
        };

        fetchData(selectedOption);
    }, [selectedOption, email]);

    const updateChartData = (data, option) => {
        const isYearSelected = option.length === 4; // Check if option is a year
        const issuedData = Array(isYearSelected ? 12 : 31).fill(0);
        const expiredData = Array(isYearSelected ? 12 : 31).fill(0);
        const reactivatedData = Array(isYearSelected ? 12 : 31).fill(0);
        const revokedData = Array(isYearSelected ? 12 : 31).fill(0);

        data.forEach((item) => {
            const index = isYearSelected ? item.month - 1 : item.day - 1;
            issuedData[index] = item.count[0];
            expiredData[index] = item.count[1];
            reactivatedData[index] = item.count[2];
            revokedData[index] = item.count[3];
        });

        setChartData({
            labels: isYearSelected
                ? ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]
                : Array.from({ length: 31 }, (_, i) => i + 1),
            datasets: [
                {
                    label: "Issued",
                    backgroundColor: "#93AAFD",
                    borderColor: "#93AAFD",
                    data: issuedData,
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
                    data: expiredData,
                    tension: 0.4,
                    pointBackgroundColor: "#962DFF",
                    pointBorderColor: "#962DFF",
                    pointRadius: 5,
                    pointHoverRadius: 7,
                },
                {
                    label: "Reactivated",
                    backgroundColor: "#FFAA33",
                    borderColor: "#FFAA33",
                    data: reactivatedData,
                    tension: 0.4,
                    pointBackgroundColor: "#FFAA33",
                    pointBorderColor: "#FFAA33",
                    pointRadius: 5,
                    pointHoverRadius: 7,
                },
                {
                    label: "Revoked",
                    backgroundColor: "#FF3333",
                    borderColor: "#FF3333",
                    data: revokedData,
                    tension: 0.4,
                    pointBackgroundColor: "#FF3333",
                    pointBorderColor: "#FF3333",
                    pointRadius: 5,
                    pointHoverRadius: 7,
                },
            ],
        });
    };

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    return (
        <div className="container outer-container">
            <div className="chart-date">
                <label htmlFor="option-select">Select Year or Month:</label>
                <select id="option-select" value={selectedOption} onChange={handleOptionChange}>
                    {getOptions().map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {loading ? (
                <div className="loader">
                <div class="spinner-border text-danger" role="status">
                </div>
              </div>
            ) : (
            <Line
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
                                display: false,
                            },
                            ticks: {
                                display: true,
                            },
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

export default LineChart;
