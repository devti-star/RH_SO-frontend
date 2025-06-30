import type { LoaderFunction } from "react-router-dom";

export function cadenciaGuards(...guards: LoaderFunction[]) {
    return async (args: any) => {
        for (const guard of guards){
            await guard(args);
        }
        return null;
    }
}