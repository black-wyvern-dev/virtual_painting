const {colorData, curIndex} = require('../../globaldata')

function roomController(){
    return {
       async index(req, res) {
            let resData = {};
            if (req.session.projectid == undefined || req.session.extofbackground == undefined) res.redirect('/photo');
            
            // const result = await Resource.getResource();
            // if(result.result) resData["resource"] = result.result;
            resData["stepInfo"] = [
                {current: 'enabled', allow: 'enabled'},
                {current: 'enabled', allow: 'enabled'},
                {current: 'current', allow: 'enabled'},
            ];
            resData["colorData"] = colorData;
            resData["curIndex"] = curIndex;
            resData["roomPhoto"] = req.session.projectid + req.session.extofbackground;

            resData['isAdmin'] = false;
            res.render('room', resData);
        }
    }
}
module.exports = roomController;