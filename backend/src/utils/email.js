import emailjs from "@emailjs/nodejs";

const SERVICE_ID = "service_gquo3ua";

export const init = async () => {
  emailjs.init({
    publicKey: process.env.EMAILJS_PUBLIC_KEY,
    //blockHeadless: true
  });
};

//export const sendNotification = (name, time, message, email) => {
//  emailjs.send(SERVICE_ID, "template_0rvgpqq", {name, time, message, email}).then(
//    (resp) => {
//      console.log("email sent: ", resp.status, resp.text)
//    },
//    (error) => {
//      console.log("email sending failed", error)
//    })
//}
//
