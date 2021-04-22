const roomController = require('../app/http/controllers/roomController');
const colorController = require('../app/http/controllers/colorController');
const colorFamiliesController = require('../app/http/controllers/colorFamiliesController');
const colorCollectionController = require('../app/http/controllers/colorCollectionController');
const photoController = require('../app/http/controllers/photoController');
const uploadController = require('../app/http/controllers/uploadController');
// const authController = require('../app/http/controllers/authController');
// const adminSettingController = require('../app/http/controllers/admin/settingController');

//Middelwares
// const guest = require('../app/http/middlewares/guest');
// const auth = require('../app/http/middlewares/auth');
// const admin = require('../app/http/middlewares/admin');
// const settingController = require('../app/http/controllers/admin/settingController');


function initRoute(app) {
    // app.get('/', authController().login)
    // app.get('/login', authController().login)
    // app.get('/register', authController().login)
    // app.post('/login', authController().postLogin)
    // app.post('/register', authController().postRegister)
    // app.post('/logout', authController().logout);

    //Customer Routes
    // app.get('/home', homeController().index)
    app.get('/color', colorController().index)
    app.get('/families', colorFamiliesController().index)
    app.get('/collection', colorCollectionController().index)
    app.get('/', photoController().index)
    app.get('/photo', photoController().photo)
    app.get('/upload', uploadController().index)
    app.get('/room', roomController().index)
    // app.get('/tips', tipsController().index)

    //Admin Routes
    // app.get('/admin/setting', admin, adminSettingController().index);

    //File upload and download
    app.post('/file_upload', uploadController().upload);
}




module.exports = initRoute;