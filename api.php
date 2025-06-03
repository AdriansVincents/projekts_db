<?php
header('Content-Type: application/json');
require 'config.php';

$sql = "
    SELECT 
        e.id,
        e.title, 
        e.location, 
        e.description, 
        e.event_year,
        e.more_info,          -- jaunā kolonna
        p.Person AS person_name
    FROM events e
    LEFT JOIN event_person ep ON e.id = ep.event_id
    LEFT JOIN persons p ON ep.person_id = p.id
";

try {
    $stmt = $pdo->query($sql);
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($events);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>