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
  public abstract set utcOffset(minutes: number);

  public abstract get millisecond(): number;
  public abstract set millisecond(input: number);

  public abstract get second(): number;
  public abstract set second(input: number);

  public abstract get minute(): number;
  public abstract set minute(input: number);

  public abstract get hour(): number;
  public abstract set hour(input: number);

  public abstract get date(): number;
  public abstract set date(input: number);

  public abstract get month(): number;
  public abstract set month(input: number);

  public abstract get year(): number;
  public abstract set year(input: number);
}

export default AbstractDate;
