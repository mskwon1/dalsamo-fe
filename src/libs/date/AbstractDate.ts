class StaticMethodNotImplementedError extends Error {
  message = 'static method not implemented from child class';
}

export type DateUnit =
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'month'
  | 'year';

abstract class AbstractDate {
  public static now(): AbstractDate {
    throw new StaticMethodNotImplementedError();
  }

  public static utc(): AbstractDate {
    throw new StaticMethodNotImplementedError();
  }

  public abstract format(formatString: string): string;
  public abstract toISOString(): string;
  public abstract toDate(): Date;
  public abstract toUnixSeconds(): number;
  public abstract toUnixMilliseconds(): number;

  public abstract add(amount: number, unit: DateUnit): AbstractDate;
  public abstract subtract(amount: number, unit: DateUnit): AbstractDate;

  public abstract get utcOffset(): number;
  public abstract setUtcOffset(minute: number): AbstractDate;

  public abstract get millisecond(): number;
  public abstract setMillisecond(input: number): AbstractDate;

  public abstract get second(): number;
  public abstract setSecond(input: number): AbstractDate;

  public abstract get minute(): number;
  public abstract setMinute(input: number): AbstractDate;

  public abstract get hour(): number;
  public abstract setHour(input: number): AbstractDate;

  public abstract get date(): number;
  public abstract setDate(input: number): AbstractDate;

  public abstract get month(): number;
  public abstract setMonth(input: number): AbstractDate;

  public abstract get year(): number;
  public abstract setYear(input: number): AbstractDate;

  public abstract isSame(compareDate: AbstractDate): boolean;
  public abstract isBefore(compareDate: AbstractDate): boolean;
  public abstract isAfter(compareDate: AbstractDate): boolean;

  public isSameOrBefore(compareDate: AbstractDate) {
    return this.isBefore(compareDate) || this.isSame(compareDate);
  }
  public isSameOrAfter(compareDate: AbstractDate) {
    return this.isAfter(compareDate) || this.isSame(compareDate);
  }
}

export default AbstractDate;
