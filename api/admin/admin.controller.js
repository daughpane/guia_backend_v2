const adminLoginController = async (req, res, client) => {
  try {
    res.send({status: "yeah"})
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
}

module.exports = {
  adminLoginController
}