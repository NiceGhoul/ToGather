import Layout_User from "@/Layouts/Layout_User";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";

export default function CampaignPending() {
    return (
        <Layout_User>
            <div className="container mx-auto px-4 py-8 mt-40">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Campaign Verification Pending</CardTitle>
                        <CardDescription>
                            Your campaign is being reviewed
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded">
                            <p className="font-medium">
                                There is Still a Pending Campaign
                            </p>
                            <p className="text-sm mt-1">
                                Please wait for Admin approval
                            </p>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            We are currently reviewing your campaign documents.
                            You will be notified once the review is complete.
                        </p>
                        <Button
                            asChild
                            className="w-full bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white"
                        >
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </Layout_User>
    );
}
