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
        // Validate video file (100MB = 102400KB)
        if ($file->getSize() > 102400 * 1024) {
            throw new \Exception('Video file size exceeds 100MB limit');
        }
        
        $allowedMimes = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-ms-wmv', 'video/x-flv', 'video/webm'];
        if (!in_array($file->getMimeType(), $allowedMimes)) {
            throw new \Exception('Invalid video format');
        }
        
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