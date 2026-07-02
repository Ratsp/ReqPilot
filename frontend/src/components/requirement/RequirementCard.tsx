import { Requirement } from "../../types/requirement";
import {
    analyzeRequirement,
    deleteRequirement,
} from "../../services/requirementService";

import { useNavigate } from "react-router-dom";
interface Props {
    requirement: Requirement;
    refreshRequirements: () => Promise<void>;
}
import toast from "react-hot-toast";

export default function RequirementCard({
    requirement,
    refreshRequirements,
}: Props) {
    const navigate = useNavigate();

    const description = requirement.description ?? "";

    const shortDescription =
        description.length > 120
            ? description.substring(0, 120) + "..."
            : description;

    const createdDate = new Date(requirement.created_at);
    const formattedDate =
        createdDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

    const formattedTime =
        createdDate.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });

    const statusColors: Record<string, string> = {
        draft: "bg-yellow-100 text-yellow-700",
        pending: "bg-orange-100 text-orange-700",
        approved: "bg-blue-100 text-blue-700",
        completed: "bg-green-100 text-green-700",
    };

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 mb-6">

            {/* Title */}
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
                📄 {requirement.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 leading-7 mb-5">
                {shortDescription}
            </p>

            {/* Status + Version */}
            <div className="flex items-center justify-between mb-6">

                <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${statusColors[requirement.status] ??
                        "bg-gray-100 text-gray-700"
                        }`}
                >
                    {requirement.status}
                </span>

                <div className="flex items-center gap-6 text-gray-600 text-sm">

                    <span>
                        📦 Version {requirement.version_number}
                    </span>

                    <span>
                        📅 {formattedDate}
                    </span>

                    <span>
                        🕒 {formattedTime}
                    </span>

                </div>

            </div>

            {/* Buttons */}
            <div className="flex gap-3">

                <button onClick={() => navigate(`/requirements/${requirement.id}`)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                    View
                </button>

                <button
                    onClick={() =>
                        navigate(`/requirements/${requirement.id}/edit`)
                    }
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                    Edit
                </button>

                <button
                    onClick={async () => {

                        try {

                            await analyzeRequirement(requirement.id);

                            toast.success("Requirement analyzed.");

                            await refreshRequirements();


                        } catch (error) {

                            console.error(error);

                            toast.error("Analysis failed.");

                        }

                    }}
                    className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                >
                    Analyze
                </button>

                <button
                    onClick={async () => {

                        const confirmDelete = window.confirm(
                            "Are you sure you want to delete this requirement?"
                        );

                        if (!confirmDelete) return;

                        try {

                            await deleteRequirement(requirement.id);
                            toast.success("Requirement deleted.");
                            await refreshRequirements();

                        } catch (error) {
                            console.error(error);
                            toast.error("Unable to delete requirement.");

                        }

                    }}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                    Delete
                </button>

            </div>

        </div>
    );
}