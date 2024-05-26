import { getAllHomeList } from "@/actions/Authenticate";
import MyButton from "@/components/ui/MyButton";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export default async function Page() {
    let response;

    try {
        response = await getAllHomeList();
        console.log(response);
    } catch (error) {
        console.error('Failed to fetch home list:', error);
        return <div className="text-red-500">Error loading home list. Please try again later.</div>;
    }

    if (!response?.isOk || !response.homeList?.length) {
        return <div className="text-gray-500">No homes found.</div>;
    }

    return (
        <div className="overflow-hidden p-4">
            <h1 className="text-2xl font-fraunces_semibold text-[clamp(24px,5vw,60px)] text-gray-900 mb-4">Home List</h1>
            <div >
                <Table>
                    <TableCaption>A list of homes managed by the Service Provider</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] sticky top-0 bg-white">Home Name</TableHead>
                            <TableHead className="w-[100px] sticky top-0 bg-white">Owner Name</TableHead>
                            <TableHead className="w-[100px] sticky top-0 bg-white">Owner Email</TableHead>
                            <TableHead className="w-full sticky top-0 bg-white">Properties</TableHead>
                            <TableHead className="w-[100px] sticky top-0 bg-white">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {response.homeList.map((home, index) => (
                            <TableRow key={home.homeId}>
                                <TableCell className="font-medium">{home.homeName}</TableCell>
                                <TableCell className="font-medium">{home.owner.firstName + " " + home.owner.lastName}</TableCell>
                                <TableCell className="font-medium">{home.owner.email}</TableCell>
                                <TableCell className="w-full overflow-x-auto">
                                    <Table className="w-fit whitespace-nowrap">
                                        <TableHeader>
                                            <TableRow>
                                                {Object.keys(home.properties).map(property => (
                                                    <TableHead key={property}>{property}</TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                {Object.keys(home.properties).map(property => (
                                                    <TableCell key={property}>{home.properties[property]}</TableCell>
                                                ))}
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableCell>
                                <TableCell>
                                    <Link href={`/serviceProvider/homeList/assignDevices?homeId=${home.homeId}`}>
                                        <MyButton type="button" variant="icon">Assign Devices</MyButton>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
