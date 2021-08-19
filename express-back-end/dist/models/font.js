const getFontByFontId = (id) => {
  const query = `SELECT * FROM fonts
WHERE id = $1;`;
  const queryParams = [id];
  return pool.query(query, queryParams);
};

const getFonts = () => {
  const query = 'SELECT * FROM fonts';
  return pool.query(query);
};