#!/usr/bin/python
# -*- coding: latin1 -*-
# Script to transform CSV file to JSON file

import os
import sys
import string

jsonDir = "/../json/";

# Translating table to remove the accent
aa ='������������ '
bb ='aaeeeeiiouuu_'
trantab = string.maketrans(aa,bb)


# Function to transpose the CSV field to JSON field with the good representation of this format.
def compute(name, folder):
	file = open(folder + "/" + name, 'r');
	lines = file.readlines();
	str = '{\n\t"data":[\n';
	for line in lines[4:]:
		array = line.split(';');
		id = array[0].replace ('\"', '\\"')
		src = array[1].replace ('\"', '\\"')
		archivage = array[2].replace ('\"', '\\"')
		insee = array[3].replace ('\"', '\\"')
		commune_origine = array[4].replace ('\"', '\\"')
		commune_actuelle = array[5].replace ('\"', '\\"')
		departement = array[6].replace ('\"', '\\"')
		x_wgs84 = array[7].replace ('\"', '\\"')
		y_wgs84 = array[8].replace ('\"', '\\"')
		x = array[9].replace ('\"', '\\"')
		y = array[10].replace ('\"', '\\"')
		z = array[11].replace ('\"', '\\"')
		precision = array[12].replace ('\"', '\\"')
		positionnement = array[13].replace ('\"', '\\"')
		reperage = array[14].replace ('\"', '\\"')
		type_cavite = array[15].replace ('\"', '\\"')
		nom_cavite = array[16].replace ('\"', '\\"')
		date = array[17].replace ('\"', '\\"')
		auteur = array[18].replace ('\"', '\\"')
		organisme = array[19].replace ('\"', '\\"')
		statut = array[20].replace ('\"', '\\"')
		dangerosite = array[21].replace ('\"', '\\"')
		cavites_associees = array[22].replace ('\"', '\\"')
		commentaire = array[23].replace ('\"', '\\"')
		str += "\t\t{\n";
		str += '\t\t\t"id":"'+id+'",\n';
		str += '\t\t\t"src":"'+src+'",\n';
		str += '\t\t\t"archivage":"'+archivage+'",\n';
		str += '\t\t\t"insee":"'+insee+'",\n';
		str += '\t\t\t"commune_origine":"'+commune_origine+'",\n';
		str += '\t\t\t"commune_actuelle":"'+commune_actuelle+'",\n';
		str += '\t\t\t"departement":"'+departement+'",\n';
		str += '\t\t\t"x_wgs84":"'+x_wgs84+'",\n';
		str += '\t\t\t"y_wgs84":"'+y_wgs84+'",\n';
		#str += '\t\t\t"x":"'+x+'",\n';
		#str += '\t\t\t"y":"'+y+'",\n';
		#str += '\t\t\t"z":"'+z+'",\n';
		str += '\t\t\t"precision":"'+precision+'",\n';
		str += '\t\t\t"positionnement":"'+positionnement+'",\n';
		str += '\t\t\t"reperage":"'+reperage+'",\n';
		
		#Manage the encodage of the lines
		type_cav_avec_accent = '\t\t\t"type_cavite":"'+type_cavite.decode('utf-8').encode('latin1')+'",\n'
		type_cav_sans_accent = type_cav_avec_accent.translate(trantab).decode('latin1').encode('utf-8');
		str += type_cav_sans_accent
		
		str += '\t\t\t"nom_cavite":"'+nom_cavite+'",\n';
		str += '\t\t\t"date":"'+date+'",\n';
		str += '\t\t\t"auteur":"'+auteur+'",\n';
		str += '\t\t\t"organisme":"'+organisme+'",\n';
		str += '\t\t\t"statut":"'+statut+'",\n';
		str += '\t\t\t"dangerosite":"'+dangerosite+'",\n';
		str += '\t\t\t"cavites_associees":"'+cavites_associees+'",\n';
		if id== "BREAW0001606":
			print commentaire
		str += '\t\t\t"commentaire":"'+commentaire+'"\n';

		str += "\t\t},\n";
	str = str[0:-2]+'\n';
	str += "\t]\n}";
	#Creation of the new file
	newFile = open(folder+jsonDir+name[0:-4]+'.json', 'w');
	newFile.write("%s" % str);
	newFile.close();
		
#Function main to manage the program and the parameters
if __name__ == "__main__":
	if len(sys.argv) != 2:
		print "Usage : python csvtojson directory"
		sys.exit(1)

	folder = sys.argv[1]
	filenames = os.listdir(folder) 
	csvlist = []

	for filename in filenames:
		if ".csv" in filename:
			csvlist.append(filename)

	if not os.path.exists(folder+jsonDir):    
		os.mkdir(folder+jsonDir)

	for name in csvlist:
		compute(name, folder)
 	
