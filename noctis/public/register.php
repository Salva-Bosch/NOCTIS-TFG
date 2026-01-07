<?php
// simple register form placeholder
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Register</title>
  <link rel="stylesheet" href="../css/global.css">
</head>
<body>
  <h1>Registro</h1>
  <form method="post" action="../php/auth.php">
    <label>Email: <input type="email" name="email"></label>
    <label>Password: <input type="password" name="password"></label>
    <button type="submit">Registrar</button>
  </form>
</body>
</html>
