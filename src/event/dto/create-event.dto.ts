import { EventInterface } from '../../interface/event.interface';

export class CreateEventDto implements Omit<EventInterface, 'event_id'> {
  name: EventInterface['name'];
  members: EventInterface['members'];
  category: EventInterface['category'];
  description: EventInterface['description'];
  start_date: EventInterface['start_date'];
  end_date: EventInterface['end_date'];
  transactions: EventInterface['transactions'];
}
