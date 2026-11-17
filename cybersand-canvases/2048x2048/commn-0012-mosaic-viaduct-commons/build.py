#!/usr/bin/env python3
"""R2 compatibility entry: old R1 Python generator remains archived on main."""
import subprocess
from pathlib import Path
subprocess.run(["node", str(Path(__file__).with_name("build-r2.cjs"))], check=True)
