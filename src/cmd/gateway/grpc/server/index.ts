import { APP_CONFIG } from "../../../../deploy";
import { Logger } from "../../../../internal/application/utils/log";
import { inject, injectable } from "inversify";
import { Server } from "@grpc/grpc-js";
import { TYPES } from "../../../../internal/domain/types";
import { PREFIXES } from "../../../../internal/application/utils/log";

const grpc = require("@grpc/grpc-js");
const PROTO_PATH = process.cwd() + "/src/protos/news.proto";
const protoLoader = require("@grpc/proto-loader");

@injectable()
export class GrpcServer {
    server: Server;

    constructor(@inject(TYPES.Logger) private logger: Logger) {
        const options = {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        };

        const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

        const newsProto = grpc.loadPackageDefinition(packageDefinition);

        const server = new grpc.Server();

        this.server = server;

        let news = [];

        server.addService(newsProto.NewsService.service, {
            getAllNews: (_, callback) => {
                logger.print(PREFIXES.GRPC_SERVER, null, "received");
                callback(null, news);
            }
        });
    }

    listen = () => {
        this.server.bindAsync(
            "127.0.0.1:" + APP_CONFIG.grpcServerPort,
            grpc.ServerCredentials.createInsecure(),
            (error) => {
                if (!error) {
                    this.logger.print(
                        PREFIXES.GRPC_SERVER,
                        null,
                        "grpc server running on " + APP_CONFIG.grpcServerPort
                    );
                    this.server.start();
                } else {
                    this.logger.print(PREFIXES.GRPC_SERVER, error, "grpc server error");
                }
            }
        );
    };
}
