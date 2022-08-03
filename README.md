# easydonate-on-js
### The unofficial easydonate.ru API wrapper for JavaScript (ES6 Module).

Based on `node-fetch` API.

If you encounter problems using this library, please, do not bug EasyDonate, instead create an issue here.

⚠ ***Note:** This library is not meant for frontend use! You **WILL leak** your shop key.*

## Usage
```javascript
// ES6
import { EasyDonate } from 'easydonate-on-js';

const shopKey = 'abcde123abcde123abcde123abcde123'; // Your shop key
const easyDonate = new EasyDonate(shopKey);

// Get shop info
let shopInfo = await easyDonate.shop();
console.log(shopInfo.name); // Will print the shop name
```

[На русском](README_ru.md)