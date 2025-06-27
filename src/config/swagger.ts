import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import dotenv from 'dotenv';
dotenv.config();

import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SOA Tickets API - Sistema de Gestión de Tickets",
      version: "1.0.0",
      description: "API para la gestión completa de tickets de eventos",
    },
    components: {
      schemas: {
        // Ticket DTOs
        CreateTicketDto: {
          type: "object",
          required: ["eventLocationId"],
          properties: {
            eventLocationId: { type: "integer", example: 1, description: "ID de la ubicación del evento" },
          },
        },
        UpdateTicketDto: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "integer", example: 1, description: "ID del ticket" },
            eventLocationId: { type: "integer", example: 1, description: "ID de la ubicación del evento" },
            code: { type: "string", example: "ABC12345", description: "Código único del ticket" },
            isUsed: { type: "boolean", example: false, description: "Indica si el ticket ha sido usado" },
            usedAt: { type: "string", format: "date-time", example: "2024-01-15T10:30:00Z", description: "Fecha y hora de uso del ticket" },
            isActive: { type: "boolean", example: true, description: "Indica si el ticket está activo" },
          },
        },
        UseTicketDto: {
          type: "object",
          required: ["code"],
          properties: {
            code: { type: "string", example: "ABC12345", description: "Código del ticket a usar" },
          },
        },
        GenerateTicketsDto: {
          type: "object",
          required: ["eventLocationId", "quantity"],
          properties: {
            eventLocationId: { type: "integer", example: 1, description: "ID de la ubicación del evento" },
            quantity: { type: "integer", example: 100, description: "Cantidad de tickets a generar (máximo 1000)" },
          },
        },
        // Ticket Entity
        Ticket: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1, description: "ID único del ticket" },
            eventLocationId: { type: "integer", example: 1, description: "ID de la ubicación del evento" },
            code: { type: "string", example: "ABC12345", description: "Código único del ticket" },
            usedAt: { type: "string", format: "date-time", example: "2024-01-15T10:30:00Z", description: "Fecha y hora de uso del ticket" },
            isUsed: { type: "boolean", example: false, description: "Indica si el ticket ha sido usado" },
            createdAt: { type: "string", format: "date-time", example: "2024-01-01T00:00:00Z", description: "Fecha de creación del ticket" },
            updatedAt: { type: "string", format: "date-time", example: "2024-01-01T00:00:00Z", description: "Fecha de última actualización" },
            isActive: { type: "boolean", example: true, description: "Indica si el ticket está activo" },
            deleted: { type: "boolean", example: false, description: "Indica si el ticket está eliminado (soft delete)" },
          },
        },
        // Ticket Statistics
        TicketStatistics: {
          type: "object",
          properties: {
            total: { type: "integer", example: 1000, description: "Total de tickets" },
            used: { type: "integer", example: 750, description: "Tickets utilizados" },
            unused: { type: "integer", example: 250, description: "Tickets no utilizados" },
            active: { type: "integer", example: 950, description: "Tickets activos" },
            usageRate: { type: "number", format: "float", example: 75.0, description: "Porcentaje de uso de tickets" },
          },
        },
        // Error Response
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Error description", description: "Descripción del error" },
          },
        },
        // Success Response
        SuccessResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Operation completed successfully", description: "Mensaje de éxito" },
            data: { type: "object", description: "Datos de la respuesta" },
          },
        },
      },
    },
    servers: [
      {
         url: process.env.SWAGGER_SERVER_URL || 'http://localhost:2225/api',
      },
    ],
  },
  apis: ["src/routes/*.ts"], // debe apuntar a donde están tus rutas
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}
