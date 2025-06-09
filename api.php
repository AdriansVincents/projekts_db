<?php
header('Content-Type: application/json');
require 'config.php';

$sql = "SELECT * FROM events";

try {
    $stmt = $pdo->query($sql);
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($events as &$event) {
        $event_id = $event['id'];
        $psql = "
            SELECT p.id, p.Person, p.bio, p.achievements, p.image_url, `Common feature or meaning`, `Impact on society`
            FROM persons p
            JOIN event_person ep ON ep.person_id = p.id
            WHERE ep.event_id = ?
        ";
        $pstmt = $pdo->prepare($psql);
        $pstmt->execute([$event_id]);
        $event['related_persons'] = $pstmt->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode($events);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
