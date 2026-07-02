import { useEffect, useState } from "react";

import { Requirement } from "../../types/requirement";
import RequirementCard from "../../components/requirement/RequirementCard";
import {
    searchRequirements,
    filterRequirements,
    sortRequirements,
    paginateRequirements,
} from "../../services/requirementService";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import { Link } from "react-router-dom";

export default function RequirementListPage() {
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("created_at");
    const [page, setPage] = useState(1);
    const limit = 10;
    const [error, setError] = useState("");

    useEffect(() => {
        loadRequirements();
    }, [search, statusFilter, sortBy, page]);

    async function loadRequirements() {
        setError("");

        if (search.trim() !== "") {
            await searchData();
        } else if (statusFilter !== "all") {
            await filterData();
        } else if (sortBy !== "created_at") {
            await sortData();
        } else {
            await paginateData();
        }
    }

    async function searchData() {
        try {
            setLoading(true);
            const data = await searchRequirements(search);
            setRequirements(data);

        } catch (error) {
            console.error(error);
            setError("Unable to search requirements.");
        } finally {
            setLoading(false);
        }
    }

    async function filterData() {

        try {
            setLoading(true);
            const data = await filterRequirements(statusFilter);
            setRequirements(data);
        } catch (error) {
            console.error(error);
            setError("Unable to filter requirements.");
        } finally {
            setLoading(false);
        }
    }

    async function sortData() {

        try {
            setLoading(true);
            const data = await sortRequirements(sortBy);
            setRequirements(data);
        } catch (error) {
            console.error(error);
            setError("Unable to sort requirements.");
        } finally {
            setLoading(false);
        }
    }

    async function paginateData() {

        try {
            setLoading(true);
            const data = await paginateRequirements(page, limit);
            setRequirements(data);
        } catch (error) {
            console.error(error);
            setError("Unable to paginate requirements.");
        } finally {
            setLoading(false);
        }

    }


    if (loading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="p-8">
            <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Requirements
                    </h1>

                    <p className="mt-1 text-gray-500">
                        View, search, and manage uploaded requirements.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={loadRequirements}
                        disabled={loading}
                        className="rounded-xl bg-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Refreshing..." : "↻ Refresh"}
                    </button>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/requirements/webpage"
                            className="rounded-xl bg-slate-700 px-5 py-3 text-white hover:bg-slate-800"
                        >
                            🌐 Analyze Webpage
                        </Link>

                        <Link
                            to="/requirements/upload"
                            className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                        >
                            + Upload Document
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mb-8 flex flex-col gap-4 lg:flex-row">
                <input
                    type="text"
                    placeholder="🔍 Search requirements..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="flex-1 rounded-xl border px-4 py-3"
                />

                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                    className="rounded-xl border px-4 py-3"
                >
                    <option value="all">All statuses</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => {
                        setSortBy(e.target.value);
                        setPage(1);
                    }}
                    className="rounded-xl border px-4 py-3"
                >
                    <option value="created_at">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="title">Title (A-Z)</option>
                    <option value="version_number">Version</option>
                </select>
            </div>

            {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="font-medium text-red-700">{error}</p>
                </div>
            )}

            {requirements.length === 0 ? (
                <div className="rounded-2xl bg-white p-12 text-center shadow-md">
                    <div className="mb-4 text-6xl">📂</div>

                    <h2 className="text-2xl font-bold text-slate-800">
                        No Requirements Found
                    </h2>

                    <p className="mt-3 text-gray-500">
                        Upload a document or create a new requirement to get started.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requirements.map((requirement) => (
                        <RequirementCard
                            key={requirement.id}
                            requirement={requirement}
                            refreshRequirements={loadRequirements}
                        />
                    ))}
                </div>
            )}

            <div className="mt-10 flex items-center justify-center gap-4">
                <button
                    disabled={page === 1 || loading}
                    onClick={() => setPage((currentPage) => currentPage - 1)}
                    className="rounded-lg bg-gray-200 px-4 py-2 disabled:opacity-40"
                >
                    Previous
                </button>

                <span className="px-4 py-2">Page {page}</span>

                <button
                    disabled={requirements.length < limit || loading}
                    onClick={() => setPage((currentPage) => currentPage + 1)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </div>
    );
}   