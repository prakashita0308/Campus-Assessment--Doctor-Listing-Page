import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.get("/api/doctors", async (req, res) => {
    try {
      const response = await fetch("https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json");
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      res.status(500).json({ 
        message: "Error fetching doctor data",
        error: (error as Error).message
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
