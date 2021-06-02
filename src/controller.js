export const createSite = async (req, res) => {
  try {
    res.json({ message: 'OK' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
