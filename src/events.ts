import { appState, newExampleNameAtom, createEmptyValues, hydrateWorkspace, initialAppState } from "./state";

import { atom } from "jotai"
import { toast } from "react-hot-toast";


export const loadWorkspaceAtom = atom<null, [any], void>(null, (get, set, workspace: any) => {
    set(appState.templates, workspace.templates)
    set(appState.templateIndex, workspace.templateIndex)
    set(appState.loadedExampleId, workspace.loadedExampleId)
    set(appState.currentValues, workspace.currentValues)
});

export const saveWorkspaceAtom = atom<null, [], string>(null, (get, set) => {
    let state = {
        templates: get(appState.templates),
        templateIndex: get(appState.templateIndex),
        loadedExampleId: get(appState.loadedExampleId),
        currentValues: get(appState.currentValues)
    }
    return JSON.stringify(state);
});


export const writeStateLocalStorageAtom = atom<null, [], void>(null, (get, set) => {
    let state = set(saveWorkspaceAtom);
    window.localStorage.setItem("state", state);
});

export const readStateLocalStorageAtom = atom<null, [], void>(null, (get, set) => {
    let state = window.localStorage.getItem("state");
    state = state ? hydrateWorkspace( JSON.parse( state ) ) : null;
    if (state) set(loadWorkspaceAtom, state);
});

export const resetWorkspaceAtom = atom<null, [], void>(null, (get, set) => {
    let {currentValues, loadedExampleId, templateId, templateIndex, templates} = initialAppState();
    set( appState.currentValues, get(currentValues) );
    set( appState.loadedExampleId, get(loadedExampleId) );
    set( appState.templateIndex, get(templateIndex) );
    set( appState.templates,  get(templates));
})

export const selectTemplateAtom = atom<null, [number], void>(null, (get, set, index: number) => {
    let template = get(appState.templates)[index];
    
    set(appState.templateIndex, index);
    set(appState.templateId, template.id)
    set(appState.loadedExampleId, null) 
    set(appState.currentValues, {}) 

    set(writeStateLocalStorageAtom);
});


export const setTemplateAtom = atom<null, [any], void>(null, (get, set, template: any) => { 
    let templates = get(appState.templates);
    if (!template.id) { 
        template.id = crypto.randomUUID();
        set(appState.templates, [...templates, template])
        toast.success("Template created");
    } else {
        let updatedTemplates = templates.reduce( (acc, t) => {
            if (t.id === template.id)
                acc.push(template);
            else 
                acc.push(t);
            return acc;
        }, []);
        set(appState.templates, updatedTemplates)
        toast.success("Template updated");
    }
    set(writeStateLocalStorageAtom);    
});


export const deleteTemplateAtom = atom<null, [string], void>(null, (get, set, templateId: string) => { 
    let templates = get(appState.templates);
    let templateIndex = get(appState.templateIndex);
    let updatedTemplates = templates.filter( t => t.id !== templateId );

    if (templateIndex >= updatedTemplates.length && templateIndex > 0)
        set(appState.templateIndex, templateIndex - 1)
    set(appState.templates, updatedTemplates);
    toast.success("Template Deleted Successfuly");
    set(writeStateLocalStorageAtom);
});


export const clearValueAtom = atom<null, [string], void>(null, (get, set, key: string) => { 
    set(appState.currentValues, {...get(appState.currentValues), [key]: ""});
    set(writeStateLocalStorageAtom);    
});


export const setValueAtom = atom<null, [string, string], void>(null, (get, set, key: string, value: string) => { 
    let v = value ? value : null;
    set(appState.currentValues, {...get(appState.currentValues), [key]: v});
    set(writeStateLocalStorageAtom);
});

export const createExampleAtom =  atom<null, [], void>(null, (get, set) => { 
    let currentValues = get(appState.currentValues)
    let templates = get(appState.templates);
    let templateIndex = get(appState.templateIndex);
    let examples = templates[templateIndex].examples;
    let exampleName = get(newExampleNameAtom);
    let exampleId = crypto.randomUUID();

    let updatedExamples = [...examples, {name: exampleName, id: exampleId, values: {...currentValues}}];
    
    set(appState.templates, templates.map( (t, i) => i === templateIndex ? {...t, examples: updatedExamples} : t));
    set(appState.loadedExampleId, exampleId);
    toast.success("Example saved");
    set(writeStateLocalStorageAtom);    
});


export const updateExampleAtom = atom<null, [string | null], void>(null, (get, set, exampleId: string | null) => { 
    let currentValues = get(appState.currentValues)
    let templates = get(appState.templates);
    let templateIndex = get(appState.templateIndex);
    
    set(appState.templates, templates.map( 
        (t, i) => i === templateIndex ? 
                    {...t, examples: [...t.examples].map( (ex) => ex.id === exampleId ? {...ex, values: {...currentValues}} : ex)} 
                    : t)
    );
    toast.success("Example updated");
    set(writeStateLocalStorageAtom);    
});


export const deleteExampleAtom = atom<null, [], void>(null, (get, set) => { 
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
    set(writeStateLocalStorageAtom);    
});


export const loadExampleAtom = atom<null, [string | null], void>(null, (get, set, exampleId: string | null) => {
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
    set(writeStateLocalStorageAtom);        
});
