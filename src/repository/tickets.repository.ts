import { Repository, DeleteResult, UpdateResult } from "typeorm";
import { Ticket } from "../infrastructure/entity/tickets.entity";
import { IBaseRepository } from "./base-repository.interface";

export class TicketRepository implements IBaseRepository<Ticket> {
  public constructor(private repository: Repository<Ticket>) {
    this.repository = repository;
  }

  async getPaginated(limit: number, offset: number): Promise<any> {
    if (limit < 1 || offset < 0) {
      throw new Error("Invalid pagination parameters");
    }

    const [data] = await this.repository.findAndCount({
      skip: offset,
      take: limit,
      order: {
        createdAt: "DESC",
      },
      where: {
        deleted: false,
      },
    });
    const count = await this.repository.count({
      where: {
        deleted: false,
      },
    });

    const response = {
      tickets: data,
      count: count,
    };

    return response;
  }

  async findAll(): Promise<Ticket[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Ticket> {
    const ticket = await this.repository.findOneBy({ id });
    if (!ticket) {
      throw new Error(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }

  async findByCriteria(criteria: Partial<Ticket>): Promise<Ticket[]> {
    return this.repository.find({ where: criteria });
  }

  async create(entity: Ticket): Promise<Ticket> {
    const ticket = this.repository.create(entity);
    return this.repository.save(ticket);
  }

  async update(id: number, entity: Partial<Ticket>): Promise<Ticket> {
    await this.repository.update(id, entity);
    const updatedTicket = await this.repository.findOne({
      where: {
        id: id,
      },
    });
    return updatedTicket;
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  async softDelete(id: number): Promise<UpdateResult> {
    return this.repository.update(id, {
      deleted: true,
    });
  }

  async restore(id: number): Promise<UpdateResult> {
    return this.repository.restore(id);
  }

  async count(criteria?: Partial<Ticket>): Promise<number> {
    return this.repository.count({ where: criteria });
  }

  // Métodos específicos para Ticket
  async findByCode(code: string): Promise<Ticket | null> {
    return this.repository.findOne({ 
      where: { 
        code: code, 
        deleted: false, 
        isActive: true 
      } 
    });
  }



  async findByEventLocation(eventLocationId: number): Promise<Ticket[]> {
    return this.repository.find({ 
      where: { 
        eventLocationId: eventLocationId, 
        deleted: false 
      } 
    });
  }

 

  async findActiveTickets(): Promise<Ticket[]> {
    return this.repository.find({ 
      where: { 
        isActive: true, 
        deleted: false 
      } 
    });
  }

  async findUnusedTickets(): Promise<Ticket[]> {
    return this.repository.find({ 
      where: { 
        isUsed: false, 
        deleted: false, 
        isActive: true 
      } 
    });
  }

  async findUsedTickets(): Promise<Ticket[]> {
    return this.repository.find({ 
      where: { 
        isUsed: true, 
        deleted: false 
      } 
    });
  }

  async useTicket(id: number): Promise<Ticket> {
    const ticket = await this.findById(id);
    if (ticket.isUsed) {
      throw new Error("Ticket has already been used");
    }
    
    await this.repository.update(id, {
      isUsed: true,
      usedAt: new Date(),
    });

    return this.findById(id);
  }

  async useTicketByCode(code: string): Promise<Ticket> {
    const ticket = await this.findByCode(code);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    
    return this.useTicket(ticket.id);
  }

  async deactivateTicket(id: number): Promise<void> {
    await this.repository.update(id, { isActive: false });
  }

  async activateTicket(id: number): Promise<void> {
    await this.repository.update(id, { isActive: true });
  }

  async generateUniqueCode(): Promise<string> {
    const generateCode = (): string => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    let code: string;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      code = generateCode();
      attempts++;
      if (attempts > maxAttempts) {
        throw new Error("Unable to generate unique code after maximum attempts");
      }
    } while (await this.findByCode(code));

    return code;
  }

  async bulkCreate(tickets: Partial<Ticket>[]): Promise<Ticket[]> {
    const createdTickets = this.repository.create(tickets);
    return this.repository.save(createdTickets);
  }
} 