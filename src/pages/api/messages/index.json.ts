import type { APIRoute } from 'astro'
import { XataClient } from '../../../xata.ts';
// Generated with CLI

const xata = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH });

export async function GET() {
   try {
       const records = await xata.db.contact_msgs
           .select(["username", "email", "message", "status"])
           .getAll();

      return new Response(
         JSON.stringify(records),
      )
   } catch (error:any) {
      if(error.toString().includes("column [panelSlug]: is not unique"))
         return new Response(
            JSON.stringify("Please enter a different a Permalink/Slug"),
         )
      console.log(error);
   }
}

export const POST: APIRoute = async ({ request }) => {

   const data = await request.formData();
   // console.log("received in API - " , data);

   if (!data) {
      return new Response(
         JSON.stringify({
            message: "Missing required fields",
         }),
         { status: 400 }
      );
   }

   // const imageFile = new Blob([data.get("imageBase64") || ""],
   //    { type: data.get("imageFileType")?.toString() || "" })

   // Do something with the data, then return a success response
   
    const record = await xata.db.contact_msgs.create({
        username: data.get("contact_name")?.toString() || "",
        email: data.get("contact_email")?.toString() || "",
        message: data.get("contact_msg")?.toString() || "",
    });
   if (record.id) {
      return new Response(
         JSON.stringify({
            message: "Data Saved Successfully"
         }),
         { status: 200 }
      );
   }
   else
      return new Response(
         JSON.stringify({
            message: "Data saving Error!"
         }),
         { status: 300 }
      );

};
