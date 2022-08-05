export type Response<T> = {
    success: true
    response: T
} | {
    success: false
    response: string
    error_code: number
}

export type Shop = {
    id: number
    // rating: any // (not in docs) wtf is this
    name: string
    domain: string
    last_domain: string
    // delivery_type: 'rcon' | 'plugin' // (not in docs) probably like this
    description: string | null
    user_id: number
    is_active: boolean
    is_premium: boolean
    hide_copyright: number
    // hide_copyright_till: string | null // (not in docs) probably this
    is_verified: boolean
    vk_link: string | null
    youtube_link: string | null
    discord_link: string | null
    twitch_link: string | null
    tiktok_link: string | null
    telegram_link: string | null // (not in docs)
    theme_id: number
    background: string
    logo: string
    favicon: string
    css: string | null
    enable_background_overlay: boolean
    hide_side_image: boolean
    hide_general_online: boolean
    products_image_padding: number
    hide_servers: boolean
    test_mode: boolean
    test_mode_from: string | null // (not in docs) pretty sure this is nullable
    created_at: string
    updated_at: string
    side: string
    key: string
    color: string
    require_email: boolean
    pay_comission: number
    particles: string
    sort_index: number | null
    https_redirect: boolean // (not in docs)
    allow_nickname_spaces: boolean // (not in docs)
    game_id: number // (not in docs) might be nullable, careful
    hide_payment_instructions: boolean // (not in docs)
    payment_instructions: string | null // (not in docs) might be nullable
    use_cart: boolean // (not in docs)
}

export type Server = {
    id: number
    name: string
    ip: string
    port: number
    version: string
    is_port_hidden: boolean
    hide_ip: boolean
    is_hidden: boolean
    is_plugin_installed: boolean
    shop_id: number
    created_at: string
    updated_at: string
    sort_index: number | null // (not in docs)
    disable_payments: boolean // (not in docs)
    pivot?: {
        shop_id: number
        server_id: number
    } // (not in docs)
}

export type Product = {
    id: number
    name: string
    price: number
    old_price: number | null
    type: "item" | "group" | "currency" | "case" | "other" | "unknown"
    number: number
    is_hidden: boolean // (why is this not in docs, kinda useful)
    commands: string[]
    withdraw_commands: string[] | null // unsure
    withdraw_commands_days: number | null
    additional_fields: {[key: number]: {
        name: string
        type: "text" | "number"
        default: string
        description: string
    }}
    description: string | null
    category_id: number | null // (not in docs) i have no idea tbh
    image: string | null
    first_delete: boolean
    shop_id: number,
    created_at: string
    updated_at: string
    sort_index: number | null
}

export type ServerWithProducts = Server & {
    products: Product[]
}

export type ProductWithServers = Product & {
    servers: Server[]
}

export type Payment = {
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
    products: Product[]
    server: Server
}

export type MassSale = {
    id: number
    name: string
    sale: number
    shop_id: number
    start_at: string | null
    expires_at: string | null
    created_at: string
    updated_at: string
    products: Product[]
}

export type Coupon = {
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
    products: Product[]
}