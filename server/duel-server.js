/* SUPER KEEPER — Stage 2 duel server (not used by the shipped CrazyGames build yet).
   Minimal WebSocket room server for real 1v1 shootout duels.
   Deploy: npm i && node duel-server.js  (Railway/Fly/Render — any Node host with WSS)

   Protocol (JSON messages):
     client → server: {t:'create'} | {t:'join',room} | {t:'shot',x,y} | {t:'glove',x,y} | {t:'dive'}
     server → client: {t:'room',code} | {t:'start',you:0|1} | {t:'peer',msg} | {t:'target',x,y}
                      {t:'result',round,scorer,saved} | {t:'end',winner} | {t:'err',why}

   Anti-cheat basics: the SERVER rolls each round's shot target and judges save
   distance — clients only report inputs, never outcomes.
*/
'use strict';
const {WebSocketServer}=require('ws');
const PORT=process.env.PORT||8081;
const wss=new WebSocketServer({port:PORT});
const rooms=new Map(); // code → {players:[ws,ws], round, goals:[0,0], phase}

const code=()=>Math.random().toString(36).slice(2,7).toUpperCase();
const send=(ws,o)=>{try{ws.readyState===1&&ws.send(JSON.stringify(o));}catch(e){}};

// goal plane matches client: x 200..760, y 150..425
const rollTarget=()=>({x:200+35+Math.random()*(560-70),y:150+30+Math.random()*(275-55)});
const SAVE_R=75;

wss.on('connection',ws=>{
  ws.on('message',raw=>{
    let m;try{m=JSON.parse(raw);}catch(e){return;}
    if(m.t==='create'){
      const c=code();
      rooms.set(c,{players:[ws],round:1,goals:[0,0],phase:'wait'});
      ws.room=c;ws.idx=0;
      send(ws,{t:'room',code:c});
    }
    else if(m.t==='join'){
      const r=rooms.get((m.room||'').toUpperCase());
      if(!r||r.players.length>=2){send(ws,{t:'err',why:'room'});return;}
      r.players.push(ws);ws.room=m.room.toUpperCase();ws.idx=1;
      r.phase='play';
      r.players.forEach((p,i)=>send(p,{t:'start',you:i}));
      beginRound(r);
    }
    else if(m.t==='glove'||m.t==='dive'){ // relay live inputs for spectating your rival
      const r=rooms.get(ws.room);if(!r)return;
      const other=r.players[1-ws.idx];other&&send(other,{t:'peer',msg:m});
    }
    else if(m.t==='shot'){
      const r=rooms.get(ws.room);if(!r||r.phase!=='play')return;
      // shooter reports aim; server clamps and judges vs defender's last glove
      const tx=Math.max(220,Math.min(740,+m.x||480)),ty=Math.max(170,Math.min(410,+m.y||287));
      const other=r.players[1-ws.idx];
      const g=other&&other.glove||{x:480,y:287};
      const saved=Math.hypot(g.x-tx,g.y-ty)<SAVE_R;
      if(!saved)r.goals[ws.idx]++;
      r.players.forEach(p=>send(p,{t:'result',round:r.round,scorer:ws.idx,saved,goals:r.goals}));
      if(ws.idx===1){ // both shot this round
        r.round++;
        if(r.round>5&&r.goals[0]!==r.goals[1]){
          const w=r.goals[0]>r.goals[1]?0:1;
          r.players.forEach(p=>send(p,{t:'end',winner:w}));
          rooms.delete(ws.room);return;
        }
        beginRound(r);
      }
    }
  });
  ws.on('message',raw=>{ // track defender glove for save judging
    try{const m=JSON.parse(raw);if(m.t==='glove')ws.glove={x:+m.x,y:+m.y};}catch(e){}
  });
  ws.on('close',()=>{
    const r=rooms.get(ws.room);
    if(r){const other=r.players[1-ws.idx];other&&send(other,{t:'end',winner:1-ws.idx,why:'disconnect'});rooms.delete(ws.room);}
  });
});
function beginRound(r){
  r.players.forEach(p=>send(p,{t:'round',n:r.round}));
}
console.log('duel-server listening on :'+PORT);
