import type { APIRoute } from 'astro'
import { XataClient } from '../../../xata.ts';
// Generated with CLI

const xata = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH });

//#region Get All Page Record
export async function GET() {
   try {
      const records = await xata.db.pages
         .select(["pageTitle", "pageContent", "PageDescription", "pageSlug"])
         .getAll();

      return new Response(
         JSON.stringify(records),
      )
   } catch (error: any) {
      console.log("Error Occured at Pages API GET", error);
   }
}
//#endregion

//#region Insert New Page Record
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
   try {
      var record = await xata.db.pages.create({
         pageTitle: data.get("titlePage")?.toString(),
         pageSlug: data.get("pageSlug")?.toString(),
         pageContent: data.get("pageContent")?.toString(),
         PageDescription: data.get("pageMetaDesc")?.toString(),
      });
      
      // console.log("response - ",record);
      
      if (record.id) {
         return new Response(
            JSON.stringify({
               message: "Page Data Saved Successfully"
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
   } catch (error:any) {
      // console.log("New Page API Error Message", error.errors[0].message);
      return new Response(
         JSON.stringify({
            status: 422,
            message: `New Page API Error Message- ${error.errors[0].message}`
         }),
         { status: 422 }
      );
   }
   
};
//#endregion