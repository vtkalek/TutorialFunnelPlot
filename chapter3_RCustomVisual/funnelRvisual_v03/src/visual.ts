/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
module powerbi.extensibility.visual {
    "use strict";

//BEGIN
 interface VisualSettingsSplineParams {      
        lineColor: string;
        conf1: string;
        conf2: string;
    }

    interface VisualSettingsScatterParams {
        pointColor: string;
        weight: number;
        percentile: number;
        sparsify: boolean;
    }

    interface VisualSettingsAxesParams {
        colLabel: string;
        textSize: number;
        scaleXformat: string;
        scaleYformat: string;
        sizeTicks: string;
        axisXisPercentage: boolean;
    }
    //END






    export class Visual implements IVisual {
        private imageDiv: HTMLDivElement;
        private imageElement: HTMLImageElement;
        private settings: VisualSettings;


       //user edit START: declare private variables
        private settings_funnel: VisualSettingsSplineParams;
        private settings_scatter: VisualSettingsScatterParams;
        private settings_axes: VisualSettingsAxesParams;
        //user edit END: declare private variables





        public constructor(options: VisualConstructorOptions) {
            this.imageDiv = document.createElement("div");
            this.imageDiv.className = "rcv_autoScaleImageContainer";
            this.imageElement = document.createElement("img");
            this.imageElement.className = "rcv_autoScaleImage";
            this.imageDiv.appendChild(this.imageElement);
            options.element.appendChild(this.imageDiv);

//BEGIN
            this.settings_funnel = <VisualSettingsSplineParams>{
               
                lineColor: "blue",
                conf1: "0.95",
                conf2: "0.999"
            };
            
            this.settings_scatter = <VisualSettingsScatterParams>{
                pointColor: "orange",
                weight: 10,
                percentile: 40,
                sparsify: true
            };
           
            this.settings_axes = <VisualSettingsAxesParams>{
                colLabel: "gray",
                textSize: 12,
                scaleXformat: "comma",
                scaleYformat: "none",
                sizeTicks: "8",
                axisXisPercentage: true
            };
//END
        }

        public update(options: VisualUpdateOptions): void {
            if (!options ||
                !options.type ||
                !options.viewport ||
                !options.dataViews ||
                options.dataViews.length === 0 ||
                !options.dataViews[0]) {
                return;
            }
            const dataView: DataView = options.dataViews[0];

            this.settings = Visual.parseSettings(dataView);

            let imageUrl: string = null;
//BEGIN
            this.updateObjects(dataView.metadata.objects);
//END

            if (dataView.scriptResult && dataView.scriptResult.payloadBase64) {
                imageUrl = "data:image/png;base64," + dataView.scriptResult.payloadBase64;
            }

            if (imageUrl) {
                this.imageElement.src = imageUrl;
            } else {
                this.imageElement.src = null;
            }

            this.onResizing(options.viewport);
        }

        public onResizing(finalViewport: IViewport): void {
            this.imageDiv.style.height = finalViewport.height + "px";
            this.imageDiv.style.width = finalViewport.width + "px";
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

//BEGIN
        /**
         * This function gets called by the update function above. You should read the new values of the properties into 
         * your settings object so you can use the new value in the enumerateObjectInstances function below.
         * 
         * Below is a code snippet demonstrating how to expose a single property called "lineColor" from the object called "settings"
         * This object and property should be first defined in the capabilities.json file in the objects section.
         * In this code we get the property value from the objects (and have a default value in case the property is undefined)
         */
        public updateObjects(objects: DataViewObjects) {
            
            this.settings_funnel = <VisualSettingsSplineParams>{
                lineColor: getValue<string>(objects, 'settings_funnel_params', 'lineColor', 'blue'),
                  conf1: getValue<string>(objects, 'settings_funnel_params', 'conf1', "0.95"),
                conf2: getValue<string>(objects, 'settings_funnel_params', 'conf2', "0.999")
            };

            this.settings_scatter = <VisualSettingsScatterParams>{
                pointColor: getValue<string>(objects, 'settings_scatter_params', 'pointColor', 'orange'),
                weight: getValue<number>(objects, 'settings_scatter_params', 'weight', 10),
                percentile: getValue<number>(objects, 'settings_scatter_params', 'percentile', 40),
                sparsify: getValue<boolean>(objects, 'settings_scatter_params', 'sparsify', true)
            };

           
            this.settings_axes = <VisualSettingsAxesParams>{

                colLabel: getValue<string>(objects, 'settings_axes_params', 'colLabel', "gray"),
                textSize: getValue<number>(objects, 'settings_axes_params', 'textSize', 12),
                scaleXformat: getValue<string>(objects, 'settings_axes_params', 'scaleXformat', "comma"),
                scaleYformat: getValue<string>(objects, 'settings_axes_params', 'scaleYformat', "none"),
                sizeTicks: getValue<string>(objects, 'settings_axes_params', 'sizeTicks', "8"),
                axisXisPercentage: getValue<boolean>(objects, 'settings_axes_params', 'axisXisPercentage', true)
            };

        }
//END

        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions):
            VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
//begin
            let objectName = options.objectName;
            let objectEnumeration = [];

                switch (objectName) {
                case 'settings_funnel_params':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            lineColor: this.settings_funnel.lineColor,
                           conf1: this.settings_funnel.conf1,
                            conf2: this.settings_funnel.conf2
                        },
                        selector: null
                    });

                    break;
                
                case 'settings_scatter_params':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            pointColor: this.settings_scatter.pointColor,
                            weight: inMinMax(this.settings_scatter.weight, 1, 50),
                            percentile: this.settings_scatter.percentile,
                            sparsify: this.settings_scatter.sparsify,
                        },
                        selector: null
                    });
                    break;
                case 'settings_axes_params':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            colLabel: this.settings_axes.colLabel,
                            textSize: this.settings_axes.textSize,
                            sizeTicks: this.settings_axes.sizeTicks,
                            scaleXformat: this.settings_axes.scaleXformat,
                            axisXisPercentage: this.settings_axes.axisXisPercentage,
                            scaleYformat: this.settings_axes.scaleYformat          
                        },
                        selector: null
                    });
                    break;
            };
             return objectEnumeration;

//end

           // return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }
    }
}