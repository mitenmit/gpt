import * as icons from "./components/Icons"

import {atom, useAtom, useSetAtom} from "jotai"
import { Fragment } from 'react';
import * as fs from 'browser-fs-access';
import { hydrateWorkspace } from "./state";

export const openFileHandleAtom = atom(null);
let openFileHandle:any = null;


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
  options.push({key: "reset", label: <div className="red"><icons.DeleteRedIcon/> Reset Workspace</div>});

  return options;
}

export function onWorkspaceMenuItemClick(key: string, label: any, loadWorkspace: Function, saveWorkspace: Function, setFileHandle: Function, resetWorkspace: Function) {
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
    case "reset": {
      resetWorkspace();
    } break;  
    default:
      console.error("Unknown workspace action");  
  }
}