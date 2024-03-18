const { getAllMuseumService } = require('./museum.service')
const getAllMuseumController = async (req, res, client) => {
    try {
        const { museum_id } = req.query;

        const result = await getAllMuseumService(client, museum_id)

        res.send({museum: result.rows});
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error');
    }
}

module.exports = {
    getAllMuseumController
}