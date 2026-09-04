// AutoCAD DXF Exporter (R12 ASCII Format) for CAD / Archicad / Sketchup
export function downloadDxfPlan(project, rooms = []) {
  const L = (Number(project?.length) || 20) * 100; // in cm
  const W = (Number(project?.width) || 15) * 100;

  let dxf = `0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nENDSEC\n0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n`;

  // Boundary layer
  dxf += `0\nPOLYLINE\n8\nTERRAIN_LIMITE\n66\n1\n70\n1\n0\nVERTEX\n8\nTERRAIN_LIMITE\n10\n0.0\n20\n0.0\n30\n0.0\n0\nVERTEX\n8\nTERRAIN_LIMITE\n10\n${L}\n20\n0.0\n30\n0.0\n0\nVERTEX\n8\nTERRAIN_LIMITE\n10\n${L}\n20\n${W}\n30\n0.0\n0\nVERTEX\n8\nTERRAIN_LIMITE\n10\n0.0\n20\n${W}\n30\n0.0\n0\nSEQEND\n`;

  // Rooms
  rooms.forEach((r, i) => {
    const rx = (r.x || (i * 4)) * 100;
    const ry = (r.y || 2) * 100;
    const rw = (r.w || 4) * 100;
    const rh = (r.h || 3.5) * 100;

    dxf += `0\nPOLYLINE\n8\nMURS_${r.name.replace(/\s+/g, '_')}\n66\n1\n70\n1\n0\nVERTEX\n8\nMURS\n10\n${rx}\n20\n${ry}\n30\n0.0\n0\nVERTEX\n8\nMURS\n10\n${rx + rw}\n20\n${ry}\n30\n0.0\n0\nVERTEX\n8\nMURS\n10\n${rx + rw}\n20\n${ry + rh}\n30\n0.0\n0\nVERTEX\n8\nMURS\n10\n${rx}\n20\n${ry + rh}\n30\n0.0\n0\nSEQEND\n`;

    dxf += `0\nTEXT\n8\nANNOTATIONS\n10\n${rx + rw/2}\n20\n${ry + rh/2}\n30\n0.0\n40\n20.0\n1\n${r.name} (${r.area || ''}m2)\n`;
  });

  dxf += `0\nENDSEC\n0\nEOF\n`;

  const blob = new Blob([dxf], { type: 'application/dxf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(project?.name || 'BTPRO_Plan').replace(/\s+/g, '_')}_AutoCAD.dxf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
