const fs = require("fs");
const http = require("http");
const url = require("url");
///////////////////  READ AND WRITE FILE //////////////////////////

//Blocking or synchronous way
// const text = fs.readFileSync("./txt/hey.txt", "utf-8");
// console.log(text);
// const textOut = `This is what we know about the hey ${text}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output,txt", textOut);
// console.log('File has been written')

//non-blocking or asynchronus way

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile(
//         "./txt/final.txt",
//         `${data2}\n ${data3}  `,
//         "utf-8",
//         (err) => {
//           console.log("ur file is read");
//         }
//       );
//     });
//   });
// });

/////////////////////SERVER /////////////////////////
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENT%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESC%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/(%IMAGE%)/g, product.image);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
};
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  }

  //PRODUCT PAGE
  else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product)
    res.end(output);
  }

  //API PAGE
  //api is a service in which we can req some data
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  }

  //NOT FOUND
  else {
    res.end("this page cant be found");
  }
});

server.listen(5000, "127.0.0.1", () => {
  console.log("listening to req on PORT 5000");
});
