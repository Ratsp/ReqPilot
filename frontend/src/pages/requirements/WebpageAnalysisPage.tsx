import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { analyzeWebpage } from "../../services/requirementService";

export default function WebpageAnalysisPage() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleAnalyzeWebpage() {
        if (!url.trim()) {
            toast.error("Please enter a webpage URL.");
            return;
        }

        try {
            setLoading(true);

            const response = await analyzeWebpage(url.trim());

            toast.success("Webpage analyzed successfully.");

            const requirementId =
                response.requirement?.id ||
                response.requirement_id ||
                response.id;

            if (requirementId) {
                navigate(`/requirements/${requirementId}`);
            } else {
                navigate("/requirements");
            }
        } catch (error: any) {
            console.error(error);

            console.log("WEBPAGE API ERROR:", error?.response?.data);

            const detail = error?.response?.data?.detail;

            const message =
                typeof detail === "string"
                    ? detail
                    : Array.isArray(detail)
                        ? detail.map((item: any) => item.msg).join(", ")
                        : error?.response?.data?.message ||
                        error?.message ||
                        "Unable to analyze webpage.";

            toast.error(message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-3xl p-8">
            <div className="rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="text-3xl font-bold text-slate-800">
                    Analyze Webpage
                </h1>

                <p className="mt-2 text-slate-500">
                    Paste a webpage URL to extract and analyze requirement-related content.
                </p>

                <div className="mt-8">
                    <label className="mb-2 block font-medium text-slate-700">
                        Webpage URL
                    </label>

                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleAnalyzeWebpage();
                            }
                        }}
                        placeholder="https://example.com/requirements"
                        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                    />
                </div>

                <button
                    onClick={handleAnalyzeWebpage}
                    disabled={loading || !url.trim()}
                    className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Analyzing Webpage..." : "Analyze Webpage"}
                </button>
            </div>
        </div>
    );
}