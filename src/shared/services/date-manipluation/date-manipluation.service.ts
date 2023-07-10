import { Injectable } from '@nestjs/common';

@Injectable()
export class DateManipluationService {
  getLastMonthDate(): Date {
    const currentDate = new Date();

    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    );
  }

  getLastYearDate(): Date {
    const currentDate = new Date();

    return new Date(
      currentDate.getFullYear() - 1,
      currentDate.getMonth(),
      currentDate.getDate(),
    );
  }
}
