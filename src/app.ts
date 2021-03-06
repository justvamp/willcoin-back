import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import expressValidator from "express-validator";

import * as apiController from "./controllers/api";

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

app.get("/", apiController.index);
app.get("/api", apiController.getApi);
app.get("/api/get_sm", apiController.getSmartContract);
app.get("/api/deploy", apiController.deploySmartContract);
app.get("/api/run_action", apiController.runAction);

export default app;
