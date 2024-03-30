const {getDashboardService } = require("./dashboard.service")

const getDashboardController = async (req, res, client) => {
    try{
        const { is_deleted, museum_id } = req.query;

        const result = await getDashboardService(client, is_deleted, museum_id)

        res.send({dashboard: result.rows});

    }catch (err) {
        console.error('Internal Server Error', err);
        res.status(500).send({detail: "Internal Server Error"})
    }
}

module.exports = {
    getDashboardController
}