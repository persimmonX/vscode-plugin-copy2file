// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require("fs");
const path = require("path")

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
let statusBarItem = null;
const downCommand = 'copy2file.copy'
function activate(context) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "copy2file" is now active!');
	// 创建一个新的状态栏项  
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 200);

	// 设置状态栏项的文本和点击时触发的命令  
	statusBarItem.text = 'Copy2File';
	statusBarItem.tooltip = 'Click Save To File';
	statusBarItem.command = downCommand; // 假设你已经在 package.json 中注册了这个命令
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand(downCommand, function () {
		statusBarItem.show();
		// The code you place here will be executed every time your command is executed
		// vscode.window.showInputBox({
		// 	placeHolder: "Enter the filename to save...",
		// 	value:"code.txt",
		// }).then(textToSave => {
		// 	// 弹出文件选择对话框，让用户选择保存位置  

		// });
		vscode.window.showSaveDialog({
			defaultUri: vscode.Uri.file(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath || '', 'code.txt')),
			filters: {
				'Text': ['txt', 'text'],
				'All Files': ['*']
			}
		}).then(fileUri => {
			if (fileUri) {
				// 使用 Node.js 的 fs 模块将文本写入文件  
				let editor = vscode.window.activeTextEditor;
				if (!editor) {
					vscode.window.showErrorMessage('No editor is active');
					return;
				}
				// 获取当前选择的文本  
				let selection = editor.selection;
				let selectedText = editor.document.getText(selection);
				fs.writeFileSync(fileUri.fsPath, selectedText, 'utf8');
				vscode.window.showInformationMessage(`Copy Saved To  ${fileUri.fsPath}`);
			}
		});
	});
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));
	context.subscriptions.push(disposable);
	context.subscriptions.push(statusBarItem);
	updateStatusBarItem();
}
function updateStatusBarItem() {
	//控制复制下载是否可用
	let editor = vscode.window.activeTextEditor;

	if (!editor) {
		statusBarItem.hide();
	} else {
		let selection = editor.selection;
		let selectedText = editor.document.getText(selection);
		if (selectedText) {
			statusBarItem.show();
		} else {
			statusBarItem.hide();
		}

	}

}
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
