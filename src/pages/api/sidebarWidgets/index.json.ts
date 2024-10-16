import type { APIRoute } from 'astro'
import { XataClient } from '../../../xata.ts';
// Generated with CLI

const xata = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH });

export async function GET() {
    try {
        const records = await xata.db.sidebarWidgets
            .select(["widgetCodeBlock", "widgetTitle"])
            .getAll();

        return new Response(
            JSON.stringify(records),
         )
    } catch (error:any) {
        console.log("Error Occured at Pages API GET", error);
    }
}
 
//#region Inserting a Sidebar Widget record
export const POST:APIRoute = async ({request}) => {

    const dataReceived = await request.formData();
    // console.log("Service Received in API - " , servicesData);
  
    const record = await xata.db.sidebarWidgets.create({
        widgetTitle: dataReceived.get("widgetTitle")?.toString(),
        widgetCodeBlock: dataReceived.get("widgetHTMLCode")?.toString()
    });

    if (record.id) {
        return new Response(
           JSON.stringify({
              message: "Sidebar Widget Data Saved Successfully"
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