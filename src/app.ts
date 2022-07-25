import { HostBuilder, ConfigurationBuilder, Logger, LogType } from "@miracledevs/paradigm-express-webapi";
import { Server } from "./server";

new HostBuilder()
    .useConfiguration((config: ConfigurationBuilder) => {
        config.addJsonFile("./configuration.json").addEnvironmentFile("./.env", "paradigm_api__").addEnvironmentVariables("paradigm_api__");
    })
    .useLogging((logger: Logger) => logger.setMinimumLevel(LogType.Trace))
    .build(Server)
    .start();
