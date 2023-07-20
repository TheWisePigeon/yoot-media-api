import { writeFileSync, readFileSync, unlinkSync } from "fs"
import { FileBlob } from "bun"
import Imagekit from "imagekit"
import { IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY, IMAGEKIT_URL_ENDPOINT} from "./config"
const imagekit = new Imagekit({
  publicKey:IMAGEKIT_PUBLIC_KEY,
  privateKey:IMAGEKIT_PRIVATE_KEY,
  urlEndpoint:IMAGEKIT_URL_ENDPOINT
})

const server = Bun.serve({
    port: 8080,
    fetch: async (request) => {
      try {
        const form_data = await request.formData()
        const file_extension = form_data.get('file_extension')! as string
        const file_data = form_data.get('file_data')! as FileBlob
        const media_id = crypto.randomUUID()
        const fileName = `${media_id}.${file_extension}`
        writeFileSync(fileName, Buffer.from(await file_data.arrayBuffer()))
        const file = readFileSync(fileName).toString('base64')
        const { url } = await imagekit.upload({
          file,
          fileName
        })
        unlinkSync(fileName)
        return new Response(JSON.stringify({url}))
      } catch (err) {
        console.log('Error while handling file upload')
        console.log(err)
        return new Response("", { status:500})
      }
    },
});

console.log(`Listening on localhost:${server.port}`);
