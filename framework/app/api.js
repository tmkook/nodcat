/**
 * express application
 * router = express();
 *
 * docs examples:
 * https://www.expressjs.com.cn/5x/api.html#app
 *
 * app.controller(string controller,string action)
 */
const { router } = require('nodcat');

//...
router.get('/api/welcome', router.controller('api/welcome_controller', 'index'));