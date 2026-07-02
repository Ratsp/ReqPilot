import api from "../api/api";

export async function getDashboardStats() {
    const response = await api.get("/dashboard/stats");
    return response.data;
}

export async function getRecentActivities() {
    const response = await api.get(
        "/dashboard/recent-activities"
    );

    return response.data.activities;
}

export async function getRequirementTrends() {
    const response = await api.get("/dashboard/trends");
    return response.data;
}

export async function getQualityDistribution() {
    const response = await api.get("/dashboard/quality-distribution");
    return response.data;
}