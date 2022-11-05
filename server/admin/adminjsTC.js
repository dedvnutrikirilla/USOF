const AdminJS = require('adminjs'),
      AdminJSFastify = require('@adminjs/fastify'),
      AdminJSSequelize = require('@adminjs/sequelize'),
      insertionProtector = require('../utils/insertionProtector.js');
//
const PORT = 8887;

AdminJS.registerAdapter({
    Resource: AdminJSSequelize.Resource,
    Database: AdminJSSequelize.Database,
});

const ValidationError = (property, length) => {
    throw new AdminJS.ValidationError({
        name: {
            message: `${property} must be greater than ${length}`
        }
    }, {
        message: 'AdminJS: Validation Error!'
    });
}

async function initAdminModels(sequelizeInstance, serverInstance) {
    const adminjs = new AdminJS({
        Databases: [sequelizeInstance],
        resources: [
            {// Users
                resource: sequelizeInstance.models.Users,
                options: {
                    properties: {
                        login: {
                            type: 'string',
                            isTitle: true  
                        },
                        password: {
                            type: 'string',
                            isVisible: {
                              list: true, edit: true, filter: false, show: true,
                            }
                        },
                    },
                    actions: {
                        new: {
                            before: (reply) => {
                                const login = reply.payload.login,
                                      password = reply.payload.password,
                                      fullName = reply.payload.fullName,
                                      email = reply.payload.email;
                                //
                                if(!login || login.length < 4)
                                    ValidationError('login', 4);
                                else if(!password || password.length < 6)
                                    ValidationError('password', 6);
                                else if(!fullName || fullName.length < 4)
                                    ValidationError('fullName', 4);
                                try {
                                    insertionProtector({login, password, fullName, email});
                                } catch (error) {
                                    throw new AdminJS.ValidationError({name: {
                                        message: error.errText
                                    }},{message: 'AdminJS: Validation Error!'});
                                }
                                return reply;
                            }
                        }
                    }
                }
            },// Users Ends
            sequelizeInstance.models.Posts,
            sequelizeInstance.models.Categories,
            sequelizeInstance.models.Comments,
            {// Likes
                resource: sequelizeInstance.models.Likes,
                options: {
                    actions: {
                        edit: {isVisible: false},
                        delete: {isVisible: false}
                    }
                }
            },
            {// Likes Posts
                resource: sequelizeInstance.models.LikesPosts,
                options: {
                    listProperties: ['likeId', 'postId'],
                    filterProperties: ['likeId', 'postId'],
                    editProperties: ['likeId', 'postId'],
                    showProperties: ['likeId', 'postId'],
                    actions: {
                        edit: {isVisible: false},
                        delete: {isVisible: false}
                    }
                }
            },
            {// Likes Comments
                resource: sequelizeInstance.models.LikesComments,
                options: {
                    listProperties: ['likeId', 'commentId'],
                    filterProperties: ['likeId', 'commentId'],
                    editProperties: ['likeId', 'commentId'],
                    showProperties: ['likeId', 'commentId'],
                    actions: {
                        edit: {isVisible: false},
                        delete: {isVisible: false}
                    }
                }
            },
            {// Posts Categories
                resource: sequelizeInstance.models.PostsCategories,
                options: {
                    listProperties: ['postId', 'categoryId'],
                    filterProperties: ['postId', 'categoryId'],
                    editProperties: ['postId', 'categoryId'],
                    showProperties: ['postId', 'categoryId'],
                    actions: {
                        edit: {isVisible: false},
                        delete: {isVisible: false}
                    }
                }
            }
        ]
    });

    await AdminJSFastify.buildRouter(adminjs, serverInstance);
    console.log(`AdminJS will start on http://localhost:${PORT}${adminjs.options.rootPath}`);
};

module.exports = {initAdminModels};
