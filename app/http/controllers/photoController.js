const products = require('../../methods/products');
const fs = require('fs');

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
        
        async library(req, res) {
            let params = req.url.split('/');
            if (params[1] != 'library') {
                res.status('404').end();
                return;
            }

            let query;
            if (params.length == 2) query = params[1] + '/1';
            else {
                if (isNaN(params[2]) || parseInt(params[2]) > 8 || parseInt(params[2]) < 0) {
                    res.status('404').end();
                    return;
                }

                query = params[1] + '/' + params[2];
            }
            
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
            resData['libraries'] = [];
            resData['isAdmin'] = false;

            let directory = __dirname + '/../../../public/img/' + query + '/';
            fs.readdir(directory, (err, files) => {
                if(err) 
                {
                    console.error(`Error occured while read library files ${err}`);
                    res.redirect('/photo');
                    return;
                }
                else {
                    let nameList = [];
                    for (file_name of files) {
                        const extIndex = file_name.lastIndexOf('.');
                        const filename = file_name.substring(0, extIndex);
                        nameList.push(filename);
                    }

                    resData['libraries'] = files;
                    resData['namelist'] = nameList;
                    console.log('Load all library files success.');
                    
                    console.log(resData);
                    res.render('library', resData);
                }
            });
            // let file = req.files.file;
            
            // //Use the mv() method to place the file in upload directory (i.e. 'uploads')
            // const extIndex = file.name.lastIndexOf('.');
            // const filename = req.session.projectid + file.name.substring(extIndex);
            // req.session.extofbackground = file.name.substring(extIndex);
            
            // file.mv('./public/data/images/' + filename);

            // //flash response
            // console.log('Upload pdf success.');
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