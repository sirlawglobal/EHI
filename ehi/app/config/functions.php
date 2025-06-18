<?php
function redirect($url)
{
	header("Location: ". ROOT . $url);
	die;
}


// function isLoggedIn()
// {
//     return isset($_SESSION['user']);
// }

function isLoggedIn() {
    return isset($_SESSION['user']) && !empty($_SESSION['user']);
}



function requireLogin($redirectTo = "login")
{
    if (!isLoggedIn()) {
        $_SESSION['fail'] = "You must log in to access this page.";
        redirect($redirectTo);
        exit;
    }
}
function isAdmin()
{
    return isset($_SESSION['user']) && $_SESSION['user']['role'] == "admin";
}
function requireAdmin($redirectTo = "login")
{
    if (!isAdmin()) {
        $_SESSION['fail'] = "Access denied. Admins only.";
        redirect($redirectTo);
        exit;
    }
}


function formatPhoneNumber($phone) {
    // Remove spaces, dashes, and parentheses
    $clean = preg_replace('/[\s\-\(\)]+/', '', $phone);

    // If number starts with 0, replace it with +234
    if (preg_match('/^0\d{10}$/', $clean)) {
        $clean = '+234' . substr($clean, 1);
    }

    // If number starts with 234 (without +), add +
    if (preg_match('/^234\d{10}$/', $clean)) {
        $clean = '+' . $clean;
    }

    // Now format the number
    if (preg_match('/^\+234(\d{3})(\d{3})(\d{4})$/', $clean, $matches)) {
        return "+234 ({$matches[1]}) {$matches[2]}-{$matches[3]}";
    }

    // If not a valid format, return original
    return $phone;
}

function formatDateToSlash($date) {
    $timestamp = strtotime($date);

    if ($timestamp === false) {
        return 'Invalid date';
    }

    return date('d/m/Y', $timestamp);
}


function formatOrderId($orderId) {
    // Add 100 to the order_id
    $formattedId = 100 + (int)$orderId; // Ensure order_id is treated as an integer
    return $formattedId;
}
