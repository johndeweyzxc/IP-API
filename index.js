const express = require("express");
const http = require("http");
const app = express();
const port = 3000;

app.get("/:ip", (req, res) => {
  http
    .get(`http://ip-api.com/json/${req.params.ip}`, (ipRes) => {
      let data = [];
      const headerDate =
        ipRes.headers && ipRes.headers.date
          ? ipRes.headers.date
          : "no response date";
      console.log("Status Code:", ipRes.statusCode);
      console.log("Date in Response header:", headerDate);

      ipRes.on("data", (chunk) => {
        data.push(chunk);
      });

      ipRes.on("end", () => {
        const ipInfo = JSON.parse(Buffer.concat(data).toString());
        console.log(`Request from: ${ipInfo.query}`);
        return res.send({
          countryCode: ipInfo.countryCode,
          ip: ipInfo.query,
          isp: ipInfo.isp,
          region: ipInfo.region,
          userAgent: ipInfo.userAgent,
        });
      });
    })
    .on("error", (err) => {
      console.log("Error: ", err.message);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
