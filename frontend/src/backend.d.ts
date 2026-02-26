import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Tool {
    id: bigint;
    seoTitle?: string;
    pricingTag: string;
    name: string;
    createdAt: bigint;
    slug: string;
    officialLink: string;
    description: string;
    isPopular: boolean;
    updatedAt: bigint;
    isFeatured: boolean;
    seoKeywords?: string;
    category: string;
    seoDescription?: string;
    iconUrl: string;
}
export interface ToolSubmission {
    id: bigint;
    status: string;
    pricingTag: string;
    name: string;
    officialLink: string;
    submittedAt: bigint;
    description: string;
    category: string;
    iconUrl: string;
}
export interface UserProfile {
    name: string;
    email?: string;
}
export interface PaginatedTools {
    tools: Array<Tool>;
    total: bigint;
    page: bigint;
    pageSize: bigint;
    totalPages: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCollection(name: string, toolIds: Array<bigint>, isFeatured: boolean): Promise<bigint>;
    addTool(name: string, iconUrl: string, description: string, category: string, pricingTag: string, officialLink: string, isFeatured: boolean, isPopular: boolean): Promise<bigint>;
    adminListTools(): Promise<Array<Tool>>;
    approveSubmission(submissionId: bigint): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bulkUploadTools(toolsData: Array<Tool>): Promise<void>;
    deleteCollection(id: bigint): Promise<void>;
    deleteTool(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCollection(id: bigint): Promise<{
        id: bigint;
        tools: Array<Tool>;
        name: string;
        isFeatured: boolean;
    } | null>;
    getFeaturedCollections(): Promise<Array<{
        id: bigint;
        tools: Array<Tool>;
        name: string;
        isFeatured: boolean;
    }>>;
    getFeaturedTools(): Promise<Array<Tool>>;
    getNewsletterEmails(): Promise<Array<string>>;
    getSimilarTools(toolId: bigint, limit: bigint): Promise<Array<Tool>>;
    getTool(id: bigint): Promise<Tool | null>;
    getToolBySlug(slug: string): Promise<Tool | null>;
    getToolsByCategory(category: string): Promise<Array<Tool>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listSubmissions(): Promise<Array<ToolSubmission>>;
    listTools(page: bigint, pageSize: bigint, filter: string | null, sortBy: string | null): Promise<PaginatedTools>;
    rejectSubmission(submissionId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchTools(searchTerm: string): Promise<Array<Tool>>;
    setToolFeatured(id: bigint, featured: boolean): Promise<void>;
    submitTool(name: string, iconUrl: string, description: string, category: string, pricingTag: string, officialLink: string): Promise<bigint>;
    subscribeNewsletter(email: string): Promise<void>;
    updateCollection(id: bigint, name: string, toolIds: Array<bigint>, isFeatured: boolean): Promise<void>;
    updateTool(id: bigint, name: string, iconUrl: string, description: string, category: string, pricingTag: string, officialLink: string, isFeatured: boolean, isPopular: boolean): Promise<void>;
    updateToolSEO(id: bigint, seoTitle: string | null, seoDescription: string | null, seoKeywords: string | null): Promise<void>;
}
