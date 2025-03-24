import React from "react";
import { Ticket, CalendarCheck, BarChart3, Bell, CreditCard, Users, Layers, ShieldCheck } from "lucide-react";

const services = [
    {
        icon: <CalendarCheck size={32} className="text-blue-600" />,
        title: "Event Discovery & Booking",
        description: "Browse, search, and book events easily. Filter by category, location, and price with instant ticket confirmation."
    },
    {
        icon: <Users size={32} className="text-green-600" />,
        title: "Event Hosting & Management",
        description: "Organizers can create, edit, and manage events with ticket tracking, analytics, and real-time updates."
    },
    {
        icon: <Ticket size={32} className="text-yellow-600" />,
        title: "Ticketing & QR Code Check-ins",
        description: "Secure QR code tickets for seamless event check-ins and fraud prevention."
    },
    {
        icon: <CreditCard size={32} className="text-purple-600" />,
        title: "Revenue & Payment Management",
        description: "Track earnings, manage payouts, and process secure payments effortlessly."
    },
    {
        icon: <Bell size={32} className="text-red-600" />,
        title: "Notifications & Alerts",
        description: "Stay updated with email and in-app notifications for bookings, approvals, and event changes."
    },
    {
        icon: <BarChart3 size={32} className="text-indigo-600" />,
        title: "Reports & Insights",
        description: "Organizers get analytics on ticket sales, audience demographics, and event performance."
    },
    {
        icon: <Layers size={32} className="text-teal-600" />,
        title: "Personalized Recommendations",
        description: "AI-powered event suggestions based on user interests and booking history."
    },
    {
        icon: <ShieldCheck size={32} className="text-gray-600" />,
        title: "Secure & User-Friendly",
        description: "Role-based access, Google login, and mobile-friendly design for a seamless experience."
    }
];

const Services = () => {
    return (
        <div className="container mx-auto px-6 py-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Our Services</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <div key={index} className="p-6 bg-white shadow-lg rounded-lg flex flex-col items-center text-center">
                        <div className="mb-4">{service.icon}</div>
                        <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
                        <p className="text-gray-600 mt-2">{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;
