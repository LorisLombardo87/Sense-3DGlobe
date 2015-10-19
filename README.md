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

# Installation

copy the globe folder to the extension folder of your server or local installation of sense

# Prerequisites

any modern browser could load this extension. The extension doesn't work on sense desktop, if you have a desktop installation you have to open the editor on web browser on this link http://localhost:4848/hub/my/work (sense 2.1.1)
