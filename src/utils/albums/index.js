const mapDBToModel = ({ 
    id,
    name,
    year,
    songs,
    cover,
  }) => ({
    id,
    name,
    year,
    songs,
    cover
  });
   
  const mapDBToModelSongs = ({ 
    id,
    title,
    performer
  }) => ({
    id,
    title,
    performer
  });

  module.exports = { mapDBToModel,mapDBToModelSongs };
  