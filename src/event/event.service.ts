import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { Repository } from 'typeorm';
import { FindEventDto } from './dto/find-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private repositoryEvent: Repository<Event>,
  ) {}
  async create(createEventDto: CreateEventDto) {
    try {
      const event = new Event();
      event.name = createEventDto.name;
      event.category = createEventDto.category;
      event.members = createEventDto.members;
      event.description = createEventDto.description;
      event.start_date = createEventDto.start_date;
      event.end_date = createEventDto.end_date;
      return await this.repositoryEvent.save(event);
    } catch (e) {
      throw new BadRequestException('create event failed');
    }
  }

  async findAll(query?: FindEventDto) {
    try {
      return await this.repositoryEvent.find({
        where: {
          name: query?.name,
          category: query?.category,
          event_id: query?.event_id,
        },
      });
    } catch (e) {
      throw new NotFoundException('events not found');
    }
  }

  async findOne(id: number) {
    try {
      return await this.repositoryEvent.findOne({
        where: {
          event_id: id,
        },
      });
    } catch (e) {
      throw new NotFoundException('event not found');
    }
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    try {
      const event = new Event();
      event.name = updateEventDto.name;
      event.category = updateEventDto.category;
      event.members = updateEventDto.members;
      event.description = updateEventDto.description;
      event.start_date = updateEventDto.start_date;
      event.end_date = updateEventDto.end_date;
      return await this.repositoryEvent.save(event);
    } catch (e) {
      throw new BadRequestException('update event failed');
    }
  }

  async remove(id: number) {
    try {
      return await this.repositoryEvent.delete(id);
    } catch (e) {
      throw new BadRequestException('delete event failed');
    }
  }
}
