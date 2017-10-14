
import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';

// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    console.log('Congratulations, your extension "WordCount" is now active!');

    // create a new word counter
    let gf = new GF();

    let disposable = commands.registerCommand('extension.sayHello', () => {
        gf.updateTimer();
    });

    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(gf);
    context.subscriptions.push(disposable);
}

class GF {

    private _statusBarItem: StatusBarItem;
    private timer: Date;

    public updateTimer() {

        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }

        // Get the current text editor
        let editor = window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }
        this._statusBarItem.show();
        let now = 0;
        console.log(now)
        setInterval(() => {
            console.log(now)
            this._statusBarItem.text = `已开始${now++}s`
        }, 1000);

        
    }

    public _getWordCount(doc: TextDocument): number {

        let docContent = doc.getText();

        // Parse out unwanted whitespace so the split is accurate
        docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ');
        docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        let wordCount = 0;
        if (docContent != "") {
            wordCount = docContent.split(" ").length;
        }

        return wordCount;
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}