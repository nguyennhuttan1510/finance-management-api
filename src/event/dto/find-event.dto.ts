import { EventInterface } from '../../interface/event.interface';
import { IsNumber, IsString } from 'class-validator';

export class FindEventDto implements Partial<EventInterface> {
  @IsNumber()
  event_id: EventInterface['event_id'];

  @IsNumber()
  category: EventInterface['category'];

  @IsString()
  name: EventInterface['name'];
}
