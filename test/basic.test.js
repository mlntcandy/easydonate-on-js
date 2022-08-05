import 'dotenv/config'

import assert from 'assert'

import { EasyDonate } from '../dist/index.js'
import { EasyDonateRateLimitedError } from '../dist/errors.js'

const shopKey = process.env.SHOP_KEY

describe('basic', () => {
    it('should create a new instance', () => {
        const easyDonate = new EasyDonate(shopKey)
        assert.ok(easyDonate)
    })

    it('should get shop info', async () => {
        const easyDonate = new EasyDonate(shopKey)
        const shop = await easyDonate.getShopInfo()
        // console.log(shop)
        assert.ok(shop)
        assert.ok(shop.name)
        // assert.ok(shop.description)
        assert.ok(shop.logo)
    })

    it('should throw a ratelimit error', async () => {
        const easyDonate = new EasyDonate(shopKey)
        let spamApi = async () => {
            for (let i = 0; i < 100; i++) await easyDonate.getShopInfo()
        }
        await assert.rejects(spamApi, EasyDonateRateLimitedError)
    })
})