import 'dotenv/config'

import assert from 'assert'

import { EasyDonate, EasyDonateRateLimitedError } from '../dist/index.js'

const shopKey = process.env.SHOP_KEY

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

it('should throw a ratelimit error', async () => {
    const easyDonate = new EasyDonate(shopKey)
    let spamApi = async () => {
        for (let i = 0; i < 100; i++) await easyDonate.getShopInfo()
    }
    await assert.rejects(spamApi, EasyDonateRateLimitedError)
    await sleep(1000)
})