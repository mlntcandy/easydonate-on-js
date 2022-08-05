const easyDonateErrorCodes = {
    1: 'Shop with provided ID not found',
    2: 'Item not found',
    3: 'Missing request parameter',
    4: 'Invalid request parameter',
    5: 'Plugin is not online',
    6: 'Plugin request failed'
}

export class EasyDonateRequestError extends Error {
    name = 'EasyDonateRequestError'
    constructor(httpCode: number) {
        super(`EasyDonate API returned HTTP code ${httpCode}!`)
    }
}

export class EasyDonateRateLimitedError extends Error {
    name = 'EasyDonateRateLimitedError'
    constructor() {
        super('EasyDonate API: rate limit exceeded!')
    }
}

export class EasyDonateError extends Error {
    constructor(message: string, code: number) {
        super(`EasyDonate API returned error: ${message} (code ${code}: ${easyDonateErrorCodes[code]})`)
        this.name = 'EasyDonateError'
    }
}