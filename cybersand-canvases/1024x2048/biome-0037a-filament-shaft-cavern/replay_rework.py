#!/usr/bin/env python3
"""R2 replay compatibility shim; historic R1 scripts remain in archived main."""
from pathlib import Path
import subprocess
import sys
here=Path(__file__).resolve().parent
cmd=["node",str(here/"build_rework_r2.js")]
if "--write" not in sys.argv:
    cmd.append("--check")
subprocess.run(cmd,cwd=here,check=True)
