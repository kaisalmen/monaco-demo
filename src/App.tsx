import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";

loader.config({ monaco });

import "@codingame/monaco-vscode-standalone-languages";

import { ConsoleLogger } from "monaco-languageclient/common";
import { LogLevel } from "@codingame/monaco-vscode-api";
import { type LanguageClientConfig, LanguageClientWrapper } from "monaco-languageclient/lcwrapper";
import { MonacoVscodeApiWrapper } from "monaco-languageclient/vscodeApiWrapper";
import { CloseAction, ErrorAction } from "vscode-languageclient";
import { configureDefaultWorkerFactory } from "monaco-languageclient/workerFactory";
import MonacoEditor from "@monaco-editor/react";

const apiWrapper = new MonacoVscodeApiWrapper({
  $type: 'classic',
  viewsConfig: {
    $type: 'EditorService',
    htmlContainer: 'ReactPlaceholder'
  },
  logLevel: LogLevel.Debug,
  monacoWorkerFactory: configureDefaultWorkerFactory
});
await apiWrapper.start();

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
      languageId: 'python',
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

    const logger = new ConsoleLogger(LogLevel.Debug);
    const languageClientWrapper = new LanguageClientWrapper(languageClientConfig, logger);

    await languageClientWrapper.start();
  };

  return onWebSocketConnectionOpen;
};

export default App;
