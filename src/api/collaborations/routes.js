const routes = (handler,auth) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollaborationHandler,
    options: {
      auth: auth,
    },  
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollaborationHandler,
    options: {
      auth: auth,
    },  
  },
];
 
module.exports = routes;
