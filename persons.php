<?php
header('Content-Type: application/json');
require 'config.php';

$sql = "SELECT * FROM persons";

try {
    $stmt = $pdo->query($sql);
    $persons = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($persons);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
