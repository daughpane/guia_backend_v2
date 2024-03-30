const {getSectionService } = require("./section.service")

const getSectionController = async (req, res, client) => {
    try{
        const { museum_id, section_id } = req.query;
        
        if (!museum_id) {
            res.status(400).send({detail:"Museum ID is required."})
        }

        const result = await getSectionService(client, museum_id, section_id)

        res.send({section: result.rows});
    }catch (err) {
        console.error('Internal Server Error', err);
        res.status(500).send({detail: "Internal Server Error"});    
    }
}

module.exports = {
    getSectionController
}