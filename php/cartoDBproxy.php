<?php
    session_cache_limiter('nocache');
    $cache_limiter = session_cache_limiter();
    function goProxy($dataURL)
    {
        $baseURL = 'http://jospueyo.cartodb.com/api/v2/sql?';
        $api = '&api_key=';
        $url = $baseURL.'q='.urlencode($dataURL).$api;
        $result = file_get_contents ($url);
        return $result;
    }
?>
