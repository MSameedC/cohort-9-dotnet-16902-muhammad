#!/bin/bash
# scan.sh
dotnet sonarscanner begin /k:"TaskManagementApp" /d:sonar.login="squ_be49c72533c3823e6d20b2852d50e0babf0b54dc" /d:sonar.host.url="http://localhost:9000"
dotnet build
dotnet sonarscanner end /d:sonar.login="squ_be49c72533c3823e6d20b2852d50e0babf0b54dc"