# First Windows attempt: exact-byte refusal preserved

[Run 45481057262](https://github.com/techrote/sandmapsreference/actions/runs/45481057262)
executed delivery source `0d896cb6ffc48cd8ba0bdc272428dc4db07048ba`.
Runtime acquisition verified nine Windows dependency files. Engine staging then
refused `godot/.godot/.gdignore` because its checked-out bytes differed from the
exact accepted Git blob. **No native map qualification ran in this attempt.**

Specialist C independently opened and checked the original evidence artifact,
its ZIP CRC and all five member hashes. The original 2,701-byte artifact is
preserved unchanged as [original-artifact.zip](original-artifact.zip), SHA-256
`fd47afa07d5457e4fbe9203c2cd1c87188030d1287c1c50509f507a1952da8fc`.
The five raw files remain under `raw/` with their original member paths and exact
bytes, including CRLF where present. [custody.v1.json](custody.v1.json) records
all individual byte counts and hashes. This is a refusal receipt, not an
executable owner kit.

The isolated [EOL reproduction](../windows-eol-review.v1.json) showed why
`core.autocrlf=false` alone was insufficient: with `text=auto` and Windows-native
EOL selection, a committed one-LF file becomes two-byte CRLF at checkout. Setting
`core.eol=lf` before both checkouts preserves that exact source blob. The
correction leaves the byte-integrity guard enabled and does not edit the source
engine, source maps or scientific locks.

The subsequent campaign must stand on its own source identity and actual
execution receipts. This original refusal is retained, not rewritten as a pass.
