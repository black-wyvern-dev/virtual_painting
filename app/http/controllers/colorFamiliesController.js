const { curIndex} = require('../../globaldata')
const products = require('../../methods/products');

function colorFamiliesController(){
    return {
        async index(req, res) {
            let resData = {};
            if (req.session.projectid == undefined || req.session.extofbackground == undefined) return res.redirect('/photo');
            if ( req.session.savedData == undefined ) resData['savedData'] = [];
            else resData['savedData'] = req.session.savedData;
            
            // const result = await Resource.getResource();
            // if(result.result) resData["resource"] = result.result;
            resData["stepInfo"] = [
                {current: 'enabled', allow: 'enabled'},
                {current: 'current', allow: 'enabled'},
            ];
            if (resData['savedData'].length > 0) resData['stepInfo'].push({current: 'enabled', allow: 'enabled'});
            else resData['stepInfo'].push({current: '', allow: ''});

            resData["curIndex"] = curIndex;

            resData['isAdmin'] = false;
            const productlist = await products.getProductList({filter: 'colors'});
            let list = productlist.result;
            list.sort((obj1, obj2) => {
                if (obj1.subtype!='3') return 0;
                if (obj2.subtype!='3') return 0;
                const str1 = obj1.title.slice(-3);
                const str2 = obj2.title.slice(-3);
                if (str1 < str2) {
                    return -1;
                }
                if (str1 > str2) {
                    return 1;
                }
                return 0;
            });

            resData['productList'] = list;
            resData['isSubscribed'] = true;
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            return res.render('color_families', resData);
        }
    }
}
module.exports = colorFamiliesController;