import log from "npmlog";
import { APP_CONFIG, CONFIG } from "../../../../deploy";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../domain/types";
import { LoggerWriter } from "./writer";

@injectable()
export class Logger {
  constructor(@inject(TYPES.APP_CONFIG) private cfg: CONFIG) {}

  print(prefix: string, error: Error | null, message: string, data: {} | null = null) {
    if (APP_CONFIG.debugMode) {
      const loggerWriter = new LoggerWriter(this.cfg.maxLogFileSize);
      if (!log.stream.path) {
        log.enableColor();
      }
      const msg = `workerId : ${process.pid} / ${message} ${data ? JSON.stringify(data) : ""}`;
      if (error) {
        log.prefixStyle = { fg: "red" };
        log.error(prefix, msg);
        loggerWriter.writeError(prefix, msg);
      } else {
        log.prefixStyle = { fg: "green" };
        log.info(prefix, msg);
        loggerWriter.writeInfo(prefix, msg);
      }
    }
  }
}
