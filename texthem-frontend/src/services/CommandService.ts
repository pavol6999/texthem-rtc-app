interface ICommandService {
    execute(command: string, args: string[]): Promise<any>;
    join(channel: string): Promise<any>;
    invite(params: any): never;
    revoke(params: any): never;
    kick(params: any): never;
    quit(params: any): never;
    cancel(params: any): never;
    list(params: any): never;
    handle(params: any): never;
}

class CommandManager implements ICommandService {
    execute(command: string, args: string[]): Promise<any> {
        throw new Error('Method not implemented.');
    }
    join(channel: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    invite(params: any): never {
        throw new Error('Method not implemented.');
    }
    revoke(params: any): never {
        throw new Error('Method not implemented.');
    }
    kick(params: any): never {
        throw new Error('Method not implemented.');
    }
    quit(params: any): never {
        throw new Error('Method not implemented.');
    }
    cancel(params: any): never {
        throw new Error('Method not implemented.');
    }
    list(params: any): never {
        throw new Error('Method not implemented.');
    }
    handle(params: any): never {
        throw new Error('Method not implemented.');
    }
}

export default new CommandManager();
