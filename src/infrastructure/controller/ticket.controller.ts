import { Request, Response } from "express";
import { CreateTicketDto, UpdateTicketDto, UseTicketDto, GenerateTicketsDto } from "../dto/tickets.dto";
import { TicketService } from "../../service/ticket.service";
import { plainToInstance } from "class-transformer";

export class TicketController {
  private readonly ticketService: TicketService;

  constructor(service: TicketService) {
    this.ticketService = service;
  }

  async createTicket(req: Request, res: Response) {
    try {
      const data = plainToInstance(CreateTicketDto, req.body, {
        excludeExtraneousValues: true
      });
      const newTicket = await this.ticketService.createTicket(data);
      res.status(201).json(newTicket);
    } catch (error) {
      if (error.message.includes("already exists")) {
        res.status(409).json({ message: error.message });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }

  async generateTickets(req: Request, res: Response) {
    try {
      const data = plainToInstance(GenerateTicketsDto, req.body, {
        excludeExtraneousValues: true
      });
      const tickets = await this.ticketService.generateTickets(data);
      res.status(201).json({
        message: `${tickets.length} tickets generated successfully`,
        tickets: tickets
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateTicket(req: Request, res: Response) {
    try {
      console.log(req.body);
      
      const data: UpdateTicketDto = plainToInstance(UpdateTicketDto, req.body, {
        excludeExtraneousValues: true 
      });
      

      const updatedTicket = await this.ticketService.updateTicket(data);
      res.status(200).json(updatedTicket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async useTicket(req: Request, res: Response) {
    try {
      const data = plainToInstance(UseTicketDto, req.body, {
        excludeExtraneousValues: true
      });
      const usedTicket = await this.ticketService.useTicket(data);
      res.status(200).json({
        message: "Ticket used successfully",
        ticket: usedTicket
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async useTicketById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ticketId = parseInt(id);
      const usedTicket = await this.ticketService.useTicketById(ticketId);
      res.status(200).json({
        message: "Ticket used successfully",
        ticket: usedTicket
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getTicketById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ticketId = parseInt(id);
      const ticket = await this.ticketService.getTicketById(ticketId);
      res.status(200).json(ticket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getTicketByCode(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const ticket = await this.ticketService.getTicketByCode(code);
      res.status(200).json(ticket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }



  async getTicketsByEventLocation(req: Request, res: Response) {
    try {
      const { eventLocationId } = req.params;
      const locationId = parseInt(eventLocationId);
      const tickets = await this.ticketService.getTicketsByEventLocation(locationId);
      res.status(200).json(tickets);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }


  async getUnusedTickets(req: Request, res: Response) {
    try {
      const tickets = await this.ticketService.getUnusedTickets();
      res.status(200).json(tickets);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getUsedTickets(req: Request, res: Response) {
    try {
      const tickets = await this.ticketService.getUsedTickets();
      res.status(200).json(tickets);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getActiveTickets(req: Request, res: Response) {
    try {
      const tickets = await this.ticketService.getActiveTickets();
      res.status(200).json(tickets);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllTickets(req: Request, res: Response) {
    try {
      const tickets = await this.ticketService.getAllTickets();
      res.status(200).json(tickets);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPaginated(req: Request, res: Response) {
    try {
      const { page, items } = req.query;
      const parsedPage = Number(page) - 1;
      const parsedItems = Number(items);

      if (parsedPage < 0) {
        throw new Error("Page number must be greater than 0");
      }

      const result = await this.ticketService.getPaginated(
        parsedPage,
        parsedItems
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getTicketStatistics(req: Request, res: Response) {
    try {
      const statistics = await this.ticketService.getTicketStatistics();
      res.status(200).json(statistics);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async softDelete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ticketId = parseInt(id);
      const result = await this.ticketService.softDelete(ticketId);
      res.status(200).json({
        message: "Ticket deleted successfully",
        result: result
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async activateTicket(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ticketId = parseInt(id);
      await this.ticketService.activateTicket(ticketId);
      res.status(200).json({
        message: "Ticket activated successfully"
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deactivateTicket(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ticketId = parseInt(id);
      await this.ticketService.deactivateTicket(ticketId);
      res.status(200).json({
        message: "Ticket deactivated successfully"
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
} 