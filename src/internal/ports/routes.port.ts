import { Router } from "../../cmd/gateway";
import express from "express";

export interface IRouter {
  getRouter(): express.Router;
}

export interface IRoutes {
  registerRoutes(): Router;
}
