import { defineQuery } from "next-sanity";

const BRANDS_QUERY = defineQuery(`*[_type=="brand"] | order(title asc)`);

const LATEST_BLOG_QUERY = defineQuery(
    `*[_type == 'blog' && isLatest == true] | order(name asc){
    ...,
    blogcategories[]->{
        title
    }
    }`
);

const DEAL_PRODUCTS = defineQuery(
    `*[_type == "product" && status in ["hot", "sale"]] | order(name asc){
    ...,"categoryTitles": categories[]->title}`
);

const PRODUCTS_BY_VARIANT_QUERY = defineQuery(
    `*[_type == "product" && variant == $variant] | order(name desc){
    ...,"categoryTitles": categories[]->title}`
);

const PRODUCT_BY_SLUG_QUERY = defineQuery(
    `*[_type == "product" && slug.current == $slug][0]`
);

const BRAND_QUERY = defineQuery(
    `*[_type == "product" && slug.current == $slug][0].brand->title`
);

export {
    BRANDS_QUERY,
    LATEST_BLOG_QUERY,
    DEAL_PRODUCTS,
    PRODUCTS_BY_VARIANT_QUERY,
    PRODUCT_BY_SLUG_QUERY,
    BRAND_QUERY,
};