import * as consts from "./constants"
import {hash} from "./hash"
import { isPv } from "./promptVariable"
import {AppState, Templates, TemplateIndex, TemplateId, LoadedExampleId, CurrentValues} from "./types"

import {atom, useAtom, useAtomValue, useSetAtom} from "jotai"
import { toast } from "react-hot-toast";

const initialTemplates = [consts.PROMPT_TEMPLATE];
const _testInitialTemplates = [consts.PROMPT_TEMPLATE,
                              {...consts.PROMPT_TEMPLATE, name: "Updated Template", id: crypto.randomUUID()}];

const appState: AppState = {
    templates: atom<Templates>(initialTemplates),
    templateIndex: atom<TemplateIndex>(0),
    templateId: atom<TemplateId>(""),
    loadedExampleId: atom<LoadedExampleId>(null),
    currentValues: atom<CurrentValues>({})
};

export const newExampleName = atom("");

export const useNewExampleName = (): string => {
    return useAtomValue(newExampleName);
};

export const useSetNewExampleName = () => {
    return useSetAtom(newExampleName);
};

export const templateByIdAtom = atom(
    null,
    (get, set, id: string) => { 
        let template = get(appState.templates)
                       .filter((t) => t.id === id).at(0);
        return template;
    }
);

export const isEmpty = (obj: any) => {
    let keys = Object.keys(obj);
    return keys.length === 0 ||
           keys.reduce( (acc, k: string) =>  acc && !obj[k], true );
}

const createEmptyValues = (template: Array<any>) => {
    return template.reduce( (acc, block) => {
        let filteredVars = block.filter(isPv); 
        let variable = (filteredVars && filteredVars.length) ? filteredVars[0].variable : null;
        if (variable) acc[variable] = "";
        return acc;
    }, {});
}

const removeEmptyKeys = (values: any) => {
    return Object.keys(values).reduce( (acc: Record<string, any>, k: string) => {
        if (values[k]) acc[k] = values[k];
        return acc;
    }, {});
}

/* Template Subscriptions */ 

export const useTemplates = (): Templates => {
    return useAtomValue(appState.templates);
};

export const useTemplateNames = (): Array<string> => {
    return useTemplates().map( t => t.name );
};

export const useTemplateOptions = () => {
    return useTemplates().map( (t, i) => {
        return { key: i, label: t.name }
    });
}

export const useSelectedTemplate = (): any => {
    let templates = useAtomValue(appState.templates);
    let index = useAtomValue(appState.templateIndex);
    return templates[index];
};

export const useSelectedTemplateName = (): string => {
    return useSelectedTemplate().name;
};

export const useSelectedTemplateId = (): string => {
    return useSelectedTemplate().id;
};

export const useSelectedTemplateAttr = (key: string) => {
    return useSelectedTemplate().promptVariableAttributes[key];
};

export const useSelectedTemplateExampes = () => {
    return useSelectedTemplate().examples;
};


export const useTemplateIndex = (): number => {
    return useAtomValue(appState.templateIndex);
};

export const useCurrentValues = (): CurrentValues => {
    return useAtomValue(appState.currentValues);
};

export const useCurrentValuesEmpty = (): boolean => {
    return isEmpty(useAtomValue(appState.currentValues));
};

export const useLoadedExampleId = (): LoadedExampleId => {
    return useAtomValue(appState.loadedExampleId)
}

export const useIsExampleModified = (): boolean => {
    let loadedExampleId = useAtomValue(appState.loadedExampleId);
    let template = useSelectedTemplate();
    let currentValues = useCurrentValues();
    let example = loadedExampleId ? template.examples.filter( (e: any) => e.id === loadedExampleId)[0] : null;

    return hash(removeEmptyKeys(example?.values)).toNumber() !== hash(removeEmptyKeys(currentValues)).toNumber();
}

export const useLoadedExampleName = (): boolean => {
    let loadedExampleId = useAtomValue(appState.loadedExampleId);
    let template = useSelectedTemplate();
    let example = loadedExampleId ? template.examples.filter( (e: any) => e.id === loadedExampleId)[0] : null;

    return example?.name;
}

export const useStateToJSON = (): Record<string, any> => {
    let [templates] = useAtom(appState.templates);
    let [templateIndex] = useAtom(appState.templateIndex);
    let [loadedExampleId] = useAtom(appState.loadedExampleId);
    let [currentValues] = useAtom(appState.currentValues);

    return {
        templates: templates,
        templateIndex: templateIndex,
        loadedExampleId: loadedExampleId,
        currentValues: currentValues
    };
}

export const useCurrentValue = (key: string): string | null => {
    return useAtomValue(appState.currentValues)[key];
};

/* Actions */

export const useAction = (action: string): any => {
    switch (action) {
        case "select_template": {
            return atom<null, [number], void>(null, (get, set, index: number) => {
                let template = get(appState.templates)[index];
            
                set(appState.templateIndex, index);
                set(appState.templateId, template.id)
                set(appState.loadedExampleId, null) 
                set(appState.currentValues, {}) 
            });
        }
        
        case "set_template": {
            return atom<null, [any], void>(null, (get, set, template: any) => { 
                let templates = get(appState.templates);
                if (!template.id) { 
                    template.id = crypto.randomUUID();
                    set(appState.templates, [...templates, template])
                    toast.success("Propmpt Copied to Clipboard");
                } else {
                    let updatedTemplates = templates.reduce( (acc, t) => {
                        if (t.id === template.id)
                            acc.push(template);
                        else 
                            acc.push(t);
                        return acc;
                    }, []);
                    set(appState.templates, updatedTemplates)
                    toast.success("Propmpt Copied to Clipboard");
                }    
            });
        }

        case "delete_template": {
            return atom<null, [string], void>(null, (get, set, templateId: string) => { 
                let templates = get(appState.templates);
                let templateIndex = get(appState.templateIndex);
                let updatedTemplates = templates.filter( t => t.id !== templateId );

                if (templateIndex >= updatedTemplates.length && templateIndex > 0)
                    set(appState.templateIndex, templateIndex - 1)
                set(appState.templates, updatedTemplates);
                toast.success("Template Deleted Successfuly");
            });
        }

        case "clear_value": {
            return atom<null, [string], void>(null, (get, set, key: string) => { 
                set(appState.currentValues, {...get(appState.currentValues), [key]: ""});
            });
        }

        case "set_value": {
            return atom<null, [string, string], void>(null, (get, set, key: string, value: string) => { 
                let v = value ? value : null;
                set(appState.currentValues, {...get(appState.currentValues), [key]: v});
            });
        }

        case "create_example": {
            return atom<null, [], void>(null, (get, set) => { 
                let currentValues = get(appState.currentValues)
                let templates = get(appState.templates);
                let templateIndex = get(appState.templateIndex);
                let examples = templates[templateIndex].examples;
                let exampleName = get(newExampleName);
                let exampleId = crypto.randomUUID();

                let updatedExamples = [...examples, {name: exampleName, id: exampleId, values: {...currentValues}}];
                
                set(appState.templates, templates.map( (t, i) => i === templateIndex ? {...t, examples: updatedExamples} : t));
                set(appState.loadedExampleId, exampleId);
                toast.success("Example saved");
            }); 
        }

        case "update_example": {
            return atom<null, [string], void>(null, (get, set, exampleId: string) => { 
                let currentValues = get(appState.currentValues)
                let templates = get(appState.templates);
                let templateIndex = get(appState.templateIndex);
                
                set(appState.templates, templates.map( 
                    (t, i) => i === templateIndex ? 
                                {...t, examples: [...t.examples].map( (ex) => ex.id === exampleId ? {...ex, values: {...currentValues}} : ex)} 
                                : t)
                );
                toast.success("Example updated");
            }); 
        }

        case "delete_example": {
            return atom<null, [], void>(null, (get, set) => { 
                let currentValues = get(appState.currentValues)
                let templates = get(appState.templates);
                let templateIndex = get(appState.templateIndex);
                let loadedExampleId = get(appState.loadedExampleId);
                
                set(appState.loadedExampleId, null);
                set(appState.templates, templates.map( 
                    (t, i) => i === templateIndex ?     
                                {...t, examples: [...t.examples].filter( (e) => e.id !== loadedExampleId)} 
                                : t)
                );
                toast.success("Example deleted");
            }); 
        }

        case "load_example": {
            return atom<null, [string | null], void>(null, (get, set, exampleId: string | null) => {
                let templates = get(appState.templates);
                let templateIndex = get(appState.templateIndex);
                let template =  templates[templateIndex].template;
                let examples = templates[templateIndex].examples;

                if (exampleId) {
                    let example = examples.filter( (e: any) => e.id === exampleId)[0];
                    let values = example?.values;
                    set(appState.loadedExampleId, exampleId)
                    set(appState.currentValues, values)
                } else {
                    set(appState.loadedExampleId, null)
                    set(appState.currentValues, createEmptyValues(template))
                }    

            });
        }

        case "load_workspace": {
            return atom<null, [any], void>(null, (get, set, workspace: any) => {
                set(appState.templates, workspace.templates)
                set(appState.templateIndex, workspace.templateIndex)
                set(appState.loadedExampleId, workspace.loadedExampleId)
                set(appState.currentValues, workspace.currentValues)
            })
        }

        case "save_workspace": {
            return atom<null, [], string>(null, (get, set) => {
                let state = {
                    templates: get(appState.templates),
                    templateIndex: get(appState.templateIndex),
                    loadedExampleId: get(appState.loadedExampleId),
                    currentValues: get(appState.currentValues)
                }
                return JSON.stringify(state);
            })
        }
    }

    return atom(null);
}