'use client'

import { Download, Loader2Icon } from "lucide-react";
import MyButton from "./ui/MyButton";
import { useState } from "react";
import { toast } from "sonner";
import { con } from "@/actions/test";
function base64ToUint8Array(base64) {
    // Decode the base64 string to a binary string
    const binaryString = atob(base64);
    // Create a new Uint8Array with the length of the binary string
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    // Populate the Uint8Array with the binary data
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}
function base64ToArrayBuffer(base64) {
    // Decode the base64 string to a binary string
    const binaryString = atob(base64);
    // Create a new ArrayBuffer with the length of the binary string
    const len = binaryString.length;
    const buffer = new ArrayBuffer(len);
    // Create a Uint8Array view of the ArrayBuffer
    const bytes = new Uint8Array(buffer);
    // Populate the Uint8Array with the binary data
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return buffer;
}

export default function DownloadFile({ CID, ivResponse, keyResponse, name }) {


    console.log('her', CID, ivResponse, keyResponse)
    const url = 'https://aquamarine-deliberate-ant-681.mypinata.cloud/ipfs/' + CID;
    const [downloadProgress, setDownloadProgress] = useState(0);

    const [isLoading, setIsloading] = useState(false)


    async function handleDownload(filename) {
        setIsloading(true)
        console.log('filename', filename)



        try {
            if ('showSaveFilePicker' in window) {
                const options = {
                    types: [
                        {
                            description: "Files",
                            accept: {
                                "application/octet-stream": [`.${name.split(".").pop()}`],
                            },
                        },
                    ],
                };
                const fileHandle = await window.showSaveFilePicker(options);
            }


            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "blob";

            xhr.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    setDownloadProgress(percentComplete);
                }
            };

            xhr.onload = async () => {
                if (xhr.status === 200) {
                    const encryptedBlob = xhr.response;

                    // Fetch iv and key

                    const iv = base64ToUint8Array(ivResponse)


                    const keyArrayBuffer = base64ToArrayBuffer(keyResponse)
                    const key = await crypto.subtle.importKey(
                        "raw",
                        keyArrayBuffer,
                        "AES-GCM",
                        true,
                        ["decrypt"]
                    );


                    const decryptedBlob = await decryptFile(encryptedBlob, iv, key);


                    if (!('showSaveFilePicker' in window)) {



                        // Create a temporary anchor element
                        const a = document.createElement('a');
                        const url1 = URL.createObjectURL(decryptedBlob);
                        a.href = url1;
                        a.download = CID;
                        document.body.appendChild(a);
                        a.click();

                        // Clean up
                        setTimeout(() => {
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url1);
                        }, 0);
                    }

                    if ('showSaveFilePicker' in window) {
                        const writableStream = await fileHandle.createWritable();

                        await writableStream.write(decryptedBlob);
                        await writableStream.close();
                    }
                    toast("File downloaded successfully");
                    setDownloadProgress(0);
                } else {
                    toast(`File download failed: ${xhr.statusText}`);
                    setDownloadProgress(0);
                }
            };

            xhr.onerror = () => {
                toast("File download failed");
                setDownloadProgress(0);
            };

            xhr.send();



        } catch (error) {
            toast(`File download failed: ${error.message}`);
            setDownloadProgress(0);
        }












        toast("You File is Downloading");




        setIsloading(false)

    }


    const decryptFile = async (encryptedBlob, iv, key) => {
        try {
            const encryptedData = await encryptedBlob.arrayBuffer();
            const decryptedData = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                key,
                encryptedData
            );
            return new Blob([decryptedData]);
        } catch (error) {
            console.error("Decryption failed:", error);
            throw new Error("Decryption failed. Please check your key and IV.");
        }
    };
    return <MyButton onClick={() => handleDownload(CID)} className=' h-8'>
        {!isLoading && <Download className=' h-5' />}
        {downloadProgress > 0 && downloadProgress < 100 && <progress value={downloadProgress} />}
        {isLoading && <Loader2Icon className=" animate-spin h-5 " />}
    </MyButton>

}