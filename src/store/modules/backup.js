async getSemanas() {
    const res = await axios.post(`${url}_find`, {
      "selector": {}
      , "limit": 500
    }, credentials.authentication);

    let forros = [];
    let suelas=[];
    let materiales = [];
    let avillos = [];
    let adornos=[];
    let lineas=[];
    let estilos = [];
    let hormas = [];

    res.data.docs.forEach(semana => {
      semana.pedidos.forEach(pedido => {
        pedido.detalle.forEach(detalle => {
          let material = detalle.detalleMaterial.material;
          let forro = detalle.detalleForro.forro;
          let suela = detalle.detalleSuela.suela;
          let linea = detalle.estilo.linea;
          let estilo = detalle.estilo;
          let horma = detalle.horma;
      
          if (!hormas.some(e => e._id === horma._id)) {
            horma._rev = undefined;
            hormas.push(horma);
          }
          if (!estilos.some(e => e._id === estilo._id)) {
            estilo._rev = undefined;
            estilos.push(estilo);
          }
          if (!forros.some(e => e._id === forro._id)) {
            forro._rev = undefined;
            forros.push(forro);
          }
          if (!suelas.some(e => e._id === suela._id)) {
            suela._rev = undefined;
            suelas.push(suela);
          }
          if (!materiales.some(e => e._id === material._id)) {
            material._rev = undefined;
            materiales.push(material);
          }
          if (!lineas.some(e => e._id === linea._id)) {
            linea._rev = undefined;
            lineas.push(linea);
          }

          //adornos avillos

          detalle.estilo.avillos.forEach(avillo => {
            if (!avillos.some(e => e._id === avillo._id)) {
              avillo._rev = undefined;
              avillos.push(avillo);
            }
          });
          detalle.estilo.adornos.forEach(adorno => {
            if (!adornos.some(e => e._id === adorno._id)) {
              adorno._rev = undefined;
              adornos.push(adorno);
            }
          });


        });
      });
    });

/*
     await axios.post(`http://localhost:5984/zapp-forros/_bulk_docs`, { "docs": forros }, {
      "auth": credentials.authentication.auth,
      "headers": credentials.authentication.headers,
    }, credentials.authentication);
   

     await axios.post(`http://localhost:5984/zapp-materiales/_bulk_docs`, { "docs": materiales }, {
      "auth": credentials.authentication.auth,
      "headers": credentials.authentication.headers,
    }, credentials.authentication);
        
    await axios.post(`http://localhost:5984/zapp-adornos/_bulk_docs`, { "docs": adornos }, {
      "auth": credentials.authentication.auth,
      "headers": credentials.authentication.headers,
    }, credentials.authentication);
   

    await axios.post(`http://localhost:5984/zapp-avillos/_bulk_docs`, { "docs": avillos }, {
      "auth": credentials.authentication.auth,
      "headers": credentials.authentication.headers,
    }, credentials.authentication);
    await axios.post(`http://localhost:5984/zapp-lineas/_bulk_docs`, { "docs": lineas }, {
      "auth": credentials.authentication.auth,
      "headers": credentials.authentication.headers,
    }, credentials.authentication);

    await axios.post(`http://localhost:5984/zapp-suelas/_bulk_docs`, { "docs": suelas }, {
      "auth": credentials.authentication.auth,
      "headers": credentials.authentication.headers,
    }, credentials.authentication);
    

    await axios.post(`http://localhost:5984/zapp-estilos/_bulk_docs`, { "docs": estilos }, {
      "auth": credentials.authentication.auth,
      "headers": credentials.authentication.headers,
    }, credentials.authentication);
    
    

    await axios.post(`http://localhost:5984/zapp-hormas/_bulk_docs`, { "docs": hormas }, {
      "auth": credentials.authentication.auth,
      "headers": credentials.authentication.headers,
    }, credentials.authentication);
*/

  },