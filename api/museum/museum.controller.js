const { getMuseumService } = require('./museum.service')
const getMuseumController = async (req, res, client) => {
    try {
        const { museum_id } = req.query;

        const result = await getMuseumService(client, museum_id)

        return res.status(200).send({museum: result.rows});
    } catch (err) {
        console.error('Error executing query', err);
        return res.status(500).send({detail:"Internal server error."});
    }
}

module.exports = {
    getMuseumController
}