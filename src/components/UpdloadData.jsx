'use client'
import { Loader2Icon } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { storeDeviceData } from '@/actions/Authenticate';


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
        formData.append('file', file);

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
            console.log('response', xhr.response)
            let response = JSON.parse(xhr.response);
            const { IpfsHash, Timestamp } = response;
            setUploading(false)

            setStoringOnBlockchain(true)
            let res = await storeDeviceData({ deviceId: deviceId, homeId: homeId, fileData: { IpfsHash, Timestamp } })
            toast('File uploaded successfully!');
            setStoringOnBlockchain(false)

            console.log(IpfsHash, Timestamp)
        }
        xhr.onerror = () => {
            toast('File upload failed.');
            setStoringOnBlockchain(false)
            setUploading(false)
        }
        setXhrObject(xhr);
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
