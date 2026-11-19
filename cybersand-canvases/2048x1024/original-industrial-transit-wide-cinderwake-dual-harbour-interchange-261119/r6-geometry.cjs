"use strict";
// R6 actual-cell original industrial authoring layer, called by build.cjs.
module.exports=function applyR6({R,P,L,ring,M}){

// R6 original industrial transit cells: rebuild one recognizable ship,
// three keyed cargo-handling positions, a real switch frog and service rooms.
// Original flat orthographic materials only; static freight, not animation.
// Preserve all Midge operational sites, 31x27 route, and deep lower return.
R(174,627,108,76,M.A); // erase competing tall port "cabin"
R(193,619,36,13,M.A); // erase orphaned old port pod roof
R(179,691,100,12,M.S);R(186,700,87,6,M.G);
R(186,679,28,12,M.C);R(191,668,17,12,M.U);
ring(199,683,12,12,4,M.G);
R(214,703,10,56,M.C);
L(192,708,233,770,10,M.U);L(229,766,265,796,10,M.S);
R(219,769,12,18,M.C);
// ONE extended hull sheer, with open central Midge keel inspection hatch.
L(169,702,202,721,10,M.U);L(202,721,267,721,9,M.S);
R(215,715,58,7,M.G);L(265,725,277,783,9,M.C);
L(359,782,387,727,10,M.C);L(385,728,429,698,11,M.U);
L(429,697,443,708,12,M.S);
R(355,694,79,11,M.S);R(365,686,58,9,M.G);
R(362,705,11,43,M.C);R(415,707,10,47,M.C);
// The ONE tall side-elevation wheelhouse has stepped roof, framed windows.
R(371,629,58,11,M.S);R(381,614,43,15,M.U);
R(391,607,25,8,M.C);R(395,614,17,7,M.F);
R(382,647,39,19,M.A);
R(384,638,40,11,M.U); // physically attached glazing lintel
R(387,648,14,11,M.F);R(406,648,11,11,M.F);
R(405,648,11,9,M.G);
L(420,668,437,687,10,M.U);
R(227,741,43,8,M.S);R(235,733,20,8,M.U);R(232,749,9,20,M.C);
R(280,674,6,10,M.A); // remove stray old crest pixel
R(284,628,64,141,M.A); // 64-cell inspection shaft remains real empty
R(280,795,80,23,M.S);

// Triple-keyed freight load identity, separated from grey fixed guides and
// the dark counterweight, at inbound cradle, left jaw and east outfeed.
function keyedLoad(x,y,w=38){
  R(x,y,w,19,M.V);R(x+3,y+3,w-6,3,M.U);
  for(let xx=x+9;xx<x+w-5;xx+=12)R(xx,y+7,3,10,M.G);
  R(x+4,y+19,5,5,M.K);R(x+w-9,y+19,5,5,M.K);
  R(x+w-18,y-4,8,4,M.J);
}
R(924,600,68,9,M.S);R(927,609,10,23,M.C);R(978,609,10,23,M.C);
keyedLoad(939,575,43);R(937,597,49,7,M.G);
keyedLoad(978,451,37);
R(976,475,42,8,M.S);R(982,483,9,21,M.C);R(1005,482,9,19,M.C);
R(1154,419,54,13,M.K);R(1166,430,29,15,M.S);
R(1171,434,20,10,M.C);
R(1222,545,82,8,M.S);R(1227,553,8,28,M.C);R(1292,553,9,30,M.C);
keyedLoad(1250,522,42);R(1244,541,57,7,M.G);R(1222,539,13,7,M.J);
// Rebuild congested hump as an intelligible single frog, high mainline,
// descending catch siding, switch operator and founded end-stop.
R(1517,550,142,74,M.A);
L(1507,540,1657,554,8,M.S);
L(1508,546,1553,564,6,M.U);L(1552,564,1649,613,8,M.G);
R(1536,550,15,10,M.S);R(1544,542,7,19,M.J);
R(1578,572,51,18,M.V);
for(const xx of [1586,1616])R(xx,591,10,9,M.K);
R(1643,600,12,27,M.C);R(1638,599,23,8,M.U);R(1649,588,5,11,M.J);
R(1546,598,12,38,M.C);R(1555,596,31,9,M.S);
// East receiving is a truly hollow, side-entered inspection room with a
// counter, grounded mass scale and separate outbound unloading grade.
R(1900,433,77,46,M.A);
R(1901,479,86,10,M.S);R(1959,436,10,43,M.C);
R(1935,456,25,13,M.U);R(1939,449,17,8,M.F);
R(1927,464,9,15,M.C);
R(1969,443,13,21,M.V);R(1972,437,7,7,M.J);
R(1903,451,19,6,M.G);R(1903,457,8,21,M.C);
R(1905,475,8,10,M.C); // connect accessible bay console to its real floor
// Western discharge pipe rises toward the ship basin; middle service platform
// belongs to the lift. Neither seals the y747 underground flight artery.
L(378,858,403,824,10,M.P);L(403,825,423,791,10,M.P);
R(391,849,16,26,M.C);R(412,789,15,14,M.S);
R(1112,812,51,11,M.S);R(1151,825,11,58,M.C);
R(1116,825,23,16,M.U);R(1122,818,11,8,M.J);
L(1156,851,1182,892,7,M.P);

};
