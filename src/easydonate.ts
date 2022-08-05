import fetch from 'node-fetch'

import { EasyDonateError, EasyDonateRequestError } from "./errors.js"

export type EasyDonateResponse<T> = {
    success: true
    response: T
} | {
    success: false
    response: string
    error_code: number
}

type EasyDonateServer = {
    id: number
    name: string
    ip: string
    port: number
    version: string
    is_port_hidden: boolean
    hide_ip: boolean
    is_hidden: boolean
    shop_id: number
    created_at: string
    updated_at: string
}

type EasyDonateProduct = {
    id: number
    name: string
    price: number
    old_price: number | null
    type: "item" | "group" | "currency" | "case" | "other" | "unknown"
    number: number
    commands: string[]
    withdraw_commands: string[] | null // unsure
    withdraw_commands_days: string | null // unsure, probably a timestamp, might be a number
    additional_fields: any // wtf is this?
    description: string | null
    image: string | null
    first_delete: boolean
    shop_id: number,
    created_at: string
    updated_at: string
    sort_index: number | null
}

type EasyDonateServerWithProducts = EasyDonateServer & {
    products: EasyDonateProduct[]
}

type EasyDonateProductWithServers = EasyDonateProduct & {
    servers: EasyDonateServer[]
}

type EasyDonatePayment = {
    id: number
    customer: string
    email: string | null
    shop_id: number
    server_id: number
    status: number // this is the dumbest shit yet, anyways, 2 = paid
    enrolled: number
    payment_system: "Qiwi" | "Interkassa" | "test",
    payment_type: "test" | "qiwi" | "card" | "mc" | "webmoney" | "yandex"
    sent_commands: {
        command: string
        response: string
    }[]
    error: string | null // probably err string. FUCKING again, null in docs example with no further explanation
    created_at: string
    updated_at: string
    products: EasyDonateProduct[]
    server: EasyDonateServer
}

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
        
        if (this.customRequestMaker) return await this.customRequestMaker(method, url, formatQuery(data))

        const response = await this.fetchSubstitute(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Shop-Key': this.shopKey
            }
        })

        let responseObject = (await response.json()) as EasyDonateResponse<T>

        if (responseObject.success === false) throw new EasyDonateError(responseObject.response, responseObject.error_code)
        if (response.status !== 200) throw new EasyDonateRequestError(response.status)

        return responseObject.response
    }

    public async getShopInfo() {
        return await this.request<{
            id: number
            name: string
            domain: string
            last_domain: string
            description: string | null
            user_id: number
            is_active: boolean
            is_premium: boolean
            hide_copyright: number
            is_verified: boolean
            vk_link: string | null
            youtube_link: string | null
            discord_link: string | null
            twitch_link: string | null
            tiktok_link: string | null
            theme_id: number
            background: string
            logo: string
            favicon: string
            css: string | null
            enable_background_overlay: number
            hide_side_image: number
            hide_general_online: number
            products_image_padding: number
            hide_servers: number
            test_mode: number
            created_at: string
            updated_at: string
            side: string
            key: string
            color: string
            require_email: number
            pay_comission: number
            particles: string
            sort_index: number | null
        }>('GET', 'shop', null)
    }

    public async getShopProducts() {
        return await this.request<EasyDonateProductWithServers[]>('GET', 'shop/products', null)
    }

    public async getShopProductInfo(productId: number) {
        return await this.request<EasyDonateProductWithServers>('GET', `shop/products/${productId}`, null)
    }

    public async getShopServers() {
        return await this.request<EasyDonateServerWithProducts[]>('GET', 'shop/servers', null)
    }

    public async getShopServerInfo(serverId: number) {
        return await this.request<EasyDonateServerWithProducts>('GET', `shop/server/${serverId}`, null)
    }

    public async getMassSales(onlyActive: boolean = true) {
        return await this.request<{
            id: number
            name: string
            sale: number
            shop_id: number
            start_at: string | null
            expires_at: string | null
            created_at: string
            updated_at: string
            products: EasyDonateProduct[]
        }[]>('GET', 'shop/massSales', (onlyActive ? { where_active: true } : null))
    }

    public async getShopCoupons(onlyActive: boolean = true) {
        return await this.request<{
            id: number
            name: string
            code: string
            sale: number
            limit: any // TODO: wtf is this? null in docs example
            expires_at: string | null
            shop_id: number
            start_at: string | null
            created_at: string
            updated_at: string
            products: EasyDonateProduct[]
        }[]>('GET', 'shop/coupons', (onlyActive ? { where_active: true } : null))
    }

    public async getSuccessfulPayments() {
        return await this.request<EasyDonatePayment[]>('GET', 'shop/payments', null)
    }

    public async getPaymentInfo(paymentId: number) {
        return await this.request<EasyDonatePayment>('GET', `shop/payment/${paymentId}`, null)
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
            payment: EasyDonatePayment
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