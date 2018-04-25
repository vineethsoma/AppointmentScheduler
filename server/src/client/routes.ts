import * as Hapi from "hapi";
import { IServerConfigurations } from "../configurations";

export default function (server: Hapi.Server, serverConfigs: IServerConfigurations) {

    server.route({
        method: 'GET',
        path: '/{path*}',
        handler: {
            directory: {
                path: __dirname + '/build'
            }
        }
    });
}