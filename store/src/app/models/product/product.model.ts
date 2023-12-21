export interface Product {
    product_id: number;
    product_name: string;
    product_desc: string;
    product_price: number;
    product_rating: number;
    brand_name: string;
    brand_image: string;
    category_name: string;
    product_picture: string;
    count: number;
    stock: number;
    dynamic_attributes: { [key: string] : any }
}