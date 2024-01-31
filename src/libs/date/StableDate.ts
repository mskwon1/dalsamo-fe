import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import AbstractDate, { DateUnit } from './AbstractDate';

dayjs.extend(utc);

type DateParam = string | number | Date;

class StableDate extends AbstractDate {
  private _date: Dayjs;

  constructor(dateParam?: DateParam) {
    super();
    this._date = dayjs(dateParam);
  }

  public static override now() {
    return new StableDate();
  }

  public static override utc(dateParam?: DateParam) {
    return new StableDate(dayjs.utc(dateParam).toDate());
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

  public set utcOffset(minutes: number) {
    this._date = this._date.utcOffset(minutes);
  }

  public get millisecond(): number {
    return this._date.millisecond();
  }
  public set millisecond(input: number) {
    this._date = this._date.millisecond(input);
  }
  public get second(): number {
    return this._date.second();
  }
  public set second(input: number) {
    this._date = this._date.second(input);
  }
  public get minute(): number {
    return this._date.minute();
  }
  public set minute(input: number) {
    this._date = this._date.minute(input);
  }
  public get hour(): number {
    return this._date.hour();
  }
  public set hour(input: number) {
    this._date = this._date.hour(input);
  }
  public get date(): number {
    return this._date.date();
  }
  public set date(input: number) {
    this._date = this._date.date(input);
  }
  public get month(): number {
    return this._date.month();
  }
  public set month(input: number) {
    this._date = this._date.month(input);
  }
  public get year(): number {
    return this._date.year();
  }
  public set year(input: number) {
    this._date = this._date.year(input);
  }
}

export default StableDate;
