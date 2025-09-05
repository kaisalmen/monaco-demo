import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";

loader.config({ monaco });

import "@codingame/monaco-vscode-standalone-languages";

import { LogLevel } from "@codingame/monaco-vscode-api";
import {
  type LanguageClientConfig,
  LanguageClientWrapper,
} from "monaco-editor-wrapper";
import { ConsoleLogger } from "monaco-languageclient/tools";
import { CloseAction, ErrorAction } from "vscode-languageclient";

import { configureDefaultWorkerFactory } from "monaco-editor-wrapper/workers/workerLoaders";


import MonacoEditor from "@monaco-editor/react";

import { initServices } from "monaco-languageclient/vscode/services";

const logger = new ConsoleLogger(LogLevel.Debug);
await initServices({}, { logger });
configureDefaultWorkerFactory();

const code = `def print_hello():

    x=5
    print("Hello World!")

print_hello()`;

function App() {
  const a = useLangClientConfig();

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MonacoEditor
        value={code}
        onMount={() => a()}
        language="python"
      ></MonacoEditor>
    </div>
  );
}

export const useLangClientConfig = () => {
  const onWebSocketConnectionOpen = async () => {
    const languageClientConfig: LanguageClientConfig = {
      name: "OVAL Language Client",
      clientOptions: {
        documentSelector: ['python', 'py'],
        errorHandler: {
          error: () => ({ action: ErrorAction.Continue }),
          closed: () => ({ action: CloseAction.DoNotRestart }),
        }
      },
      connection: {
        options: {
          $type: "WebSocketUrl",
          url: "ws://localhost:30001/pyright?authorization=UserAuth",
        },
      }
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
