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
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->unique()->constrained()->onDelete('cascade');
            $table->decimal('lat', 20, 7)->nullable();
            $table->decimal('lon', 20, 12)->nullable();
            $table->string('city_block')->nullable();
            $table->string('village')->nullable();
            $table->string('suburb')->nullable();
            $table->string('city')->nullable();
            $table->string('region')->nullable();
            $table->string('postcode')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
