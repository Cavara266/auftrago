import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"

export async function POST(){

const session = await stripe.checkout.sessions.create({

payment_method_types:["card"],

line_items:[
{
price_data:{
currency:"chf",
product_data:{name:"50 Credits"},
unit_amount:5000
},
quantity:1
}
],

mode:"payment",

success_url:"https://auftrago.ch/dashboard",
cancel_url:"https://auftrago.ch"

})

return NextResponse.json({url:session.url})

}