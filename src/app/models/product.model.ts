export interface ProductModelServer {
    id: number;
    name: String;
    category: String;
    description: String;
    image: String;
    price: number;
    quantity: number;
    images: String;
}


export interface serverResponse {
    count: number;
    products: ProductModelServer[]
};


export interface registerProduct {
    title: string,
    image: string,
    description: string,
    price: number,
    quantity: number,
    short_desc: string,
    cat_id: number
}