<?php
$username = $_POST['username'];
$password = $_POST['password'];
$data = $_POST['data'];

$conn = new mysqli('server204.web-hosting.com', 
  'joshgncd_joshua', 'hn%X=FbWIU]J', 'joshgncd_riverbank', 3306);
if ($conn->connect_error) {
  die('Connection failed: ' . $conn->connect_error);
}
$sql = 
'INSERT INTO users (username, password, data) 
VALUES (' . $username . ', ' . $password . ', ' . $data . ')';
$conn->query($sql);
$conn->close();
?>