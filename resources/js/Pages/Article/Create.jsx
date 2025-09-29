import Layout_User from "@/Layouts/Layout_User";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useForm } from "@inertiajs/react";
import { useRef } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
    });
    
    const quillRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/articles');
    };

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch('/api/upload-image', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                });
                const result = await response.json();
                
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', result.location);
            } catch (error) {
                console.error('Image upload failed:', error);
            }
        };
    };

    const modules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    };

    return (
        <Layout_User>
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Create New Article</CardTitle>
                        <CardDescription>
                            Share your story or insights
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                                )}
                            </div>
                            
                            <div>
                                <Label htmlFor="content">Content</Label>
                                <ReactQuill
                                    ref={quillRef}
                                    theme="snow"
                                    value={data.content}
                                    onChange={(content) => setData('content', content)}
                                    modules={modules}
                                    style={{ height: '400px', marginBottom: '50px' }}
                                />
                                {errors.content && (
                                    <p className="text-sm text-red-600 mt-1">{errors.content}</p>
                                )}
                            </div>
                            
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Publishing...' : 'Publish Article'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout_User>
    );
}