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

    console.log('Initializing - remove me');

    return {

        definition: props,

        initialProperties: initProps,

        snapshot: { canTakeSnapshot: true },

        resize : function( /*$element, layout*/ ) {
            //do nothing
        },

        paint: function ( $element , layout ) {

            $element.empty();
            var app = qlik.currApp();

            var createHyperCube =  function () {
                console.log(layout.props);

                var qDimensions= [];
                
                var qDef = {
                        qFieldDefs:[],
                        qFieldLabels: [], 
                        qSortCriterias:[],
                        qNumberPresentations:[],
                        //qReverseSort: false
                        //qActiveFields
                        //qGrouping
                    };
                qDef.qFieldDefs.push( "="+layout.props.d.dimension.geoRef);
                qDef.qFieldLabels.push('Geo Reference');
                qDef.qSortCriterias.push({qSortByAscii: 1});

                var qDimension = {
                    qDef: qDef
                    //qLibraryId
                    //qNullSuppression: true,
                    //qShowAll: true,
                    //qTotalLabel: "Total"
                    //qOtherTotalSpec = 
                    //qOtherLabel
                };
                qDimensions.push(qDimension);

                var qMeasures= [], qDef = {};
                _.each(layout.props.m, function(measure,index){
                    var mdef = measure.definition;
                    console.log(index, measure.definition);
                    if(index.trim() == 'measure1' || index.trim() == 'measure2'){
                        mdef = "avg("+measure.definition+")";
                    }

                    var qMeasure = {
                            qDef:{
                                    qDef: "="+mdef, 
                                    qLabel: measure.label,
                                    qNumFormat: {
                                        qType: 'R'
                                        // qnDec
                                        // qUseThou
                                        // qFmt
                                        // qDec
                                        // qThou
                                    }
                                    // qDescription,
                                    // qTags,
                                    // qGrouping,
                                    // qRelative,
                                    // qBrutalSum,
                                    // qAggrFunc,
                                    // qAccumulate,
                                    // qReverseSort,
                                    // qActiveExpression,
                                    // qExpressions,

                            }
                            // qLibraryId,
                            // qSortBy,
                            // qAttributeExpressions

                    };
                    qMeasures.push(qMeasure);
                });

                //console.log(qMeasures);

                var cubeDef = {
                    qInterColumnSortOrder: [0, 1],
                    qDimensions: qDimensions,
                    qMeasures: qMeasures,
                    qInitialDataFetch: 
                        [{
                                qWidth: 4,
                                qHeight: 2500
                        }],
                    // qStateName
                    // qSuppressZero
                    // qSuppressMissing
                    // qMode
                    // qNoOfLeftDims
                    // qAlwaysFullyExpanded
                };
                console.log('cube def',cubeDef);

                app.createCube( cubeDef, function ( reply ) {
                    console.log( 'cube', reply );

                    var data = [], qMatrix = reply.qHyperCube.qDataPages[0].qMatrix ;    
                    //latitude, longitude, magnitude
                    for (var i=0;i<qMatrix.length;i++) {
                        data.push(qMatrix[i][1].qNum);
                        data.push(qMatrix[i][2].qNum);
                        data.push(qMatrix[i][3].qNum);
                    }
                    console.log('matrix',qMatrix);
                    //console.log('data',data);
                    $element.empty();
                    console.log('h',$element.height());
                    var d = document.createElement('div');
                    d.setAttribute("style", "height: 100%; width: 100%");
                    if(!Detector.webgl){
                        d.setAttribute('class','error');
                        d.innerHTML = 'Accelerazione Grafica non supportata, apri l\'applicazione in un browser';
                        $element.append(d);
                        Detector.addGetWebGLMessage();
                    } 
                    else {
                        //d.setAttribute('class','globe');
                        //$element.innerHTML = 'Accelerazione Grafica supportata, hai un browser moderno';
                        $element.append(d);

                        var globe = new DAT.Globe(d);
                        console.log(globe);
                        globe.addData(data, {format: 'magnitude'});
                        globe.createPoints();
                        globe.animate();
                    }
                } ); // app cube
            }
            createHyperCube();
        }
    };

});
