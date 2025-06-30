import SecureLS from 'secure-ls';
import type { Usuario } from '../../models/usuario.interface';

export class ServicoArmazenamento {
    private ls: SecureLS = new SecureLS({encodingType: 'aes'});
    private prefix: string = "requerimentos_";
    private static instance: ServicoArmazenamento;

    private constructor(){};

    static getInstance(){
        if (!ServicoArmazenamento.instance){
            ServicoArmazenamento.instance = new ServicoArmazenamento();
        }

        return ServicoArmazenamento.instance;
    }

    remove(key: string): void {
        this.ls.remove(this.prefix+ key);
    }

    set(key: string, value: Usuario){
        this.ls.set(this.prefix + key,value);
    }

    get(key: string): Usuario{
        const obj = this.ls.get(this.prefix + key);
        return obj;
    }
}