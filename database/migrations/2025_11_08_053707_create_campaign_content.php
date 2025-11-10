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
        Schema::create('campaign_content', function (Blueprint $table) {
           $table->id();
            $table->foreignId('campaign_id')->constrained()->onDelete('cascade');
            $table->text('tabs')->nullable();
            $table->enum('type', ['paragraph', 'media']);
            $table->longText('content')->nullable();
            $table->integer('order_y')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaign_content');
    }
};
