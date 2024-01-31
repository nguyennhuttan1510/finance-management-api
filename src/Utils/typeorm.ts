import * as moment from 'moment';
import { Between } from 'typeorm';

const QueryCondition = {
  BetweenDates: (from: moment.Moment | string, to: moment.Moment | string) => {
    return Between(
      moment(typeof from === 'string' ? moment(from) : from).format(
        'YYYY-MM-DD HH:mm:ss',
      ),
      moment(typeof to === 'string' ? moment(to) : to).format(
        'YYYY-MM-DD HH:mm:ss',
      ),
    );
  },
};
const TypeORM = {
  QueryCondition,
};
export default TypeORM;
