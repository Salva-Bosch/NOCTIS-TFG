<?php
// Session helper
session_start();
function is_logged_in(){
  return !empty($_SESSION['user']);
}
