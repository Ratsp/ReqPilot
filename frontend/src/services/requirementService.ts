import api from "../api/api";
import { RequirementListResponse } from "../types/requirement";

export async function getRequirements() {
    const response = await api.get<RequirementListResponse>("/requirements");
    return response.data.requirements;
}

export async function getRequirement(id: string) {
    const response = await api.get(`/requirements/${id}`);
    return response.data;
}

export async function analyzeRequirement(id: string) {
    const response = await api.post(`/requirements/${id}/analyze`);
    return response.data;
}

export async function deleteRequirement(id: string) {
    const response = await api.delete(`/requirements/${id}`);
    return response.data;
}

export async function qualityAnalysis(id: string) {
    const response = await api.post(
        `/requirements/${id}/quality-analysis`
    );
    return response.data;
}

export async function gapAnalysis(id: string) {
    const response = await api.post(
        `/requirements/${id}/gap-analysis`
    );
    return response.data;
}

export async function improveRequirement(id: string) {
    const response = await api.post(
        `/requirements/${id}/improve`
    );
    return response.data;
}

export async function rewriteRequirement(id: string) {
    const response = await api.post(
        `/requirements/${id}/rewrite`
    );
    return response.data;
}

export async function exportPDF(id: string) {
    const response = await api.get(
        `/requirements/${id}/export/pdf`,
        {
            responseType: "blob",
        }
    );

    const blob = new Blob([response.data], {
        type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `requirement-${id}.pdf`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
}

export async function updateRequirement(
    id: string,
    payload: any,
) {

    const response = await api.put(
        `/requirements/${id}`,
        payload,
    );

    return response.data;
}

export async function searchRequirements(keyword: string) {

    const response = await api.get(
        `/requirements/search?keyword=${encodeURIComponent(keyword)}`
    );

    return response.data.requirements;
}

export async function filterRequirements(status: string) {

    const response = await api.get(
        `/requirements/filter/status?status=${status}`
    );

    return response.data.requirements;
}

export async function sortRequirements(sortBy: string) {

    const response = await api.get(
        `/requirements/sort?sort_by=${sortBy}`
    );

    return response.data.requirements;
}

export async function paginateRequirements(
    page: number,
    limit: number
) {

    const response = await api.get(
        `/requirements/paginate?page=${page}&limit=${limit}`
    );

    return response.data.requirements;
}



export async function compareRequirements(
    firstRequirementId: string,
    secondRequirementId: string
) {
    const response = await api.post("/requirements/compare", {
        requirement_id_1: firstRequirementId,
        requirement_id_2: secondRequirementId,
    });

    return response.data;
}


export async function generateAcceptanceCriteria(requirementId: string) {
    const response = await api.post(
        `/requirements/${requirementId}/acceptance-criteria`
    );

    return response.data;
}

export async function generateUserStories(id: string) {
    const response = await api.post(
        `/requirements/${id}/user-stories`
    );

    return response.data;
}


export async function riskAnalysis(id: string) {
    const response = await api.post(
        `/requirements/${id}/risk-analysis`
    );

    return response.data;
}


export async function getRequirementVersions(id: string) {
    const response = await api.get(`/requirements/${id}/versions`);

    return response.data;
}

export async function getTraceability(requirementId: string) {
    const response = await api.get(
        `/requirements/${requirementId}/traceability`
    );

    return response.data;
}

export async function chatRequirement(
    requirementId: string,
    question: string
) {
    const response = await api.post(
        `/requirements/${requirementId}/chat`,
        {
            question: question,
        }
    );

    return response.data;
}


export async function analyzeWebpage(url: string) {
    const response = await api.post("/requirements/webpage", {
        url,
    });

    return response.data;
}