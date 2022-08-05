import fetch from 'node-fetch'

import { EasyDonateError, EasyDonateRateLimitedError, EasyDonateRequestError, types } from './index.js'


const formatQuery = (query: Record<string, (string | number | boolean | null)>) => {
    var newObject: Record<string, string> = {}
    for (const key in query) {
        let value = query[key]
        if (value) newObject[key] = value.toString()
    }
    return newObject
}

type CustomRequestMaker = (method: string, url: string, query: Record<string, string>) => Promise<any>

export class EasyDonate {
    private shopKey: string
    private customRequestMaker: CustomRequestMaker | null = null
    private fetchSubstitute: typeof fetch = fetch

    constructor(shopKey: string, options?: { customRequestMaker?: CustomRequestMaker, fetchSubstitute?: typeof fetch }) {
        this.shopKey = shopKey
        if (options?.customRequestMaker) this.customRequestMaker = options.customRequestMaker
        if (options?.fetchSubstitute) this.fetchSubstitute = options.fetchSubstitute
    }

    private async request<T>(method: string, path: string, data: { [key: string]: string | number | boolean | null } | null): Promise<T> {
        let url = `https://easydonate.ru/api/v3/${path}${data ? '?' + new URLSearchParams(formatQuery(data)) : ''}`
        
        if (this.customRequestMaker) return (await this.customRequestMaker(method, url, formatQuery(data))).response as T

        const response = await this.fetchSubstitute(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Shop-Key': this.shopKey
            }
        })
        
        if (response.status === 429) throw new EasyDonateRateLimitedError()
        if (response.status !== 200) throw new EasyDonateRequestError(response.status)

        let responseObject = (await response.json()) as types.Response<T>

        if (responseObject.success === false) throw new EasyDonateError(responseObject.response, responseObject.error_code)

        return responseObject.response
    }

    public async getShopInfo() {
        return await this.request<types.Shop>('GET', 'shop', null)
    }

    public async getShopProducts() {
        return await this.request<types.ProductWithServers[]>('GET', 'shop/products', null)
    }

    public async getShopProductInfo(productId: number) {
        return await this.request<types.ProductWithServers>('GET', `shop/products/${productId}`, null)
    }

    public async getShopServers() {
        return await this.request<types.ServerWithProducts[]>('GET', 'shop/servers', null)
    }

    public async getShopServerInfo(serverId: number) {
        return await this.request<types.ServerWithProducts>('GET', `shop/server/${serverId}`, null)
    }

    public async getMassSales(onlyActive: boolean = true) {
        return await this.request<types.MassSale[]>('GET', 'shop/massSales', (onlyActive ? { where_active: true } : null))
    }

    public async getShopCoupons(onlyActive: boolean = true) {
        return await this.request<types.Coupon[]>('GET', 'shop/coupons', (onlyActive ? { where_active: true } : null))
    }

    public async getSuccessfulPayments() {
        return await this.request<types.Payment[]>('GET', 'shop/payments', null)
    }

    public async getPaymentInfo(paymentId: number) {
        return await this.request<types.Payment>('GET', `shop/payment/${paymentId}`, null)
    }

    public async createPayment(
        productIdQuantities: {[id: number]: number}, 
        serverId: number, 
        customerNickname: string, 
        successUrl: string,
        coupon: string | null = null,
        email: string | null = null,
    ) {
        return await this.request<{
            url: string
            payment: types.Payment
        }>('GET', 'shop/payment/create', {
            customer: customerNickname,
            server_id: serverId,
            products: JSON.stringify(productIdQuantities),
            email,
            coupon,
            success_url: successUrl
        })

    }

}