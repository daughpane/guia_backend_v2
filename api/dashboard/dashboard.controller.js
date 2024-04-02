const {     
    getDashboardTotalArtworksCountByAdminIdService,
    getDashboardVisitorsLast24HByAdminIdService,
    getDashboardMostVisitedArtworksByAdminIdService,
    getDashboardMostCrowdedSectionsByAdminIdService
} = require("./dashboard.service")

const getDashboardController = async (req, res, client) => {
    try{
        const { admin_id } = req.query;

        const totalArtworks = await getDashboardTotalArtworksCountByAdminIdService(client, admin_id);
        const visitorsLast24H = await getDashboardVisitorsLast24HByAdminIdService(client, admin_id);
        const mostVisitedArtworks = await getDashboardMostVisitedArtworksByAdminIdService(client, admin_id);
        const mostCrowdedSections = await getDashboardMostCrowdedSectionsByAdminIdService(client, admin_id);

        const result = {
            artworks_count: totalArtworks.rows.length > 0 ? totalArtworks.rows[0].artworks_count : "0",
            visitors_count: visitorsLast24H.rows.length > 0 && visitorsLast24H.rows[0].visitors_count
                ? visitorsLast24H.rows[0].visitors_count
                : "0",
            popular_artworks: mostVisitedArtworks.rows.length > 0
                ? mostVisitedArtworks.rows.map(row => row.art_id_id)
                : "0",
            popular_sections: mostCrowdedSections.rows.length > 0
                ? mostCrowdedSections.rows.map(row => row.section_id)
                : "0"
        };

        res.send({dashboard: result});

    }catch (err) {
        console.error('Internal Server Error', err);
        res.status(500).send({detail: "Internal Server Error"})
    }
}

module.exports = {
    getDashboardController
}