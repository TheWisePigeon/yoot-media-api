import { FileBlob } from "bun"
import { v2 as cloudinary } from "cloudinary"
import * as fs from "fs"
const PORT = process.env.PORT || 3000
const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
cloudinary.config({
    cloud_name:CLOUDINARY_NAME as string,
    api_key:CLOUDINARY_API_KEY as string,
    api_secret:CLOUDINARY_API_SECRET as string
})

const server = Bun.serve({
  port: PORT,
  fetch: async(request)=> {
    console.log("Received")
    const form_data = await request.formData()
    const file = form_data.get('file') as FileBlob
    const file_extension = file.type.split("/")[1]
    console.log(file_extension)
    const media_id = crypto.randomUUID()
    const file_name = `${media_id}.${file_extension}`
    await Bun.write(file_name, file)
    console.log("Finished")
    return new Response();
  },
});

console.log(`Listening on localhost:${server.port}`);
