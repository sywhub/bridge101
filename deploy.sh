#!/bin/bash
files=` grep 'script src=\"' index.html | sed -e 's/.*="//' -e 's/".*$//'`
tmpindex=`mktemp -p . -t html`
sed -e 's/src=\"\.\.\/refcard2\//src="/' index.html > $tmpindex
tmpftp=`mktemp -p . -t ftp`
echo "cd js/`basename $(PWD)`" > $tmpftp
echo "rm *" >> $tmpftp
echo "put $tmpindex index.html" >> $tmpftp
for f in ${files}
do
echo "put $f ." >> $tmpftp
done
echo "chmod 0644 *" >> $tmpftp
echo "quit" >> $tmpftp
sftp -p -b $tmpftp -N u47659892@ftp.nomadicminds.org 
rm $tmpindex
rm $tmpftp
git push --all origin
