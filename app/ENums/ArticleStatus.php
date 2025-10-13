<?php

namespace App\Enums;

enum ArticleStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Disabled = 'disabled';
}
