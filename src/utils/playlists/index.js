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
    
  const mapDBToModelActivities = ({ 
    username,
    title,
    action,
    time
  }) => ({
    username,
    title,
    action,
    time
  });
    

  module.exports = { mapDBToModel,mapDBToModelSongs,mapDBToModelActivities };
  