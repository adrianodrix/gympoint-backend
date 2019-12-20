export default (req, res) => {
  return res.status(404).json({ error: { message: 'Method not found' } });
};
