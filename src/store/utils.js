


function (doc, req) {
  if (!doc) {
    let datos = JSON.parse(req.body);
    let nuevoPedido = datos.nuevoPedido;

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
            materialEnLista.cantidad = Number(materialEnLista.cantidad) + 1;
            existeMaterial = true;
          }
        });
        if (!existeMaterial) {
          let nuevoMaterial = {
            _id: detalle.detalleMaterial.material._id+detalle.detalleMaterial.color,
            nombre: detalle.detalleMaterial.material.nombre,
            color: detalle.detalleMaterial.color,
            cantidad: 1
          };

          lista.materiales.push(nuevoMaterial);
        }



        lista.estilos.push({
          codigo: detalle.estilo.linea.nombre + detalle.estilo.correlativo,
          rendimientoPorYarda: detalle.estilo.rendimientoPorYarda,
          capeyada: detalle.estilo.capeyada,
        });
        lista.suelas.push(detalle.detalleSuela);
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

{
  "_id": "_design/manejadorSemanas",
  "_rev": "30-3616a4cdbcd845518159b1e7f3408228",
  "updates": {
    "agregarPedido": "function (doc, req) { if (!doc) { let datos = JSON.parse(req.body); let nuevoPedido = datos.nuevoPedido; function calcularLista(psemana, pnuevoPedido) { let lista = psemana.listaDeCompras || { adornos: [], avillos: [], suelas: [], tacones: [], estilos: [], materiales: [] }; pnuevoPedido.detalle.forEach((detalle) => { detalle.estilo.adornos.forEach((adorno) => { if (adorno.cantidad > 0) { let existe = false; lista.adornos.forEach((adornoEnLista) => { if (adornoEnLista._id == adorno._id) { adornoEnLista.cantidad = Number(adornoEnLista.cantidad) + Number(adorno.cantidad)*detalle.subtotal; existe=true } }); if (!existe) { let nuevoAdorno = Object.assign({},adorno) ; nuevoAdorno.cantidad = nuevoAdorno.cantidad*detalle.subtotal; lista.adornos.push(nuevoAdorno); } } }); detalle.estilo.avillos.forEach((avillo) => { if (avillo.cantidad > 0) { let existe = false; lista.avillos.forEach((avilloEnLista) => { if (avilloEnLista._id == avillo._id) { avilloEnLista.cantidad = Number(avilloEnLista.cantidad) + Number(avillo.cantidad)*detalle.subtotal; existe=true; } }); if (!existe) { let nuevoAvillo = Object.assign({},avillo) ; nuevoAvillo.cantidad = nuevoAvillo.cantidad*detalle.subtotal; lista.avillos.push(nuevoAvillo); } } }); lista.estilos.push({ codigo: detalle.estilo.linea.nombre + detalle.estilo.correlativo, rendimientoPorYarda: detalle.estilo.rendimientoPorYarda, capeyada: detalle.estilo.capeyada, }); lista.suelas.push(detalle.detalleSuela); lista.tacones.push(detalle.detalleTacon); lista.materiales.push(detalle.detalleMaterial); }); return lista; } let semana = datos.semana || { _id: req.uuid, semana: nuevoPedido.semana, ano: nuevoPedido.ano, pedidos: undefined, listaDeCompras: null }; if (semana.pedidos === undefined) { semana.pedidos = [nuevoPedido]; } else { semana.pedidos = semana.pedidos.concat(nuevoPedido); } semana.listaDeCompras = calcularLista(semana, nuevoPedido); if (datos.semana === undefined) { return [semana, JSON.stringify(semana)] } else { return [null, JSON.stringify(semana)] } } else { return [null, 'Error'] } }"
  },
  "language": "javascript"
}


*/




