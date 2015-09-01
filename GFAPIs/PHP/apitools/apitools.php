<?php
    class APITools{

        static function apiDoActivity($activityId, $userId){

            $url = "http://dev1.atglab.co.kr:3000/api/activities/do?aid=" . $activityId . "&uid=" . $userId;

            $ch = curl_init();

            curl_setopt($ch, CURLOPT_URL, $url);

            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
            curl_setopt($ch, CURLOPT_TIMEOUT, 5);

            $res = curl_exec($ch);
            curl_close($ch);

            return $res;
        }

        static function apiAddUser($user){

            $url = "http://dev1.atglab.co.kr:3000/api/users";

            $json_data = array("data" => json_encode($user));

            $ch = curl_init($url);

            curl_setopt_array($ch, array(
                CURLOPT_POST => TRUE,
                CURLOPT_RETURNTRANSFER => TRUE,
                CURLOPT_HTTPHEADER => array(
                    'Authorization: '.$authToken,
                    'Content-Type: application/json'
                ),
                CURLOPT_POSTFIELDS => json_encode($json_data)
            ));

            $res = curl_exec($ch);
            curl_close($ch);
            return $res;
        }
    }
?>
