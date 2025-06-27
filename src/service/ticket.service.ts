import { Ticket } from "../infrastructure/entity/tickets.entity";
import { TicketRepository } from "../repository/tickets.repository";
import { CreateTicketDto, UpdateTicketDto, UseTicketDto, GenerateTicketsDto } from "../infrastructure/dto/tickets.dto";
import { plainToInstance } from "class-transformer";
import { getPaginated } from "../utils/getPaginated";

export class TicketService {
  constructor(private readonly ticketRepository: TicketRepository) {}

  /**
   * Get all Tickets
   */
  async getAllTickets(): Promise<Ticket[]> {
    return this.ticketRepository.findAll();
  }

  /**
   * Get active Tickets only
   */
  async getActiveTickets(): Promise<Ticket[]> {
    return this.ticketRepository.findActiveTickets();
  }

  /**
   * Get Ticket by ID
   * @param id Ticket ID
   */
  async getTicketById(id: number): Promise<Ticket> {
    return this.ticketRepository.findById(id);
  }

  /**
   * Get Ticket by code
   * @param code Ticket code
   */
  async getTicketByCode(code: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findByCode(code);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    return ticket;
  }

  /**
   * Get Tickets by event location
   * @param eventLocationId Event location ID
   */
  async getTicketsByEventLocation(eventLocationId: number): Promise<Ticket[]> {
    return this.ticketRepository.findByEventLocation(eventLocationId);
  }

  /**
   * Get unused tickets
   */
  async getUnusedTickets(): Promise<Ticket[]> {
    return this.ticketRepository.findUnusedTickets();
  }

  /**
   * Get used tickets
   */
  async getUsedTickets(): Promise<Ticket[]> {
    return this.ticketRepository.findUsedTickets();
  }

  /**
   * Create a new Ticket
   * @param ticketData Ticket data
   */
  async createTicket(ticketData: CreateTicketDto): Promise<Ticket> {
    const ticket = plainToInstance(Ticket, ticketData);
    
    // Generate unique code
    ticket.code = await this.ticketRepository.generateUniqueCode();
    
    return this.ticketRepository.create(ticket);
  }

  /**
   * Generate multiple tickets for an event location
   * @param generateData Data for ticket generation
   */
  async generateTickets(generateData: GenerateTicketsDto): Promise<Ticket[]> {
    const { eventLocationId, quantity } = generateData;
    
    if (quantity <= 0 || quantity > 1000) {
      throw new Error("Quantity must be between 1 and 1000");
    }

    const tickets: Partial<Ticket>[] = [];
    
    for (let i = 0; i < quantity; i++) {
      const code = await this.ticketRepository.generateUniqueCode();
      tickets.push({
        eventLocationId,
        code,
        isUsed: false,
        isActive: true,
        deleted: false
      });
    }

    return this.ticketRepository.bulkCreate(tickets);
  }

  /**
   * Update a ticket
   * @param ticketData Ticket data to update
   */
  async updateTicket(ticketData: UpdateTicketDto): Promise<Ticket> {
    const ticket = plainToInstance(Ticket, ticketData);
    const { id } = await this.ticketRepository.findById(ticketData.id);

    // If code is being updated, check if it's unique
    if (ticket.code) {
      const existingTicket = await this.ticketRepository.findByCode(ticket.code);
      if (existingTicket && existingTicket.id !== id) {
        throw new Error(`Code "${ticket.code}" is already in use`);
      }
    }

    return this.ticketRepository.update(ticket.id, ticket);
  }

  /**
   * Use a ticket by code
   * @param useData Ticket use data
   */
  async useTicket(useData: UseTicketDto): Promise<Ticket> {
    const ticket = await this.ticketRepository.findByCode(useData.code);
    
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    if (ticket.isUsed) {
      throw new Error("Ticket has already been used");
    }

    if (!ticket.isActive) {
      throw new Error("Ticket is not active");
    }

    return this.ticketRepository.useTicketByCode(useData.code);
  }

  /**
   * Use a ticket by ID
   * @param id Ticket ID
   */
  async useTicketById(id: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findById(id);
    
    if (ticket.isUsed) {
      throw new Error("Ticket has already been used");
    }

    if (!ticket.isActive) {
      throw new Error("Ticket is not active");
    }

    return this.ticketRepository.useTicket(id);
  }

  /**
   * Soft delete a ticket
   * @param id Ticket ID
   */
  async softDelete(id: number): Promise<any> {
    const exists = await this.ticketRepository.findById(id);

    if (!exists) {
      throw new Error("Ticket does not exist");
    }
    return await this.ticketRepository.softDelete(id);
  }

  /**
   * Activate a ticket
   * @param id Ticket ID
   */
  async activateTicket(id: number): Promise<void> {
    await this.ticketRepository.findById(id); // Verify ticket exists
    await this.ticketRepository.activateTicket(id);
  }

  /**
   * Deactivate a ticket
   * @param id Ticket ID
   */
  async deactivateTicket(id: number): Promise<void> {
    await this.ticketRepository.findById(id); // Verify ticket exists
    await this.ticketRepository.deactivateTicket(id);
  }

  /**
   * Get paginated tickets
   * @param page Page number
   * @param itemsPerPage Items per page
   */
  async getPaginated(page: number, itemsPerPage: number) {
    return getPaginated<Ticket>(this.ticketRepository, page, itemsPerPage);
  }

  /**
   * Get ticket statistics
   */
  async getTicketStatistics() {
    const totalTickets = await this.ticketRepository.count({ deleted: false });
    const usedTickets = await this.ticketRepository.count({ isUsed: true, deleted: false });
    const unusedTickets = await this.ticketRepository.count({ isUsed: false, deleted: false });
    const activeTickets = await this.ticketRepository.count({ isActive: true, deleted: false });

    return {
      total: totalTickets,
      used: usedTickets,
      unused: unusedTickets,
      active: activeTickets,
      usageRate: totalTickets > 0 ? (usedTickets / totalTickets) * 100 : 0
    };
  }
} 