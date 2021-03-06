import { createLogger, LogLevel, stdSerializers, Stream } from "bunyan";
import * as Logger from "bunyan";
import { injectable } from "inversify";

type Newable<T> = new (...args: any[]) => T;

@injectable()
export class LogFactory {

    private readonly logLevel = process.env.LOG_LEVEL as LogLevel || "debug";
    private readonly namespace: string = "ServiceLandscape.Delivery";
    private readonly outputToFile: string | false;

    public constructor(toFile?: string | false, private readonly outputToConsole: boolean = true) {
        this.outputToFile = toFile === undefined ?
            `/var/log/service.landscape/${this.namespace.toLowerCase()}.json` :
            toFile;
    }

    public createLog<T>(t: Newable<T>): Logger {
        const loggerName = `${this.namespace}.${t.name}`;

        const logger = createLogger({
            name: loggerName,
            serializers: {
                err: stdSerializers.err,
                req: stdSerializers.req,
            },
            streams: this.getStreams(),
        });

        logger.info(`Logger '${loggerName}' created with level: ${this.logLevel}!`);

        return logger;
    }

    private getStreams(): Stream[] {
        const streams: Stream[] = [];

        if (this.outputToConsole) {
            streams.push({
                level: this.logLevel,
                stream: process.stdout,
            });
        }

        if (this.outputToFile) {
            streams.push({
                count: 5,
                level: this.logLevel,
                path: this.outputToFile,
                period: "1d",
                type: "rotating-file",
            });
        }

        return streams;
    }
}
