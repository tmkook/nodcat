/**
 * express application
 * router = express();
 *
 * docs examples:
 * https://www.expressjs.com.cn/5x/api.html#app
 *
 * router.controller(string controller,string action)
 */
const { router } = require('nodcat');

//...
router.get('/', router.controller('web/welcome_controller', 'index'));