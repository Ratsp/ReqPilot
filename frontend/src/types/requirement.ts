export interface Requirement {
    id: string;
    title: string;
    description: string;
    status: string;
    version_number: number;
    created_at: string;
    updated_at: string;
    ai_summary?: string;
    extracted_requirements?: string;
    missing_information?: string;
    clarification_questions?: string;
    improved_requirements?: string;
    rewritten_requirement?: string;
    quality_analysis?: any;
}

export interface RequirementListResponse {
    requirements: Requirement[];
}