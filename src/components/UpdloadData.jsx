'use client'
import { Loader2Icon } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { storeDeviceData } from '@/actions/Authenticate';


function uint8ArrayToBase64(uint8Array) {
    let binaryString = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binaryString);
}

// Convert ArrayBuffer to Base64
function arrayBufferToBase64(arrayBuffer) {
    return uint8ArrayToBase64(new Uint8Array(arrayBuffer));
}

async function encryptFile(buffer) {
    const key = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const encryptedData = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        buffer
    );
    const exportedKey = await crypto.subtle.exportKey("raw", key);
    return { encryptedData, iv, exportedKey };
}
function UploadData({ token, deviceId, homeId }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false)
    const [storingOnBlockchain, setStoringOnBlockchain] = useState(false)

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        console.log(e.target.files[0])
    };
    const [uploadProgress, setUploadProgress] = useState(0);
    const [xhrObject, setXhrObject] = useState(null);
    const uploadToNFTStorage = async () => {
        setUploading(true)
        const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
        if (!file) {
            toast('Please select a file to upload.');
            setUploading(false)

            return;
        }
        console.log(file)
        const formData = new FormData();
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        var { encryptedData, iv, exportedKey } = await encryptFile(buffer);
        let EncryptedFile = new File([encryptedData], file.name)

        formData.append('file', EncryptedFile);



        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`)
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                console.log(e.loaded, e.total)
                setUploadProgress((e.loaded / e.total) * 100);
            }
        }


        xhr.onload = async () => {
            try {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const response = JSON.parse(xhr.responseText);
                    const { IpfsHash, Timestamp } = response;
                    setUploading(false);
                    setStoringOnBlockchain(true);

                    await storeDeviceData({ deviceId, homeId, fileData: { name: file.name, IpfsHash, Timestamp, iv: uint8ArrayToBase64(iv), key: arrayBufferToBase64(exportedKey) } });
                    console.log('fileData:', { IpfsHash, Timestamp, iv: iv, key: exportedKey })




                    toast('File uploaded successfully!');
                } else {
                    console.error('Upload failed', xhr.responseText);
                    toast('File upload failed.');
                }
            } catch (error) {
                console.error('Error parsing response', error);
                toast('File upload failed.');
            } finally {
                setUploading(false);
                setStoringOnBlockchain(false);
            }
        };

        xhr.onerror = () => {
            toast('File upload failed.');
            setStoringOnBlockchain(false)
            setUploading(false)
        }
        setXhrObject(xhr);
        console.log('formData', formData)


        xhr.send(formData)

    };
    const cancleUpload = () => {
        if (xhrObject) {
            xhrObject.abort();
            setUploading(false)
        }
    }
    return (
        <div>
            <h2 className=' text-[24px] font-satisfy'>
                Upload Data to the device
            </h2>
            <div className='flex flex-col gap-5 justify-center items-center mx-auto w-full max-w-[232px]'>

                <input type="file" onChange={handleFileChange} />
                {uploading && <Loader2Icon className=' animate-spin' />}
                {storingOnBlockchain && <>Storing hash on blockChain <Loader2Icon className=' animate-spin' />  </>}
                <div className='flex gap-5 w-fit mx-auto '>
                    {!uploading && <Button disabled={uploading} onClick={uploadToNFTStorage} className='flex gap-5  w-[200px]'>
                        {!uploading && "Upload to NFT Storage"}</Button>}
                    {uploading && <Button onClick={cancleUpload}> Cancle Upload</Button>}
                </div>
                {uploading && "Uploading percentage: " + uploadProgress.toFixed(1) + '%'}
            </div>
        </div>
    );
}

export default UploadData;
