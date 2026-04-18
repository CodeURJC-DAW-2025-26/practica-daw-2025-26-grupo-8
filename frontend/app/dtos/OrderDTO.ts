export interface OrderDTO {
    id: number;
    address: string;
    city: string;
    postalCode: string;
    phoneNumber: string;
    userEmail: string;
    productTitles: string[];
}

export interface OrderRequestDTO {
    productIds: number[];
    address: string;
    city: string;
    postalCode: string;
    phoneNumber: string;
}