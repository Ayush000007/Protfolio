<?php
/**
 * LIQUID CHROME - CONTACT FORM HANDLER
 * Portfolio of Ayush Pratap Singh
 * Email: ayushpratapsinghgzp@gmail.com
 */

header('Content-Type: application/json; charset=utf-8');

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed. Please submit via POST.'
    ]);
    exit;
}

// Destination mailbox
$recipient = 'ayushpratapsinghgzp@gmail.com';

// Sanitize and validate inputs
$name    = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$email   = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$subject = isset($_POST['subject']) ? trim(strip_tags($_POST['subject'])) : 'New Portfolio Transmission';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

// Validation checks
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Please fill in all required fields (Name, Email, Message).'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'The provided email address is invalid.'
    ]);
    exit;
}

// Prepare email headers
$emailSubject = "Portfolio Contact: " . ($subject ?: "General Inquiry") . " from " . $name;
$emailBody = "You have received a new message from your Liquid Chrome portfolio website:\n\n";
$emailBody .= "Name: " . $name . "\n";
$emailBody .= "Email: " . $email . "\n";
$emailBody .= "Subject: " . $subject . "\n\n";
$emailBody .= "Message:\n" . $message . "\n\n";
$emailBody .= "---\nSent from Portfolio Website (Ayush Pratap Singh)";

$headers = [];
$headers[] = 'From: Portfolio Website <no-reply@' . ($_SERVER['SERVER_NAME'] ?? 'localhost') . '>';
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'X-Mailer: PHP/' . phpversion();
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=utf-8';

// Send email
$mailSent = @mail($recipient, $emailSubject, $emailBody, implode("\r\n", $headers));

if ($mailSent) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Message successfully transmitted. I will get back to you shortly!'
    ]);
} else {
    // If mail() failed (e.g. local environment without sendmail), return fallback status
    echo json_encode([
        'status' => 'fallback',
        'message' => 'Server mail transfer unavailable. Please use direct email or fallback.'
    ]);
}
?>
