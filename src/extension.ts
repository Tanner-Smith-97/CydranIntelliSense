// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { readFileSync, existsSync } from 'fs';
import { homedir } from 'os';

type CydranJson = {
	cydran: [
		{
			completionItem: string,
			snippetString: string,
			markdownString: string
		}
	]
};

console.log(process.cwd());

// const wf = vscode.workspace.workspaceFolders![0].uri.path;

let cydranJson: CydranJson = onLoad();

function onLoad(): CydranJson {
	console.log('in onLoad');
	if (existsSync('./cydran.json')) {
		console.log('debug json loaded');
		return JSON.parse(readFileSync('./cydran.json', 'utf-8'));
	} else if (existsSync(homedir() + '/.vscode/extensions/tannersmith.cydran-intellisense-0.0.9/out/cydran.json')) {
		console.log('prod json loaded');
		return JSON.parse(readFileSync(homedir() + '/.vscode/extensions/tannersmith.cydran-intellisense-0.0.9/out/cydran.json', 'utf-8'));
	} else {
		throw new Error('It didn\'t work :(');
	}
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, Cydran IntelliSense is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('cydran-intellisense.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello from Cydran IntelliSense!');
	});

	const htmlCommands = vscode.languages.registerCompletionItemProvider(
		'html',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

				const cydranCompletionItems: vscode.CompletionItem[] = [];

				cydranJson.cydran.forEach(cydranItem => {
					const item = new vscode.CompletionItem(cydranItem.completionItem);
					item.insertText = new vscode.SnippetString(cydranItem.snippetString);
					const itemDocs = new vscode.MarkdownString(cydranItem.markdownString);
					item.documentation = itemDocs;
					cydranCompletionItems.push(item);
				});

				// const ceach = new vscode.CompletionItem('c-each');
				// ceach.insertText = new vscode.SnippetString('c-each=\'${1:List}\'');
				// const ceachDocs: any = new vscode.MarkdownString("Cydran: Repeating Cydran stuctures (arrays). Works similarly to a foreach loop. requires a c-each-mode=");
				// ceach.documentation = ceachDocs;

				// const ceachMode = new vscode.CompletionItem('c-each-mode');
				// ceachMode.insertText = new vscode.SnippetString('c-each-mode=\'${1|none,generated,expression|}\'');
				// const ceachModeDocs: any = new vscode.MarkdownString("Cydran: Repeating Cydran stuctures (arrays). This is c-each-mode");
				// ceachMode.documentation = ceachModeDocs;

				return cydranCompletionItems;
			}
		}
	);

	context.subscriptions.push(htmlCommands, disposable);

	// context.subscriptions.push(disposable, provider2, pubSub, htmlCommands);

	// vscode.workspace.onDidChangeTextDocument(event => {
	// 	insertAutoCloseTag(event);
	// });

	// let closeTag = vscode.commands.registerCommand('auto-close-tag.closeTag', () => {
	// 	insertCloseTag();
	// });

	// let showStuff = 


	// context.subscriptions.push(closeTag);

}

// this method is called when your extension is deactivated
export function deactivate() { }