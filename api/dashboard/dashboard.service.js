const getDashboardTotalArtworksCountByAdminIdService = async (client, admin_id) => {
    let query = `
    SELECT COUNT(*) AS artworks_count
        FROM public.guia_db_admin ad
        INNER JOIN public.guia_db_section s ON ad.museum_id_id = s.museum_id_id
        INNER JOIN public.guia_db_artwork a ON s.section_id = a.section_id_id
        WHERE a.is_deleted = FALSE 
    `;

    if (admin_id) {
        query+= `AND ad.user_id = $1`
      }

    return await client.query(query, admin_id ? [admin_id]: []);

}

const getDashboardVisitorsLast24HByAdminIdService = async (client, admin_id) => {
    let query = `
    SELECT COUNT(*) AS visitors_count
        FROM public.guia_db_visitor v
        INNER JOIN public.guia_db_admin ad ON v.museum_id_id = ad.museum_id_id
        WHERE v.visited_on >= NOW() - INTERVAL '24 HOURS' 
    `

    if (admin_id) {
        query+= `AND ad.user_id = $1;`
      }   

    return await client.query(query, admin_id ? [admin_id]: []);
}

const getDashboardMostVisitedArtworksByAdminIdService = async (client, admin_id) => {
    let query = `
    SELECT av.art_id_id, count(*) AS visit_count
    FROM public.guia_db_artworkvisits av
    INNER JOIN public.guia_db_artwork a ON av.art_id_id = a.art_id
    INNER JOIN public.guia_db_section s ON a.section_id_id = s.section_id
    INNER JOIN public.guia_db_admin ad ON s.museum_id_id = ad.museum_id_id
    WHERE art_visited_on >= NOW() - INTERVAL '24 HOURS' 
    `

    if (admin_id) {
        query+= `AND ad.user_id = $1`
      }   

    query += ` GROUP BY av.art_id_id
    ORDER BY visit_count DESC
    LIMIT 3;`

    return await client.query(query, admin_id ? [admin_id]: []);
}

const getDashboardMostCrowdedSectionsByAdminIdService = async (client, admin_id) => {

    let query = `
    SELECT s.section_id, COUNT(*) AS visit_count
    FROM public.guia_db_admin ad
    INNER JOIN public.guia_db_section s ON ad.museum_id_id = s.museum_id_id
    INNER JOIN public.guia_db_artwork a ON s.section_id = a.section_id_id
    INNER JOIN public.guia_db_artworkvisits av ON a.art_id = av.art_id_id
    WHERE av.art_visited_on >= NOW() - INTERVAL '24 HOURS' 
    `

    if (admin_id) {
        query+= `AND ad.user_id = $1`
      }   

    query += ` GROUP BY s.section_id
    ORDER BY visit_count DESC;`

    return await client.query(query, admin_id ? [admin_id]: []);

}

module.exports = {
    getDashboardTotalArtworksCountByAdminIdService,
    getDashboardVisitorsLast24HByAdminIdService,
    getDashboardMostVisitedArtworksByAdminIdService,
    getDashboardMostCrowdedSectionsByAdminIdService
}