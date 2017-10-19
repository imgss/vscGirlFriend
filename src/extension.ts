
import {window, commands, Disposable, ExtensionContext, ThemeColor,StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';

let vscode = require('vscode');
console.dir(vscode);
let theme = new ThemeColor('1');
console.dir(theme)
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
                this._statusBarItem.color = 'red'
            }
        }, 1000);
    }

    public showMsg(now: number) {//过去多少分钟
        let showMsg = (msg: string) => {
            let prefix = `${this.gfName}:${this.name},`;
            window.showInformationMessage(prefix + msg, '重新计时').then(action => {
                if(action){
                    this.timer = 0;
                }
            });
        }
        if(now % 60 === 0){
            showMsg(`你已经连续写了一个小时了，脖子，腰，背是不是很难受?😰`);
            return;
        }
        if(now % 30 === 0){//过去半小时
            showMsg(`你已经敲了${now}分钟了，接杯热水，走动走动哦☕`);
            return;
        }
        if(now % 10 === 0){//过去十分钟
            showMsg(`你已经敲了${now}分钟了，环顾四周，看看风景😘`);
            return;
        }
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}