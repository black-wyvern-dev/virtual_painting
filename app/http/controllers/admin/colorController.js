const fs = require('fs');
const {colorData, curIndex} = require('../../../globaldata');
const products = require('../../../methods/products');

let draft;

function colorController(){
    return {
       async index(req, res) {
            let resData = {};
        
            // const result = await Resource.getResource();
            // if(result.result) resData["resource"] = result.result;
            resData["stepInfo"] = [
                {current: 'enabled', allow: 'enabled'},
                {current: 'current', allow: 'enabled'},
                {current: 'enabled', allow: 'enabled'},
            ];
            resData["colorData"] = colorData;
            resData["curIndex"] = curIndex;

            res.render('admin/color', resData);
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
            let {title, id, src, type} = req.body;
            if ( await products.addProduct({title, id, src, type}) ) {
                console.log('Product add succeed');
                draft = undefined;
                res.status(200).send ({result: true});
            } else {
                console.log('Error occured while add product.')
                res.status(403).send ({message: 'Could not add product.'});
            }
        }
    }
}
module.exports = colorController;