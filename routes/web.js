// const homeController = require('../app/http/controllers/homeController');
// const cardsController = require('../app/http/controllers/cardsController');
// const oddsController = require('../app/http/controllers/oddsController');
// const tipsController = require('../app/http/controllers/tipsController');
const authController = require('../app/http/controllers/authController');
// const adminSettingController = require('../app/http/controllers/admin/settingController');

//Middelwares
// const guest = require('../app/http/middlewares/guest');
// const auth = require('../app/http/middlewares/auth');
// const admin = require('../app/http/middlewares/admin');
// const settingController = require('../app/http/controllers/admin/settingController');


function initRoute(app) {
    app.get('/', authController().login)
    // app.get('/login', authController().login)
    // app.get('/register', authController().login)
    // app.post('/login', authController().postLogin)
    // app.post('/register', authController().postRegister)
    // app.post('/logout', authController().logout);

    //Customer Routes
    // app.get('/home', auth, homeController().index)
    // app.get('/cards', auth, cardsController().index)
    // app.get('/odds', auth, oddsController().index)
    // app.get('/tips', auth, tipsController().index)

    //Admin Routes
    // app.get('/admin/setting', admin, adminSettingController().index);

    //File upload and download
    // app.post('/admin/setting/pdf_upload', settingController().upload);
}




module.exports = initRoute;