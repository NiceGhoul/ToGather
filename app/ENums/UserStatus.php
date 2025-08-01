<?php

namespace App\Enums;

enum UserStatus: string
{
    case Active = 'active';
    case Inactive = 'inactive';
    case Unverified = 'unverified';
    case Banned = 'banned';
}
