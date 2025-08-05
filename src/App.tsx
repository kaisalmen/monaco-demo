import { LogLevel } from "@codingame/monaco-vscode-api";
import {
  type LanguageClientConfig,
  LanguageClientWrapper,
} from "monaco-editor-wrapper";
import { ConsoleLogger } from "monaco-languageclient/tools";
import { CloseAction, ErrorAction } from "vscode-languageclient";

import "monaco-editor/esm/vs/editor/editor.all";
import "monaco-editor/esm/vs/basic-languages/xml/xml.contribution";
import "monaco-editor/esm/vs/language/json/monaco.contribution";

import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";

loader.config({ monaco });
import { configureDefaultWorkerFactory } from "monaco-editor-wrapper/workers/workerLoaders";

import MonacoEditor from "@monaco-editor/react";

import { initServices } from "monaco-languageclient/vscode/services";

await initServices({});
configureDefaultWorkerFactory();

function App() {
  const a = useLangClientConfig();

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MonacoEditor
        value=""
        onMount={() => a()}
        language="xml"
        path="inmemory://direct.xml"
      ></MonacoEditor>
    </div>
  );
}

export const useLangClientConfig = () => {
  const onWebSocketConnectionOpen = async () => {
    const logger = new ConsoleLogger(LogLevel.Trace);
    const languageClientConfig: LanguageClientConfig = {
      name: "OVAL Language Client",
      clientOptions: {
        documentSelector: ["xml"],
        errorHandler: {
          error: () => ({ action: ErrorAction.Continue }),
          closed: () => ({ action: CloseAction.DoNotRestart }),
        },
      },
      connection: {
        options: {
          $type: "WebSocketUrl",
          url: "ws://localhost:30000/sampleServer",
        },
      },
    };
    const languageClientWrapper = new LanguageClientWrapper({
      languageClientConfig,
      logger,
    });

    await languageClientWrapper.start();
  };

  return onWebSocketConnectionOpen;
};

export default App;
