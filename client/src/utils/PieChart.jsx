import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import eventData from "../events.json";
import Sidebar from '../utils/Sidebar';
import { Navigate } from 'react-router-dom';

export default function PieChart() {
    const [chartData, setChartData] = useState([["Status", "Count"]]);
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    useEffect(() => {
        // Assuming eventData is an array of events
        let totalAccepted = 0;
        let totalRejected = 0;

        eventData.forEach(event => {
            totalAccepted += event.registration_status.accepted;
            totalRejected += event.registration_status.rejected;
        });

        setChartData([
            ["Status", "Count"],
            ["Accepted", totalAccepted],
            ["Rejected", totalRejected],
        ]);
    }, []);

    const options = {
        title: "Event Registrations",
        slices: {
            0: { color: "#adda4b" },
            1: { color: "#dc1111" },
        },
        is3D: true,
    };

    return (

        <>
            <div className="Home">
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <div className="md:ml-64 p-4">
                    <button
                        className={`md:hidden p-4 bg-gray-800 text-white rounded ${isSidebarOpen ? 'hidden' : 'block'}`}
                        onClick={toggleSidebar}
                    >
                        ☰
                    </button>

                    <div className="min-h-screen bg-gray-100 p-8">
                        <div className="p-4">
                            <h1 className="text-2xl font-bold mb-4 text-center">Event Registrations Overview</h1>
                            <div className="mb-8">
                                <Chart
                                    chartType="PieChart"
                                    data={chartData}
                                    options={options}
                                    width={"100%"}
                                    height={"400px"}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {eventData.map(event => {
                                    const { accepted, rejected } = event.registration_status;
                                    const hasData = accepted > 0 || rejected > 0;

                                    return (
                                        <div key={event.location} className="p-4 border rounded-lg shadow-md bg-[#eee] flex flex-col justify-between h-full">
                                            <h3 className="text-lg font-semibold mb-2 text-center">{event.location}</h3>
                                            {hasData ? (
                                                <div className="relative border rounded-lg">
                                                    <Chart
                                                        chartType="PieChart"
                                                        data={[
                                                            ["Status", "Count"],
                                                            ["Accepted", accepted],
                                                            ["Rejected", rejected],
                                                        ]}
                                                        options={{
                                                            ...options,
                                                            title:` ${event.location} Registrations`,
                                                            slices: {
                                                                0: { color: "#adda4b" },
                                                                1: { color: "#dc1111" },
                                                            },
                                                        }}
                                                        width={"100%"}
                                                        height={"300px"}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-64 text-gray-700 text-sm py-4 px-4 rounded font-semibold">
                                                    No trainers assigned
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>


    );
}