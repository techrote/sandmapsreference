'use strict';
// R6: real physically authored, structural/collision material cells, no reference art.
// Works on the EXACT previous R5 plane after finish, bearing closure and inhabitation.
// The industrial process is a visual/physical facility, not a simulated pump.
// Existing closed Water/Lava and exact old sites must not change.
module.exports=function processFlow(g,index,spec,{W,H,MAT}){
 const prior=g.slice(),ops=[];
 const steps=index===0?[
  // PYREWATER: freight assay -> stepped quench metering -> reactor dry transfer
  // -> unequal distillation columns -> supported quarantine sampling.
  ['quench isolated inspection landing',598,560,190,8,MAT.iron],
  ['quench meter western stanchion',602,529,8,31,MAT.iron],
  ['quench meter eastern stanchion',735,529,8,31,MAT.iron],
  ['quench pressure header',602,529,141,7,MAT.quartz],
  ['quench sample plinth',620,552,28,8,MAT.glass],
  ['quench gauge foot',690,553,20,7,MAT.glow],
  ['service load path from quench to reactor bearing',786,546,52,10,MAT.iron],
  ['dry refractory service return across reactor-chemical joint',1279,682,91,9,MAT.iron],
  ['service return anchored knee to distillation wall',1356,653,9,38,MAT.iron],
  ['fractionator first supported riser',1452,503,9,106,MAT.iron],
  ['fractionator upper flash column',1529,483,9,126,MAT.iron],
  ['condenser isolated third column',1643,517,10,92,MAT.iron],
  ['warm fractionator overhead feed',1452,503,86,7,MAT.quartz],
  ['cold offset condensation tray',1529,533,124,7,MAT.glass],
  ['reflux recovery tray',1532,574,121,6,MAT.quartz],
  // Dry inspection fixtures entirely downstream of the existing R5
  // double-entered quarantine scrubber, grounded to its real support frame.
  ['quarantine west sample support',1730,844,26,29,MAT.iron],
  ['quarantine west joined sample head',1744,836,51,9,MAT.glass],
  ['quarantine clean-side sample support',1934,842,26,30,MAT.iron],
  ['quarantine separate clean-side manifold',1900,845,54,7,MAT.quartz]
 ]:[
  // ASHLIGHT: cyclone differentiated coarse/fine extraction -> independently
  // serviceable hot/cold reactor overpasses -> real particulate exit filtration.
  ['cyclone coarse collector step tied to main mast',919,639,144,9,MAT.iron],
  ['cyclone coarse collector support to lower rack',1053,640,9,52,MAT.iron],
  ['cyclone fine collector upper tray',1082,608,125,8,MAT.quartz],
  ['cyclone fine collector descending grounded leg',1198,608,9,77,MAT.iron],
  ['cyclone lower fine product deck',1090,672,118,7,MAT.glass],
  ['cyclone metering mast',1020,573,9,69,MAT.iron],
  ['cyclone ancillary sample rail',970,573,59,8,MAT.glass],
  ['hot reactor dedicated metal servicing gangway',1350,580,162,8,MAT.iron],
  ['hot reactor gangway borne on welded steel',1362,568,9,13,MAT.iron],
  ['cold reactor isolated reflux gangway',1590,576,119,8,MAT.glass],
  ['cold reactor reflux bearing A',1590,568,10,9,MAT.iron],
  ['cold reactor reflux bearing B',1699,568,10,9,MAT.iron],
  ['ash exhaust first grounded cassette',1785,610,10,87,MAT.iron],
  ['ash exhaust second grounded cassette',1870,616,10,81,MAT.iron],
  ['ash exhaust outlet cassette',1910,632,10,65,MAT.iron],
  ['high lamellar filter tray',1795,611,85,8,MAT.quartz],
  ['low lamellar particle retrieval',1795,654,85,8,MAT.glass],
  ['separate outlet exhaust baffle',1910,632,96,8,MAT.glass]
 ];
 const sites=index===0?[
  ['Quench metering overlook',[680,482]],
  ['Distillation fractionator overlook',[1570,472]]
 ]:[
  ['Cyclone graded separation overlook',[1160,550]],
  ['Exhaust filter inspection perch',[1840,588]]
 ];
 let totalAdded=0;
 for(const [label,x,y,w,h,id] of steps){
  if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error('R6 geometry outside world '+label);
  let added=0;
  for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
   const p=yy*W+xx,m=g[p];
   if(m===MAT.water||m===MAT.lava)throw Error('R6 must not overwrite mobile liquid at '+label+' '+xx+','+yy);
   // Only add on physically EMPTY pixels. Never blindly cover previously
   // installed seals, reactor supports, apertures or hazard bodies.
   if(!m){g[p]=id;added++;}
  }
  totalAdded+=added;
  ops.push({label,actual_added_cells:added,source_rect:[x,y,w,h],material:id});
 }
 let removed=0,changed=0,liquidAltered=0;
 for(let p=0;p<g.length;p++){
  if((prior[p]===MAT.water)!==(g[p]===MAT.water)||(prior[p]===MAT.lava)!==(g[p]===MAT.lava))liquidAltered++;
  if(prior[p]&&!g[p])removed++;
  else if(prior[p]&&g[p]!==prior[p])changed++;
 }
 if(liquidAltered||removed||changed||totalAdded<1500)throw Error('R6 non-additive or fluid mutation');
 return {sites,receipt:{revision:'R6',purpose:index===0?
  'quench pressure control, actual reactor-to-distillation service transfer, unequal fractionator and separate scrubber inspection machinery':
  'two graded cyclone collection decks, different hot/cold reactor service and lamellar particulate recovery',
  physical_features:ops,added_cells:totalAdded,removed_cells:0,rematerialised_cells:0,mobile_fluid_changes:0,
  native_processes:'NOT simulated: actual inert material geometry only; NATIVE-UNTESTED'}};
};
