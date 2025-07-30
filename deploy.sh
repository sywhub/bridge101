#!/bin/bash
../refcard2/newdate.sh
files=` grep 'script src=\"[a-z]' index.html | sed -e 's/.*="//' -e 's/".*$//'`
files="index.html ${files}"
tmp=`mktemp -p . -t ftp`
echo "cd js/`basename $(PWD)`" > $tmp
echo "rm *" >> $tmp
for f in ${files}
do
echo "put $f" >> $tmp
done
echo "chmod 0644 *" >> $tmp
echo "quit" >> $tmp
sftp -p -b $tmp -N u47659892@ftp.nomadicminds.org 
rm $tmp
