import * as consts from "./constants"
import { isPv, recordToPvAttr } from "./components/promptVariable"
import {AppState, Templates, TemplateIndex, TemplateId, LoadedExampleId, CurrentValues} from "./types"

import { atom, useAtomValue, useSetAtom } from "jotai"
import { lex } from "./lexer"

const initialTemplates = [consts.PROMPT_TEMPLATE];
// const _testInitialTemplates = [consts.PROMPT_TEMPLATE,
//                               {...consts.PROMPT_TEMPLATE, name: "Updated Template", id: crypto.randomUUID()}];

export const initialAppState = () => {
    return {
        templates: atom<Templates>(initialTemplates),
        templateIndex: atom<TemplateIndex>(0),
        templateId: atom<TemplateId>(""),
        loadedExampleId: atom<LoadedExampleId>(null),
        currentValues: atom<CurrentValues>({})
    }
}

export const appState: AppState = initialAppState();

export const newExampleNameAtom = atom("");

export const useNewExampleName = (): string => {
    return useAtomValue(newExampleNameAtom);
};

export const useSetNewExampleName = () => {
    return useSetAtom(newExampleNameAtom);
};

export const templateByIdAtom = atom(
    null,
    (get, set, id: string) => { 
        let template = get(appState.templates)
                       .filter((t) => t.id === id).at(0);
        return template;
    }
);

export const createEmptyValues = (template: Array<any>) => {
    return template.reduce( (acc, block) => {
        let filteredVars = block.filter(isPv); 
        let variable = (filteredVars && filteredVars.length) ? filteredVars[0].variable : null;
        if (variable) acc[variable] = "";
        return acc;
    }, {});
}

function renameKey(o: any, oldKey: string, newKey: any) {
    let ownPropDescriptor = Object.hasOwn(o, oldKey) && Object.getOwnPropertyDescriptor(o, oldKey);
    if (oldKey !== newKey && ownPropDescriptor) {
        Object.defineProperty(o, newKey, ownPropDescriptor);
        delete o[oldKey];
    }
  }
  
  function renameKeys(o: any, mapping: Record<string, string>) {
    for(const k  in mapping)
      renameKey(o, k, mapping[k])
  }
  
  export function hydrateWorkspace(wspc: any) {
    let keyMapping: Record<string, any> = { "loaded-example-id": "loadedExampleId",
                                            "template-index": "templateIndex",
                                            "values": "currentValues"}
    let templateMapping: Record<string, any> = {"prompt-variable-attributes": "promptVariableAttributes",
                                                "source-template": "sourceTemplate"};
    let promptVariableMapping : Record<string, any> = {"empty-value": "emptyValue"}                                              
  
    let workspace = {...wspc};
  
    renameKeys(workspace, keyMapping)
  
    workspace.templates = workspace.templates.map( (t: any) => {
      renameKeys(t, templateMapping);
      for (const k in t.promptVariableAttributes) {
        renameKeys(t.promptVariableAttributes[k], promptVariableMapping)
        t.promptVariableAttributes[k] = recordToPvAttr(t.promptVariableAttributes[k])
      }
  
      if (t.sourceTemplate)
        t.template = lex(t.sourceTemplate);
      
      return t;
    })
    
    return workspace;
  }