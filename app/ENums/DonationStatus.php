<?php

namespace App\Enums;

enum DonationStatus: string
{
    case Pending = 'pending';
    case Successful = 'successful'; 
    case Failed = 'failed';
}
