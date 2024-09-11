import * as winston from "winston";
import * as fs from "fs";
import * as path from "path";

export class LoggerWriter {
  private logger: winston.Logger;
  private readonly date: Date = new Date(Date.now());
  private logFilePath: string = path.resolve(`logs/app-${this.timeFormatter(this.date)}.log`);
  private maxFileSize: number;
  constructor(maxFileSize: number) {
    this.maxFileSize = maxFileSize;
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level} ${message}`;
        })
      ),
      transports: [new winston.transports.File({ filename: this.logFilePath })]
    });
  }
  timeFormatter(date: Date): string {
    return `${date.getFullYear()}-${
      date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
    }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
  }
  writeInfo(prefix: string, message: string) {
    const msg: string = `${prefix}: ${message}`;
    this.logger.info(msg);
  }
  writeError(prefix: string, message: string) {
    const msg: string = `${prefix}: ${message}`;
    this.logger.error(msg);
  }
}
