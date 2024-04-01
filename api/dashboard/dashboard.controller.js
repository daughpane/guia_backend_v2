const {getDashboardService } = require("./dashboard.service")

const getDashboardController = async (req, res, client) => {
    try{
        const { admin_id } = req.query;

        const result = await getDashboardService(client, admin_id)

        res.send({dashboard: result});

    }catch (err) {
        console.error('Internal Server Error', err);
        res.status(500).send({detail: "Internal Server Error"})
    }
}

module.exports = {
    getDashboardController
}