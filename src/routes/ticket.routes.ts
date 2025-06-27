import { Router } from "express";
import { TicketController } from "../infrastructure/controller/ticket.controller";

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: API para la gestión de tickets de eventos
 */
export class TicketRoutes {
  private router: Router;
  private controller: TicketController;

  constructor(ticketController: TicketController) {
    this.router = Router();
    this.controller = ticketController;

    /**
     * @swagger
     * /tickets:
     *   post:
     *     summary: Crear un nuevo ticket
     *     tags: [Tickets]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateTicketDto'
     *     responses:
     *       201:
     *         description: Ticket creado correctamente
     *       400:
     *         description: Error en la solicitud
     *       409:
     *         description: El código del ticket ya existe
     */
    this.router.post("/", this.controller.createTicket.bind(this.controller));

    /**
     * @swagger
     * /tickets/generate:
     *   post:
     *     summary: Generar múltiples tickets para una ubicación de evento
     *     tags: [Tickets]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/GenerateTicketsDto'
     *     responses:
     *       201:
     *         description: Tickets generados correctamente
     *       400:
     *         description: Error en la solicitud
     */
    this.router.post("/generate", this.controller.generateTickets.bind(this.controller));

    /**
     * @swagger
     * /tickets:
     *   put:
     *     summary: Actualizar un ticket existente
     *     tags: [Tickets]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateTicketDto'
     *     responses:
     *       200:
     *         description: Ticket actualizado correctamente
     *       400:
     *         description: Error en la solicitud
     */
    this.router.put("/", this.controller.updateTicket.bind(this.controller));

    /**
     * @swagger
     * /tickets/use:
     *   post:
     *     summary: Usar un ticket por código
     *     tags: [Tickets]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UseTicketDto'
     *     responses:
     *       200:
     *         description: Ticket usado correctamente
     *       400:
     *         description: Error al usar el ticket
     */
    this.router.post("/use", this.controller.useTicket.bind(this.controller));

    /**
     * @swagger
     * /tickets/{id}/use:
     *   post:
     *     summary: Usar un ticket por ID
     *     tags: [Tickets]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *     responses:
     *       200:
     *         description: Ticket usado correctamente
     *       400:
     *         description: Error al usar el ticket
     */
    this.router.post("/:id/use", this.controller.useTicketById.bind(this.controller));

    /**
     * @swagger
     * /tickets:
     *   get:
     *     summary: Obtener lista paginada de tickets
     *     tags: [Tickets]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           example: 1
     *         description: Página a obtener
     *       - in: query
     *         name: items
     *         schema:
     *           type: integer
     *           example: 10
     *         description: Cantidad de tickets por página
     *     responses:
     *       200:
     *         description: Lista paginada de tickets
     *       400:
     *         description: Error en los parámetros
     */
    this.router.get("/", this.controller.getPaginated.bind(this.controller));

    /**
     * @swagger
     * /tickets/all:
     *   get:
     *     summary: Obtener todos los tickets
     *     tags: [Tickets]
     *     responses:
     *       200:
     *         description: Lista de todos los tickets
     *       400:
     *         description: Error al obtener los tickets
     */
    this.router.get("/all", this.controller.getAllTickets.bind(this.controller));

    /**
     * @swagger
     * /tickets/active:
     *   get:
     *     summary: Obtener tickets activos
     *     tags: [Tickets]
     *     responses:
     *       200:
     *         description: Lista de tickets activos
     *       400:
     *         description: Error al obtener los tickets
     */
    this.router.get("/active", this.controller.getActiveTickets.bind(this.controller));

    /**
     * @swagger
     * /tickets/unused:
     *   get:
     *     summary: Obtener tickets no utilizados
     *     tags: [Tickets]
     *     responses:
     *       200:
     *         description: Lista de tickets no utilizados
     *       400:
     *         description: Error al obtener los tickets
     */
    this.router.get("/unused", this.controller.getUnusedTickets.bind(this.controller));

    /**
     * @swagger
     * /tickets/used:
     *   get:
     *     summary: Obtener tickets utilizados
     *     tags: [Tickets]
     *     responses:
     *       200:
     *         description: Lista de tickets utilizados
     *       400:
     *         description: Error al obtener los tickets
     */
    this.router.get("/used", this.controller.getUsedTickets.bind(this.controller));

    /**
     * @swagger
     * /tickets/statistics:
     *   get:
     *     summary: Obtener estadísticas de tickets
     *     tags: [Tickets]
     *     responses:
     *       200:
     *         description: Estadísticas de tickets
     *       400:
     *         description: Error al obtener las estadísticas
     */
    this.router.get("/statistics", this.controller.getTicketStatistics.bind(this.controller));

    /**
     * @swagger
     * /tickets/{id}:
     *   get:
     *     summary: Obtener ticket por ID
     *     tags: [Tickets]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *     responses:
     *       200:
     *         description: Ticket encontrado
     *       400:
     *         description: Ticket no encontrado o ID inválido
     */
    this.router.get("/:id", this.controller.getTicketById.bind(this.controller));

    /**
     * @swagger
     * /tickets/code/{code}:
     *   get:
     *     summary: Obtener ticket por código
     *     tags: [Tickets]
     *     parameters:
     *       - in: path
     *         name: code
     *         required: true
     *         schema:
     *           type: string
     *           example: "ABC12345"
     *     responses:
     *       200:
     *         description: Ticket encontrado
     *       400:
     *         description: Ticket no encontrado o código inválido
     */
    this.router.get("/code/:code", this.controller.getTicketByCode.bind(this.controller));

    /**
     * @swagger
     * /tickets/event-location/{eventLocationId}:
     *   get:
     *     summary: Obtener tickets por ubicación de evento
     *     tags: [Tickets]
     *     parameters:
     *       - in: path
     *         name: eventLocationId
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *     responses:
     *       200:
     *         description: Lista de tickets para la ubicación
     *       400:
     *         description: Error al obtener los tickets
     */
    this.router.get("/event-location/:eventLocationId", this.controller.getTicketsByEventLocation.bind(this.controller));

    /**
     * @swagger
     * /tickets/{id}/activate:
     *   post:
     *     summary: Activar un ticket
     *     tags: [Tickets]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *     responses:
     *       200:
     *         description: Ticket activado correctamente
     *       400:
     *         description: Error al activar el ticket
     */
    this.router.post("/:id/activate", this.controller.activateTicket.bind(this.controller));

    /**
     * @swagger
     * /tickets/{id}/deactivate:
     *   post:
     *     summary: Desactivar un ticket
     *     tags: [Tickets]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *     responses:
     *       200:
     *         description: Ticket desactivado correctamente
     *       400:
     *         description: Error al desactivar el ticket
     */
    this.router.post("/:id/deactivate", this.controller.deactivateTicket.bind(this.controller));

    /**
     * @swagger
     * /tickets/{id}:
     *   delete:
     *     summary: Eliminar un ticket (soft delete)
     *     tags: [Tickets]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *     responses:
     *       200:
     *         description: Ticket eliminado correctamente
     *       400:
     *         description: Error al eliminar el ticket
     */
    this.router.delete("/:id", this.controller.softDelete.bind(this.controller));
  }

  public getRoutes(): Router {
    return this.router;
  }
} 