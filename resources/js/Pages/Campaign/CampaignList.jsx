import { Inertia } from "@inertiajs/inertia";
import { Button } from "@/Components/ui/button";
import Layout_User from "@/Layouts/Layout_User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@inertiajs/react";


const CampaignList = () => {
    return (
        <Layout_User>
            <div className="container mx-auto px-4 py-8 flex justify-center">
                <Card className="max-w-2xl mx-auto" >
                    <CardHeader>
                        <CardTitle className="text-center text-xl">Campaign</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button>
                            <Link href="/campaigns/create">Create New Campaign</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </Layout_User>
    );
}

export default CampaignList;
