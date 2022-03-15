// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

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

	const pubSub = vscode.languages.registerCompletionItemProvider(
		'javascript',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				const message = new vscode.CompletionItem('message', vscode.CompletionItemKind.Method);
				// ${1|this,or,this|}, ${2:SampleText}
				message.insertText = new vscode.SnippetString('message(\'${1:channelName}\', \'${2:messageType}\', ${3:somePayLoad});');
				const messageDocs: any = new vscode.MarkdownString("Cydran: publish a message directly");
				message.documentation = messageDocs;

				const broadcast = new vscode.CompletionItem('broadcast', vscode.CompletionItemKind.Method);
				broadcast.insertText = new vscode.SnippetString('broadcast(\'${1:channelName}\', \'${2:messageType}\', ${3:somePayLoad});');
				const broadcastDocs: any = new vscode.MarkdownString("Cydran: broadcast a message");
				broadcast.documentation = broadcastDocs;

				const broadcastGlobal = new vscode.CompletionItem('broadcastGlobally', vscode.CompletionItemKind.Method);
				broadcastGlobal.insertText = new vscode.SnippetString('broadcast(\'${1:channelName}\', \'${2:messageType}\', ${3:somePayLoad});');
				const broadcastGlobalDocs: any = new vscode.MarkdownString("Cydran: broadcast a message in the Cydran global scope");
				broadcastGlobal.documentation = broadcastGlobalDocs;

				const directMessage = new vscode.CompletionItem('on', vscode.CompletionItemKind.Method);
				directMessage.insertText = new vscode.SnippetString('on(\"${1:messageType}\").invoke(${2:expression});');
				const directMessageDocs: any = new vscode.MarkdownString("Cydran: Listening for direct messages");
				directMessage.documentation = directMessageDocs;

				const broadcastMessage = new vscode.CompletionItem('on', vscode.CompletionItemKind.Method);
				broadcastMessage.insertText = new vscode.SnippetString('on(\"${1:messageType}\").forChannel(\"${2:channelName}\").invoke(${3:expression});');
				const broadcastMessageDocs: any = new vscode.MarkdownString("Cydran: listening for brodcast messages");
				broadcastMessage.documentation = broadcastMessageDocs;


				// get all text until the `position` and check if it reads `console.`
				// and if so then complete if `log`, `warn`, and `error`
				const linePrefix = document.lineAt(position).text.substring(0, position.character);
				if (!linePrefix.endsWith('this.')) {
					console.log('pfx: ' + linePrefix);
					return undefined;
				}

				console.log('pfx: match');
				return [
					broadcast,
					broadcastGlobal,
					message,
					directMessage,
					broadcastMessage
				];
			}
		}, '.'
	);

	const htmlCommands = vscode.languages.registerCompletionItemProvider(
		'html',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				const ceach = new vscode.CompletionItem('each');
				ceach.insertText = new vscode.SnippetString('each=\'${1:List}\'');
				const ceachDocs: any = new vscode.MarkdownString("Cydran: Repeating Cydran stuctures (arrays). Works similarly to a foreach loop. requires a c-each-mode=");
				ceach.documentation = ceachDocs;

				const ceachMode = new vscode.CompletionItem('each-mode');
				ceachMode.insertText = new vscode.SnippetString('each-mode=\'${1|none,generated,expression|}\'');
				const ceachModeDocs: any = new vscode.MarkdownString("Cydran: Repeating Cydran stuctures (arrays). Works similarly to a foreach loop. requires a c-each-mode=");
				ceachMode.documentation = ceachModeDocs;


				const reger = /([\w\[\]]+\-[\w\[\]\.]*)/g;

				const linePrefix = document.lineAt(position).text.substring(0, position.character);
				// if (!linePrefix.endsWith('c.')) {
				// 	console.log('pfx: ' + linePrefix);
				// 	return undefined;
				// }
				if (!linePrefix.match(reger)) {
					console.log('pfx: ' + linePrefix);
					return undefined;
				}


				console.log('pfx: match');
				//temp return
				return [
					ceach,
					ceachMode
				];
			}
		}, '-'
	);

	context.subscriptions.push(disposable, provider2, pubSub);
}

// this method is called when your extension is deactivated
export function deactivate() { }
