require('dotenv').config();

const ClientError = require('./exceptions/ClientError');

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');


const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');


const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
 
  await server.register([{
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator,
    },
  }
  ,{
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  }]  
  );
 
  server.ext('onPreResponse', (request, h) => {

      const { response } = request;

      if (response instanceof ClientError) {
    
        const newResponse = h.response({
    
          status: 'fail',
    
          message: response.message,
    
        });
    
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (response && response.isBoom && response.isServer) {

        const error = response.error || response.message;
        server.log([ 'error' ], error);
        console.log(error);
        const newResponse = h.response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.',
        });
        newResponse.code(500);
        return newResponse;
      }

        
      return response.continue || response;
  });
  
  
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
 
init();
