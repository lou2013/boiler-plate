FROM  m.docker-registry.ir/osrm/osrm-backend
ADD  http://download.geofabrik.de/asia/iran-latest.osm.pbf .
RUN osrm-extract -p /opt/car.lua iran-latest.osm.pbf
RUN osrm-partition iran-latest.osrm
RUN osrm-customize iran-latest.osrm
CMD osrm-routed --algorithm mld iran-latest.osrm

