import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { Requirement } from "../../types/requirement";

import {
    getRequirement,
    analyzeRequirement,
    qualityAnalysis,
    gapAnalysis,
    improveRequirement,
    rewriteRequirement,
    exportPDF,
    updateRequirement,
    generateAcceptanceCriteria,
    generateUserStories,
    riskAnalysis,
    getRequirementVersions,
    getTraceability,
    chatRequirement,
} from "../../services/requirementService";

export default function RequirementDetailsPage() {
    const { id } = useParams();

    const [requirement, setRequirement] = useState<Requirement | null>(null);
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [result, setResult] = useState<any>(null);

    const [loading, setLoading] = useState(true);
    const [loadingAI, setLoadingAI] = useState(false);

    const [versions, setVersions] = useState<any[]>([]);
    const [showVersions, setShowVersions] = useState(false);
    const [loadingVersions, setLoadingVersions] = useState(false);

    const [traceability, setTraceability] = useState<any>(null);
    const [loadingTraceability, setLoadingTraceability] = useState(false);

    const [chatMessage, setChatMessage] = useState("");
    const [chatResponse, setChatResponse] = useState("");
    const [loadingChat, setLoadingChat] = useState(false);
    const latestResultRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        loadRequirement();
    }, [id]);

    async function loadRequirement() {
        if (!id) return;

        try {
            setLoading(true);

            const data = await getRequirement(id);

            setRequirement(data);
            setTitle(data.title);
            setDescription(data.description);

            if (data.ai_summary) {
                setResult((previousResult: any) => {
                    if (previousResult) return previousResult;

                    return {
                        requirement: data,
                    };
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Unable to load requirement.");
        } finally {
            setLoading(false);
        }
    }

    async function runAI(fn: (requirementId: string) => Promise<any>) {
        if (!id) return;

        try {
            setLoadingAI(true);
            setResult(null);

            const response = await fn(id);

            setResult(response);
            setResult(response);

            setTimeout(() => {
                latestResultRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 100);

            toast.success("AI operation completed successfully.");

            const updatedRequirement = await getRequirement(id);

            setRequirement(updatedRequirement);
            setTitle(updatedRequirement.title);
            setDescription(updatedRequirement.description);
        } catch (error: any) {
            console.error("AI operation error:", error);

            const message =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                "AI operation failed.";

            toast.error(message);
        } finally {
            setLoadingAI(false);
        }
    }

    async function handleChatRequirement() {
        if (!id || !chatMessage.trim()) return;

        try {
            setLoadingChat(true);
            setChatResponse("");

            const data = await chatRequirement(id, chatMessage.trim());

            console.log("CHAT RESPONSE:", data);

            setChatResponse(
                data?.answer ||
                data?.response ||
                data?.message ||
                "No response received."
            );

            setChatMessage("");
        } catch (error: any) {
            console.error("CHAT ERROR:", error);

            const message =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                "Unable to get an answer.";

            toast.error(
                typeof message === "string"
                    ? message
                    : "Unable to get an answer."
            );
        } finally {
            setLoadingChat(false);
        }
    }

    async function loadTraceability() {
        if (!id) return;

        try {
            setLoadingTraceability(true);

            const data = await getTraceability(id);

            console.log("TRACEABILITY RESPONSE:", data);

            setTraceability(data);
            toast.success("Traceability loaded successfully.");
        } catch (error) {
            console.error(error);
            toast.error("Unable to load traceability.");
        } finally {
            setLoadingTraceability(false);
        }
    }

    async function handleExportPdf() {
        if (!id) return;

        try {
            setLoadingAI(true);

            await exportPDF(id);

            toast.success("PDF exported successfully.");
        } catch (error) {
            console.error(error);
            toast.error("Unable to export PDF.");
        } finally {
            setLoadingAI(false);
        }
    }

    async function loadVersions() {
        if (!id) return;

        try {
            setLoadingVersions(true);

            const data = await getRequirementVersions(id);

            console.log("VERSION HISTORY RESPONSE:", data);

            const versionList = Array.isArray(data)
                ? data
                : data?.versions || [];

            setVersions(Array.isArray(versionList) ? versionList : []);
            setShowVersions(true);
        } catch (error) {
            console.error(error);
            toast.error("Unable to load version history.");
        } finally {
            setLoadingVersions(false);
        }
    }

    async function saveRequirement() {
        if (!id || !requirement) return;

        try {
            const updated = await updateRequirement(id, {
                title,
                description,
                status: requirement.status,
            });

            setRequirement(updated);
            setTitle(updated.title);
            setDescription(updated.description);
            setEditing(false);

            toast.success("Requirement updated successfully.");
        } catch (error) {
            console.error(error);
            toast.error("Update failed.");
        }
    }

    const extractedRequirements =
        result?.requirement?.extracted_requirements
            ? (() => {
                try {
                    return JSON.parse(result.requirement.extracted_requirements);
                } catch {
                    return {
                        functional_requirements: [],
                        non_functional_requirements: [],
                        assumptions: [],
                        risks: [],
                    };
                }
            })()
            : {
                functional_requirements: [],
                non_functional_requirements: [],
                assumptions: [],
                risks: [],
            };

    if (loading) {
        return <h2 className="p-8">Loading...</h2>;
    }

    if (!requirement) {
        return <h2 className="p-8">Requirement not found.</h2>;
    }

    return (
        <div className="p-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        {editing ? (
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border rounded-xl p-3 text-4xl font-bold"
                            />
                        ) : (
                            <h1 className="text-4xl font-bold text-slate-800">
                                {requirement.title}
                            </h1>
                        )}

                        <p className="text-gray-500 mt-2">
                            Requirement ID: {requirement.id}
                        </p>
                    </div>

                    <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
                        {requirement.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {!editing ? (
                    <button
                        onClick={() => setEditing(true)}
                        className="h-14 w-full rounded-xl bg-blue-900 px-4 text-base font-medium text-white transition hover:bg-blue-700"
                    >
                        ✏️ Edit Requirement
                    </button>
                ) : (
                    <>
                        <button
                            onClick={saveRequirement}
                            className="h-14 w-full rounded-xl bg-blue-600 px-4 text-base font-medium text-white transition hover:bg-blue-700"
                        >
                            💾 Save
                        </button>

                        <button
                            onClick={() => {
                                setEditing(false);
                                setTitle(requirement.title);
                                setDescription(requirement.description);
                            }}
                            className="h-14 w-full rounded-xl bg-slate-600 px-4 text-base font-medium text-white transition hover:bg-slate-700"
                        >
                            Cancel
                        </button>
                    </>
                )}

                <button
                    onClick={() => runAI(analyzeRequirement)}
                    disabled={loadingAI}
                    className="h-14 w-full rounded-xl bg-blue-800 px-4 text-base font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                    Analyze
                </button>

                <button
                    onClick={() => runAI(qualityAnalysis)}
                    disabled={loadingAI}
                    className="h-14 w-full rounded-xl bg-blue-700 px-4 text-base font-medium text-white transition hover:bg-blue-600 disabled:opacity-60"
                >
                    Quality
                </button>

                <button
                    onClick={() => runAI(gapAnalysis)}
                    disabled={loadingAI}
                    className="h-14 w-full rounded-xl bg-blue-600 px-4 text-base font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                    Gap Analysis
                </button>

                <button
                    onClick={() => runAI(improveRequirement)}
                    disabled={loadingAI}
                    className="h-14 w-full rounded-xl bg-blue-600 px-4 text-base font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                    Improve
                </button>

                <button
                    onClick={() => runAI(rewriteRequirement)}
                    disabled={loadingAI}
                    className="h-14 w-full rounded-xl bg-blue-700 px-4 text-base font-medium text-white transition hover:bg-blue-600 disabled:opacity-60"
                >
                    Rewrite
                </button>

                <button
                    onClick={() => runAI(generateAcceptanceCriteria)}
                    disabled={loadingAI}
                    className="h-14 w-full rounded-xl bg-blue-800 px-4 text-base font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                    Acceptance Criteria
                </button>

                <button
                    onClick={() => runAI(generateUserStories)}
                    disabled={loadingAI}
                    className="h-14 w-full rounded-xl bg-blue-900 px-4 text-base font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                    User Stories
                </button>

                <button
                    onClick={() => runAI(riskAnalysis)}
                    disabled={loadingAI}
                    className="h-14 w-full rounded-xl bg-blue-800 px-4 text-base font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                    Risk Analysis
                </button>

                <button
                    onClick={loadVersions}
                    disabled={loadingVersions}
                    className="h-14 w-full rounded-xl bg-blue-600 px-4 text-base font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                    {loadingVersions ? "Loading..." : "Version History"}
                </button>

                <button
                    onClick={loadTraceability}
                    disabled={loadingTraceability}
                    className="h-14 w-full rounded-xl bg-blue-500 px-4 text-base font-medium text-white transition hover:bg-blue-600 disabled:opacity-60"
                >
                    {loadingTraceability ? "Loading..." : "Traceability"}
                </button>

                <button
                    onClick={handleExportPdf}
                    disabled={loadingAI}
                    className="h-14 w-full rounded-xl bg-red-600 px-4 text-base font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                    Export PDF
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            Requirement Assistant
                        </h2>

                        <p className="text-slate-500 mt-1">
                            Ask anything about this requirement.
                        </p>
                    </div>

                    <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                        AI Chat
                    </span>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleChatRequirement();
                            }
                        }}
                        placeholder="Ask about risks, missing details, acceptance criteria..."
                        className="flex-1 border rounded-xl px-5 py-4"
                    />

                    <button
                        onClick={handleChatRequirement}
                        disabled={loadingChat || !chatMessage.trim()}
                        className="bg-blue-600 text-white px-7 py-4 rounded-xl hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loadingChat ? "Thinking..." : "Ask AI"}
                    </button>
                </div>

                {chatResponse && (
                    <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-5">
                        <p className="text-sm font-medium text-slate-500 mb-2">
                            AI Response
                        </p>

                        <p className="text-slate-800 whitespace-pre-wrap">
                            {chatResponse}
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-5">
                    Requirement Description
                </h2>

                {editing ? (
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={10}
                        className="w-full border rounded-xl p-4 text-gray-700 leading-7"
                    />
                ) : (
                    <p className="text-gray-700 leading-8 whitespace-pre-wrap text-justify">
                        {requirement.description}
                    </p>
                )}

                <hr className="my-8" />

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-semibold mt-1">{requirement.status}</p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-sm text-gray-500">Version</p>
                        <p className="font-semibold mt-1">
                            {requirement.version_number}
                        </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="font-semibold mt-1">
                            {new Date(requirement.created_at).toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-sm text-gray-500">Updated</p>
                        <p className="font-semibold mt-1">
                            {new Date(requirement.updated_at).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {loadingAI && (
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="font-medium text-yellow-700">
                        🤖 Running AI...
                    </p>
                </div>
            )}



            {result && result.requirement && (
                <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
                    <h2 className="text-2xl font-bold mb-6">AI Analysis</h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Summary</h3>
                            <p className="text-gray-700">
                                {result.requirement?.ai_summary}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2">
                                Functional Requirements
                            </h3>
                            <ul className="list-disc pl-6 space-y-2">
                                {(extractedRequirements.functional_requirements || []).map(
                                    (item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2">
                                Non Functional Requirements
                            </h3>
                            <ul className="list-disc pl-6 space-y-2">
                                {(extractedRequirements.non_functional_requirements || []).map(
                                    (item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2">
                                Assumptions
                            </h3>
                            <ul className="list-disc pl-6 space-y-2">
                                {(extractedRequirements.assumptions || []).map(
                                    (item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2">Risks</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                {(extractedRequirements.risks || []).map(
                                    (item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {result && result.overall_score !== undefined && (
                <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
                    <h2 className="text-2xl font-bold mb-6">
                        Requirement Quality Report
                    </h2>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-2">Overall Score</h3>

                        <div className="text-5xl font-bold text-green-600">
                            {Number(result.overall_score || 0).toFixed(1)}/10
                        </div>

                        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                            <div
                                className="h-full rounded-full bg-green-500"
                                style={{
                                    width: `${Math.min(
                                        Number(result.overall_score || 0) * 10,
                                        100
                                    )}%`,
                                }}
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-3">Strengths</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            {result.strengths?.map(
                                (item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                )
                            )}
                        </ul>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-3">Weaknesses</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            {result.weaknesses?.map(
                                (item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                )
                            )}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3">
                            Recommendations
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                            {result.recommendations?.map(
                                (item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                )
                            )}
                        </ul>
                    </div>
                </div>
            )}

            {result?.gap_analysis && (
                <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
                    <h2 className="text-2xl font-bold mb-6">Gap Analysis</h2>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-3">
                            Missing Information
                        </h3>

                        <ul className="list-disc pl-6 space-y-2">
                            {(result.gap_analysis.missing_information || []).map(
                                (item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                )
                            )}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3">
                            Clarification Questions
                        </h3>

                        <ol className="list-decimal pl-6 space-y-3">
                            {(result.gap_analysis.clarification_questions || []).map(
                                (item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                )
                            )}
                        </ol>
                    </div>
                </div>
            )}

            {result?.improved_requirements && (
                <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Improved Requirement</h2>

                        <button
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    (result.improved_requirements || []).join("\n\n")
                                )
                            }
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                            Copy All
                        </button>
                    </div>

                    <div className="space-y-4">
                        {(result.improved_requirements || []).map(
                            (item: string, index: number) => (
                                <div
                                    key={index}
                                    className="border rounded-xl p-4 bg-green-50"
                                >
                                    ✔ {item}
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {result?.rewritten_requirement && (
                <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Rewritten Requirement</h2>

                        <button
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    result.rewritten_requirement
                                )
                            }
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                        >
                            Copy
                        </button>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 whitespace-pre-wrap leading-8">
                        {result.rewritten_requirement}
                    </div>
                </div>
            )}

            {result?.acceptance_criteria && (
                <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Acceptance Criteria</h2>

                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    (result.acceptance_criteria || []).join("\n")
                                );
                                toast.success("Acceptance criteria copied.");
                            }}
                            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                        >
                            Copy All
                        </button>
                    </div>

                    <ol className="list-decimal pl-6 space-y-4">
                        {(result.acceptance_criteria || []).map(
                            (item: string, index: number) => (
                                <li
                                    key={index}
                                    className="bg-teal-50 border border-teal-100 rounded-xl p-4"
                                >
                                    {item}
                                </li>
                            )
                        )}
                    </ol>
                </div>
            )}

            {result?.user_stories && (
                <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">User Stories</h2>

                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    result.user_stories.join("\n\n")
                                );
                                toast.success("User stories copied.");
                            }}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                        >
                            Copy All
                        </button>
                    </div>

                    <div className="space-y-4">
                        {result.user_stories.map(
                            (item: string, index: number) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-purple-100 bg-purple-50 p-5"
                                >
                                    <p className="font-medium text-purple-800">
                                        User Story {index + 1}
                                    </p>

                                    <p className="mt-2 whitespace-pre-wrap text-gray-700">
                                        {item}
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {result?.risk_level && (
                <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
                    <h2 className="text-2xl font-bold mb-6">Risk Analysis</h2>

                    <div className="mb-8">
                        <p className="text-sm text-gray-500">Overall Risk Level</p>

                        <p className="mt-2 inline-block rounded-full bg-red-100 px-4 py-2 font-semibold text-red-700">
                            {result.risk_level}
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">
                            <h3 className="mb-3 text-lg font-semibold">
                                Technical Risks
                            </h3>

                            <ul className="list-disc space-y-2 pl-6 text-gray-700">
                                {result.technical_risks?.map(
                                    (item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div className="rounded-xl border border-red-100 bg-red-50 p-5">
                            <h3 className="mb-3 text-lg font-semibold">
                                Business Risks
                            </h3>

                            <ul className="list-disc space-y-2 pl-6 text-gray-700">
                                {result.business_risks?.map(
                                    (item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                            <h3 className="mb-3 text-lg font-semibold">
                                Dependencies
                            </h3>

                            <ul className="list-disc space-y-2 pl-6 text-gray-700">
                                {result.dependencies?.map(
                                    (item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div className="rounded-xl border border-green-100 bg-green-50 p-5">
                            <h3 className="mb-3 text-lg font-semibold">
                                Mitigation Plan
                            </h3>

                            <ul className="list-disc space-y-2 pl-6 text-gray-700">
                                {result.mitigation?.map(
                                    (item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {showVersions && (
                <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Version History</h2>

                        <button
                            onClick={() => setShowVersions(false)}
                            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                        >
                            Close
                        </button>
                    </div>

                    {versions.length === 0 ? (
                        <p className="text-gray-500">
                            No previous versions are available yet.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {versions.map((version, index) => (
                                <div
                                    key={version.id || index}
                                    className="border rounded-xl p-5 bg-slate-50"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                Version {version.version_number}
                                            </p>

                                            <p className="text-sm text-gray-500 mt-1">
                                                {version.created_at
                                                    ? new Date(
                                                        version.created_at
                                                    ).toLocaleString()
                                                    : "Date unavailable"}
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                            {version.status || "Saved"}
                                        </span>
                                    </div>

                                    {version.title && (
                                        <p className="mt-4 font-medium text-gray-800">
                                            {version.title}
                                        </p>
                                    )}

                                    {version.description && (
                                        <p className="mt-2 whitespace-pre-wrap text-gray-600">
                                            {version.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {traceability && (
                <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
                    <h2 className="text-2xl font-bold mb-6">Traceability</h2>

                    <p className="text-slate-500 mb-6">
                        Current requirement traceability information.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-slate-50 rounded-xl p-5">
                            <p className="text-sm text-slate-500">Requirement ID</p>
                            <p className="font-medium text-slate-800 break-all mt-1">
                                {traceability.id}
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-5">
                            <p className="text-sm text-slate-500">Status</p>
                            <p className="font-medium text-slate-800 mt-1 capitalize">
                                {traceability.status}
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-5">
                            <p className="text-sm text-slate-500">Version</p>
                            <p className="font-medium text-slate-800 mt-1">
                                Version {traceability.version_number}
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-5">
                            <p className="text-sm text-slate-500">Created</p>
                            <p className="font-medium text-slate-800 mt-1">
                                {new Date(traceability.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );


}
