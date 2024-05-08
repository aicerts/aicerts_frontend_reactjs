import React, { useEffect, useState } from "react";
import DashboardCard from "../components/dashboardCard"; // Importing DashboardCard component
import LineChart from "../components/lineChart"; // Importing LineChart component
import BarChart from "../components/barChart"; // Importing BarChart component

const Dashboard = () => {
    const [token, setToken] = useState(null); // State variable for storing token
    const [email, setEmail] = useState(null); // State variable for storing email
    const [formData, setFormData] = useState({ // State variable for form data
        email: "",
        certificateNumber: "",
        name: "",
        course: "",
        grantDate: null, // Use null for Date values
        expirationDate: null, // Use null for Date values
    });

    useEffect(() => {
        // Check if the token is available in localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser && storedUser.JWTToken) {
            // If token is available, set it in the state
            setToken(storedUser.JWTToken);
            setEmail(storedUser.email);
            // Set formData.email with stored email
            setFormData((prevFormData) => ({
                ...prevFormData,
                email: storedUser.email,
            }));
        } else {
            // If token is not available, redirect to the login page
            router.push("/");
        }
    }, []);

    const cardsData = [
        {
            title: "Certificates",
            titleValue: "Issued",
            badgeIcon: "",
            value: "635",
            percentage: "+21.01%",
        },
        {
            title: "Monthly Certificates",
            titleValue: "Expiration",
            badgeIcon: "",
            value: "635",
            percentage: "+21.01%",
        },
        {
            title: "Certificates",
            titleValue: "Reactive",
            badgeIcon: "",
            value: "635",
            percentage: "+21.01%",
        },
        {
            title: "Certificates",
            titleValue: "Revoked",
            badgeIcon: "",
            value: "635",
            percentage: "+21.01%",
        },
    ];

    return (
        <div className="dashboard-main">
            <div className="cards-container-main">
                {/* Mapping through cardsData and rendering DashboardCard component for each item */}
                {cardsData.map((item, index) => {
                    return <DashboardCard key={index} item={item} />;
                })}
            </div>

            {/* Rendering LineChart component */}
            <LineChart />
            {/* Rendering BarChart component */}
            <BarChart />
        </div>
    );
};

export default Dashboard;
