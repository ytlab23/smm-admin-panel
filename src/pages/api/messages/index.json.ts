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
   // Do something with the data, then return a success response
   
   const record = await xata.db.contact_msgs.create({
      username: data.get("contact_name")?.toString() || "",
      email: data.get("contact_email")?.toString() || "",
      message: data.get("contact_msg")?.toString() || "",
   });
   if (record.id) {
      const emailParams = {
         service_id: import.meta.env.PUBLIC_AUTORespond_SERVICE_ID,
         template_id: import.meta.env.PUBLIC_AUTORespond_TEMPLATE_ID,
         user_id: import.meta.env.PUBLIC_ForgotPass_PUBLICKEY,
         accessToken: import.meta.env.PUBLIC_ForgotPass_PRIVATEKEY,
         template_params: {
            site_name: 'SMMSearch.io Team',
            to_name: data.get("contact_name")?.toString(),
            to_email: data.get("contact_email")?.toString(),
            website_link: "https://smmsearch.io/"
         }
      };

      let respondMessage="";
      try {
         const emailJSresponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailParams),
         });
         // console.log(emailJSresponse);
         
         if (emailJSresponse.ok) {
            console.log('SUCCESS!', emailJSresponse, emailJSresponse.status, emailJSresponse.text);
            respondMessage = "Message Saved into Database and Email is Sent."
         } else {
            const error = await emailJSresponse.json();
            console.log('FAILED...', error);
            respondMessage = "Message Saved into Database and Email is not Sent."
         }
      } 
      catch (error) {
          console.log("Email JS error-", error);
      }
     
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
