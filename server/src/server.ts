import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { IPlugin } from './plugins/interfaces';
import { IServerConfigurations } from './configurations';

import * as Client from './client';

export async function init(
    configs: IServerConfigurations,
): Promise<Hapi.Server> {
    try {
        const port = process.env.PORT || configs.port;
        const server = new Hapi.Server({
            port: port,
            routes: {
                cors: { origin: ['*'] }
            }
        });

        if (configs.routePrefix) {
            server.realm.modifiers.route.prefix = configs.routePrefix;
        }

        //  Setup Hapi Plugins
        const plugins: Array<string> = configs.plugins;
        const pluginOptions = {
            serverConfigs: configs
        };

        const pluginPromises: Promise<any>[] = [];

        plugins.forEach((pluginName: string) => {
            const plugin: IPlugin = require('./plugins/' + pluginName).default();
            console.log(
                `Register Plugin ${plugin.info().name} v${plugin.info().version}`
            );
            pluginPromises.push(plugin.register(server, pluginOptions));
        });

        await Promise.all(pluginPromises);


        console.log('All plugins registered successfully.');

        console.log('Register Routes');
        Client.init(server, configs);
        console.log('Routes registered sucessfully.');

        return server;
    } catch (err) {
        console.log('Error starting server: ', err);
        throw err;
    }
}
