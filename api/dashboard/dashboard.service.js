const getDashboardService = async (client, is_deleted, museum_id) => {
    let query = `
    SELECT 
    COUNT(*) AS total_artworks,
    (SELECT COUNT(*) FROM public.guia_db_visitor WHERE museum_id_id = $2 AND visited_on > NOW() - INTERVAL '24 HOURS') AS total_visitors_last24H
    FROM public.guia_db_artwork
    WHERE is_deleted = $1`;

    return await client.query(query, [is_deleted, museum_id]);
}

module.exports = {
    getDashboardService
}