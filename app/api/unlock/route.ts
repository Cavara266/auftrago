import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req:Request){

const body = await req.json()

const user = await prisma.user.findUnique({
where:{id:body.userId}
})

if(user.credits < 5){
return new NextResponse("Not enough credits",{status:400})
}

await prisma.unlock.create({

data:{
userId:body.userId,
leadId:body.leadId
}

})

await prisma.user.update({

where:{id:body.userId},

data:{
credits:{decrement:5}
}

})

return NextResponse.json({success:true})

}