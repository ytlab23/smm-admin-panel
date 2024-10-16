import type { APIRoute } from 'astro'
import { XataClient } from '../../../xata.ts';
// Generated with CLI

interface panelStructure{
   panelTitle : string,
   panelWebsiteURL : string,
   panelAPILink : string,
   panelAPIKey : string,
   panelSlug : string,
   panelTextDescrition : string,
   panelMetaDesc : string,
   rating : number,
   ratingOtherSites : string,
   paymentOptions : string,
   paneFeaturedImage? : {
       name? : string,
       mediaType? : string,
       base64Content? : string
   },
}

const xata = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH });

export async function GET() {
   try {
      const records = await xata.db["panels-datatable"]
         .select([
            "panelTitle",
            "panelWebsiteURL",
            "panelAPILink",
            "panelAPIKey",
            "panelSlug",
            "panelTextDescrition",
            "panelMetaDesc",
            "rating",
            "ratingOtherSites",
            "paymentOptions",
            "paneFeaturedImage"
         ])
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

   let dataToUpdate :panelStructure= {
      panelTitle: data.get("panelTitle")?.toString() || "",
      panelWebsiteURL: data.get("panelWebsiteURL")?.toString() || "",
      panelAPILink: data.get("panelAPILink")?.toString() || "",
      panelAPIKey: data.get("panelAPIKey")?.toString() || "",

      panelMetaDesc : data.get("panelMetaDesc")?.toString() || "",
      panelSlug: data.get("panelSlug")?.toString() || "",
      panelTextDescrition: data.get("panelTextDescrition")?.toString() || "",
      rating: Number(data.get("rating")!),
      paymentOptions: data.get("paymentOptions")?.toString() || "",
      ratingOtherSites : data.get("otherRatings")?.toString() || "",
   }

   if (data.get("imageName") || data.get("imageFileType") || data.get("imageBase64")) {
      dataToUpdate.paneFeaturedImage = {
          name: data.get("imageName")?.toString() || "",
          mediaType: data.get("imageFileType")?.toString() || "",
          base64Content: data.get("imageBase64")?.toString() || ""
      };
   }
   const record = await xata.db["panels-datatable"].create(dataToUpdate);

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
