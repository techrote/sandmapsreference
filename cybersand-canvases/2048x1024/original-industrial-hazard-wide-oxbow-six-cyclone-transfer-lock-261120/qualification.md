# Independent indexed PNG decoder qualification
**Producer:** separate in-memory decoder, not the committed build.cjs PNG writer. The exact committed source grid was rebuilt and compared to every indexed pixel after decompressing its independently decoded PNG stream.

| PNG | Bytes | Exact pixels | CRC / Adler / parity |
|---|---:|---:|---|
| overview.png | 30479 | 2097152 | PASS |
| 01-freight-airlock.png | 6758 | 256750 | PASS |
| 02-cyclone-separators.png | 7166 | 276750 | PASS |
| 03-breached-annular-kiln.png | 10214 | 301240 | PASS |
| 04-quenched-canyon.png | 6822 | 275880 | PASS |
| 05-triple-chimney.png | 6937 | 304000 | PASS |
| 06-deep-utility-return.png | 3062 | 144900 | PASS |
**Total 3656672 source-identical decoded pixels, zero mismatches.**

Every image retains original material IDs in PLTE indices at exact 1:1 crop coordinates, no screenshot, no AI illustration. Static creator qualification only, not an independent reviewer or native runtime test. 