const routes = (handler,auth) => [
    {
      method: 'POST',
      path: '/albums',
      handler: handler.postAlbumHandler,
    },
    {
      method: 'GET',
      path: '/albums/{id}',
      handler: handler.getAlbumByIdHandler,
    },
    {
      method: 'PUT',
      path: '/albums/{id}',
      handler: handler.putAlbumByIdHandler,
    },
    {
      method: 'DELETE',
      path: '/albums/{id}',
      handler: handler.deleteAlbumByIdHandler,
    },
    {
      method: 'POST',
      path: '/albums/{id}/likes',
      handler: handler.postAlbumLikeHandler,
      options: {
        auth: auth,
      },  
    },
    {
      method: 'GET',
      path: '/albums/{id}/likes',
      handler: handler.getAlbumLikeHandler,
    },
  ];
   
  module.exports = routes;
  