import { useEffect, useState } from "react";

import {
    getDashboardStats,
    getRecentActivities,
    getRequirementTrends,
    getQualityDistribution,
} from "../../services/dashboardService";

import StatCard from "../../components/dashboard/StatCard";
import RecentActivities from "../../components/dashboard/RecentActivities";
import StatusPieChart from "../../components/dashboard/StatusPieChart";
import RequirementTrends from "../../components/dashboard/RequirementTrends";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";

interface DashboardStats {
    total_requirements: number;
    draft: number;
    pending: number;
    approved: number;
    completed: number;
    average_quality_score: number;
    total_versions: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activities, setActivities] = useState([]);
    const [trends, setTrends] = useState<any[]>([]);
    const [qualityDistribution, setQualityDistribution] = useState<any>(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {

            const [
                statsData,
                activitiesData,
                trendsData,
                qualityDistributionData,
            ] = await Promise.all([
                getDashboardStats(),
                getRecentActivities(),
                getRequirementTrends(),
                getQualityDistribution(),
            ]);

            setStats(statsData);
            setActivities(
                Array.isArray(activitiesData)
                    ? activitiesData
                    : activitiesData.activities || []
            );

            setTrends(
                Array.isArray(trendsData)
                    ? trendsData
                    : trendsData.trends || []
            );

            setQualityDistribution(qualityDistributionData);



        } catch (err) {
            console.error(err);
        }
    }

    if (!stats) {
        return (
            <div className="p-8">
                <h1 className="text-5xl font-bold mb-6">
                    Dashboard
                </h1>

                <div className="text-gray-500">
                    <LoadingSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">

            <div className="mb-10">
                <h1 className="text-5xl font-bold">
                    Welcome back 👋
                </h1>

                <p className="text-gray-500 mt-2 text-lg">
                    Here's an overview of your ReqPilot workspace.
                </p>

            </div>

            <h1 className="text-5xl font-bold mb-8">
                Dashboard
            </h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Requirements"
                    value={stats.total_requirements}
                />

                <StatCard
                    title="Draft"
                    value={stats.draft}
                />

                <StatCard
                    title="Completed"
                    value={stats.completed}
                />

                <StatCard
                    title="Quality Score"
                    value={Number(stats.average_quality_score || 0).toFixed(1)}
                />
            </div>
            <RecentActivities
                activities={activities}
            />
            <div className="mt-8">
                <StatusPieChart
                    draft={stats.draft}
                    pending={stats.pending}
                    approved={stats.approved}
                    completed={stats.completed}
                />
            </div>
            <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
                <RequirementTrends trends={trends} />

                <div className="rounded-2xl bg-white p-6 shadow-lg">
                    <h2 className="text-2xl font-bold text-slate-800">
                        Quality Distribution
                    </h2>

                    <p className="mt-1 text-slate-500">
                        Requirements grouped by quality score.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-xl bg-red-50 p-5">
                            <p className="text-sm text-red-600">
                                Low Quality
                            </p>

                            <p className="mt-2 text-3xl font-bold text-red-700">
                                {qualityDistribution?.low ?? 0}
                            </p>
                        </div>

                        <div className="rounded-xl bg-yellow-50 p-5">
                            <p className="text-sm text-yellow-700">
                                Medium Quality
                            </p>

                            <p className="mt-2 text-3xl font-bold text-yellow-800">
                                {qualityDistribution?.medium ?? 0}
                            </p>
                        </div>

                        <div className="rounded-xl bg-green-50 p-5">
                            <p className="text-sm text-green-700">
                                High Quality
                            </p>

                            <p className="mt-2 text-3xl font-bold text-green-800">
                                {qualityDistribution?.high ?? 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}