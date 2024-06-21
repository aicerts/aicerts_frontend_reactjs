import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import Chart from "chart.js/auto";
import { useRouter } from 'next/router';
import DatePicker from "react-datepicker";
import { AiOutlineCalendar, AiOutlineDown } from 'react-icons/ai';
import calenderIcon from "../../public/icons/calendar.svg";
import "react-datepicker/dist/react-datepicker.css";
import Image from 'next/image';

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

function LineChart() {
    Chart.register(CategoryScale, LinearScale, PointElement, LineElement);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    const [originalData, setOriginalData] = useState({
        labels: [],
        datasets: [],
    });

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [email, setEmail] = useState("");
    const [token, setToken] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("All");

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
        const fetchData = async (date) => {
            setLoading(true);
            try {
                const currentYear = new Date().getFullYear();
                const selectedYear = date.getFullYear();

                if (selectedYear !== currentYear) {
                    updateChartData([], `${selectedYear}`);
                    return;
                }

                const encodedEmail = encodeURIComponent(email);
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const response = await fetch(`${apiUrl}/api/get-status-graph-data/${month}/${encodedEmail}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                updateChartData(data.data, `${year}-${month}`);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchData(selectedDate);
    }, [selectedDate, email]);

    const updateChartData = (data, option) => {
        const isYearSelected = option.length === 4; // Check if option is a year
        const issuedData = Array(isYearSelected ? 12 : 31).fill(0);
        const reactivatedData = Array(isYearSelected ? 12 : 31).fill(0);
        const revokedData = Array(isYearSelected ? 12 : 31).fill(0);

        data.forEach((item) => {
            const index = isYearSelected ? item.month - 1 : item.day - 1;
            issuedData[index] = item.count[0];
            reactivatedData[index] = item.count[2];
            revokedData[index] = item.count[3];
        });

        const updatedData = {
            labels: isYearSelected
                ? ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]
                : Array.from({ length: 31 }, (_, i) => i + 1),
            datasets: [
                {
                    label: "Issued",
                    backgroundColor: "#CFA935",
                    borderColor: "#CFA935",
                    data: issuedData,
                    tension: 0.4,
                    pointBackgroundColor: "#CFA935",
                    pointBorderColor: "#CFA935",
                    pointRadius: 5,
                    pointHoverRadius: 7,
                },
                {
                    label: "Reactivated",
                    backgroundColor: "#A28F65",
                    borderColor: "#A28F65",
                    data: reactivatedData,
                    tension: 0.4,
                    pointBackgroundColor: "#A28F65",
                    pointBorderColor: "#A28F65",
                    pointRadius: 5,
                    pointHoverRadius: 7,
                },
                {
                    label: "Revoked",
                    backgroundColor: "#ECDDAE",
                    borderColor: "#ECDDAE",
                    data: revokedData,
                    tension: 0.4,
                    pointBackgroundColor: "#ECDDAE",
                    pointBorderColor: "#ECDDAE",
                    pointRadius: 5,
                    pointHoverRadius: 7,
                },
            ],
        };

        setOriginalData(updatedData);
        filterChartData(selectedFilter, updatedData);
    };

    const filterChartData = (filter, data = originalData) => {
        if (filter === "All") {
            setChartData(data);
        } else {
            const filteredDatasets = data.datasets.filter(dataset => dataset.label === filter);
            setChartData({
                labels: data.labels,
                datasets: filteredDatasets,
            });
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleFilterChange = (e) => {
        const filter = e.target.value;
        setSelectedFilter(filter);
        filterChartData(filter);
    };

    const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
        <div className="custom-date-input" onClick={onClick} ref={ref}>
            <Image className="me-2" width={26} height={26} src={calenderIcon} alt="Calendar Icon" />
            <span>{value}</span>
            <AiOutlineDown className="icon-down" />
        </div>
    ));
    CustomInput.displayName = "CustomInput";

    return (
        <div className="container outer-container">
            <div className="chart-date">
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    customInput={<CustomInput />}
                    className="form-control"
                />
            </div>
            <div className="filter-options">
    <label>
        <input
            type="radio"
            value="All"
            checked={selectedFilter === "All"}
            onChange={handleFilterChange}
        />
        All
    </label>
    <label>
        <input
            type="radio"
            value="Issued"
            checked={selectedFilter === "Issued"}
            onChange={handleFilterChange}
        />
        Issued
    </label>
    <label>
        <input
            type="radio"
            value="Reactivated"
            checked={selectedFilter === "Reactivated"}
            onChange={handleFilterChange}
        />
        Reactivated
    </label>
    <label>
        <input
            type="radio"
            value="Revoked"
            checked={selectedFilter === "Revoked"}
            onChange={handleFilterChange}
        />
        Revoked
    </label>
</div>

            {loading ? (
                <div className="loader">
                    <div className="spinner-border text-danger" role="status">
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
                                display: false, // Hide the legend
                            },
                        },
                        elements: {
                            line: {
                                borderWidth: 1.5,
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
