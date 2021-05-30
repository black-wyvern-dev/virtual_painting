
function uploadController(){
    return {
        
       async index(req, res) {
            let resData = {};
            // const result = await Resource.getResource();
            // if(result.result) resData["resource"] = result.result;
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
            resData['isSubscribed'] = true;
            res.render('upload', resData);
        },
    
        async upload(req, res) {
            try {
                if(!req.files) {
                    console.log('Error: File must be supplied while uploading.')
                    res.status(403).send ({message: 'Error: Select the upload file.'});
                } else {
                    //Use the name of the input field (i.e. 'file') to retrieve the uploaded file
                    if ( req.session.projectid == undefined )req.session.projectid = Math.ceil(Math.random() * 100000);
                    let file = req.files.file;
                    
                    //Use the mv() method to place the file in upload directory (i.e. 'uploads')
                    const extIndex = file.name.lastIndexOf('.');
                    const filename = req.session.projectid + file.name.substring(extIndex);
                    req.session.extofbackground = file.name.substring(extIndex);
                    
                    file.mv('./public/data/images/' + filename);
        
                    //flash response
                    console.log('Upload pdf success.');
                    res.status(200).send({result: true});
                }
            } catch (err) {
                console.log('Error occured while upload :', err);
                res.status(500).end({message: err});
            }
        },
    }
}
module.exports = uploadController;