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

export type DateParam = StringDateParam | NumberDateParam | Date;

// expects ISO 8601 datestring
type StringDateParam = string;
// unix milliseconds
type NumberDateParam = number;

abstract class AbstractDate {
  public static now(): AbstractDate {
    throw new StaticMethodNotImplementedError();
  }

  public static utc(): AbstractDate {
    throw new StaticMethodNotImplementedError();
  }

  /*
    YY: two digit year
    YYYY: four digit year
    M: month, 1-12
    MM:  month, 01-12
    D: date, 1-31
    DD: date, 01-31
    H: hour, 1-12
    HH: hour, 01-12
    m: minute, 0-60
    mm: minute, 00-60
    s: second, 0-60
    ss: second, 00-60
    Z: offset from utc +-HH:mm
    ZZ: offset from utc +-HHmm
    A: AM/PM
    a: am/pm
  */
  public abstract format(formatString: string): string;
  public abstract toISOString(): string;
  public abstract toDate(): Date;
  public abstract toUnixSeconds(): number;
  public abstract toUnixMilliseconds(): number;

  public abstract add(amount: number, unit: DateUnit): AbstractDate;
  public abstract subtract(amount: number, unit: DateUnit): AbstractDate;

  /**
   * @returns utc offset in minutes
   */
  public abstract get utcOffset(): number;
  public abstract setUtcOffset(minute: number): AbstractDate;

  public abstract get millisecond(): number;
  /**
   * @param input 0~999
   */
  public abstract setMillisecond(input: number): AbstractDate;

  public abstract get second(): number;
  /**
   * @param input 0~59
   */
  public abstract setSecond(input: number): AbstractDate;

  public abstract get minute(): number;
  /**
   * @param input 0~59
   */
  public abstract setMinute(input: number): AbstractDate;

  public abstract get hour(): number;
  /**
   * @param input 0~59
   */
  public abstract setHour(input: number): AbstractDate;

  public abstract get date(): number;
  /**
   * @param input 1~31
   */
  public abstract setDate(input: number): AbstractDate;

  public abstract get month(): number;
  /**
   * @param input 1~12
   */
  public abstract setMonth(input: number): AbstractDate;

  public abstract get year(): number;
  /**
   * @param input number bigger than 0
   */
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
