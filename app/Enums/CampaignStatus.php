<?php

namespace App\Enums;

enum CampaignStatus: string
{
    case Pending = 'pending';
    case Active = 'active';
    case Completed = 'completed';
    case Rejected = 'rejected';
    case Banned = 'banned';
    case Draft = 'draft';
    case Inactive = 'inactive';
}
