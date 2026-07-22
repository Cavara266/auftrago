import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      invoiceId: string;
    };
  }
) {
  const session = await getSession();
  const email = session?.user?.email;

  if (!email) {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      email: email.trim().toLowerCase(),
    },
    select: {
      id: true,
    },
  });

  if (!provider) {
    redirect("/login");
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: params.invoiceId,
      providerId: provider.id,
    },
    include: {
      fixedOrder: true,
    },
  });

  if (!invoice) {
    return NextResponse.json(
      {
        error: "Rechnung nicht gefunden.",
      },
      {
        status: 404,
      }
    );
  }

  const amount = new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
  }).format(invoice.amountCents / 100);

  const created = new Intl.DateTimeFormat("de-CH").format(
    invoice.createdAt
  );

  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>${invoice.invoiceNumber}</title>
<style>
body{
font-family:Arial,Helvetica,sans-serif;
padding:50px;
color:#222;
}
table{
width:100%;
border-collapse:collapse;
margin-top:30px;
}
td,th{
border:1px solid #ddd;
padding:12px;
}
h1{
margin-bottom:0;
}
.small{
color:#777;
}
</style>
</head>
<body>

<h1>Rechnung</h1>

<p class="small">
${invoice.invoiceNumber}
</p>

<hr>

<h3>Auftrago</h3>

<p>
Vermittlungsplattform
</p>

<h3>Position</h3>

<table>

<tr>
<th>Leistung</th>
<th>Betrag</th>
</tr>

<tr>
<td>
Übernahme Fixauftrag<br>
<b>${invoice.fixedOrder.title}</b>
</td>

<td>
${amount}
</td>

</tr>

</table>

<p style="margin-top:30px;">
Status:
<b>${invoice.status}</b>
</p>

<p>
Rechnungsdatum:
${created}
</p>

</body>
</html>
`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="${invoice.invoiceNumber}.html"`,
    },
  });
}