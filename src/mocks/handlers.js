import { http, HttpResponse } from "msw";


export const handlers = [
 http.get(
   "https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com/confirmation",
   () => {
     const data = JSON.parse(sessionStorage.getItem("confirmation"));
     return HttpResponse.json(data || {});
   }
 ),
 http.post(
   "https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com",
   async ({ request }) => {
     const body = await request.json();
     const { when, lanes, people, shoes } = body;


     const price = parseInt(lanes) * 100 + parseInt(people) * 120;
     const confirmation = {
       id: "12345",
       price: price.toString(),
       active: true,
       when,
       lanes,
       people,
       shoes,
       price,
     };


     sessionStorage.setItem("confirmation", JSON.stringify(confirmation));


     return HttpResponse.json(confirmation);
   }
 ),
];

