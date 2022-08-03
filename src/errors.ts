const easyDonateErrorCodes = {
    1: 'Shop with provided ID not found',
    2: 'Item not found',
    3: 'Missing request parameter',
    4: 'Invalid request parameter',
    5: 'Plugin is not online',
    6: 'Plugin request failed'
}

export class EasyDonateRequestError extends Error {
    constructor(httpCode: number) {
        super(`EasyDonate API returned HTTP code ${httpCode}!`)
        this.name = 'EasyDonateRequestError'
    }
}

export class EasyDonateError extends Error {
    constructor(message: string, code: number) {
        super(`EasyDonate API returned error: ${message} (code ${code}: ${easyDonateErrorCodes[code]})`)
        this.name = 'EasyDonateError'
    }
}