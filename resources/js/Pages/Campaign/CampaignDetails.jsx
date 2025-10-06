import Layout_User from "@/Layouts/Layout_User";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Create() {
    return (
        <Layout_User>
            <Box className="container mx-auto px-4 py-8">
                <Card className="max-w-2xl mx-auto" >
                    <CardHeader>
                        <CardTitle>Create New Campaign</CardTitle>
                        <CardDescription>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                    </CardContent>
                </Card>
            </Box>
        </Layout_User>
    );
}
