const mapDBToModel = ({ 
    id,
    name,
    year,
    songs
  }) => ({
    id,
    name,
    year,
    songs
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
  