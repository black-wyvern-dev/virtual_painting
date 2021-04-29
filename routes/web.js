const roomController = require('../app/http/controllers/roomController');
const colorController = require('../app/http/controllers/colorController');
const colorFamiliesController = require('../app/http/controllers/colorFamiliesController');
const colorCollectionController = require('../app/http/controllers/colorCollectionController');
const adminController = require('../app/http/controllers/admin/colorController');
const photoController = require('../app/http/controllers/photoController');
const uploadController = require('../app/http/controllers/uploadController');

function initRoute(app) {
    //Customer Routes
    app.get('/color', colorController().index)
    app.get('/families', colorFamiliesController().index)
    app.get('/collection', colorCollectionController().index)
    app.get('/', photoController().index)
    app.get('/photo', photoController().photo)
    app.get('/upload', uploadController().index)
    app.get('/room', roomController().index)

    //Admin Routes
    app.get('/admin', adminController().index)
    app.post('/add_product', adminController().addProduct)
    app.post('/reset_upload', adminController().resetUpload)

    //File upload and download
    app.post('/file_upload', uploadController().upload);
    app.post('/image_upload*', adminController().upload);
}




module.exports = initRoute;