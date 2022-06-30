<?php
    $texto = $_GET['Label'];
    $font_file = 'arial.ttf';
    $width = ((strlen($texto)*9)+20)-10;
    $height = 30;
    $img = imagecreate($width, $height);
    $white = imagecolorallocate($img, 255, 255, 255);
    $black = imagecolorallocate($img, 0, 0, 0);
    imagecolortransparent($img, $white);
    imagestring($img, 5, 5, 5, $texto, $black);
    header('Content-Type: image/png');
    imagepng($img);
    imagedestroy($img);
?>