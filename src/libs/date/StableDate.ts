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

  public setUtcOffset(mintues: number) {
    return new StableDate(this._date.utcOffset(mintues).toDate());
  }

  public get millisecond(): number {
    return this._date.millisecond();
  }
  public setMillisecond(input: number) {
    return new StableDate(this._date.millisecond(input).toDate());
  }
  public get second(): number {
    return this._date.second();
  }
  public setSecond(input: number) {
    return new StableDate(this._date.second(input).toDate());
  }
  public get minute(): number {
    return this._date.minute();
  }
  public setMinute(input: number) {
    return new StableDate(this._date.minute(input).toDate());
  }
  public get hour(): number {
    return this._date.hour();
  }
  public setHour(input: number) {
    return new StableDate(this._date.hour(input).toDate());
  }
  public get date(): number {
    return this._date.date();
  }
  public setDate(input: number) {
    return new StableDate(this._date.date(input).toDate());
  }
  public get month(): number {
    return this._date.month();
  }
  public setMonth(input: number) {
    return new StableDate(this._date.month(input).toDate());
  }
  public get year(): number {
    return this._date.year();
  }
  public setYear(input: number) {
    return new StableDate(this._date.year(input).toDate());
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
