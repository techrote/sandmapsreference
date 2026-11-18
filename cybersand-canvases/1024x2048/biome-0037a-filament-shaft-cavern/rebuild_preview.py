#!/usr/bin/env python3
"""Regenerate exact R2 indexed PNG material overview and native crops."""
from pathlib import Path
import subprocess
here=Path(__file__).resolve().parent
subprocess.run(["node",str(here/"render_material_cells_r2.js")],cwd=here,check=True)
