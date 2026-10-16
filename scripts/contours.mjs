export function contours(kind){
 const lines=Array.from({length:24},(_,i)=>{
  const n=i/23;
  return '<path d="M -300 '+(55+n*130)+' C '+(40+n*70)+' '+(70+n*140)+', '+(220+n*85)+' '+(400+n*160)+', '+(490+n*34)+' '+(420+n*115)+' S '+(770-n*45)+' '+(65+n*180)+', 1300 '+(40+n*180)+'"/>';
 }).join('');
 return '<div class="contour-art contour-'+kind+'" aria-hidden="true" data-ambient><svg viewBox="0 0 1000 680" preserveAspectRatio="none" fill="none" focusable="false"><defs><linearGradient id="contour-'+kind+'" x1="-100" y1="0" x2="1150" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#244069" stop-opacity="0"/><stop offset=".15" stop-color="#395c8d" stop-opacity=".3"/><stop offset=".38" stop-color="#668cbb" stop-opacity=".65"/><stop offset=".62" stop-color="#95b8e5"/><stop offset=".83" stop-color="#527aaa" stop-opacity=".5"/><stop offset="1" stop-color="#284b7c" stop-opacity="0"/></linearGradient></defs><g class="contour-sheet" stroke="url(#contour-'+kind+')" stroke-width="1.2">'+lines+'</g></svg></div>';
}
