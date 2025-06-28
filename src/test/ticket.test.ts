import { TicketService } from "../service/ticket.service";
import { TicketRepository } from "../repository/tickets.repository";
import { CreateTicketDto, GenerateTicketsDto, UseTicketDto } from "../infrastructure/dto/tickets.dto";

// Mock del repositorio
const mockTicketRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findByCode: jest.fn(),
  generateUniqueCode: jest.fn(),
  bulkCreate: jest.fn(),
  update: jest.fn(),
  useTicketByCode: jest.fn(),
  softDelete: jest.fn(),
  count: jest.fn(),
  getPaginated: jest.fn(),
};

describe("TicketService", () => {
  let ticketService: TicketService;

  beforeEach(() => {
    ticketService = new TicketService(mockTicketRepository as any);
    jest.clearAllMocks();
  });

  describe("createTicket", () => {
    it("should create a ticket with generated code", async () => {
      const createDto: CreateTicketDto = {
        eventLocationId: 1,
      };

      const mockCode = "ABC12345";
      const mockTicket = {
        id: 1,
        eventLocationId: 1,
        code: mockCode,
        isUsed: false,
        isActive: true,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTicketRepository.generateUniqueCode.mockResolvedValue(mockCode);
      mockTicketRepository.create.mockResolvedValue(mockTicket);

      const result = await ticketService.createTicket(createDto);

      expect(mockTicketRepository.generateUniqueCode).toHaveBeenCalled();
      expect(mockTicketRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          eventLocationId: 1,
          code: mockCode,
        })
      );
      expect(result).toEqual(mockTicket);
    });
  });

  describe("generateTickets", () => {
    it("should generate multiple tickets", async () => {
      const generateDto: GenerateTicketsDto = {
        eventLocationId: 1,
        quantity: 5,
      };

      const mockTickets = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        eventLocationId: 1,
        code: `CODE${i + 1}`,
        isUsed: false,
        isActive: true,
        deleted: false,
      }));

      mockTicketRepository.generateUniqueCode
        .mockResolvedValueOnce("CODE1")
        .mockResolvedValueOnce("CODE2")
        .mockResolvedValueOnce("CODE3")
        .mockResolvedValueOnce("CODE4")
        .mockResolvedValueOnce("CODE5");
      mockTicketRepository.bulkCreate.mockResolvedValue(mockTickets);

      const result = await ticketService.generateTickets(generateDto);

      expect(mockTicketRepository.generateUniqueCode).toHaveBeenCalledTimes(5);
      expect(mockTicketRepository.bulkCreate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            eventLocationId: 1,
            isUsed: false,
            isActive: true,
            deleted: false,
          }),
        ])
      );
      expect(result).toEqual(mockTickets);
    });

    it("should throw error for invalid quantity", async () => {
      const generateDto: GenerateTicketsDto = {
        eventLocationId: 1,
        quantity: 0,
      };

      await expect(ticketService.generateTickets(generateDto)).rejects.toThrow(
        "Quantity must be between 1 and 1000"
      );
    });
  });

  describe("useTicket", () => {
    it("should use a ticket successfully", async () => {
      const useDto: UseTicketDto = {
        code: "ABC12345",
      };

      const mockTicket = {
        id: 1,
        eventLocationId: 1,
        code: "ABC12345",
        isUsed: false,
        isActive: true,
        deleted: false,
      };

      const usedTicket = {
        ...mockTicket,
        isUsed: true,
        usedAt: new Date(),
      };

      mockTicketRepository.findByCode.mockResolvedValue(mockTicket);
      mockTicketRepository.useTicketByCode.mockResolvedValue(usedTicket);

      const result = await ticketService.useTicket(useDto);

      expect(mockTicketRepository.findByCode).toHaveBeenCalledWith("ABC12345");
      expect(mockTicketRepository.useTicketByCode).toHaveBeenCalledWith("ABC12345");
      expect(result).toEqual(usedTicket);
    });

    it("should throw error for non-existent ticket", async () => {
      const useDto: UseTicketDto = {
        code: "INVALID",
      };

      mockTicketRepository.findByCode.mockResolvedValue(null);

      await expect(ticketService.useTicket(useDto)).rejects.toThrow("Ticket not found");
    });

    it("should throw error for already used ticket", async () => {
      const useDto: UseTicketDto = {
        code: "ABC12345",
      };

      const mockTicket = {
        id: 1,
        eventLocationId: 1,
        code: "ABC12345",
        isUsed: true,
        isActive: true,
        deleted: false,
      };

      mockTicketRepository.findByCode.mockResolvedValue(mockTicket);

      await expect(ticketService.useTicket(useDto)).rejects.toThrow("Ticket has already been used");
    });
  });

  describe("getTicketStatistics", () => {
    it("should return ticket statistics", async () => {
      mockTicketRepository.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(75)  // used
        .mockResolvedValueOnce(25)  // unused
        .mockResolvedValueOnce(90); // active

      const result = await ticketService.getTicketStatistics();

      expect(result).toEqual({
        total: 100,
        used: 75,
        unused: 25,
        active: 90,
        usageRate: 75,
      });
    });
  });
}); 