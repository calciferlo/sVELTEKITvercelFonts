import "../../../chunks/index.js";
import PdfPrinter from "pdfmake";
import blobStream from "blob-stream";
import path from "node:path";
const regular = "/_app/immutable/assets/FuturaPTBook.85be74ee.otf";
const bold = "/_app/immutable/assets/FuturaPTCondBold.35d3f580.otf";
const fonts = {
  Futura: {
    normal: path.join(process.cwd(), ".vercel/output/static", regular),
    bold: path.join(process.cwd(), ".vercel/output/static", bold)
  }
};
const printer = new PdfPrinter(fonts);
async function genInvoicePdf() {
  const file = {
    pageMargins: [40, 40, 40, 60],
    content: ["Hello, World!!"],
    defaultStyle: {
      font: "Futura"
    }
  };
  return new Promise((resolve, reject) => {
    const pdf = printer.createPdfKitDocument(file);
    pdf.pipe(blobStream()).on("finish", function() {
      console.log("Finished generating PDF");
      resolve(this.toBlob("application/pdf"));
    }).on("error", (err) => {
      console.error("err", err);
      reject(err);
    });
    pdf.end();
  });
}
const GET = async ({ setHeaders }) => {
  const pdf = await genInvoicePdf();
  setHeaders({
    "Content-Type": "application/pdf",
    "Content-Length": pdf.size.toString(),
    "Last-Modified": (/* @__PURE__ */ new Date()).toUTCString(),
    "Cache-Control": "public, max-age=600"
  });
  return new Response(pdf);
};
export {
  GET
};
