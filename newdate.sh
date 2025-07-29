#!/bin/bash
echo "// Generated, do not edit" > deploydate.js
echo -n 'var DeployDate = new Date("' >> deploydate.js
date '+%B %d, %Y");' >> deploydate.js
