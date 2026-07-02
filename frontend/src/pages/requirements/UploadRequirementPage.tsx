import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/api";

export default function UploadRequirementPage() {
    const navigate = useNavigate();


    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleUpload(e: React.FormEvent) {
        e.preventDefault();

        if (!file) {
            toast.error("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("files", file);

        try {
            setLoading(true);

            await api.post("/requirements/upload", formData);

            toast.success("Requirement uploaded successfully.");

            navigate("/requirements");
        } catch (error: any) {
            console.error("Upload error:", error.response?.data || error);

            const detail = error.response?.data?.detail;

            const message =
                Array.isArray(detail)
                    ? detail.map((item: any) => item.msg).join(", ")
                    : typeof detail === "string"
                        ? detail
                        : "Upload failed. Please check the document and try again.";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-slate-800">
                    Upload Requirement Document
                </h1>

                <p className="text-gray-500 mt-2 mb-8">
                    Upload a document and ReqPilot AI will extract requirements from it.
                </p>

                <form onSubmit={handleUpload} className="space-y-6">
                    <div className="border-2 border-dashed border-blue-300 rounded-2xl p-10 text-center">
                        <div className="text-5xl mb-4">📄</div>

                        <label className="cursor-pointer">
                            <span className="text-blue-600 font-semibold">
                                Choose a document
                            </span>

                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={(e) =>
                                    setFile(e.target.files?.[0] || null)
                                }
                                className="hidden"
                            />
                        </label>

                        <p className="text-sm text-gray-500 mt-3">
                            Supported formats: PDF, DOC, DOCX, TXT
                        </p>

                        {file && (
                            <div className="mt-5 bg-blue-50 rounded-xl p-4">
                                <p className="font-medium text-blue-700">
                                    Selected: {file.name}
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    {(file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading
                            ? "Uploading and extracting requirements..."
                            : "Upload Document"}
                    </button>
                </form>
            </div>
        </div>
    );

}
