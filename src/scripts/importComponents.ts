 const importComponents = (req: any): Map<string, React.FC<any>> => {
    const entries = req.keys().map((key: any) => [req(key).default.name,req(key).default as React.FC<any>]);
    return new Map(entries);
}

export default importComponents;