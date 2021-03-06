#!/usr/bin/python
# -*- coding: utf8 -*-

# This script permit to transform a shape file in JSON
# with the bounding box of France country


from osgeo import ogr

shapefolder = '/home/alex/Bureau/DATA/dpt_wgs84/'

 
x = ogr.Open(shapefolder+'ok.shp')
layers = x.GetLayer(0)

str = '{\n\t"bbox_dpt_france":{\n';
bbox_json_name = "bbox_dpt_wgs84.json"
 
for line in layers:
	env = line.GetGeometryRef().GetEnvelope()
	code_dep = "%s" % line.GetField(1)
	long_min = "%f" % env[0]
	lat_min = "%f" % env[2]
	long_max = "%f" % env[1]
	lat_max = "%f" % env[3]
	#str += "\t\t{\n";
	str += '\t\t"'+code_dep+'":{\n'
	str += '\t\t\t"long_min":"'+long_min+'",\n';
	str += '\t\t\t"lat_min":"'+lat_min+'",\n';
	str += '\t\t\t"long_max":"'+long_max+'",\n';
	str += '\t\t\t"lat_max":"'+lat_max+'"\n';
	str += "\t\t},\n";
	
str = str[0:-2]+'\n';
str += "\t}\n}";
newFile = open(shapefolder+bbox_json_name , 'w');
newFile.write("%s" % str);
newFile.close();


	#print "%s.json %f, %f, %f,%f" % (line.GetField(1), env[0], env[2], env[1], env[3])
	
	
	

