import * as vscode from 'vscode';
import EXTENSION_COMMANDS from '../commands';

export default class PartialExecutionCodeLensProvider
implements vscode.CodeLensProvider {
  _selection?: vscode.Range;
  _onDidChangeCodeLenses: vscode.EventEmitter<
    void
  > = new vscode.EventEmitter<void>();

  readonly onDidChangeCodeLenses: vscode.Event<void> = this
    ._onDidChangeCodeLenses.event;

  constructor() {
    vscode.workspace.onDidChangeConfiguration(() => {
      this._onDidChangeCodeLenses.fire();
    });
  }

  refresh(selection?: vscode.Range): void {
    this._selection = selection;
    this._onDidChangeCodeLenses.fire();
  }

  provideCodeLenses(): vscode.CodeLens[] {
    if (!this._selection) {
      return [];
    }

    const message = '► Run Selected Lines From Playground';
    const codeLens = new vscode.CodeLens(this._selection);

    codeLens.command = {
      title: message,
      command: EXTENSION_COMMANDS.MDB_RUN_SELECTED_PLAYGROUND_BLOCKS,
      arguments: [message]
    };

    return [codeLens];
  }
}
