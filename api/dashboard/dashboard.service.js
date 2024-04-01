const getDashboardService = async (client, admin_id) => {
    let artworkQuery = `
    SELECT COUNT(*) AS total_artworks
        FROM public.guia_db_admin ad
        INNER JOIN public.guia_db_section s ON ad.museum_id_id = s.museum_id_id
        INNER JOIN public.guia_db_artwork a ON s.section_id = a.section_id_id
        WHERE a.is_deleted = FALSE AND ad.user_id = $1
    `;

    let visitorQuery = `
    SELECT COUNT(*) AS total_visitors_last24H
        FROM public.guia_db_visitor v
        INNER JOIN public.guia_db_admin ad ON v.museum_id_id = ad.museum_id_id
        WHERE v.visited_on > NOW() - INTERVAL '24 HOURS'
        AND ad.user_id = $1
    `;

    let artworkVisitsQuery = `
    SELECT av.art_id_id, count(*) AS visit_count
        FROM public.guia_db_artworkvisits av
        INNER JOIN public.guia_db_artwork a ON av.art_id_id = a.art_id
        INNER JOIN public.guia_db_section s ON a.section_id_id = s.section_id
        INNER JOIN public.guia_db_admin ad ON s.museum_id_id = ad.museum_id_id
        WHERE art_visited_on > NOW() - INTERVAL '24 HOURS'
        AND ad.user_id = $1
        GROUP BY av.art_id_id
        ORDER BY visit_count DESC
        LIMIT 3
    `;

    let sectionQuery = `
    SELECT s.section_id, COUNT(*) AS visit_count
        FROM public.guia_db_admin ad
        INNER JOIN public.guia_db_section s ON ad.museum_id_id = s.museum_id_id
        INNER JOIN public.guia_db_artwork a ON s.section_id = a.section_id_id
        INNER JOIN public.guia_db_artworkvisits av ON a.art_id = av.art_id_id
        WHERE av.art_visited_on > NOW() - INTERVAL '1 HOUR'
        AND ad.user_id = $1
        GROUP BY s.section_id
        ORDER BY visit_count DESC
    `;

    let totalArtworks = await client.query(artworkQuery, [admin_id]);
    let totalVisitorsLast24H = await client.query(visitorQuery, [admin_id]);
    let mostVisitedArtworks = await client.query(artworkVisitsQuery, [admin_id]);
    let mostCrowdedSections =  await client.query(sectionQuery, [admin_id]);

    return {
        total_artworks: totalArtworks.rows[0].total_artworks,
        total_visitors_last24H: totalVisitorsLast24H.rows[0].total_visitors_last24h,
        most_visited_artworks: mostVisitedArtworks.rows.length > 0 
            ? mostVisitedArtworks.rows.map(row => row.art_id_id)
            : "No visitors yet.",
        most_crowded_section: mostCrowdedSections.rows.length > 0
            ? mostCrowdedSections.rows.map(row => row.section_id)
            : "No visitors yet."
    };
}

module.exports = {
    getDashboardService
}