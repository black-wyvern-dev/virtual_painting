const {colorData, curIndex} = require('../../globaldata')

function colorController(){
    return {
       async index(req, res) {
            let resData = {};
            if (req.session.projectid == undefined || req.session.extofbackground == undefined) res.redirect('/photo');
        
            // const result = await Resource.getResource();
            // if(result.result) resData["resource"] = result.result;
            resData["stepInfo"] = [
                {current: 'enabled', allow: 'enabled'},
                {current: 'current', allow: 'enabled'},
                {current: 'enabled', allow: 'enabled'},
            ];
            resData["colorData"] = colorData;
            resData["curIndex"] = curIndex;

            res.render('color', resData);
        }
    }
}
module.exports = colorController;