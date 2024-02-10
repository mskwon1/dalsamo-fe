import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import AbstractDate, { DateParam, DateUnit } from './AbstractDate';

dayjs.extend(utc);

class StableDate extends AbstractDate {
  private _date: Dayjs;

  constructor(dateParam?: DateParam | Dayjs) {
    super();
    this._date = dayjs(dateParam);

    if (!this._date.isValid()) {
      throw new TypeError('date input is not valid : ' + dateParam);
    }
  }

  public static override now() {
    return new StableDate();
  }

  public static override utc(dateParam?: DateParam) {
    return new StableDate(dayjs.utc(dateParam));
  }

  public format(formatString: string): string {
    return this._date.format(formatString);
  }
  public toISOString(): string {
    return this._date.toISOString();
  }
  public toDate(): Date {
    return this._date.toDate();
  }
  public toUnixSeconds(): number {
    return this._date.unix();
  }
  public toUnixMilliseconds(): number {
    return this._date.valueOf();
  }

  public add(amount: number, unit: DateUnit): AbstractDate {
    return new StableDate(this._date.add(amount, unit));
  }
  public subtract(amount: number, unit: DateUnit): AbstractDate {
    return new StableDate(this._date.subtract(amount, unit));
  }

  public get utcOffset(): number {
    return this._date.utcOffset();
  }

  public setUtcOffset(mintues: number) {
    return new StableDate(this._date.utcOffset(mintues));
  }

  public get millisecond(): number {
    return this._date.millisecond();
  }
  public setMillisecond(input: number) {
    if (input < 0 || input > 999) {
      throw new RangeError('input must be number between 0 ~ 999');
    }

    return new StableDate(this._date.millisecond(input));
  }
  public get second(): number {
    return this._date.second();
  }
  public setSecond(input: number) {
    if (input < 0 || input > 59) {
      throw new RangeError('input must be number between 0 ~ 59');
    }

    return new StableDate(this._date.second(input));
  }
  public get minute(): number {
    return this._date.minute();
  }
  public setMinute(input: number) {
    if (input < 0 || input > 59) {
      throw new RangeError('input must be number between 0 ~ 59');
    }

    return new StableDate(this._date.minute(input));
  }
  public get hour(): number {
    return this._date.hour();
  }
  public setHour(input: number) {
    if (input < 0 || input > 23) {
      throw new RangeError('input must be number between 0 ~ 23');
    }

    return new StableDate(this._date.hour(input));
  }
  public get date(): number {
    return this._date.date();
  }
  public setDate(input: number) {
    const daysInMonth = this._date.daysInMonth();
    if (input < 1 || input > daysInMonth) {
      throw new RangeError(`input must be number between 1 ~ ${daysInMonth}`);
    }

    return new StableDate(this._date.date(input));
  }
  public get month(): number {
    return this._date.month() + 1;
  }
  public setMonth(input: number) {
    if (input < 1 || input > 12) {
      throw new RangeError('input must be number between 1 ~ 12');
    }

    return new StableDate(this._date.month(input - 1));
  }
  public get year(): number {
    return this._date.year();
  }
  public setYear(input: number) {
    if (input < 0) {
      throw new RangeError('input must be number bigger than 0');
    }

    return new StableDate(this._date.year(input));
  }

  public isAfter(compareDate: AbstractDate): boolean {
    return this._date.isAfter(compareDate.toDate());
  }
  public isBefore(compareDate: AbstractDate): boolean {
    return this._date.isBefore(compareDate.toDate());
  }
  public isSame(compareDate: AbstractDate): boolean {
    return this._date.isSame(compareDate.toDate());
  }
}

export default StableDate;
