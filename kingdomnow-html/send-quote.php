<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');

function respond(int $status, bool $ok): void
{
    http_response_code($status);
    echo json_encode(['ok' => $ok]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, false);
}

$limits = ['name' => 120, 'email' => 254, 'phone' => 40, 'service' => 100, 'location' => 100, 'message' => 3000];
$fields = [];
foreach ($limits as $key => $limit) {
    $value = $_POST[$key] ?? '';
    if (!is_string($value) || strlen($value) > $limit) {
        respond(422, false);
    }
    $fields[$key] = trim($value);
}

if ($fields['name'] === '' || $fields['service'] === '' || !filter_var($fields['email'], FILTER_VALIDATE_EMAIL)) {
    respond(422, false);
}

$inbox = 'Info@kingdomnowcleaning.org';
$body = implode("\n", [
    'Name: ' . $fields['name'],
    'Email: ' . $fields['email'],
    'Phone: ' . $fields['phone'],
    'Service: ' . $fields['service'],
    'Service location: ' . $fields['location'],
    '',
    'Details:',
    $fields['message'],
]);
$headers = [
    'From' => 'Kingdomnow Website <' . $inbox . '>',
    'Reply-To' => $fields['email'],
    'Content-Type' => 'text/plain; charset=UTF-8',
];

$accepted = mail($inbox, 'New Kingdomnow cleaning quote request', $body, $headers);
respond($accepted ? 200 : 503, $accepted);
