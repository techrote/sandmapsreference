function r2({rect,poly,ellipse,line,label,M}) {
 // The reference has a single deep blue roof with full-span triangular trussing,
 // twin traveling crane rails, hoists, cold clerestory and cantilevered pod.
 rect(202,107,1642,24,M.iron);rect(218,115,1610,9,M.steel);
 rect(216,144,1612,13,M.paint);
 for(let x=227;x<1810;x+=89) {
  rect(x,155,8,85,M.iron);
  line(x+7,157,x+89,229,8,M.paint);
  line(x+89,157,x+7,229,6,M.steel);
  rect(x+13,138,36,6,M.corr);
 }
 rect(216,232,1631,19,M.iron);rect(224,237,1618,7,M.steel);
 rect(270,259,1485,10,M.paint);rect(275,266,1471,5,M.brass);
 for(let x=287;x<1730;x+=144){rect(x,270,24,8,M.amber);rect(x+10,277,5,19,M.corr);}
 // Crane carriages, cable blocks. Keep original Midge stations at y 370-386 clear.
 function hook(x,y,depth) {
  rect(x-46,y,95,17,M.iron);rect(x-37,y+4,74,7,M.hazard);
  ellipse(x-22,y+18,9,9,M.steel);ellipse(x+22,y+18,9,9,M.steel);
  rect(x-3,y+27,6,depth,M.corr);
  rect(x-18,y+depth+23,36,16,M.brass);
  rect(x-11,y+depth+27,22,5,M.iron);
  line(x,y+depth+40,x-15,y+depth+54,5,M.brass);
  line(x-15,y+depth+54,x+8,y+depth+55,5,M.brass);
 }
 hook(1202,287,32);hook(873,284,21);
 rect(663,280,722,12,M.paint);rect(673,285,704,5,M.steel);
 for(let x=691;x<1370;x+=70)rect(x,285,18,5,M.brass);
 // Rock asymmetry: terraced west excavation, rust/ochre beds, jagged east bank.
 poly([[0,151],[149,151],[145,295],[116,423],[157,536],[128,688],
       [165,780],[132,946],[160,1031],[130,1207],[170,1351],
       [134,1532],[153,1740],[0,1750]],M.basalt);
 poly([[0,274],[114,274],[148,414],[118,544],[153,698],[108,878],
       [145,1053],[115,1228],[142,1501],[110,1682],[0,1682]],M.rust);
 poly([[0,327],[98,327],[128,420],[88,567],[121,710],[78,922],
       [118,1099],[90,1295],[117,1487],[86,1660],[0,1660]],M.basalt);
 for(let y=375;y<1690;y+=141) {
  line(0,y,96,y-28,6,M.granite);
  line(12,y+20,114,y+7,5,M.rust);
 }
 poly([[2048,538],[1945,538],[1928,670],[1947,817],[1898,954],
       [1938,1150],[1902,1300],[1938,1438],[1896,1669],
       [1948,1748],[2048,1748]],M.basalt);
 for(let y=600;y<1690;y+=193){
  line(1982,y,2048,y+37,6,M.rust);
  line(1958,y+43,2048,y+76,7,M.granite);
 }
 // Projecting BLUE GLASS control deck in the rightmost upper bank.
 // It opens directly into the existing East Flight Control gallery.
 rect(1820,312,228,220,M.air);
 rect(1902,308,146,244,M.air);
 rect(1815,305,233,21,M.iron);rect(1820,309,222,7,M.paint);
 rect(1834,329,213,10,M.steel);
 rect(1883,342,165,47,M.dark);
 rect(1895,347,142,4,M.cyan);
 for(let x=1899;x<2040;x+=34)rect(x,342,6,48,M.paint);
 rect(1882,390,165,9,M.iron);
 rect(1944,400,103,15,M.dark);
 for(let x=1953;x<2040;x+=30)rect(x,399,5,17,M.steel);
 rect(1816,500,232,23,M.iron);rect(1823,503,220,6,M.hazard);
 // Portal is a real 76x83 opening, not fake window access.
 rect(1809,405,78,86,M.air);
 rect(1841,403,10,9,M.amber);
 rect(1975,465,65,30,M.iron);rect(1983,450,52,13,M.dark);
 rect(1993,454,31,5,M.cyan);rect(1950,488,70,7,M.corr);
 line(1943,525,2021,607,13,M.iron);
 line(2031,527,1991,607,12,M.paint);
 rect(1982,605,63,11,M.steel);
 label("FLIGHT",1888,349,2,M.white);
 // Differentiate the five western assembly programmes by heavyweight machine
 // silhouettes rather than recurring display cupboards.
 rect(232,618,291,11,M.paint);
 for(let x=242;x<515;x+=44){rect(x,631,8,37,M.corr);rect(x+13,636,22,5,M.brass);}
 rect(256,718,176,15,M.iron);rect(264,693,8,27,M.hazard);
 rect(409,689,9,31,M.steel);rect(282,734,112,7,M.amber);
 rect(254,918,12,123,M.iron);rect(268,919,155,11,M.paint);
 rect(414,925,10,91,M.iron);ellipse(339,974,58,38,M.steel);
 ellipse(339,974,47,28,M.dark);rect(295,972,88,7,M.brass);
 for(let y=935;y<1025;y+=19){rect(252,y,17,6,M.amber);rect(411,y,13,6,M.cyan);}
 rect(245,1193,217,17,M.iron);ellipse(258,1204,22,21,M.corr);
 ellipse(458,1204,24,21,M.corr);rect(279,1197,169,7,M.steel);
 rect(300,1216,9,17,M.brass);rect(414,1216,10,17,M.brass);
 // The eastern control/metrology stack has separate electronic board,
 // overhead optical rig and modular inspection terminals.
 rect(1517,602,15,161,M.paint);
 for(let j=0;j<5;j++){rect(1545+j*49,609,35,57,M.dark);
  rect(1550+j*49,617,23,6,M.cyan);rect(1556+j*49,650,14,4,M.phos);}
 rect(1716,690,103,11,M.paint);rect(1731,700,9,67,M.amber);
 for(let j=0;j<4;j++){const x=1552+j*65;
  rect(x,956,47,12,M.iron);rect(x+5,944,38,9,M.dark);rect(x+9,948,20,4,M.cyan);}
 for(const y of [616,896,1176,1456]){
  rect(1884,y,32,9,M.paint);rect(1895,y-43,10,43,M.corr);
 }
 // Continuous logistics gallery: ceiling rails split around BOTH lift shafts.
 for(const [x,w] of [[225,287],[693,657],[1518,279]]) {
  rect(x,1777,w,7,M.paint);rect(x,1784,w,4,M.brass);
  for(let j=x+20;j<x+w;j+=80)rect(j,1788,8,20,M.corr);
 }
 // Cold freight carriage on bottom of cavity; headroom remains above.
 rect(856,1884,221,23,M.iron);rect(870,1890,192,7,M.paint);
 for(let x=888;x<1060;x+=36)rect(x,1896,18,4,M.cyan);
 rect(846,1918,270,10,M.steel);
 for(const x of [878,1022,1105]){ellipse(x,1924,12,12,M.iron);ellipse(x,1924,5,5,M.brass);}
 label("FREIGHT",883,1864,2,M.phos);

 // R2A: genuine source preview demands glass cabin ending inside canvas.
 rect(1815,303,233,322,M.air);
 rect(1799,395,74,103,M.air);rect(1804,502,150,17,M.iron);rect(1812,505,134,6,M.paint);
 poly([[1815,315],[1845,302],[1957,302],[1981,314],[1986,336],[1816,336]],M.iron);
 rect(1825,317,150,7,M.paint);rect(1836,339,144,10,M.steel);
 rect(1856,350,123,56,M.dark);
 for(let x=1865;x<1973;x+=28){rect(x,349,6,56,M.paint);rect(x+9,361,14,3,M.cyan);}
 rect(1853,407,126,8,M.corr);
 rect(1847,499,140,19,M.iron);rect(1855,502,122,5,M.amber);
 poly([[1978,315],[1996,334],[1996,489],[1978,519],[1969,508],[1981,483],[1981,347],[1969,325]],M.iron);
 rect(1984,361,6,115,M.cyan);rect(1985,483,6,16,M.paint);
 rect(1883,471,39,16,M.iron);rect(1888,466,30,5,M.cyan);
 rect(1934,473,31,18,M.steel);rect(1939,470,23,5,M.phos);
 line(1844,518,1817,568,11,M.iron);line(1937,518,1903,584,12,M.iron);
 line(1817,568,1903,584,7,M.corr);rect(1900,580,64,10,M.steel);
 rect(1998,290,50,245,M.air);
 // Source-specific uneven mast silhouettes rather than mirror copies.
 rect(319,40,12,72,M.iron);rect(315,29,20,11,M.corr);
 line(325,32,292,68,4,M.brass);line(326,34,350,58,3,M.paint);
 rect(321,25,8,6,M.amber);rect(300,97,52,10,M.iron);
 rect(1726,15,7,92,M.steel);rect(1719,20,21,12,M.iron);
 line(1729,31,1766,53,4,M.paint);rect(1726,9,10,8,M.cyan);
 rect(1713,92,31,14,M.iron);
 for(const [x,y] of [[414,100],[1663,105],[1758,105]]){rect(x,y,3,17,M.iron);rect(x-3,y-4,9,5,M.amber);}
 // Unequal excavated rock strata and genuinely differentiated industrial bays.
 poly([[119,670],[161,686],[183,737],[171,770],[145,720]],M.rust);
 poly([[117,1180],[178,1168],[189,1203],[172,1261],[134,1234]],M.basalt);
 rect(142,909,27,92,M.iron);rect(148,913,12,78,M.brass);
 rect(160,931,24,7,M.corr);rect(161,965,22,7,M.corr);
 rect(151,1505,25,81,M.corr);
 for(let j=0;j<4;j++)rect(157,1514+j*18,13,5,j%2?M.paint:M.amber);
 rect(225,1158,87,8,M.corr);rect(225,1171,8,69,M.steel);
 line(230,1163,308,1219,6,M.iron);rect(315,1216,31,8,M.amber);
 rect(228,1462,18,125,M.iron);rect(247,1475,40,9,M.steel);
 for(let j=0;j<4;j++)rect(253,1494+j*19,32,5,j===2?M.cyan:M.corr);
 rect(1812,898,28,68,M.iron);rect(1816,910,19,5,M.cyan);
 line(1816,963,1782,992,5,M.corr);
 rect(1808,1185,25,64,M.steel);rect(1814,1196,14,8,M.amber);
 rect(1814,1230,14,7,M.cyan);
 rect(1542,1490,75,8,M.paint);rect(1549,1499,9,41,M.corr);

}
module.exports=r2;
