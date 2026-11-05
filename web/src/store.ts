import {reactive} from 'vue';
import api, {getMediaURL} from '@/axios';

export const store = reactive({
    categories: [] as ProductCategory[],
    products: [] as Product[],
});

// Populate all first-level relations so the product's category is included in
// Strapi's response. The same query also includes product media and components.
const populate = 'populate=*';
const locale = 'locale=cs';
let catalogRequest: Promise<void> | null = null;

function content<T>(item: any): T {
    if (item?.data !== undefined) return content<T>(item.data);
    return (item?.attributes ? {...item.attributes, id: item.id, documentId: item.documentId} : item) as T;
}

function relation<T>(value: any): T | null {
    if (!value) return null;
    const related = content<T | T[]>(value);
    return Array.isArray(related) ? related[0] ?? null : related;
}

function mediaItems(value: any): any[] {
    const items = value?.data ?? value;
    if (!items) return [];
    return Array.isArray(items) ? items.map(content) : [content(items)];
}

function mediaURL(value: any): string | null {
    const item = typeof value === 'string' ? value : content<any>(value);
    return getMediaURL(item?.url ?? null);
}

function asSize(components: any[] = []): ProductSize {
    const size = components[0] ?? {};
    const isSheetCount = size.__component === 'product-sizes.sheet-count';
    const dimensions = isSheetCount
        ? `${size.width ?? ''}x${size.height ?? ''}`
        : `${size.width ?? ''}x${size.depth ?? ''}${size.height == null ? '' : `x${size.height}`} `;
    return {
        sheetCount: isSheetCount ? size.sheets ?? null : null,
        width: size.width ?? 0,
        height: size.height ?? null,
        depth: size.depth ?? 0,
        unit: size.unit ?? 'cm',
        dimensions_display_name: `${dimensions.trim()} ${size.unit ?? 'cm'}`.trim(),
    };
}

function asColor(components: any[] = []): ProductColor {
    const meta = components.find(component => component.color || component.box_color);
    const value = meta?.color ?? meta?.box_color ?? '';
    return {label: value, hex: null};
}

function deserializeProduct(raw: any, detailed = false): Product {
    const item = content<any>(raw);
    const images = mediaItems(item.images);
    const category = relation<any>(item.product_category);
    const variant = relation<any>(item.variant);
    const variantProducts = mediaItems(variant?.products).map(product => content<any>(product));
    const categoryId = category?.documentId ?? category?.id;
    const knownCategory = store.categories.find(entry => String(entry.id) === String(categoryId));
    const allImages = images.map((image, index) => ({
        id: image.id ?? index,
        thumbnail: index === 0,
        image: mediaURL(image) ?? '',
    }));

    return {
        id: item.documentId ?? item.id,
        category: knownCategory ?? {
            id: categoryId ?? '',
            name: category?.name ?? '',
            description: category?.description ?? '',
            products: 0,
        },
        displayName: item.name ?? '',
        description: item.description ?? '',
        tags: [],
        size: asSize(item.product_size),
        color: asColor(item.product_meta),
        thumbnail: allImages[0]?.image ?? null,
        images: detailed ? allImages : [],
        variants: variant ? {
            name: variant.name ?? '',
            products: variantProducts
                .filter(product => String(product.documentId ?? product.id) !== String(item.documentId ?? item.id))
                .map(product => product.documentId ?? product.id),
        } : null,
    };
}

async function getAllProducts(): Promise<any[]> {
    const products: any[] = [];
    let page = 1;
    let pageCount = 1;
    while (page <= pageCount) {
        const response = await api.get(`/products?${populate}&${locale}&pagination[page]=${page}&pagination[pageSize]=100`);
        products.push(...(response.data?.data ?? []));
        pageCount = response.data?.meta?.pagination?.pageCount ?? 1;
        page += 1;
    }
    return products;
}

async function loadCatalog(): Promise<void> {
    const [categoryResponse, products] = await Promise.all([
        api.get(`/product-categories?${locale}&pagination[pageSize]=100`),
        getAllProducts(),
    ]);

    store.categories = (categoryResponse.data?.data ?? []).map((raw: any) => {
        const category = content<any>(raw);
        const id = category.documentId ?? category.id;
        const count = products.filter((rawProduct: any) => {
            const product = content<any>(rawProduct);
            const productCategory = relation<any>(product.product_category);
            return String(productCategory?.documentId ?? productCategory?.id) === String(id);
        }).length;
        return {id, name: category.name, description: category.description ?? '', products: count};
    });
    store.products = products.map(product => deserializeProduct(product));
}

function ensureCatalog(): Promise<void> {
    if (!catalogRequest) {
        catalogRequest = loadCatalog().finally(() => { catalogRequest = null; });
    }
    return catalogRequest;
}

export async function fetchCategories(): Promise<ProductCategory[]> {
    await ensureCatalog();
    return store.categories;
}

export async function fetchProducts(): Promise<Product[]> {
    await ensureCatalog();
    return store.products;
}

export async function fetchProduct(id: string | number): Promise<Product> {
    await ensureCatalog();
    const response = await api.get(`/products/${encodeURIComponent(String(id))}?${populate}&${locale}`);
    return deserializeProduct(response.data?.data, true);
}

export function getProductCategory(id: string | number): ProductCategory | undefined {
    return store.categories.find(category => String(category.id) === String(id));
}

export function deserializeProductDetail(product: any): Product {
    return deserializeProduct(product, true);
}

export function deserializeProductCategory(category: any): ProductCategory {
    const item = content<any>(category);
    return {
        id: item.documentId ?? item.id,
        name: item.name,
        description: item.description ?? '',
        products: item.products ?? 0,
    };
}
