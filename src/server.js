require('dotenv').config();

const ClientError = require('./exceptions/ClientError');

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');


// albums
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');

// songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');
 
// Exports
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

// uploads
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

// cache
const CacheService = require('./services/redis/CacheService');


const init = async () => {
  const cacheService = new CacheService();
  const collaborationsService = new CollaborationsService();
  const albumsService = new AlbumsService(cacheService);
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });


  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);
 

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('music_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });  

  await server.register([{
    plugin: albums,
    options: {
      service: albumsService,
      cacheService,
      validator: AlbumsValidator,
      auth: 'music_jwt',
    },
  },
  {
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  },
  {
    plugin: users,
    options: {
      service: usersService,
      validator: UsersValidator,
    },
  },
  {
    plugin: authentications,
    options: {
      authenticationsService,
      usersService,
      tokenManager: TokenManager,
      validator: AuthenticationsValidator,
    },
  },
  {
    plugin: playlists,
    options: {
      service: playlistsService,
      validator: PlaylistsValidator,
      auth: 'music_jwt',
    },    
  },
  {
    plugin: collaborations,
    options: {
      collaborationsService,
      playlistsService,
      usersService,
      validator: CollaborationsValidator,
      auth: 'music_jwt',
    },
  },
  {
    plugin: _exports,
    options: {
      ProducerService,
      playlistsService,
      validator: ExportsValidator,
      auth: 'music_jwt',
    },
  },
  {
    plugin: uploads,
    options: {
      service: storageService,
      albumsService,
      validator: UploadsValidator,
    },
  },
]);
 
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
