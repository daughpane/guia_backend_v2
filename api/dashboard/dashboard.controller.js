const {     
    getDashboardTotalArtworksCountByAdminIdService,
    getDashboardVisitorsLast24HByAdminIdService,
    getDashboardMostVisitedArtworksByAdminIdService,
    getDashboardMostCrowdedSectionsByAdminIdService
} = require("./dashboard.service")

const {
  getPresignedUrls
} = require("../../utils/amazon")
const getDashboardController = async (req, res, client) => {
    try{
        const { admin_id } = req.query;
        if (req.admin_id != admin_id) {
          return res.status(401).send({detail: "Admin does not have access to this action.", dev_message:"Logged in account and Admin ID do not match."})
        }
        const totalArtworks = await getDashboardTotalArtworksCountByAdminIdService(client, admin_id);
        const visitorsLast24H = await getDashboardVisitorsLast24HByAdminIdService(client, admin_id);
        const mostVisitedArtworks = await getDashboardMostVisitedArtworksByAdminIdService(client, admin_id);
        const mostCrowdedSections = await getDashboardMostCrowdedSectionsByAdminIdService(client, admin_id);
      
        
        const popularArtworks = await Promise.all(
          mostVisitedArtworks.rows.map(async (row) => {
            const presignedUrl = await getPresignedUrls(row.image_thumbnail);
          return { ...row, image_thumbnail: presignedUrl };
        }));

        const result = {
            artworks_count: totalArtworks.rows.length > 0 ? totalArtworks.rows[0].artworks_count : "0",
            visitors_count: visitorsLast24H.rows.length > 0 && visitorsLast24H.rows[0].visitors_count
                ? visitorsLast24H.rows[0].visitors_count
                : "0",
            popular_artworks: popularArtworks.length > 0
                ? popularArtworks
                : [],
            popular_sections: mostCrowdedSections.rows.length > 0
                ? mostCrowdedSections.rows
                : []
        };

        return res.status(200).send(result)

    }catch (err) {
        console.error('Internal Server Error', err);
        res.status(500).send({detail: "Internal Server Error"})
    }
}

module.exports = {
    getDashboardController
}