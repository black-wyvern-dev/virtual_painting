const Products = require('../models/products');

const addProduct = async(data) => {
    if(!data.title || !data.id || !data.type || !data.src) {
        console.log(`Data is undefined in addProduct`);
        return false;
    }

    const product = new Products(data);
    
    const insertInfo = await product.save();
    if (insertInfo) {
        console.log("Product data inserted")  // Success
        return true;
    } else {
        console.log(insertInfo)      // Failure
        return false;
    }
}

const getTipsInfo = async() => {
    try {
        result = await TipsInfo.find({});
        return { result: result, error: ''}
    } catch(e) {
        console.log(`Error while getTipsInfo: ${e.message}`);
        return { result: false, error: e.message};
    }
}

module.exports = {
    addProduct,
    getTipsInfo,
};