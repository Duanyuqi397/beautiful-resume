export type Component = {
    id: string;
    props?: Cprops;
    type: string;
    children: string[] | [];
}

interface Cprops extends Object {
    value?: string;
    style?: Object
}