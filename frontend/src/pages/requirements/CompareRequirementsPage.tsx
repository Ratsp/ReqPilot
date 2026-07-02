import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    getRequirements,
    compareRequirements,
} from "../../services/requirementService";
import { Requirement } from "../../types/requirement";

export default function CompareRequirementsPage() {
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [firstId, setFirstId] = useState("");
    const [secondId, setSecondId] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        loadRequirements();
    }, []);

    async function loadRequirements() {
        try {
            const data = await getRequirements();
            setRequirements(data);
        } catch (error) {
            console.error(error);
            toast.error("Could not load requirements.");
        }
    }

    async function handleCompare() {
        if (!firstId || !secondId) {
            toast.error("Please select two requirements.");
            return;
        }

        if (firstId === secondId) {
            toast.error("Please select two different requirements.");
            return;
        }

        try {
            setLoading(true);
            setResult(null);

            const data = await compareRequirements(firstId, secondId);

            setResult(data);

            toast.success("Requirements compared successfully.");
        }
        catch (error: any) {
            console.error("Compare error:", error.response?.data || error);

            const detail = error.response?.data?.detail;

            const message =
                Array.isArray(detail)
                    ? detail.map((item: any) => item.msg).join(", ")
                    : typeof detail === "string"
                        ? detail
                        : error.response?.data?.message ||
                        "Unable to compare requirements.";

            toast.error(message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-slate-800">
                    Compare Requirements
                </h1>

                <p className="text-gray-500 mt-2 mb-8">
                    Select two requirements to compare their details and AI analysis.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-semibold mb-2">
                            First Requirement
                        </label>

                        <select
                            value={firstId}
                            onChange={(e) => setFirstId(e.target.value)}
                            className="w-full border rounded-xl p-3"
                        >
                            <option value="">Select a requirement</option>

                            {requirements.map((requirement) => (
                                <option
                                    key={requirement.id}
                                    value={requirement.id}
                                >
                                    {requirement.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            Second Requirement
                        </label>

                        <select
                            value={secondId}
                            onChange={(e) => setSecondId(e.target.value)}
                            className="w-full border rounded-xl p-3"
                        >
                            <option value="">Select a requirement</option>

                            {requirements.map((requirement) => (
                                <option
                                    key={requirement.id}
                                    value={requirement.id}
                                >
                                    {requirement.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleCompare}
                    disabled={loading}
                    className="mt-8 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 disabled:opacity-60"
                >
                    {loading ? "Comparing..." : "Compare Requirements"}
                </button>
                {result && (
                    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

                        <h2 className="text-3xl font-bold text-slate-800 mb-6">
                            Comparison Result
                        </h2>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
                            <p className="text-sm text-blue-700 font-medium">
                                Similarity Score
                            </p>

                            <p className="text-4xl font-bold text-blue-700 mt-1">
                                {result.similarity_score ?? 0}%
                            </p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-green-700 mb-3">
                                Similarities
                            </h3>

                            {result.similarities?.length > 0 ? (
                                <ul className="space-y-3">
                                    {result.similarities.map(
                                        (item: string, index: number) => (
                                            <li
                                                key={index}
                                                className="bg-green-50 border border-green-200 rounded-xl p-4 text-slate-700"
                                            >
                                                ✓ {item}
                                            </li>
                                        )
                                    )}
                                </ul>
                            ) : (
                                <p className="text-slate-500">
                                    No similarities found.
                                </p>
                            )}
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-red-700 mb-3">
                                Differences
                            </h3>

                            {result.differences?.length > 0 ? (
                                <ul className="space-y-3">
                                    {result.differences.map(
                                        (item: string, index: number) => (
                                            <li
                                                key={index}
                                                className="bg-red-50 border border-red-200 rounded-xl p-4 text-slate-700"
                                            >
                                                • {item}
                                            </li>
                                        )
                                    )}
                                </ul>
                            ) : (
                                <p className="text-slate-500">
                                    No differences found.
                                </p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-purple-700 mb-3">
                                Recommendation
                            </h3>

                            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 text-slate-700 leading-relaxed">
                                {result.recommendation || "No recommendation available."}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );

}
