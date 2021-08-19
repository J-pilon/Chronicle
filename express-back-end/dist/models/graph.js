const getGraphByUserId = (userId, params) => {
  const { type, startDate, endDate } = params;
  const queryParams = [userId];
  let queryStart = 'SELECT mood, ';
  let queryMid = ' FROM entries WHERE user_id = $1 AND mood IS NOT NULL ';
  let queryEnd = '';
  if (type === 'line') {
      queryStart += `TO_CHAR(date_created, 'YYYY-MM-DD') as date`;
      queryEnd = 'ORDER BY date_created';
  }
  if (type === 'pie') {
      queryStart += 'count(*) as entries';
      queryEnd = 'GROUP BY mood';
  }
  if (startDate) {
      queryParams.push(startDate);
      queryMid += ` AND date_created >= $${queryParams.length}`;
  }
  if (endDate) {
      queryParams.push(endDate);
      queryMid += ` AND date_created <= $${queryParams.length}`;
  }
  const query = queryStart + queryMid + queryEnd;
  return pool.query(query, queryParams);
};