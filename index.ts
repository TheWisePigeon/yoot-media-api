import { FileBlob } from "bun"
import * as fs from "fs"
const PORT = process.env.PORT || 3000
const server = Bun.serve({
    port: PORT,
    fetch: async (request) => {
        const form_data = await request.formData()
        const file = form_data.get('file') as FileBlob
        const file_extension = file.type.split("/")[1]
        const media_id = crypto.randomUUID()
        const file_name = `${media_id}.${file_extension}`
        const file_data = await file.arrayBuffer()
        fs.writeFile(file_name, file_data, (err) => {
            if (err) {
                console.log("Error writting file")
                console.log(err)
                return new Response()
            }
        })
        try {
            return new Response()
        } catch (error) {
            console.log("Error uploading to cloudinary ")
            console.log(error)
            return new Response("", { status: 500 });
        }
    },
});

console.log(`Listening on localhost:${server.port}`);
