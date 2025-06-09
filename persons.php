<?php
header('Content-Type: application/json');
require 'config.php';

$sql = "SELECT id, Person, bio, achievements, image_url, `Common feature or meaning`, `Impact on society` FROM persons";

try {
    $stmt = $pdo->query($sql);
    $persons = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($persons as &$person) {
        $stmt = $pdo->prepare("
            SELECT e.id, e.title, e.event_year, e.location, e.description
            FROM events e
            JOIN event_person ep ON e.id = ep.event_id
            WHERE ep.person_id = ?
        ");
        $stmt->execute([$person['id']]);
        $person['related_events'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode($persons);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
