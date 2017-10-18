
import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';

// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    console.log('Congratulations, your extension "vscGF" is now active!');

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
    private name: string;
    private timer: number;

    public getName(){
        window.showInputBox({
            placeHolder: '给你女朋友取个名字'
        }).then(name => {
            this.gfName = name;
            window.showInputBox({
                placeHolder: '你的昵称'
            }).then(name => {
                this.name = name;
            });
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
        this.timer = 0;
        setInterval(() => {
            this._statusBarItem.text = `已开始${this.timer++}s`;
            if(this.timer % 60 === 0){
                this.showMsg(this.timer / 60);
            }
        }, 1000);
    }

    public showMsg(now: number) {//过去多少分钟
        function actionHandler(action:any){
            console.log(action)
            if(action){
                this.timer = 0;
            }
        }
        if(now % 60 === 0){
            let msg = `${this.gfName}:${this.name}，你已经连续写了一个小时了，脖子，腰，背是不是很难受?😰`
            window.showInformationMessage(msg, '重新计时').then(action => actionHandler.call(this, action));
        }
        if(now % 30 === 0){//过去半小时
            let msg = `${this.gfName}:${this.name}，你已经敲了${now}分钟了，接杯热水，走动走动哦☕`
            window.showInformationMessage(msg, '重新计时').then(action => actionHandler.call(this, action));
        }
        if(now % 1 === 0){//过去十分钟
            let msg = `${this.gfName}:${this.name}，你已经敲了${now}分钟了，环顾四周，看看风景😘`
            window.showInformationMessage(msg, '重新计时').then(action => actionHandler.call(this, action));
        }
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}