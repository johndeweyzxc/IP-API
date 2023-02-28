const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5173",
      "https://john-dewey-5c83a.web.app",
      "https://john-dewey-5c83a.firebaseapp.com",
    ],
  })
);

app.get("/:ip/:date", (req, res) => {
  let date = req.params.date;
  console.log("Date in request parameter: ", date.replace(/%20/g, " "));
  console.log("New request coming from: ", req.params.ip);

  // Fetch the information about the ip from req.params.ip
  // Returns the country, ip address, isp and region
  http
    .get(`http://ip-api.com/json/${req.params.ip}`, (ipRes) => {
      let data = [];

      ipRes.on("data", (chunk) => {
        data.push(chunk);
      });

      ipRes.on("end", () => {
        const ipInfo = JSON.parse(Buffer.concat(data).toString());
        return res.send({
          countryCode: ipInfo.countryCode,
          ip: ipInfo.query,
          isp: ipInfo.isp,
          region: ipInfo.region,
        });
      });
    })
    .on("error", (err) => {
      console.log("Error: ", err.message);
    });
});

app.listen(port, () => {
  console.log(`IP API Server started listening on port:${port}`);
});
