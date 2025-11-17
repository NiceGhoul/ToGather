import Layout_User from "@/Layouts/Layout_User";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

export default function Pending() {
    return (
        <Layout_User>
            <div className="container mx-auto px-4 py-8 mt-40">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Verification Pending</CardTitle>
                        <CardDescription>
                            Your verification request is being reviewed
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded">
                            <p className="font-medium">Your verification is still pending</p>
                            <p className="text-sm mt-1">Please wait for admin approval</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            We are currently reviewing your verification documents. 
                            You will be notified once the review is complete.
                        </p>
                        <Button asChild className="w-full">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </Layout_User>
    );
}