export async function GET() {
  console.log("fruits route", __filename);

  return Response.json("Apple");
}
