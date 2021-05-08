const products = require('../../methods/products');

function photoController(){
    return {
       async index(req, res) {
            let resData = {};
            req.session.extofbackground = undefined;
            req.session.authonticated = undefined;
            req.session.projectid = Math.ceil(Math.random() * 100000);
            req.session.savedData = [];
            if (req.query.product_id) {
                const product = await products.getProductList({id_filter: req.query.product_id});
                if (product.result && product.result.length > 0) req.session.savedData = product.result;
            }
            resData['stepInfo'] = [
                {current: 'current', allow: 'enabled'},
            ];
            if (req.session.extofbackground != undefined) resData['stepInfo'].push({current: 'enabled', allow: 'enabled'});
            else resData['stepInfo'].push({current: '', allow: ''});
            resData['stepInfo'].push({current: '', allow: ''});
            resData['savedData'] = [];

            resData['isAdmin'] = false;
            res.render('photo', resData);
        },
        
        async photo(req, res) {
            let resData = {};
            
            if ( req.session.projectid == undefined )req.session.projectid = Math.ceil(Math.random() * 100000);
            if ( req.session.savedData == undefined ) resData['savedData'] = [];
            else resData['savedData'] = req.session.savedData;
            
            resData['stepInfo'] = [
                {current: 'current', allow: 'enabled'},
            ];
            if (req.session.extofbackground != undefined) resData['stepInfo'].push({current: 'enabled', allow: 'enabled'});
            else resData['stepInfo'].push({current: '', allow: ''});
            resData['stepInfo'].push({current: '', allow: ''});

            resData['isAdmin'] = false;
            res.render('photo', resData);
        }, 

        async saveData(req, res) {
            let {savedProductData} = req.body;
            
            req.session.savedData = savedProductData;
            res.status(200).send ({result: true});
        }, 
    }
}
module.exports = photoController;