<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class MinioService
{
    protected $disk;

    public function __construct()
    {
        $this->disk = Storage::disk('minio');
    }

    public function uploadFile(UploadedFile $file, string $directory = ''): string
    {
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $directory ? $directory . '/' . $filename : $filename;
        
        $this->disk->putFileAs($directory, $file, $filename);
        
        return $path;
    }

    public function uploadImage(UploadedFile $file, string $directory = 'images'): string
    {
        return $this->uploadFile($file, $directory);
    }

    public function uploadVideo(UploadedFile $file, string $directory = 'videos'): string
    {
        return $this->uploadFile($file, $directory);
    }

    public function uploadDocument(UploadedFile $file, string $directory = 'documents'): string
    {
        return $this->uploadFile($file, $directory);
    }

    public function getFileUrl(string $path): string
    {
        return $this->disk->url($path);
    }

    public function deleteFile(string $path): bool
    {
        return $this->disk->delete($path);
    }

    public function fileExists(string $path): bool
    {
        return $this->disk->exists($path);
    }
}