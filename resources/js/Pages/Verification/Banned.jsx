import Layout_User from "@/Layouts/Layout_User";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { AlertTriangle } from "lucide-react";

export default function Banned() {
    return (
        <Layout_User>
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            Account Banned
                        </CardTitle>
                        <CardDescription>
                            Your account has been suspended
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                            <p className="font-medium">Your account is currently banned</p>
                            <p className="text-sm mt-1">You cannot create articles or campaigns</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Your account has been suspended due to policy violations. 
                            Please contact support for more information about your account status.
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