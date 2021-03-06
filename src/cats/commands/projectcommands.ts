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


// This module contains all the global commands pertaining to project related functionality

module Cats.Commands {


    function closeAllProjects() {
        var sure = confirm("Do you really want to quit?");
        if (sure) GUI.App.closeAllWindows();
    }

    /**
     * Close the project
     */ 
    function closeProject() {        
        window.close();
    }

    /**
     * Run the project
     */ 
    function runProject() {
        var main = IDE.project.config.main;
        if (!main) {
            alert("Please specify the main html file to run in the project settings.");
            return;
        }
        var startPage = IDE.project.getStartURL();
        console.log("Opening file: " + startPage);
        var win2 = GUI.Window.open(startPage, {
            toolbar: true,
            webkit: {
                "page-cache": false
            }
        });
        // win2.reloadIgnoringCache()
    };

   

    /**
     * Build the project
     */ 
    function buildProject() {
        // this.defaultOutput = window.prompt("Output file",this.defaultOutput);
        var project = IDE.project;
        IDE.compilationResult.innerHTML = "";

        project.iSense.compile((err, data:Cats.CompileResults) => {                        

            View.showCompilationResults(data);
            if (data.errors && (data.errors.length > 0)) return;
            
            var sources = data.source
            for (var name in sources) {
                var src = sources[name];
                console.log(name);
                
                // We might get a relative path back. Lets make sure it 
                // is absolute before we save it
                if (name.indexOf(project.projectDir) !== 0 ) {
                    name = PATH.join(project.projectDir, name);
                }
                
                OS.File.writeTextFile(name, src);
            }
        });
    }


    /**
     * Configure the properties of a project
     */ 
    function propertiesProject() {
        var project = IDE.project;
        var name = ConfigLoader.getFileName(project.projectDir);
        if (IDE.getSession(name)) {
            IDE.openSession(name);
        } else {
            var content = JSON.stringify(project.config, null, 4);
            var session = new AceSession(name,content);
            IDE.addSession(session);
            IDE.openSession(name);
        }
    }
    
    /**
     * Refresh the project so everything is in sync again.
     */ 
    function refreshProject() {
        IDE.project.refresh();
    }

    /**
     * Open a (new) project in a separate window
     */ 
    function openProject() {
        var chooser: any = document.getElementById('fileDialog');
        chooser.onchange = function(evt) {
            console.log(this.value);
            var param = encodeURIComponent(this.value)
            this.value = ""; // Make sure the change event goes off next tome
            window.open('index.html?project=' + param, '_blank');
        };
        chooser.click();
    };


    export class ProjectCommands {
        static init(registry) {
            registry({ name: CMDS.project_open, label: "Open Project...", command: openProject });
            registry({ name: CMDS.project_close, label: "Close project", command: closeProject });
            registry({ name: CMDS.project_build, label: "Build Project", command: buildProject });
            registry({ name: CMDS.project_refresh, label: "Refresh Project", command: refreshProject });
            registry({ name: CMDS.project_run, label: "Run Project", command: runProject });
            registry({ name: CMDS.project_debug, label: "Debug Project", command: null });
            registry({ name: CMDS.project_properties, label: "Properties", command: propertiesProject });

        }

    }

}