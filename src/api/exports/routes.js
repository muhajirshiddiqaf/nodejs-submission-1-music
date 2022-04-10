const routes = (handler,auth) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postExportPlaylistsHandler,
    options: {
      auth: auth,
    },
  },
];
 
module.exports = routes;
