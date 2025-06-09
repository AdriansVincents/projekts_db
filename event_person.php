<?php
header('Content-Type: application/json');
require 'config.php';

try {
    $sql = "
        SELECT 
            e.title, 
            e.location, 
            e.description, 
            e.event_year,
            p.Person,
            p.`Common feature or meaning` AS common_feature,
            p.`Impact on society` AS impact_on_society,
            p.image_url
        FROM events e
        JOIN event_person ep ON e.id = ep.event_id
        JOIN persons p ON p.id = ep.person_id
    ";

    $stmt = $pdo->query($sql);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
