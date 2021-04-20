const Resource = require('../../methods/resource')

function roomController(){
    return {
       async index(req, res) {
            let resData = {};
            
            // const result = await Resource.getResource();
            // if(result.result) resData["resource"] = result.result;
            resData["stepInfo"] = [
                {current: 'enabled', allow: 'enabled'},
                {current: 'enabled', allow: 'enabled'},
                {current: 'current', allow: 'enabled'},
            ];

            res.render('room', resData);
        }
    }
}
module.exports = roomController;