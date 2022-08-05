import 'dotenv/config'

import assert from 'assert'

import { EasyDonate } from '../dist/index.js'

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
})