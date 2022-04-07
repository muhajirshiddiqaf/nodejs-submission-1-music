const mapDBToModel = ({ 
    id,
    name,
    username
  }) => ({
    id,
    name,
    username
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
  