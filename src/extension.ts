
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
        gf.getName();
        gf.updateTimer();
    });

    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(gf);
    context.subscriptions.push(disposable);
}

class GF {

    private _statusBarItem: StatusBarItem;
    private gfName: string;

    public getName(){
        window.showInputBox({
            placeHolder: '给你女朋友取个名字'
        }).then(name => {
            this.gfName = name;
            console.log(this.gfName);
        })
    }

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
        setInterval(() => {
            this._statusBarItem.text = `已开始${now++}s`;
            if(now % 60 === 0){
                this.showMsg(`${this.gfName}:老公，已撸代码长达${now/60}分钟`);
            }
        }, 1000);
    }

    public showMsg(msg: string) {
        window.showInformationMessage(msg, '重新计时');
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}