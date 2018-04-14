"use strict";

import async from "async";
import request from "request";
import { Response, Request, NextFunction } from "express";

export let index = (req: Request, res: Response) => {
  res.render("home", {
    title: "Home"
  });
};

export let getApi = (req: Request, res: Response) => {
  res.render("api/index", {
    title: "API Examples"
  });
};
