// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('cydran-intellisense.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello Cydran from Cydran IntelliSense!');
	});

	//for debugging
	const provider2 = vscode.languages.registerCompletionItemProvider(
		'plaintext',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				// get all text until the `position` and check if it reads `console.`
				// and if so then complete if `log`, `warn`, and `error`
				const linePrefix = document.lineAt(position).text.substring(0, position.character);
				if (!linePrefix.endsWith('console.')) {
					return undefined;
				}

				return [
					new vscode.CompletionItem('log', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('warn', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('error', vscode.CompletionItemKind.Method),
				];
			}
		},
		'.' // triggered whenever a '.' is being typed
	);

	// const pubSub = vscode.languages.registerCompletionItemProvider(
	// 	'javascript',
	// 	{
	// 		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

	// 				const message = new vscode.CompletionItem('this.message');
	// 				// ${1|this|or|this|}, ${2:SampleText}
	// 				message.insertText = new vscode.SnippetString('this.message(\'${1:channelName}\', \'${2:messageType}\', ${3:somePayLoad});');
	// 				const messageDocs : any = new vscode.MarkdownString("publish a message directly.");
	// 				message.documentation = messageDocs;

	// 				//this is for adding docs linking which we cant do at work anyway :(
	// 				// docs.baseUri = vscode.Uri.parse('http://example.com/a/b/c/');

	// 				const broadcast = new vscode.CompletionItem('this.broadcast');
	// 				broadcast.insertText = new vscode.SnippetString('this.broadcast(\'${1:channelName}\', \'${2:messageType}\', ${3:somePayLoad});');
	// 				const broadcastDocs : any = new vscode.MarkdownString("broadcast a message.");
	// 				broadcast.documentation = broadcastDocs;


	// 			return [
	// 				message,
	// 				broadcast,
	// 				new vscode.CompletionItem('this.globalBrodcast', vscode.CompletionItemKind.Method)
	// 			];
	// 		}
	// 	});

	const pubSub = vscode.languages.registerCompletionItemProvider(
		'javascript',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				const message = new vscode.CompletionItem('message', vscode.CompletionItemKind.Method);
				// ${1|this|or|this|}, ${2:SampleText}
				message.insertText = new vscode.SnippetString('message(\'${1:channelName}\', \'${2:messageType}\', ${3:somePayLoad});');
				const messageDocs: any = new vscode.MarkdownString("publish a message directly.");
				message.documentation = messageDocs;



				// get all text until the `position` and check if it reads `console.`
				// and if so then complete if `log`, `warn`, and `error`
				const linePrefix = document.lineAt(position).text.substring(0, position.character);
				if (!linePrefix.endsWith('this.')) {
					return undefined;
				}

				return [
					new vscode.CompletionItem('broadcast', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('globalBroadcast', vscode.CompletionItemKind.Method),
					message
				];
			}
		}, '.'
	);



	context.subscriptions.push(disposable, provider2, pubSub);
}

// this method is called when your extension is deactivated
export function deactivate() { }
