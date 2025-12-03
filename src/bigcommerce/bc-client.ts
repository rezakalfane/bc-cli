/**
 * HTTP Methods for REST API calls
 */
export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
}

/**
 * Credentials required to request BigCommerce API
 */
export interface BCClientCredentials {
    storeHash: string;
    accessToken: string;
}

/**
 * BigCommerce REST API client
 */
export class BCClient {
    private storeHash: string;
    private accessToken: string;

    constructor({ storeHash, accessToken }: BCClientCredentials) {
        this.storeHash = storeHash;
        this.accessToken = accessToken;
    }

    /**
     * Get all Category Trees for a BigCommerce store
     * @param page Pagination page
     * @returns Array of Category Trees
     */
    async getCategoryTrees(page = 1): Promise<any[]> {
        const url = `https://api.bigcommerce.com/stores/${this.storeHash}/v3/catalog/trees?page=${page}`
        const response = await fetch(url, {
            method: HttpMethod.GET,
            headers: {
                "X-Auth-Token": this.accessToken,
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            throw new Error(
                `Failed to get  with status code ${response.status}`,
            );
        }

        const result = await response.json();

        // Go through all pages
        if (result.meta.pagination.total_pages > result.meta.pagination.current_page) {
            return [
                ...result.data,
                ...await(this.getCategoryTrees(result.meta.pagination.current_page + 1))
            ]
        }
        return result.data
    }

    /**
     * Get all Categories for a specific Tree
     * @param tree_id Category Tree ID
     * @returns Array of top level Categories with children
     */
    async getSingleCategoryTree(tree_id: number): Promise<any[]> {
        const url = `https://api.bigcommerce.com/stores/${this.storeHash}/v3/catalog/trees/${tree_id}/categories`
        const response = await fetch(url, {
            method: HttpMethod.GET,
            headers: {
                "X-Auth-Token": this.accessToken,
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            throw new Error(
                `Failed to get Categories with status code ${response.status}`,
            );
        }

        const result = await response.json();
        return result.data
    }

    /**
     * Get all Categories
     * @param query Query parameters
     * @returns Array of Categories
     */
    async getAllCategories(query: string[] = []): Promise<any[]> {
        let url = `https://api.bigcommerce.com/stores/${this.storeHash}/v3/catalog/trees/categories`
        if (query.length) {
            url += "?"
            url += query.join("&")
        }
        const response = await fetch(url, {
            method: HttpMethod.GET,
            headers: {
                "X-Auth-Token": this.accessToken,
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            throw new Error(
                `Failed to get Categories with status code ${response.status}`,
            );
        }

        const result = await response.json();
        return result.data
    }

    /**
     * Get all Products in a BigCommerce store
     * @param page Pagination page
     * @param query Query parameters
     * @returns Array of Products
     */
    async getProducts(page = 1, query: string[] = []): Promise<any[]> {
        let url = `https://api.bigcommerce.com/stores/${this.storeHash}/v3/catalog/products?page=${page}`
        if (query.length) {
            url += "&"
            url += query.join("&")
        }
        const response = await fetch(url, {
            method: HttpMethod.GET,
            headers: {
                "X-Auth-Token": this.accessToken,
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            throw new Error(
                `Failed to get Products with status code ${response.status}`,
            );
        }

        const result = await response.json();

        // Go through all pages
        if (result.meta.pagination.total_pages > result.meta.pagination.current_page) {
            return [
                ...result.data,
                ...await(this.getProducts(result.meta.pagination.current_page + 1, query))
            ]
        }
        return result.data
    }

    /**
     * Get a single Product
     * @returns Product entry
     */
    async getProduct(product_id: number): Promise<any> {
        const url = `https://api.bigcommerce.com/stores/${this.storeHash}/v3/catalog/products/${product_id}`
        const response = await fetch(url, {
            method: HttpMethod.GET,
            headers: {
                "X-Auth-Token": this.accessToken,
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            throw new Error(
                `Failed to get Product with status code ${response.status}`,
            );
        }

        const result = await response.json();
        return result.data
    }

    /**
     * Get all Product Variants
     * @param page Pagination page
     * @param query Query parameters
     * @returns Array of Product Variants
     */
    async getAllProductVariants(product_id: number, page = 1, query: string[] = []): Promise<any[]> {
        let url = `https://api.bigcommerce.com/stores/${this.storeHash}/v3/catalog/products/${product_id}/variants?page=${page}`
        if (query.length) {
            url += "&"
            url += query.join("&")
        }
        const response = await fetch(url, {
            method: HttpMethod.GET,
            headers: {
                "X-Auth-Token": this.accessToken,
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            throw new Error(
                `Failed to get Product Variants with status code ${response.status}`,
            );
        }

        const result = await response.json();

        // Go through all pages
        if (result.meta.pagination.total_pages > result.meta.pagination.current_page) {
            return [
                ...result.data,
                ...await(this.getAllProductVariants(product_id, result.meta.pagination.current_page + 1, query))
            ]
        }
        return result.data
    }

    /**
     * Get all Brands in a BigCommerce store
     * @param page Pagination page
     * @param query Query parameters
     * @returns Array of Brands
     */
    async getBrands(page = 1, query: string[] = []): Promise<any[]> {
        let url = `https://api.bigcommerce.com/stores/${this.storeHash}/v3/catalog/brands?page=${page}`
        if (query.length) {
            url += "&"
            url += query.join("&")
        }
        const response = await fetch(url, {
            method: HttpMethod.GET,
            headers: {
                "X-Auth-Token": this.accessToken,
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            throw new Error(
                `Failed to get Brands with status code ${response.status}`,
            );
        }

        const result = await response.json();

        // Go through all pages
        if (result.meta.pagination.total_pages > result.meta.pagination.current_page) {
            return [
                ...result.data,
                ...await(this.getBrands(result.meta.pagination.current_page + 1, query))
            ]
        }
        return result.data
    }

    /**
     * Create categories in bulk
     * @param categories Array of category objects to create
     * @returns Array of created categories
     */
    async createCategories(categories: any[]): Promise<any[]> {
        const url = `https://api.bigcommerce.com/stores/${this.storeHash}/v3/catalog/trees/categories`
        const response = await fetch(url, {
            method: HttpMethod.POST,
            headers: {
                "X-Auth-Token": this.accessToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(categories)
        })

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Failed to create categories with status code ${response.status}: ${errorText}`,
            );
        }

        const result = await response.json();
        return result.data
    }

    /**
     * Update categories in bulk
     * @param categories Array of category objects to update (must include category_id in each object)
     * @returns Array of updated categories
     */
    async updateCategories(categories: any[]): Promise<any[]> {
        const url = `https://api.bigcommerce.com/stores/${this.storeHash}/v3/catalog/trees/categories`
        const response = await fetch(url, {
            method: HttpMethod.PUT,
            headers: {
                "X-Auth-Token": this.accessToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(categories)
        })

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Failed to update categories with status code ${response.status}: ${errorText}`,
            );
        }

        const result = await response.json();
        // BigCommerce API may return data in result.data or directly in result
        return result.data || result || []
    }
}
