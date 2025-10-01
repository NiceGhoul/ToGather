import Layout_User from "@/Layouts/Layout_User";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import JoditEditor from 'jodit-react';
import { useForm } from "@inertiajs/react";
import { useRef, useState } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
    });
    
    const editor = useRef(null);
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setData('content', content);
        post('/articles');
    };

    const config = {
        readonly: false,
        height: 400,
        uploader: {
            insertImageAsBase64URI: false,
            url: '/api/upload-image',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            },
            format: 'json',
            isSuccess: function (resp) {
                return resp.success === 1;
            },
            defaultHandlerSuccess: function (data) {
                const files = data.files || [];
                if (files.length) {
                    const selection = this.s.sel;
                    const range = selection.range;
                    const img = this.createInside.element('img');
                    img.setAttribute('src', files[0]);
                    img.setAttribute('style', 'max-width: 100%; height: auto;');
                    this.s.insertNode(img, false, false);
                }
            },
            process: function (resp) {
                return resp.data;
            }
        },
        buttons: [
            'bold', 'italic', 'underline', '|',
            'ul', 'ol', '|',
            'font', 'fontsize', '|',
            'image', 'link', '|',
            'align', '|',
            'undo', 'redo'
        ]
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
                                <JoditEditor
                                    ref={editor}
                                    value={content}
                                    config={config}
                                    tabIndex={1}
                                    onBlur={newContent => setContent(newContent)}
                                    onChange={newContent => {}}
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