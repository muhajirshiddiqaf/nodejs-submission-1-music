const Joi = require('joi');
const currentYear = new Date().getFullYear();
 
const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});
 
const PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PlaylistPayloadSchema,PlaylistSongPayloadSchema };
