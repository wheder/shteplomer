#!/bin/sh
cd shteplomer
zip -r ../../build/shteplomer.zip . -x "*.svn*" -x "*~" && mv ../../build/shteplomer.zip ../../build/shteplomer.plasmoid
cd ..
