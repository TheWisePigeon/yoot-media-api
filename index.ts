import { FileBlob } from "bun"
import * as fs from "fs"
import { v2 as cloudinary } from "cloudinary"
const PORT = process.env.PORT || 3000
const { 
    CLOUDINARY_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_UPLOAD_PRESET
} = process.env
cloudinary.config({
    cloud_name: CLOUDINARY_NAME as string,
    api_key: CLOUDINARY_API_KEY as string,
    api_secret: CLOUDINARY_API_SECRET as string
})

const server = Bun.serve({
    port: PORT,
    fetch: async (request) => {
        const form_data = await request.formData()
        const file = form_data.get('file') as FileBlob
        const file_extension = file.type.split("/")[1]
        const media_id = crypto.randomUUID()
        const file_name = `${media_id}.${file_extension}`
        const file_data = await file.arrayBuffer()
        fs.writeFile(file_name, file_data, (err)=>{
            if(err){
                console.log("Error writting file")
                console.log(err)
                return new Response()
            }
        })
        try {
            const upload_response = await cloudinary.uploader.upload(
                file_name,
                {
                    public_id: media_id,
                    resource_type: "image"
                },
                (err, result) => {
                    if (err) throw err
                    return result
                }
            )
            const { secure_url, url } = upload_response
            console.log(secure_url, url)
            return new Response(
                JSON.stringify({ secure_url, url })
            )
        } catch (error) {
            console.log("Error uploading to cloudinary ")
            console.log(error)
            return new Response("", { status:500 });
        }
    },
});

console.log(`Listening on localhost:${server.port}`);
