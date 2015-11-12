define([
        'jquery',
        'underscore',
        'qlik',
        './properties',
        './initialproperties',
        './lib/js/extensionUtils',
        './lib/js/globe',
        'text!./lib/css/style.css',
        './lib/external/Detector',
        './lib/external/three.min',
        './lib/external/Tween'
],
function ($, _, qlik,props, initProps, extensionUtils, globe,cssContent) {
    'use strict';

    extensionUtils.addStyleToHeader(cssContent);
    var globe = null,
    n = 0;
    //console.log('Initializing - remove me');

    return {

        definition: props,

        initialProperties: initProps,

        snapshot: { canTakeSnapshot: true },

        resize : function( /*$element, layout*/ ) {
            //do nothing
        },

        paint: function ( $element , layout ) {

            var app = qlik.currApp();

            var createHyperCube =  function () {
                console.log('ch');
                //console.log(layout.props);

                var qDimensions= [];
                
                var qDef = {
                        qFieldDefs:[],
                        qFieldLabels: [], 
                        qSortCriterias:[],
                        qNumberPresentations:[]
                    };
                qDef.qFieldDefs.push( "="+layout.props.d.dimension.geoRef);
                qDef.qFieldLabels.push('Geo Reference');
                qDef.qSortCriterias.push({qSortByAscii: 1});

                var qDimension = {
                    qDef: qDef
                };
                qDimensions.push(qDimension);

                var qMeasures= [], qDef = {};
                var dim ;
                _.each(layout.props.m, function(measure,index){
                    var mdef = measure.definition;
                    //console.log(index, measure.definition);
                    if(index.trim() == 'measure1' ){
                        mdef = "avg("+measure.definition+")";
                        dim = measure.definition;
                    }

                    else if (index.trim() == 'measure2'){
                        mdef = "avg("+measure.definition+")";
                    }
                    else if (index.trim() == 'measure3'){
                        //Sum ( Value)/max(all aggr( if(IsNull(dimension), 0, Sum (Value)),dimension))
                        mdef = 'Sum ( '+mdef+')/max(all aggr( if(IsNull('+dim+'), 0, Sum ( '+mdef+')),'+dim+'))';
                    }

                    var qMeasure = {
                            qDef:{
                                    qDef: "="+mdef, 
                                    qLabel: measure.label,
                                    qNumFormat: {
                                        qType: 'R'
                                    }

                            }

                    };
                    qMeasures.push(qMeasure);
                });

                ////console.log(qMeasures);

                var cubeDef = {
                    qInterColumnSortOrder: [0, 1],
                    qDimensions: qDimensions,
                    qMeasures: qMeasures,
                    qInitialDataFetch: 
                        [{
                                qWidth: 4,
                                qHeight: 2500
                        }]
                };
                //console.log('cube def',cubeDef);

                app.createCube( cubeDef, function ( reply ) {
                    //console.log( 'cube', reply );

                    var data = [], qMatrix = reply.qHyperCube.qDataPages[0].qMatrix ;    
                    //latitude, longitude, magnitude
                    for (var i=0;i<qMatrix.length;i++) {
                        data.push(qMatrix[i][1].qNum);
                        data.push(qMatrix[i][2].qNum);
                        data.push(qMatrix[i][3].qNum);
                    }
                    console.log(data);
                    addPoints(data);
                } ); // app cube
            };

            var createGlobe = function(){
                $element.empty();
                console.log('globe creation');
                var d = document.createElement('div');
                d.setAttribute("style", "height: 100%; width: 100%");
                if(!Detector.webgl){
                    d.setAttribute('class','error');
                    d.innerHTML = 'Accelerazione Grafica non supportata, apri l\'applicazione in un browser';
                    $element.append(d);
                    Detector.addGetWebGLMessage();
                } 
                else {
                    $element.append(d);
                    globe = new DAT.Globe(d);
                    
                }
            };

            var addPoints = function(data){
                //console.log(globe);

                console.log('points additions');
                if(n>0){
                    globe.clearData();
                }
                globe.addData(data, {format: 'magnitude'});
                globe.createPoints();

                if(n==0){
                    globe.animate();
                    n = 1;
                }
            };



            if(globe == null){
                console.log('bch');
                createGlobe();
            }
            createHyperCube();
        }
    };

});
