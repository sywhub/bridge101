#!/bin/bash
../refcard2/newdate.sh
files=`grep 'src=' index.html  | sed -e 's/.*="//' -e 's/".*$//' -e '/refcard2/d'`
files="index.html ${files}"
tmp=`mktemp -p . -t ftp`
echo "cd js/ssc_examples" > $tmp
echo "rm *" >> $tmp
for f in ${files}
do
echo "put $f" >> $tmp
done
echo "chmod 0644 *" >> $tmp
echo "quit" >> $tmp
sftp -p -b $tmp -N u47659892@ftp.nomadicminds.org 
rm $tmp
