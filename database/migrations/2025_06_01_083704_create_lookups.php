<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lookups', function (Blueprint $table) {
            $table->id();
            $table->string('lookup_type');
            $table->string('lookup_code')->unique();
            $table->string('lookup_description');
            $table->string('lookup_value');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
