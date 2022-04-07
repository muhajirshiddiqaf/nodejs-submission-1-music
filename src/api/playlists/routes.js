const routes = (handler,auth) => [
    {
      method: 'POST',
      path: '/playlists',
      handler: handler.postPlaylistHandler,
      options: {
        auth: auth,
      },  
    },
    {
      method: 'GET',
      path: '/playlists',
      handler: handler.getPlaylistsHandler,
      options: {
        auth: auth,
      },  
    },
    {
      method: 'DELETE',
      path: '/playlists/{id}',
      handler: handler.deletePlaylistByIdHandler,
      options: {
        auth: auth,
      },
    },
    {
      method: 'POST',
      path: '/playlists/{id}/songs',
      handler: handler.postPlaylistSongHandler,
      options: {
        auth: auth,
      },  
    },
    {
      method: 'GET',
      path: '/playlists/{id}/songs',
      handler: handler.getPlaylistDetailByIdHandler,
      options: {
        auth: auth,
      },  
    },
    {
      method: 'DELETE',
      path: '/playlists/{id}/songs',
      handler: handler.deleteSongPlaylistByIdHandler,
      options: {
        auth: auth,
      },  
    },
    {
      method: 'GET',
      path: '/playlists/{id}/activities',
      handler: handler.getPlaylistsActivities,
      options: {
        auth: auth,
      },  
    },
  ];
   
  module.exports = routes;
  