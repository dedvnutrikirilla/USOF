// Fastify reqs
const Fastify = require('fastify').default,
      FastifyStatic = require('@fastify/static'),
      FastifyFormbody = require('@fastify/formbody'),
      FatsifyJWT = require('@fastify/jwt'),
      FastifyCookies = require('@fastify/cookie');
// Other useful reqs
const Path = require('path');
// Fastify reqs, doesnt work with admijs thangs
const FastifyMultipart = require('@fastify/multipart');
// const names
const PORT = 8888,
      CURRENTDIR = __dirname;
// db parts
const DataBase = require('./utils/db.js'),
      db = new DataBase();
//
// passwords: 
// f51694f010cbf3e0e9cd94cc9fe410961533eeab16429d8c30fb359becfa4451be1a73680679eae59d3c97aaf7f35547774f4ec3de7584654871d19e2affa004
// 8a14a84c8f61b4e4a50c23ccddea364c775197cd6daaccbe2b21ba6dcf21d2f2b301353769cdbcf24ba897427b1f9c8d498d70c7da3e8dae1ab4a24593b84e08
// 33ec1df3e86fc8731117107cf4be89be907804352a30e7a1a2bbdce9ca3b8538b45f954a8217bfdb4bcf6da96b1dd55ca1f5110edf5a9537fdf5d4f88c235d77
//console.log(hashPassword('300buks'))
//console.log(hashPassword('moderpass'))
//console.log(hashPassword('sosiBebru'))
//

const server = Fastify({
    logger: false,
    maxParamLength: 1000 
});
server.register(FastifyCookies, {
    secret: 'my-secret',
    hook: 'onRequest'
});
server.register(FastifyFormbody);
server.register(FastifyMultipart);
server.register(FastifyStatic, {
    root: Path.join(CURRENTDIR, 'public')
});
server.register(FatsifyJWT, require('./utils/jwtConfig.json').loginToken);

// decorators
server.decorateReply('sendAuthToken', function (id, login, role = 'user') {
    console.log('LOG: token for: ' + login);
    const AuthToken = server.jwt.sign({id:id, login:login, role:role});
    console.log('LOG: AuthToken:' + AuthToken);
    this.status(200)
    .setCookie('AuthToken', AuthToken, {path: '/'})
    .setCookie('login', login, {path: '/'})
    .setCookie('role', role, {path: '/'});
});
// Hooks
server.addHook('onRequest', function(request, reply, done) {
    request.db = db;
    request.jwt = server.jwt;
    done();
});

// vvv ONLY FOR DEV PURPOSE
server.addHook('onRequest', function(request, reply, done) {
    if (request.url.includes('admin')){
        console.log('LOG: HOOK: URL: admin')
        done();
    }
    done();
});
// ^^^ ONLY FOR DEV PURPOSE

server.addHook('onRequest', function(request, reply, done) {
    if(!request.cookies.AuthToken)
        done();
    try {
        server.jwt.verify(request.cookies.AuthToken, (err, payload)=> {
            request.user = {
                id: payload.id,
                login: payload.login,
                role: payload.role
            };
        });
    } catch (error) {
        // TODO LIST
        //
        // 0: cout
        // 1: Nothing
        // 2: NOTHING
        // 3: absolutely nothing
        // 4: le me think.... nothin
    }
    done();
});
// routes
server.register(require('./routes/routesAuth.js'));     // Auth
server.register(require('./routes/routesUser.js'));     // User
server.register(require('./routes/routesPost.js'));     // Posts
server.register(require('./routes/routesCateg.js'));    // Categories
server.register(require('./routes/routesComms.js'));    // Commentts

// init
const init = async function() {
    server.listen({port: PORT}, function(err, adres){
        if(err) {
            console.log(err);
            process.exit(1);
        }
    });
}
init();
