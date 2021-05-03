
function photoController(){
    return {
       async index(req, res) {
            let resData = {};
            req.session.extofbackground = undefined;
            req.session.projectid = Math.ceil(Math.random() * 100000);
            // const result = await Resource.getResource();
            // if(result.result) resData['resource'] = result.result;
            resData['stepInfo'] = [
                {current: 'current', allow: 'enabled'},
            ];
            if (req.session.extofbackground != undefined) resData['stepInfo'].push({current: 'enabled', allow: 'enabled'});
            else resData['stepInfo'].push({current: '', allow: ''});
            resData['stepInfo'].push({current: '', allow: ''});

            resData['isAdmin'] = false;
            res.render('photo', resData);
        },
        
        async photo(req, res) {
            let resData = {};
            
            if ( req.session.projectid == undefined )req.session.projectid = Math.ceil(Math.random() * 100000);
            // const result = await Resource.getResource();
            // if(result.result) resData['resource'] = result.result;
            resData['stepInfo'] = [
                {current: 'current', allow: 'enabled'},
            ];
            if (req.session.extofbackground != undefined) resData['stepInfo'].push({current: 'enabled', allow: 'enabled'});
            else resData['stepInfo'].push({current: '', allow: ''});
            resData['stepInfo'].push({current: '', allow: ''});

            resData['isAdmin'] = false;
            res.render('photo', resData);
        }, 

    }
}
module.exports = photoController;