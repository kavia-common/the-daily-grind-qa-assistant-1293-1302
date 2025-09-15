#!/bin/bash
cd /home/kavia/workspace/code-generation/the-daily-grind-qa-assistant-1293-1302/the_daily_grind_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

