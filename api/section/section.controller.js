const {getSectionService } = require("./section.service")

const getSectionController = async (req, res, client) => {
    try{
        const { museum_id, section_id } = req.query;
        
        if (!museum_id) {
            res.status(400).send({detail:"The Museum ID is Required :)"})
        }

        const result = await getSectionService(client, museum_id, section_id)

        res.send({section: result.rows});
    }catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error');    
    }
}

module.exports = {
    getSectionController
}