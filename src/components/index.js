const req = require.context('./', false, /[^.]+\.tsx/);

const componentsNames = req.keys();
const components = componentsNames.reduce((component,module) => {
    const mod = req(module);
    component[mod.default.name] = mod.default;
    return component;
},{});

export { components };