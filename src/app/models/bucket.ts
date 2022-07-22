export interface IBucket {
    id: string;
    name: string;
    goal?: string;
    reminder?: string;
    days?: string;
    sort_order?: number;
    description?: string;
    categories?: string[];
    doc_group?: string[];
}
