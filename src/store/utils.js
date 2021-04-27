


function (doc, req) {
  if (!doc) {
    let datos = JSON.parse(req.body);
    let nuevoPedido = datos.nuevoPedido;
    let total = 0;
    nuevoPedido.detalle.forEach((detalle) => {
      total += detalle.subtotal;
      let tall = '';
      detalle.detalleTallas = detalle.detalleTallas.filter(s => s.cantidad > 0);
      detalle.detalleTallas.forEach((t) => {
        tall = tall + t.cantidad + '/' + t.talla.nombre + ', ';
      });
      tall = tall.substring(0, tall.length - 1);
      detalle.resumen = [
        detalle.estilo.linea.nombre + detalle.estilo.correlativo,
        detalle.detalleMaterial.material.nombre +
        ' ' +
        detalle.detalleMaterial.color,
        tall,
        detalle.horma.nombre,
        detalle.detalleForro.forro.nombre +
        ' ' +
        detalle.detalleForro.color,
        detalle.detalleSuela.suela.nombre +
        ' ' +
        detalle.detalleSuela.color,
        detalle.subtotal,
      ];
    });
    nuevoPedido.total = total;


    function calcularLista(psemana, pnuevoPedido) {

      let lista = psemana.listaDeCompras || {
        adornos: [],
        avillos: [],
        suelas: [],
        tacones: [],
        estilos: [],
        materiales: []
      };

      pnuevoPedido.detalle.forEach((detalle) => {
        detalle.estilo.adornos.forEach((adorno) => {
          if (adorno.cantidad > 0) {

            let existe = false;
            lista.adornos.forEach((adornoEnLista) => {
              if (adornoEnLista._id == adorno._id) {
                adornoEnLista.cantidad = Number(adornoEnLista.cantidad) + Number(adorno.cantidad) * detalle.subtotal;
                existe = true
              }
            });
            if (!existe) {
              let nuevoAdorno = Object.assign({}, adorno);
              nuevoAdorno.cantidad = nuevoAdorno.cantidad * detalle.subtotal;
              lista.adornos.push(nuevoAdorno);
            }
          }
        });

        detalle.estilo.avillos.forEach((avillo) => {
          if (avillo.cantidad > 0) {

            let existe = false;
            lista.avillos.forEach((avilloEnLista) => {
              if (avilloEnLista._id == avillo._id) {
                avilloEnLista.cantidad = Number(avilloEnLista.cantidad) + Number(avillo.cantidad) * detalle.subtotal;
                existe = true;
              }
            });
            if (!existe) {
              let nuevoAvillo = Object.assign({}, avillo);
              nuevoAvillo.cantidad = nuevoAvillo.cantidad * detalle.subtotal;
              lista.avillos.push(nuevoAvillo);
            }

          }
        });

        let existeMaterial = false;
        lista.materiales.forEach((materialEnLista) => {

          if (detalle.detalleMaterial.material.nombre == materialEnLista.nombre &&
            detalle.detalleMaterial.color == materialEnLista.color) {
            materialEnLista.cantidad = Number(materialEnLista.cantidad) + Number(detalle.subtotal) * Number(detalle.estilo.capeyada);
            existeMaterial = true;
          }
        });

        if (!existeMaterial) {
          let nuevoMaterial = {
            _id: detalle.detalleMaterial.material._id + detalle.detalleMaterial.color,
            nombre: detalle.detalleMaterial.material.nombre,
            color: detalle.detalleMaterial.color,
            cantidad: (detalle.subtotal) * Number(detalle.estilo.capeyada)
          };

          lista.materiales.push(nuevoMaterial);
        }

        let existeSuela = false;
        lista.suelas.forEach((suelaEnLista) => {

          if (detalle.detalleSuela.suela.nombre == suelaEnLista.nombre &&
            detalle.detalleSuela.color == suelaEnLista.color) {

            detalle.detalleTallas.forEach(t => {
              let e = false;
              suelaEnLista.detalle.forEach(l => {
                if (t.talla.nombre == l.nombre) {
                  l.cantidad += t.cantidad;
                  e = true
                }
              });
              if (!e) {
                suelaEnLista.detalle.push({
                  nombre: t.talla.nombre,
                  cantidad: t.cantidad
                });
              }
            });
            existeSuela = true;
          }
        });

        if (!existeSuela) {
          let nuevaSuela = {
            _id: detalle.detalleSuela.suela._id + detalle.detalleSuela.color,
            nombre: detalle.detalleSuela.suela.nombre,
            color: detalle.detalleSuela.color,
            detalle: detalle.detalleTallas.filter(s => s.cantidad > 0),
            total:detalle.subtotal
          };

          nuevaSuela.detalle = nuevaSuela.detalle.map(s => {
            return {
              nombre: s.talla.nombre,
              cantidad: s.cantidad
            }
          });
          nuevaSuela.total=pnuevoPedido.total;

          lista.suelas.push(nuevaSuela);
        }

        lista.estilos.push({
          codigo: detalle.estilo.linea.nombre + detalle.estilo.correlativo,
          rendimientoPorYarda: detalle.estilo.rendimientoPorYarda,
          capeyada: detalle.estilo.capeyada,
        });

        lista.tacones.push(detalle.detalleTacon);

      });


      return lista;
    }

    let semana = datos.semana || {
      _id: req.uuid,
      semana: nuevoPedido.semana,
      ano: nuevoPedido.ano,
      pedidos: undefined,
      listaDeCompras: null
    };

    if (semana.pedidos === undefined) {
      semana.pedidos = [nuevoPedido];
    } else {
      semana.pedidos = semana.pedidos.concat(nuevoPedido);
    }
    semana.listaDeCompras = calcularLista(semana, nuevoPedido);


    if (datos.semana === undefined) {
      return [semana, JSON.stringify(semana)]
    } else {
      return [null, JSON.stringify(semana)]
    }
  } else {
    return [null, 'Error']
  }
}
/*

//semanas
{
  "_id": "_design/manejadorSemanas",
  "_rev": "21-26ceb419c6dfa6fe29e4cc69aca216be",
  "updates": {
    "agregarPedido3": "function (doc, req) { if (!doc) { let datos = JSON.parse(req.body); let nuevoPedido = datos.nuevoPedido; let total = 0; nuevoPedido.detalle.forEach((detalle) => { total += detalle.subtotal; let tall = ''; detalle.detalleTallas = detalle.detalleTallas.filter(s => s.cantidad > 0); detalle.detalleTallas.forEach((t) => { tall = tall + t.cantidad + '/' + t.talla.nombre + ', '; }); tall = tall.substring(0, tall.length - 1); detalle.resumen = [ detalle.estilo.linea.nombre + detalle.estilo.correlativo, detalle.detalleMaterial.material.nombre + ' ' + detalle.detalleMaterial.color, tall, detalle.horma.nombre, detalle.detalleForro.forro.nombre + ' ' + detalle.detalleForro.color, detalle.detalleSuela.suela.nombre + ' ' + detalle.detalleSuela.color, detalle.subtotal, ]; }); nuevoPedido.total = total; function calcularLista(psemana, pnuevoPedido) { let lista = psemana.listaDeCompras || { adornos: [], avillos: [], suelas: [], tacones: [], estilos: [], materiales: [] }; pnuevoPedido.detalle.forEach((detalle) => { detalle.estilo.adornos.forEach((adorno) => { if (adorno.cantidad > 0) { let existe = false; lista.adornos.forEach((adornoEnLista) => { if (adornoEnLista._id == adorno._id) { adornoEnLista.cantidad = Number(adornoEnLista.cantidad) + Number(adorno.cantidad) * detalle.subtotal; existe = true } }); if (!existe) { let nuevoAdorno = Object.assign({}, adorno); nuevoAdorno.cantidad = nuevoAdorno.cantidad * detalle.subtotal; lista.adornos.push(nuevoAdorno); } } }); detalle.estilo.avillos.forEach((avillo) => { if (avillo.cantidad > 0) { let existe = false; lista.avillos.forEach((avilloEnLista) => { if (avilloEnLista._id == avillo._id) { avilloEnLista.cantidad = Number(avilloEnLista.cantidad) + Number(avillo.cantidad) * detalle.subtotal; existe = true; } }); if (!existe) { let nuevoAvillo = Object.assign({}, avillo); nuevoAvillo.cantidad = nuevoAvillo.cantidad * detalle.subtotal; lista.avillos.push(nuevoAvillo); } } }); let existeMaterial = false; lista.materiales.forEach((materialEnLista) => { if (detalle.detalleMaterial.material.nombre == materialEnLista.nombre && detalle.detalleMaterial.color == materialEnLista.color) { materialEnLista.cantidad = Number(materialEnLista.cantidad) + Number(detalle.subtotal) * Number(detalle.estilo.capeyada); existeMaterial = true; } }); if (!existeMaterial) { let nuevoMaterial = { _id: detalle.detalleMaterial.material._id + detalle.detalleMaterial.color, nombre: detalle.detalleMaterial.material.nombre, color: detalle.detalleMaterial.color, cantidad: (detalle.subtotal) * Number(detalle.estilo.capeyada) }; lista.materiales.push(nuevoMaterial); } let existeSuela = false; lista.suelas.forEach((suelaEnLista) => { if (detalle.detalleSuela.suela.nombre == suelaEnLista.nombre && detalle.detalleSuela.color == suelaEnLista.color) { detalle.detalleTallas.forEach(t => { let e = false; suelaEnLista.detalle.forEach(l => { if (t.talla.nombre == l.nombre) { l.cantidad += t.cantidad; e = true } }); if (!e) { suelaEnLista.detalle.push({ nombre: t.talla.nombre, cantidad: t.cantidad }); } }); existeSuela = true; } }); if (!existeSuela) { let nuevaSuela = { _id: detalle.detalleSuela.suela._id + detalle.detalleSuela.color, nombre: detalle.detalleSuela.suela.nombre, color: detalle.detalleSuela.color, detalle: detalle.detalleTallas.filter(s => s.cantidad > 0) }; nuevaSuela.detalle = nuevaSuela.detalle.map(s => { return { nombre: s.talla.nombre, cantidad: s.cantidad } }); lista.suelas.push(nuevaSuela); } lista.estilos.push({ codigo: detalle.estilo.linea.nombre + detalle.estilo.correlativo, rendimientoPorYarda: detalle.estilo.rendimientoPorYarda, capeyada: detalle.estilo.capeyada, }); lista.tacones.push(detalle.detalleTacon); }); return lista; } let semana = datos.semana || { _id: req.uuid, semana: nuevoPedido.semana, ano: nuevoPedido.ano, pedidos: undefined, listaDeCompras: null }; if (semana.pedidos === undefined) { semana.pedidos = [nuevoPedido]; } else { semana.pedidos = semana.pedidos.concat(nuevoPedido); } semana.listaDeCompras = calcularLista(semana, nuevoPedido); if (datos.semana === undefined) { return [semana, JSON.stringify(semana)] } else { return [null, JSON.stringify(semana)] } } else { return [null, 'Error'] } }",
    "agregarPedido": "function (doc, req) { if (!doc) { let datos = JSON.parse(req.body); let nuevoPedido = datos.nuevoPedido; let total = 0; nuevoPedido.detalle.forEach((detalle) => { total += detalle.subtotal; let tall = ''; detalle.detalleTallas = detalle.detalleTallas.filter(s => s.cantidad > 0); detalle.detalleTallas.forEach((t) => { tall = tall + t.cantidad + '/' + t.talla.nombre + ', '; }); tall = tall.substring(0, tall.length - 1); detalle.resumen = [ detalle.estilo.linea.nombre + detalle.estilo.correlativo, detalle.detalleMaterial.material.nombre + ' ' + detalle.detalleMaterial.color, tall, detalle.horma.nombre, detalle.detalleForro.forro.nombre + ' ' + detalle.detalleForro.color, detalle.detalleSuela.suela.nombre + ' ' + detalle.detalleSuela.color, detalle.subtotal, ]; }); nuevoPedido.total = total; function calcularLista(psemana, pnuevoPedido) { let lista = psemana.listaDeCompras || { adornos: [], avillos: [], suelas: [], tacones: [], estilos: [], materiales: [] }; pnuevoPedido.detalle.forEach((detalle) => { detalle.estilo.adornos.forEach((adorno) => { if (adorno.cantidad > 0) { let existe = false; lista.adornos.forEach((adornoEnLista) => { if (adornoEnLista._id == adorno._id) { adornoEnLista.cantidad = Number(adornoEnLista.cantidad) + Number(adorno.cantidad) * detalle.subtotal; existe = true } }); if (!existe) { let nuevoAdorno = Object.assign({}, adorno); nuevoAdorno.cantidad = nuevoAdorno.cantidad * detalle.subtotal; lista.adornos.push(nuevoAdorno); } } }); detalle.estilo.avillos.forEach((avillo) => { if (avillo.cantidad > 0) { let existe = false; lista.avillos.forEach((avilloEnLista) => { if (avilloEnLista._id == avillo._id) { avilloEnLista.cantidad = Number(avilloEnLista.cantidad) + Number(avillo.cantidad) * detalle.subtotal; existe = true; } }); if (!existe) { let nuevoAvillo = Object.assign({}, avillo); nuevoAvillo.cantidad = nuevoAvillo.cantidad * detalle.subtotal; lista.avillos.push(nuevoAvillo); } } }); let existeMaterial = false; lista.materiales.forEach((materialEnLista) => { if (detalle.detalleMaterial.material.nombre == materialEnLista.nombre && detalle.detalleMaterial.color == materialEnLista.color) { materialEnLista.cantidad = Number(materialEnLista.cantidad) + Number(detalle.subtotal) * Number(detalle.estilo.capeyada); existeMaterial = true; } }); if (!existeMaterial) { let nuevoMaterial = { _id: detalle.detalleMaterial.material._id + detalle.detalleMaterial.color, nombre: detalle.detalleMaterial.material.nombre, color: detalle.detalleMaterial.color, cantidad: (detalle.subtotal) * Number(detalle.estilo.capeyada) }; lista.materiales.push(nuevoMaterial); } let existeSuela = false; lista.suelas.forEach((suelaEnLista) => { if (detalle.detalleSuela.suela.nombre == suelaEnLista.nombre && detalle.detalleSuela.color == suelaEnLista.color) { detalle.detalleTallas.forEach(t => { let e = false; suelaEnLista.detalle.forEach(l => { if (t.talla.nombre == l.nombre) { l.cantidad += t.cantidad; e = true } }); if (!e) { suelaEnLista.detalle.push({ nombre: t.talla.nombre, cantidad: t.cantidad }); } }); existeSuela = true; } }); if (!existeSuela) { let nuevaSuela = { _id: detalle.detalleSuela.suela._id + detalle.detalleSuela.color, nombre: detalle.detalleSuela.suela.nombre, color: detalle.detalleSuela.color, detalle: detalle.detalleTallas.filter(s => s.cantidad > 0), total:detalle.subtotal }; nuevaSuela.detalle = nuevaSuela.detalle.map(s => { return { nombre: s.talla.nombre, cantidad: s.cantidad } }); nuevaSuela.total=pnuevoPedido.total; lista.suelas.push(nuevaSuela); } lista.estilos.push({ codigo: detalle.estilo.linea.nombre + detalle.estilo.correlativo, rendimientoPorYarda: detalle.estilo.rendimientoPorYarda, capeyada: detalle.estilo.capeyada, }); lista.tacones.push(detalle.detalleTacon); }); return lista; } let semana = datos.semana || { _id: req.uuid, semana: nuevoPedido.semana, ano: nuevoPedido.ano, pedidos: undefined, listaDeCompras: null }; if (semana.pedidos === undefined) { semana.pedidos = [nuevoPedido]; } else { semana.pedidos = semana.pedidos.concat(nuevoPedido); } semana.listaDeCompras = calcularLista(semana, nuevoPedido); if (datos.semana === undefined) { return [semana, JSON.stringify(semana)] } else { return [null, JSON.stringify(semana)] } } else { return [null, 'Error'] } }"
  },
  "language": "javascript"
}


//estilos
{
  "_id": "_design/correlativosExistentes",
  "_rev": "17-625995078d14037305325a2bc95daf7e",
  "views": {
    "correlativosExistentes": {
      "map": "function (doc) {\n  emit(doc.linea.nombre, doc.correlativo);\n}",
      "reduce": "function (keys, values, rereduce) {\n  if (rereduce) {\n    all = []\n    values.forEach(i=>{\n      all.push(i);\n    });\n    return all;\n  } else {\n    return values;\n  }\n}"
    }
  },
  "language": "javascript"
}


*/




