/*global define*/
define( [], function () {
	'use strict';

	// ****************************************************************************************
	// Properties used for the hypercube
	// ****************************************************************************************

	var GeograficalReference = {
		ref: "props.d.dimension.geoRef",
		label: "Geografical Reference",
		type: "string",
		expression: ""
	};
	
	var Lat = {
		ref: "props.m.measure1.definition",
		label: "Latitude",
		type: "string",
		expression: ""
	};
	var Lng = {
		ref: "props.m.measure2.definition",
		label: "Longitude",
		type: "string",
		expression: ""
	};

	//-----------------------------------------------------------------------------------------
	var mea1 = {
		ref: "props.m.measure3.definition",
		label: "Measure Definition",
		type: "string",
		expression: ""
	};
	


	// Dimension Panel
	var DimensionPanel1 = {
		label: "Geografical Dimension",
		items: {
			CustomDimension: {
				type: "items",
				label: "Dimension",
				items: {
					GeograficalReference: GeograficalReference,
					Lat: Lat,
					Lng: Lng,
					mea1: mea1
				}
			}
		}
	};


	var DimensionSection = {
	    
	    label: "Settings",
	    component: "expandable-items",
	    items: {
	        DimensionPanel1: DimensionPanel1

	    }
	};
	// Return values
	return {
		type: "items",
		component: "accordion",
		items: {
			DimensionSection: DimensionSection
		}
	};

} );