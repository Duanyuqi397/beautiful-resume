const importComponents = (req: any) => {
    const entries = req.keys().map((key: any) => [req(key).default.name,req(key).default]);
    return Object.fromEntries(entries);
}

export default importComponents;