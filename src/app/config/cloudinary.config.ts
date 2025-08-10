/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import Stream from "stream";

cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
})

export const deleteImageFromCloudinary = async (url: string) => {
    try {
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
        const match = url.match(regex);

        console.log({match});

        if(match && match[1]){
            const public_id = match[1];
            await cloudinary.uploader.destroy(public_id);
            console.log(`File ${public_id} is deleted from cloudinary.`);
        }

    } catch (error: any) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Cloudinary image deletion failed", error.message)
    }
}




export const uploadBufferToCloudinary = async (buffer: Buffer, fileName: string): Promise<UploadApiResponse | undefined> => {
    try {
        return new Promise((resolve, reject) => {

            const public_id = `pdf/${fileName}-${Date.now()}`

            const bufferStream = new Stream.PassThrough();
            bufferStream.end(buffer)

            cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    public_id: public_id,
                    folder: "pdf"
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result)
                }
            ).end(buffer)


        })

    } catch (error: any) {
        console.log(error);
        throw new AppError(401, `Error uploading file ${error.message}`)
    }
}



export const cloudinaryUpload = cloudinary;