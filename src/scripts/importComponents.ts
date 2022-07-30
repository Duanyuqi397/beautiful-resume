import { FunctionRender } from "../types/types";

const importComponents = (req: any): Record<string, FunctionRender> => {
    const entries = req.keys().map((key: any) => [req(key).default.name,req(key).default as FunctionRender]);
    return Object.fromEntries(entries);
}

export default importComponents;