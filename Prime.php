<?php
function isPrime($number) {
    if ($number <= 1) {
        return false;
    }
    if ($number == 2) {
        return true;
    }
    if ($number % 2 == 0) {
        return false;
    }

    $sqrt = sqrt($number);
    for ($i = 3; $i <= $sqrt; $i += 2) {
        if ($number % $i == 0) {
            return false;
        }
    }
    return true;
}

$number = 29;

if (isPrime($number)) {
    echo "$number is a Prime number.";
} else {
    echo "$number is NOT a Prime number.";
}
?>
