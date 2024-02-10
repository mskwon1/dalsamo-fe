import MockDate from 'mockdate';
import StableDate from './StableDate';

describe('Constructor', () => {
  beforeEach(() => {
    MockDate.set(new Date());
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should built with current time when no param is given', () => {
    expect(new StableDate().toISOString()).toBe(new Date().toISOString());
  });

  it('should built with built-in Date Object', () => {
    const nativeDate = new Date();
    const stableDate = new StableDate(nativeDate);

    expect(stableDate.toISOString()).toBe(nativeDate.toISOString());
  });

  it('should built with ISO8601 date format', () => {
    const nativeDate = new Date();
    const stableDate = new StableDate(nativeDate.toISOString());

    expect(stableDate.toISOString()).toBe(nativeDate.toISOString());
  });

  it('should built with YYYY-MM-DD HH:mm:ss as local time', () => {
    const dateString = '2000-01-01 00:00:00';
    const stableDate = new StableDate(dateString);

    expect(stableDate.format('YYYY-MM-DD HH:mm:ss')).toBe(dateString);
  });

  it('should built with YYYY-MM-DD format, with time data as 00:00:00', () => {
    const dateString = '2000-01-01';
    const stableDate = new StableDate(dateString);

    expect(stableDate.format('YYYY-MM-DD HH:mm:ss')).toBe(
      dateString + ' 00:00:00'
    );
  });

  it('should built with unix ms number', () => {
    const UNIX_MS = 946684800000;

    expect(new StableDate(UNIX_MS).toUnixMilliseconds()).toBe(UNIX_MS);
  });

  it('should throw error when wrong input is given', () => {
    expect(() => {
      new StableDate('NON_DATE_STRING');
    }).toThrow(TypeError);
  });
});

describe('Static Methods', () => {
  beforeEach(() => {
    MockDate.set(new Date());
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('utc static method', () => {
    it('should built as utc when no param is given', () => {
      const stableDate = StableDate.utc();

      expect(stableDate.utcOffset).toBe(0);
    });

    it('should built with built-in Date Object', () => {
      const nativeDate = new Date();
      const stableDate = StableDate.utc(nativeDate);

      expect(stableDate.utcOffset).toBe(0);
      expect(stableDate.toISOString()).toBe(nativeDate.toISOString());
    });

    it('should built with ISO8601 date format', () => {
      const nativeDate = new Date();
      const stableDate = StableDate.utc(nativeDate.toISOString());

      expect(stableDate.toISOString()).toBe(nativeDate.toISOString());
    });

    it('should built with YYYY-MM-DD HH:mm:ss as utc time', () => {
      const dateString = '2000-01-01 00:00:00';
      const stableDate = StableDate.utc(dateString);

      expect(stableDate.utcOffset).toBe(0);
      expect(stableDate.format('YYYY-MM-DD HH:mm:ss')).toBe(dateString);
    });

    it('should built with YYYY-MM-DD format, with time data as 00:00:00', () => {
      const dateString = '2000-01-01';
      const stableDate = StableDate.utc(dateString);

      expect(stableDate.utcOffset).toBe(0);
      expect(stableDate.format('YYYY-MM-DD HH:mm:ss')).toBe(
        dateString + ' 00:00:00'
      );
    });

    it('should built with unix ms number', () => {
      const UNIX_MS = 946684800000;
      const stableDate = StableDate.utc(UNIX_MS);

      expect(stableDate.utcOffset).toBe(0);
      expect(stableDate.toUnixMilliseconds()).toBe(UNIX_MS);
    });

    it('should throw error when wrong input is given', () => {
      expect(() => {
        StableDate.utc('NON_DATE_STRING');
      }).toThrow(TypeError);
    });
  });

  describe('now static method', () => {
    it('should built with current time', () => {
      const nativeDate = new Date();
      const stableDate = StableDate.now();

      expect(stableDate.toUnixMilliseconds()).toBe(nativeDate.valueOf());
    });
  });
});

describe('Display', () => {
  describe('toISOString', () => {
    it('should display time with timezone', () => {
      const originalISOString = '2020-01-01T00:00:00.000Z';
      const stableDate = new StableDate('2020-01-01T00:00:00.000Z');

      expect(originalISOString).toBe(stableDate.toISOString());
    });
  });

  describe('format', () => {
    it('should format date string', () => {
      const stableDate = StableDate.utc('2000-01-01T00:00:00.000Z');

      expect(stableDate.format('YYYY-MM-DD')).toBe('2000-01-01');
      expect(stableDate.format('YY-M-D')).toBe('00-1-1');
    });

    it('should format time string', () => {
      const stableDate = StableDate.utc('2000-01-01T00:00:00.000Z');

      expect(stableDate.format('HH:mm:ss')).toBe('00:00:00');
      expect(stableDate.format('H:m:s')).toBe('0:0:0');
    });

    it('should format offset string', () => {
      const stableDate = StableDate.utc('2000-01-01T00:00:00.000Z');

      expect(stableDate.format('Z')).toBe('+00:00');
      expect(stableDate.format('ZZ')).toBe('+0000');
    });

    it('should format AM/PM string', () => {
      const amDate = StableDate.utc('2000-01-01T09:00:00.000Z');

      expect(amDate.format('A')).toBe('AM');
      expect(amDate.format('a')).toBe('am');

      const pmDate = StableDate.utc('2000-01-01T15:00:00.000Z');

      expect(pmDate.format('A')).toBe('PM');
      expect(pmDate.format('a')).toBe('pm');
    });
  });

  describe('toUnixSeconds', () => {
    const stableDate = new StableDate('2020-01-01T00:00:00.000Z');

    expect(stableDate.toUnixSeconds()).toBe(1577836800);
  });

  describe('toUnixMilliseconds', () => {
    const stableDate = new StableDate('2020-01-01T00:00:00.000Z');

    expect(stableDate.toUnixMilliseconds()).toBe(1577836800000);
  });

  describe('Getters', () => {
    it('should get values by getter methods', () => {
      const stableDate = StableDate.utc('2020-10-11T10:05:10.123Z');

      expect(stableDate.millisecond).toBe(123);
      expect(stableDate.second).toBe(10);
      expect(stableDate.minute).toBe(5);
      expect(stableDate.hour).toBe(10);
      expect(stableDate.date).toBe(11);
      expect(stableDate.month).toBe(10);
      expect(stableDate.year).toBe(2020);
    });

    it('should get utcOffset', () => {
      const stableDate = StableDate.utc();

      expect(stableDate.utcOffset).toBe(0);
    });
  });
});

describe('Manipulate', () => {
  it('should be immutable', () => {
    const originalISOString = '2000-01-15T00:00:30.000Z';
    const stableDate = new StableDate(originalISOString);

    stableDate.add(1, 'day').subtract(40, 'second');
    stableDate.setSecond(40);

    expect(stableDate.toISOString()).toBe(originalISOString);
  });

  describe('Add/Subtract', () => {
    it('should add/subtract milliseconds', () => {
      const originalISOString = '2000-01-15T00:00:30.000Z';
      const stableDate = StableDate.utc(originalISOString);

      expect(stableDate.add(100, 'millisecond').toISOString()).toBe(
        '2000-01-15T00:00:30.100Z'
      );
      expect(stableDate.subtract(100, 'millisecond').toISOString()).toBe(
        '2000-01-15T00:00:29.900Z'
      );
    });

    it('should add/subtract seconds', () => {
      const originalISOString = '2000-01-15T00:00:30.000Z';
      const stableDate = StableDate.utc(originalISOString);

      expect(stableDate.add(100, 'second').toISOString()).toBe(
        '2000-01-15T00:02:10.000Z'
      );
      expect(stableDate.subtract(100, 'second').toISOString()).toBe(
        '2000-01-14T23:58:50.000Z'
      );
    });

    it('should add/subtract minutes', () => {
      const originalISOString = '2000-01-15T12:00:00.000Z';
      const stableDate = StableDate.utc(originalISOString);

      expect(stableDate.add(100, 'minute').toISOString()).toBe(
        '2000-01-15T13:40:00.000Z'
      );
      expect(stableDate.subtract(100, 'minute').toISOString()).toBe(
        '2000-01-15T10:20:00.000Z'
      );
    });

    it('should add/subtract hours', () => {
      const originalISOString = '2000-01-15T12:00:00.000Z';
      const stableDate = StableDate.utc(originalISOString);

      expect(stableDate.add(5, 'hour').toISOString()).toBe(
        '2000-01-15T17:00:00.000Z'
      );
      expect(stableDate.subtract(5, 'hour').toISOString()).toBe(
        '2000-01-15T07:00:00.000Z'
      );
    });

    it('should add/subtract day', () => {
      const originalISOString = '2000-01-15T12:00:00.000Z';
      const stableDate = StableDate.utc(originalISOString);

      expect(stableDate.add(10, 'day').toISOString()).toBe(
        '2000-01-25T12:00:00.000Z'
      );
      expect(stableDate.subtract(10, 'day').toISOString()).toBe(
        '2000-01-05T12:00:00.000Z'
      );
    });

    it('should add/subtract month', () => {
      const originalISOString = '2000-01-15T12:00:00.000Z';
      const stableDate = StableDate.utc(originalISOString);

      expect(stableDate.add(10, 'month').toISOString()).toBe(
        '2000-11-15T12:00:00.000Z'
      );
      expect(stableDate.subtract(10, 'month').toISOString()).toBe(
        '1999-03-15T12:00:00.000Z'
      );
    });

    it('should add/subtract year', () => {
      const originalISOString = '2000-01-15T12:00:00.000Z';
      const stableDate = StableDate.utc(originalISOString);

      expect(stableDate.add(10, 'year').toISOString()).toBe(
        '2010-01-15T12:00:00.000Z'
      );
      expect(stableDate.subtract(10, 'year').toISOString()).toBe(
        '1990-01-15T12:00:00.000Z'
      );
    });
  });

  describe('Setters', () => {
    it('should set appropriate value for in-range inputs', () => {
      const originalISOString = '2000-01-01T00:00:00.000Z';
      const stableDate = StableDate.utc(originalISOString);

      expect(
        stableDate
          .setMillisecond(50)
          .setSecond(50)
          .setMinute(10)
          .setHour(5)
          .setDate(10)
          .setMonth(9)
          .setYear(2010)
          .toISOString()
      ).toBe('2010-09-10T05:10:50.050Z');
    });

    it('should throw error for out-of-range inputs', () => {
      const stableDate = StableDate.utc('2001-02-01T00:00:00.00Z');
      const leapYearDate = StableDate.utc('2024-02-01T00:00:00.00Z');

      expect(() => {
        stableDate.setMillisecond(-1);
      }).toThrowError(RangeError);
      expect(() => {
        stableDate.setMillisecond(1000);
      }).toThrowError(RangeError);

      expect(() => {
        stableDate.setSecond(-1);
      }).toThrowError(RangeError);
      expect(() => {
        stableDate.setSecond(60);
      }).toThrowError(RangeError);

      expect(() => {
        stableDate.setMinute(-1);
      }).toThrowError(RangeError);
      expect(() => {
        stableDate.setMinute(60);
      }).toThrowError(RangeError);

      expect(() => {
        stableDate.setHour(-1);
      }).toThrowError(RangeError);
      expect(() => {
        stableDate.setHour(24);
      }).toThrowError(RangeError);

      expect(() => {
        stableDate.setDate(0);
      }).toThrowError(RangeError);
      expect(() => {
        stableDate.setDate(29);
      }).toThrowError(RangeError);
      expect(() => {
        leapYearDate.setDate(29);
      }).not.toThrow(RangeError);

      expect(() => {
        stableDate.setMonth(0);
      }).toThrowError(RangeError);
      expect(() => {
        stableDate.setMonth(13);
      }).toThrowError(RangeError);

      expect(() => {
        stableDate.setYear(-1);
      }).toThrowError();
    });

    it('should set utcOffset', () => {
      const stableDate = StableDate.utc();

      expect(stableDate.setUtcOffset(600).utcOffset).toBe(600);
    });
  });
});

describe('Comparison', () => {
  describe('isBefore & isAfter', () => {
    it('should return true when condition is met', () => {
      const stableDate = StableDate.utc('2000-01-01T00:00:00.001Z');
      const stableDate2 = StableDate.utc('2000-01-01T00:00:00.000Z');

      expect(stableDate.isAfter(stableDate2)).toBe(true);
      expect(stableDate2.isBefore(stableDate)).toBe(true);
    });

    it('should return false when condition is not met', () => {
      const stableDate = StableDate.utc('2000-01-01T00:00:00.001Z');
      const stableDate2 = StableDate.utc('2000-01-01T00:00:00.000Z');

      expect(stableDate.isBefore(stableDate2)).toBe(false);
      expect(stableDate2.isAfter(stableDate)).toBe(false);
    });
  });

  describe('isSame & isSameOrXXX', () => {
    it('should return true when condition is met', () => {
      const stableDate = StableDate.utc('2000-01-01T00:00:00.000Z');
      const stableDate2 = StableDate.utc('2000-01-01T00:00:00.000Z');
      const stableDate3 = StableDate.utc('2000-01-01T00:00:00.001Z');

      expect(stableDate.isSame(stableDate2)).toBe(true);
      expect(stableDate.isSameOrBefore(stableDate2)).toBe(true);
      expect(stableDate.isSameOrAfter(stableDate2)).toBe(true);

      expect(stableDate.isSameOrBefore(stableDate3)).toBe(true);
      expect(stableDate3.isSameOrAfter(stableDate)).toBe(true);
    });

    it('should return false when condition is not met', () => {
      const stableDate = StableDate.utc('2000-01-01T00:00:00.100Z');
      const stableDate2 = StableDate.utc('2000-01-01T00:00:00.000Z');

      expect(stableDate.isSame(stableDate2)).toBe(false);
      expect(stableDate.isSameOrBefore(stableDate2)).toBe(false);
      expect(stableDate2.isSameOrAfter(stableDate)).toBe(false);
    });
  });
});
