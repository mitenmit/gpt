import * as icons from "./components/Icons"
import { lex } from "./lexer"
import { recordToPvAttr } from "./promptVariable"

import {atom, useAtom, useSetAtom} from "jotai"
import { Fragment } from 'react';
import * as fs from 'browser-fs-access';

export const openFileHandleAtom = atom(null);
let openFileHandle:any = null;


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

function hydrateWorkspace(wspc: any) {
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

function openFile(options: any, onSuccess: Function) {
  let blob = fs.fileOpen({extensions: options.extensions, mimeTypes: ["txt/*"]});
  blob.then(
    (result) => {
      result.text().then(
        (state) => {
          let workspace = hydrateWorkspace(JSON.parse(state));
          if (typeof onSuccess === "function") onSuccess(result, workspace);
          
        }
      )
    }
  ).catch( (err) => {} );
}

function saveFile(content: string, options: any, onSuccess: Function) {
  let blob = new Blob([content], { type: "application/json" });
  let fsOpts = {fileName: options.fileName || "untitled", extensions: options.extensions};
  
  (options?.handle ? fs.fileSave(blob, fsOpts, options.handle, true) : fs.fileSave(blob, fsOpts))
  .then( (res) => { if (typeof onSuccess === "function") onSuccess(res); })
  .catch( (err) => {})
}

export function WorkspaceMenuOptions(): [{key: string, label: any}] {
  let [openFileHandle] = useAtom(openFileHandleAtom);

  let options: [{key: string, label: any}] = [{key: "load", label: <Fragment><icons.Folder/> Load Workspave</Fragment>}];
  if (openFileHandle) 
    options.push({key: "save", label: <Fragment><icons.Diskette/> Save Workspace</Fragment>});
  options.push({key: "save-as", label: <Fragment><icons.Download/> Save Workspace As ...</Fragment>});

  return options;
}

export function onWorkspaceMenuItemClick(key: string, label: any, loadWorkspace: Function, saveWorkspace: Function, setFileHandle: Function) {
  switch (key) {
    case "load":
      openFile({extensions: [".llmwsp"]}, (res: any, workspace: any) => {
        loadWorkspace(workspace)
        openFileHandle = res.handle;
        setFileHandle(res.handle);
      })
      break;
    case "save": {
      let content = saveWorkspace();
      saveFile(content, {handle: openFileHandle}, (res: any) => {
        
      })
    } break;  
    case "save-as": {
      let content = saveWorkspace();
      saveFile(content, {fileName: "untitled.llmwsp", extensions: [".llmwsp"]}, (res: any) => {
        openFileHandle = res;
        setFileHandle(res);
      })
    } break;  
    default:
      console.error("Unknown workspace action");  
  }
}