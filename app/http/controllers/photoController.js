const Resource = require('../../methods/resource')

function photoController(){
    return {
       async index(req, res) {
            let resData = {};
            
            // const result = await Resource.getResource();
            // if(result.result) resData["resource"] = result.result;
            resData["stepInfo"] = [
                {current: 'current', allow: 'enabled'},
                {current: 'enabled', allow: 'enabled'},
                {current: '', allow: ''},
            ];

            res.render('photo', resData);
        }
    }
}
module.exports = photoController;