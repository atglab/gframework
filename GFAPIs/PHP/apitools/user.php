<?php
    class GFUser{
        public $id, $name, $nickname, $gender, $birthday, $profile;

        public function getInfo(){
            return $this->id . ' ' . $this->name . ' ' . $this->nickname . ' ' . $this->gender
                         . ' ' . $this->birthday  . ' ' . $this->profile;
        }

        public function __toString()
            {
                return "{ \"id\": \"" . $this->id . "\", \"name\": \"" . $this->name . "\"}";
            }
    }
?>