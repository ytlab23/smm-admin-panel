import type { APIRoute } from "astro";
import { XataClient } from "../../../xata";
const xata = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH });


//#region Fetching All Services
export async function GET() {
    try {
        const records = await xata.db.services.sort('serviceTitle', 'asc')
            .select(["serviceTitle", "serviceLogo", "serviceColor"])
            .getAll();

        return new Response(
            JSON.stringify(records),
        )
    } catch (error:any) {
        console.log("Error occured at API/Services/index", error);
        return new Response(
            JSON.stringify(error),
        )
    }
}
//#endregion

//#region Inserting a Services record
export const POST:APIRoute = async ({request}) => {

    const servicesData = await request.formData();
    // console.log("Service Received in API - " , servicesData);
    let Color;

    servicesData.get("serviceColor")?.toString() == "" 
    ? Color = servicesData.get("serviceColor")?.toString()
    : Color = servicesData.get("serviceColor")?.toString()
     
    const record = await xata.db.services.create({
        serviceTitle: servicesData.get("serviceName")?.toString(),
        serviceColor: Color,
        serviceLogo: {
            name : servicesData.get("imageName")?.toString(),
            mediaType : servicesData.get("imageFileType")?.toString(),
            base64Content : servicesData.get("imageBase64")?.toString(),
        },
    });

    if (record.id) {
        return new Response(
           JSON.stringify({
              message: "Service Data Saved Successfully"
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
}
//#endregion