module.exports = (req, res, next) => {
  if (req.path === '/heroes' && req.method === 'GET' && req.query.name_like) {
    const nameLike = req.query.name_like.toLowerCase();
    const db = req.app.db;
    const filteredHeroes = db.heroes.filter(hero =>
      hero.name.toLowerCase().includes(nameLike)
    );
    res.status(200).jsonp(filteredHeroes);
  } else {
    next();
  }
};
