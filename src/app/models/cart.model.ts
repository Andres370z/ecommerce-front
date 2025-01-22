import { ProductModelServer } from "./product.model"

export interface cartModelServer {
    total: number,
    data: [{
        products: ProductModelServer,
        numIncart: number
    }]
};

export interface cartModelPublic {
    total: number,
    productDta: [{
        id: number,
        incart: number
    }]
}