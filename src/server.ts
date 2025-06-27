import express from "express";
import { createServer } from "http";
import { TicketController } from "./infrastructure/controller/ticket.controller";
import { TicketRoutes } from "./routes/ticket.routes";
import { TicketService } from "./service/ticket.service";
import { TicketRepository } from "./repository/tickets.repository";
import { Ticket } from "./infrastructure/entity/tickets.entity";
import { AppDataSource } from "./infrastructure/database/database";
import { setupSwagger } from "./config/swagger";

const PORT = 2225;
const app = express();
const httpServer = createServer(app);
setupSwagger(app);

// Initialize ticket repository and service
const ticketRepository = new TicketRepository(AppDataSource.getRepository(Ticket));
const ticketService = new TicketService(ticketRepository);

// Initialize ticket controller and routes
const ticketController = new TicketController(ticketService);
const ticketRoutes = new TicketRoutes(ticketController);

app.use(express.json());

// API Routes - Only tickets
app.use("/api/tickets", ticketRoutes.getRoutes());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "SOA Tickets API is running",
    timestamp: new Date().toISOString()
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 SOA Tickets API running on port ${PORT}`);
  console.log(`📚 Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
