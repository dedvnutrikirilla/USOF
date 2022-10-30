const Fastify = require('fastify').default;

// Adminjs reqs
const {initAdminModels} = require('./admin/adminjsTC.js');
const PORT = 8887,
      CURRENTDIR = __dirname;
const DataBase = require('./utils/db.js'),
      db = new DataBase();
//
const server = Fastify({
    logger: false,
    maxParamLength: 1000 
});

const init = async function() {
    await initAdminModels(db.sequelize, server);
    server.listen({port: PORT}, function(err, adres){
        if(err) {
            console.log(err);
            process.exit(1);
        }
    });
}
init();