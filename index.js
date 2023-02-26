const express = require("express");
const http = require("http");
const app = express();
const port = 3000;

app.get("/:ip/:date", (req, res) => {
  console.log("Date in request parameter: ", req.params.date);
  console.log("New request coming from: ", req.params.ip);

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
