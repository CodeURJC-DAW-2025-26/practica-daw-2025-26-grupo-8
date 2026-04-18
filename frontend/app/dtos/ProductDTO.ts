export interface ProductDTO {
    id: number;
    title: string;
    description: string;
    shortDescription: string;
    price: number;
    allergies: string[];
    categoryId: number;
    categoryTitle: string;
    hasImage: boolean;
}