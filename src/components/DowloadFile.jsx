'use client'

import { Download, Loader2Icon } from "lucide-react";
import MyButton from "./ui/MyButton";
import { useState } from "react";
import { toast } from "sonner";

export default function DownloadFile({ CID }) {
    let url = 'https://aquamarine-deliberate-ant-681.mypinata.cloud/ipfs/' + CID;

    const [isLoading, setIsloading] = useState(false)
    async function handleDownload() {
        setIsloading(true)


        toast("You File is Downloading");




        setIsloading(false)

    }
    return <a href={url}>
        <MyButton className=' h-8'>
            {!isLoading && <Download onClick={handleDownload} className=' h-5' />}
            {isLoading && <Loader2Icon className=" animate-spin h-5 " />}
        </MyButton>
    </a>
}