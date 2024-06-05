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
    SELECT a.*, image.image_link as image_thumbnail, count(*) AS visit_count
    FROM public.guia_db_artworkvisits av
    INNER JOIN public.guia_db_artwork a ON av.art_id_id = a.art_id
    INNER JOIN public.guia_db_section s ON a.section_id_id = s.section_id
    INNER JOIN public.guia_db_admin ad ON s.museum_id_id = ad.museum_id_id
    INNER JOIN public.guia_db_artworkimage image ON a.art_id = image.artwork_id 

    WHERE
      art_visited_on >= NOW() - INTERVAL '24 HOURS'
      AND a.is_deleted = FALSE
      AND image.is_thumbnail = true

    `

    if (admin_id) {
        query+= ` AND ad.user_id = $1`
      }   

    query += ` GROUP BY a.art_id, image.image_link  
    ORDER BY visit_count DESC
    LIMIT 3;`

    return await client.query(query, admin_id ? [admin_id]: []);
}

const getDashboardMostCrowdedSectionsByAdminIdService = async (client, admin_id) => {

    let query = `
    SELECT 
        section.section_id,
        section.section_name,
        section.museum_id_id as museum_id,
        COALESCE(COUNT(visits.visitor_id_id), 0) AS visit_count
    FROM 
        guia_db_section section 
    left join guia_db_admin ad on ad.museum_id_id = section.museum_id_id
    LEFT JOIN
        guia_db_artwork artwork ON artwork.section_id_id = section.section_id
    LEFT JOIN 
        (                
            SELECT g1.visitor_id_id, g1.art_id_id, g1.art_visited_on
            FROM guia_db_artworkvisits AS g1
            JOIN (
                SELECT 
                distinct 
                gda.section_id_id, 
                visitor_id_id, 
                MAX(art_visited_on) AS latest_visit
                FROM guia_db_artworkvisits
                left join guia_db_artwork gda on gda.art_id = art_id_id
                WHERE DATE(art_visited_on) = CURRENT_DATE
                and visit_type = 'scan'
                GROUP BY visitor_id_id, gda.section_id_id
            ) AS g2 
            ON g1.visitor_id_id = g2.visitor_id_id AND g1.art_visited_on = g2.latest_visit

        ) visits
        ON visits.art_id_id = artwork.art_id 
    `

    if (admin_id) {
        query+= ` AND ad.user_id = $1`
      }   

    query += ` GROUP BY section.section_id
	ORDER BY visit_count desc
	LIMIT 3`

    return await client.query(query, admin_id ? [admin_id]: []);

}

module.exports = {
    getDashboardTotalArtworksCountByAdminIdService,
    getDashboardVisitorsLast24HByAdminIdService,
    getDashboardMostVisitedArtworksByAdminIdService,
    getDashboardMostCrowdedSectionsByAdminIdService
}