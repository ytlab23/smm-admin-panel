import type { APIRoute } from "astro";
import { XataClient } from '../../../xata.ts';
// Generated with CLI
const xata = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH });

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

//#region Returns Panel Information by ID
export const GET: APIRoute = async ({ params }) => {
    const id = params.id;
    // console.log("Parameter received - ", id);
    
    const record = await xata.db["panels-datatable"].read(id?.toString() || "");
    // console.log(record);
    if (record!.id == id) {
        return new Response(
            JSON.stringify({
                id: id,
                status: 200,
                data: record,
            }))
    }
    else {
        return new Response(
            JSON.stringify({
                id: id,
                status: 404,
                message: `${id} Not Found in the Database`
            }))
    }
}
//#endregion

//#region Updates Panels Information by ID
export const PUT : APIRoute = async ({params, request}) =>{
    const data = await request.formData();
    const id = params.id;

    if (!data) {
        return new Response(
            JSON.stringify({
                message: "Missing required fields",
            }),
            { status: 400 }
        );
    }

    let dataToUpdate : panelStructure ={
        panelTitle : data.get("panelTitle")?.toString() || "",
        panelWebsiteURL : data.get("panelWebsiteURL")?.toString() || "",
        panelAPILink : data.get("panelAPILink")?.toString() || "",
        panelAPIKey : data.get("panelAPIKey")?.toString() || "",
        panelSlug : data.get("panelSlug")?.toString() || "",
        panelTextDescrition : data.get("panelTextDescrition")?.toString() || "",
        panelMetaDesc : data.get("panelMetaDesc")?.toString() || "",
        rating : Number(data.get("rating")!),
        ratingOtherSites : data.get("otherRatings")?.toString() || "",
        paymentOptions : data.get("paymentOptions")?.toString() || "",
    };

    if (data.get("imageName") || data.get("imageFileType") || data.get("imageBase64")) {
        dataToUpdate.paneFeaturedImage = {
            name: data.get("imageName")?.toString() || "",
            mediaType: data.get("imageFileType")?.toString() || "",
            base64Content: data.get("imageBase64")?.toString() || ""
        };
    }

    // console.log("received in API - " , data);
    // console.log("received in API - " , dataToUpdate);
    
    const record = await xata.db["panels-datatable"].update(id?.toString() || "", dataToUpdate)
    // console.log(record);
    
    if (record!.id) {
        return new Response(
           JSON.stringify({
            id: id,
            message : "Data Updated Successfully",
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

//#region Delete Panels Information by ID
export const DELETE: APIRoute = async ({ params }) => {
    const id = params.id;
    const record = await xata.db["panels-datatable"].delete(id?.toString() || "");
    // console.log(record);
    if (record!.id == id) {
        return new Response(
            JSON.stringify({
                id: id,
                status : 200,
                message: `${id} Deleted from the Database`
            }))
    }
    else {
        return new Response(
            JSON.stringify({
                id: id,
                status : 404,
                message: `${id} Not Found in the Database`
            }))
    }
}
//#endregion