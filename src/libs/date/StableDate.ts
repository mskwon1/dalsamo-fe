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
    this._date = this._date.add(amount, unit);
    return this;
  }
  public subtract(amount: number, unit: DateUnit): AbstractDate {
    this._date = this._date.subtract(amount, unit);
    return this;
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
    return new StableDate(this._date.millisecond(input));
  }
  public get second(): number {
    return this._date.second();
  }
  public setSecond(input: number) {
    return new StableDate(this._date.second(input));
  }
  public get minute(): number {
    return this._date.minute();
  }
  public setMinute(input: number) {
    return new StableDate(this._date.minute(input));
  }
  public get hour(): number {
    return this._date.hour();
  }
  public setHour(input: number) {
    return new StableDate(this._date.hour(input));
  }
  public get date(): number {
    return this._date.date();
  }
  public setDate(input: number) {
    return new StableDate(this._date.date(input));
  }
  public get month(): number {
    return this._date.month();
  }
  public setMonth(input: number) {
    return new StableDate(this._date.month(input));
  }
  public get year(): number {
    return this._date.year();
  }
  public setYear(input: number) {
    return new StableDate(this._date.year(input));
  }

  public isAfter(compareDate: AbstractDate): boolean {
    return this._date.isAfter(compareDate.toDate());
  }
  public isBefore(compareDate: AbstractDate): boolean {
    return this._date.isAfter(compareDate.toDate());
  }
  public isSame(compareDate: AbstractDate): boolean {
    return this._date.isSame(compareDate.toDate());
  }
}

export default StableDate;
