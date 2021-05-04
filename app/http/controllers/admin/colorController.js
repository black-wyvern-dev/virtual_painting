const fs = require('fs');
const {curIndex, getPassword, setPassword} = require('../../../globaldata');
const products = require('../../../methods/products');

let draft;

function colorController(){
    return {
       async index(req, res) {
            let resData = {};
        
            resData['stepInfo'] = [
                {current: 'enabled', allow: 'enabled'},
                {current: 'current', allow: 'enabled'},
                {current: 'enabled', allow: 'enabled'},
            ];
            resData['curIndex'] = curIndex;
            
            resData['isAdmin'] = true;

            resData['productList'] = [];
            if (req.session.authonticated == undefined) {
                res.render('admin/login', resData);
                return;
            }

            const productlist = await products.getProductList({});
            resData['productList'] = productlist.result;
            res.render('admin/color', resData);
        },

        async login(req, res) {
            if (req.body.password == getPassword()) {
                req.session.authonticated = true;
                req.session.save();
                res.status(200).send();
                return;
            };
            res.status(401).send();
         },

         async reset(req, res) {
            let resData = {};
        
            resData['stepInfo'] = [
                {current: 'enabled', allow: 'enabled'},
                {current: 'current', allow: 'enabled'},
                {current: 'enabled', allow: 'enabled'},
            ];
            resData['curIndex'] = curIndex;
            
            resData['isAdmin'] = true;

            resData['productList'] = [];
            if (req.session.authonticated == undefined) {
                res.render('admin/login', resData);
                return;
            }

            res.render('admin/reset', resData);
        },

        async passwordChange(req, res) {
            if (req.session.authonticated == undefined) {
                res.status(401).send();
                return;
            }
            setPassword(req.body.password);
            console.log('Password changed');
            res.status(200).send();
        },

        async upload(req, res) {
            try {
                if(!req.files) {
                    console.log('Error: File must be supplied while uploading.')
                    res.status(403).send ({message: 'Error: Select the upload file.'});
                } else {
                    //Use the name of the input field (i.e. 'file') to retrieve the uploaded file
                    let file = req.files.file;
                    
                    //Use the mv() method to place the file in upload directory (i.e. 'uploads')
                    const extIndex = file.name.lastIndexOf('.');
                    let url = req.url.substring(13);
                    const now = new Date();
                    let type = url.split('?')[0], oldfilename = url.split('?')[1], filename = now.getTime();
                    if (oldfilename && (oldfilename.indexOf('/data/colors/') == -1 && oldfilename.indexOf('/data/patterns/') == -1  || oldfilename.indexOf('..') != -1)) {
                        console.log('Error occured while upload :', 'Not allowed file path.');
                        res.status(500).end({message: 'Not allowed file path.'});
                        return;
                    }
                    if (oldfilename)
                        fs.unlink('./public' + oldfilename, err => {
                            if(err) console.error(`Error occured while delete image files ${err}`);
                        });
                    if (draft)
                        fs.unlink('./public' + draft, err => {
                            if(err) console.error(`Error occured while delete image files ${err}`);
                        });

                    if (type == 'colors') filename = '/data/colors/' + filename + file.name.substring(extIndex);
                    else if (type == 'patterns') filename = '/data/patterns/' + filename + file.name.substring(extIndex);
                    file.mv('./public' + filename);
        
                    //flash response
                    console.log('Upload image success.');
                    draft = filename;
                    res.status(200).send({result: filename});
                }
            } catch (err) {
                console.log('Error occured while upload :', err);
                res.status(500).end({message: err});
            }
        },

        async resetUpload(req, res) {
            const src = req.body.draftsrc;
            if(!src) {
                console.log('Error: File must be supplied while uploading.')
                res.status(403).send ({message: 'Error: Select the upload file.'});
            } else {
                if (src.indexOf('/data/colors/') == -1 && src.indexOf('/data/patterns/') == -1  || src.indexOf('..') != -1) {
                    console.log('Error occured while upload :', 'Not allowed file path.');
                    res.status(500).end({message: 'Not allowed file path.'});
                    return;
                }
                if (src)
                    fs.unlink('./public' + src, err => {
                        if(err) console.error(`Error occured while delete image files ${err}`);
                    });
    
                //flash response
                console.log('Reset Draft Upload success.');
                res.status(200).send({result: true});
            }
        },

        async addProduct(req, res) {
            console.log('add prodcut request is received.');
            let {title, src, type} = req.body;
            if (src.indexOf(type) == -1) {
                var strList = src.split('/');
                for ( i in strList ) {
                    if (strList[i] == 'colors' || strList[i] == 'patterns') {strList[i] = type;break;}
                }
                var newStr = strList.join('/');
                fs.copyFile('./public' + src, './public' + newStr, (err) => {
                    if (err) console.log(err);
                    console.log('src was copied to newSrc');
                });
                src = newStr;
            }
            const result =  await products.addProduct({title, src, type});
            if ( result ) {
                console.log('Product add succeed');
                draft = undefined;
                res.status(200).send ({result: true});
            } else {
                console.log('Error occured while add product.')
                res.status(403).send ({message: 'Could not add product.'});
            }
        },

        async updateProduct(req, res) {
            console.log('update product request is received.');
            let {old_title, title, src, type} = req.body;
            if (src.indexOf(type) == -1) {
                var strList = src.split('/');
                for ( i in strList ) {
                    if (strList[i] == 'colors' || strList[i] == 'patterns') {strList[i] = type;break;}
                }
                var newStr = strList.join('/');
                fs.copyFile('./public' + src, './public' + newStr, (err) => {
                    if (err) console.log(err);
                    else console.log('src was copied to newSrc');
                });
                src = newStr;
            }
            const result =  await products.updateProduct({old_title, title, src, type});
            if ( result ) {
                console.log('Product update succeed');
                draft = undefined;
                res.status(200).send ({result: true});
            } else {
                console.log('Error occured while update product.')
                res.status(403).send ({message: 'Could not update product.'});
            }
        },

        async deleteProduct(req, res) {
            console.log('delete product request is received.');
            let {title} = req.body;
            const result =  await products.deleteProduct({title});
            if ( result ) {
                console.log('Product delete succeed');
                draft = undefined;
                res.status(200).send({result: true});
            } else {
                console.log('Error occured while delete product.')
                res.status(403).send ({message: 'Could not delete product.'});
            }
        }
    }
}
module.exports = colorController;