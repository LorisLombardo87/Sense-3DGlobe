# Sense-3DGlobe
this extension draw a 3d globe using web gl, and adds line proportional to the measure you want to show.

The extension need four parameters fo working:

Geografical reference, it is used for drawing the lines, could be zip code, city name, store name ecc...
it is not necessary to use the smallest granularity.

Latitude, the field which contains latitude in your model.

Longitude, the field which contains longitude in your model.

Measure definition, measure must be between 0 and 1. an expression like this one:
 sum(value)/max(total aggr(sum(value),geo_reference))
so the georeference with the highest value gets 1 the others a value relative to the highest.
