import * as xxhash from "xxhashjs";

function sortObjectKeys(obj: any) {
    if(obj === null || obj === undefined) return obj;
    if(typeof obj !== 'object') return obj;

    return Object.keys(obj).sort().reduce( (acc: Record<string, any>, key: string) => {
        if (Array.isArray(obj[key]))
            acc[key]=obj[key].map(sortObjectKeys);
        else if (typeof obj[key] === 'object')
            acc[key]=sortObjectKeys(obj[key]);
        else
            acc[key]=obj[key];
        
        return acc;
    }, {});
}

export function hash(Obj : any) {
    let SortedObject : any = sortObjectKeys(Obj);
    let jsonstring = JSON.stringify(SortedObject, function(k, v) { return v === undefined ? "undef" : v; });

    // Remove all whitespace
    let jsonstringNoWhitespace :string = jsonstring.replace(/\s+/g, '');

    // let JSONBuffer: Buffer = Buffer.from(jsonstringNoWhitespace,'binary');   // encoding: encoding to use, optional.  Default is 'utf8'
    return xxhash.h64(jsonstringNoWhitespace, 0xCAFEBABE);
}