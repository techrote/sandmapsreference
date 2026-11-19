'use strict';
// R5: enterable, dry, human/Midge-scale industrial chambers, real material cells.
// Applied AFTER R4 bearing repair; never edits Water #3 or Lava #8.
// All added machinery is rooted into existing floors; unsupported decor prohibited.
module.exports=function inhabit(g,index,spec,{W,H,MAT}){
  const before=g.slice(),cuts=[],inlays=[],fixtures=[];
  const at=(x,y)=>y*W+x;
  function carve(x,y,w,h,label){
    let removed=0;
    if(x<19||y<19||x+w>W-19||y+h>H-19)throw Error('carve beyond safe site bounds '+label);
    for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
      const p=at(xx,yy),m=g[p];
      if(m===3||m===8)throw Error('R5 hatch contacts mobile fluid '+label+' at '+xx+','+yy);
      if(m){g[p]=0;removed++;}
    }
    cuts.push({label,box:[x,y,w,h],removed});
  }
  function finishExisting(x,y,w,h,id,label){
    let changed=0;
    for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
      const p=at(xx,yy),m=g[p];
      if(m&&m!==3&&m!==8&&m!==id){g[p]=id;changed++;}
    }
    inlays.push({label,box:[x,y,w,h],changed});
  }
  function floorMachine(x,y,w,h,label){
    // Very low machine consoles on retained solid floors: add only where the
    // point below is solid and no neighbouring fluid can be touched.
    let cells=0;
    for(let yy=y+h-1;yy>=y;yy--)for(let xx=x;xx<x+w;xx++){
      const p=at(xx,yy),m=g[p];
      if(m)continue;
      const down=yy+1<H?g[at(xx,yy+1)]:0;
      if(down!==0&&down!==3&&down!==8){g[p]=MAT.iron;cells++;}
    }
    if(!cells)throw Error('R5 physical fixture did not construct real material cells: '+label);
    fixtures.push({label,box:[x,y,w,h],new_cells:cells});
  }
  if(index===0){
    // Freight-to-quench transition: an inhabitable assay and seal-change booth.
    // The old 25-cell threshold was smaller than the 31-cell actor envelope.
    carve(258,775,76,77,'freight assay east double-leaf airlock');
    finishExisting(100,748,170,6,MAT.quartz,'arrival booth pressure head');
    finishExisting(114,850,156,7,MAT.obsidian,'freight assay supported underdeck');
    floorMachine(132,826,35,28,'freight sample scale and weighing bed');
    floorMachine(182,830,28,24,'air-quality analyzer lower plinth');
    // East evacuation: safe passage through the scrubber quarantine vestibule,
    // with two genuinely independent wide dry doors on its flanks.
    carve(1686,756,124,107,'quarantine west rib-spanning decontamination hatch');
    carve(1814,692,94,90,'quarantine overhead dry emergency vent');
    finishExisting(1762,872,177,8,MAT.quartz,'scrubber floor reclaim grating');
    finishExisting(1760,754,160,8,MAT.glass,'sealed upper aerosol conduit');
    floorMachine(1800,846,28,27,'scrubber west inspection pedestal');
    floorMachine(1893,844,26,29,'scrubber east rinse pedestal');
    // Plant process sequence is recorded in actual inert containment surfaces.
    finishExisting(452,582,120,5,MAT.quartz,'quench primary transfer jacket');
    finishExisting(592,584,106,5,MAT.glass,'cold secondary transfer jacket');
    finishExisting(721,583,70,5,MAT.quartz,'quench tertiary return jacket');
    finishExisting(1351,603,127,7,MAT.glass,'separation assay receiving channel');
    finishExisting(1515,603,157,7,MAT.quartz,'distillation feed-and-return channel');
  }else{
    // Ashward intake has a sealed-looking shell but now really admits the
    // full conservative Midge envelope through an engineered side vestibule.
    carve(326,773,81,86,'ashward particulate receiving airlock');
    finishExisting(120,859,200,7,MAT.obsidian,'ashward filter service trench cover');
    floorMachine(151,817,40,44,'ash intake sieve desk');
    floorMachine(276,816,29,45,'ash intake pressure diagnostic');
    // Unlike Pyrewater's end scrubber, Ashlight's usable isolation bay has
    // a vertical underfloor descent joining the existing deep dry service run.
    carve(1347,812,84,77,'twin hot-hall west isolation gate');
    carve(1653,813,91,78,'twin cold-hall east isolation gate');
    carve(1495,873,78,92,'twin-reactor independent underfloor recovery shaft');
    finishExisting(1400,786,230,7,MAT.glass,'isolation watchroom certified top beam');
    finishExisting(1382,889,112,7,MAT.obsidian,'hot-side grounded service plinth');
    finishExisting(1573,889,101,7,MAT.quartz,'cold-side grounded service plinth');
    floorMachine(1442,858,28,27,'hot zone visual assay pedestal');
    floorMachine(1604,847,28,46,'cold zone visual assay pedestal');
    // Solid-only marks differentiate actual cold/sorted/hot process bearings.
    finishExisting(472,502,110,6,MAT.glass,'cold siphon transfer trunk');
    finishExisting(644,502,110,6,MAT.quartz,'graded particle separation trunk');
    finishExisting(930,789,145,6,MAT.obsidian,'cyclone debris weighbridge');
    finishExisting(1130,789,142,6,MAT.quartz,'cyclone refined material return');
    finishExisting(1355,742,123,6,MAT.glass,'hot plasma isolation indicator');
    finishExisting(1590,742,126,6,MAT.quartz,'cold plasma isolation indicator');
  }
  let added=0,removed=0,recoloured=0,liquidsChanged=0;
  for(let p=0;p<g.length;p++){
    if((before[p]===3)!==(g[p]===3)||(before[p]===8)!==(g[p]===8))liquidsChanged++;
    if(!before[p]&&g[p])added++;
    else if(before[p]&&!g[p])removed++;
    else if(before[p]&&g[p]&&before[p]!==g[p])recoloured++;
  }
  if(liquidsChanged)throw Error('R5 safety failure: mobile liquid changed');
  if(removed<80)throw Error('R5 did not physically open enough chamber structure');
  return {revision:'R5',purpose:'two entered, monitored dry industrial districts per world; distinct process and escape topology',
    opened:cuts,physical_inlays:inlays,rooted_fixtures:fixtures,
    added_cells:added,removed_cells:removed,recoloured_cells:recoloured,changed_mobile_fluid_cells:0};
};
