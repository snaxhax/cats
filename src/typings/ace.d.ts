//
// Copyright (c) JBaron.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//


// Right now only defined what CATS is actually using

module Ace {

	interface EditorCommand {
		name:string;
        bindKey:any;
        exec:Function;
	}

	interface CommandManager {
		byName;
		commands;
		addCommands(commands:EditorCommand[]);
		addCommand(command:EditorCommand);
		platform: string; // win or mac
	}

	interface Annotation {
		 row: number;
         column: number;
         text: string;
         type: string;
	}

	interface Document {
		getAllLines(): string[];
		getLines(firstRow:number, lastRow:number) : string[];
	}

	interface Range {
		new(startRow,startColumn,endRow,endColumn);
		startRow:number;
		startColumn:number;
		endRow:number;
		endColumn:number;
	}

	interface UndoManager {
		new();
		undo(dontSelect?: bool);
		redo(dontSelect?:bool): Range;
		reset():void;
		hasUndo(): bool;
		hasRedo(): bool;
	}

	interface TokenInfo {
		value: string;
	}

	interface EditSession {
		new(content:string, mode:string);
		getUndoManager():UndoManager;
		getValue():string;
        getOverwrite():bool;
        setValue(value:string);
		getDocument():Document;
		setMode(mode:string);
        getSelection():any;
        setNewLineMode(mode:string); // unix, windows or auto
        getNewLineMode():string;
        getMode():any;
		setUndoManager(manager:UndoManager);
		on: (event:string, handler:Function) => void;
		screenToDocumentPosition(x:number,y:number);
		getLine(row:number):string;
		removeListener(event:string, listener:Function);
		removeAllListeners(event:string);
		getTokenAt(row:number, column:number): TokenInfo;	
		setAnnotations(annotations:Annotation[]);
		replace(range:Range,newText:string);
	}

	interface Position {
		row: number;
		column: number;
	}

	interface Editor {
		find(value:string,options,something);
		focus();
        setReadOnly(readOnly:bool);
        getReadOnly():bool;
		replace(value:string,options);
		session:EditSession;
		renderer;
        resize(force:bool);
		keyBinding;
		clearSelection();
        centerSelection();
        onTextInput:Function;
        getSelectionRange(): Range;
		remove(direction:string);
		insert(text:string);
		container: HTMLElement;
		commands:CommandManager;
		setSession(session:EditSession);
		getCursorPosition(): Position;
		execCommand(command:string);
		getSession():EditSession;
		setTheme(theme:string);
		getTheme():string;
		moveCursorTo(row:number, column:number, animate?:bool);
        moveCursorToPosition(position:Position);
		setFontSize(cssSize: string);
	}


interface IAce {

    /**
     * Provides access to require in packed noconflict mode
     * @param moduleName
    **/
    require(moduleName: string): any;

    /**
     * Embeds the Ace editor into the DOM, at the element provided by `el`.
     * @param el Either the id of an element, or the element itself
    **/
    edit(el: string):Editor;

    /**
     * Embeds the Ace editor into the DOM, at the element provided by `el`.
     * @param el Either the id of an element, or the element itself
    **/
    edit(el: HTMLElement):Editor;

    /**
     * Creates a new [[EditSession]], and returns the associated [[Document]].
     * @param text {:textParam}
     * @param mode {:modeParam}
    **/
    createEditSession(text: Document, mode: string);

    /**
     * Creates a new [[EditSession]], and returns the associated [[Document]].
     * @param text {:textParam}
     * @param mode {:modeParam}
    **/
    createEditSession(text: string, mode: string);
}

}

declare var ace:Ace.IAce;
