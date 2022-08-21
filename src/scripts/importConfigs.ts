const importConfigs = (req: any): Record<string, Object> => {  
    const entries = req.keys().map((key: any) => [req(key).default.component,req(key).default]);
    return Object.fromEntries(entries); 
}
export default importConfigs;