import React, { useEffect, useState } from "react";
import DashboardCard from "../components/dashboardCard"; // Importing DashboardCard component
import LineChart from "../components/lineChart"; // Importing LineChart component
import BarChart from "../components/barChart"; // Importing BarChart component
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
import { useRouter } from 'next/router';

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
    const [responseData, setResponseData] = useState(null);
    const router = useRouter();

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
        fetchData(storedUser.email);

        } else {
            // If token is not available, redirect to the login page
            router.push("/");
        }
    }, [router]);

    const fetchData = async (email) => {
        try {
          const response = await fetch(`${apiUrl}/api/get-issuers-log`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              queryCode: 1,
            }),
          });
    
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
    
          const data = await response.json();
          setResponseData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
          // Handle error as needed
        }
    };

  
    const cardsData = [
        {
            title: "Certificates",
            titleValue: "Issued",
            badgeIcon: "",
            value: responseData?.data?.issued || "0",
            percentage: "+21.01%",
        },
        {
            title: "Monthly Certificates",
            titleValue: "Reissued",
            badgeIcon: "",
            value: responseData?.data?.renewed || "0",
            percentage: "+21.01%",
        },
        {
            title: "Certificates",
            titleValue: "Reactivated",
            badgeIcon: "",
            value: responseData?.data?.reactivated || "0",
            percentage: "+21.01%",
        },
        {
            title: "Certificates",
            titleValue: "Revoked",
            badgeIcon: "",
            value: responseData?.data?.revoked || "0",
            percentage: "+21.01%",
        },
    ];

    return (
        <div className=" page-bg">
            <div className="container cards-container-main">
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
