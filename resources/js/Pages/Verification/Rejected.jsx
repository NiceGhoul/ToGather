import Layout_User from "@/Layouts/Layout_User";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";

export default function Rejected() {
    return (
        <Layout_User>
            <div className="container mx-auto px-4 py-8 mt-40">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Verification Rejected</CardTitle>
                        <CardDescription>
                            Your verification request was not approved
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
                            <p className="font-medium">Your verification was rejected</p>
                            <p className="text-sm mt-1">Please try again with correct documents</p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            Your verification documents did not meet our requirements.
                            Please submit a new verification request with valid documents.
                        </p>
                        <Button asChild className="w-full mb-2">
                            <Link href="/verification/create">Try Again</Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </Layout_User>
    );
}
