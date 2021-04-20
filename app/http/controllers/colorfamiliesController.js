const Resource = require('../../methods/resource')

function colorFamiliesController(){
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

            res.render('color_families', resData);
        }
    }
}
module.exports = colorFamiliesController;