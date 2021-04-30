const mongoose = require('mongoose');
const {getProductList} = require('./app/methods/products');

//Database Connection
const url = 'mongodb://192.168.104.56:8003/virtual-painting';
// const url = 'mongodb://localhost:8003/virtual-painting';
// const url = 'mongodb+srv://admin:%21QAZxsw2@puzzle.am9gf.mongodb.net/Horse_racing?authSource=admin&replicaSet=atlas-h19s4z-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected..');
    main();
}).catch(err => {
    console.log('Connection failed..');
})

async function main() {
    // let result = await connection.dropDatabase();
    // console.log('database droped : ', result);
    console.log(await getProductList({filter: 'colors'}));

    await connection.close();
};