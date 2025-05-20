<!DOCTYPE html>
<html>
<head>
<title>Hello!</title>
</head>
<body>
<?php
$user = 'fs';
$pass = 'fsd';
$db = 'fsd'; 

//create connection
$con = mysqli_connect('localhost', $user, $pass, $db) or
    die("Connection failed: " . mysqli_connect_error()); 

echo "Connected successfully<br>"; 

// Create database table (corrected variable name)
$sql = "CREATE TABLE login(name VARCHAR(25), pass VARCHAR(5))"; 
if (mysqli_query($con, $sql)) {
    echo "Table 'login' created successfully";
} else {
    echo "Error creating table: " . mysqli_error($con); 
}

mysqli_close($con);
?>
</body>
</html>