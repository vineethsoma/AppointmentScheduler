import { IPlugin } from '../interfaces';
import * as Hapi from 'hapi';

const register = async (server: Hapi.Server): Promise<void> => {
    try {
        return server.register({
            plugin: require('inert'),
        });

    } catch (err) {
        console.log(`Error registering inert plugin: ${err}`);
        throw err;
    }
};

export default (): IPlugin => {
    return {
        register,
        info: () => {
            return {
                name: 'Inert',
                version: '5.1.0'
            };
        }
    };
};
